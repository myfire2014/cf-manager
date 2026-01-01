import { ConfigService, LogService } from "./db";

interface CloudflareZone {
  id: string;
  name: string;
  status: string;
  name_servers: string[];
}

interface CloudflareResponse<T> {
  success: boolean;
  errors: Array<{ code: number; message: string }>;
  result: T;
}

interface DnsRecord {
  id: string;
  type: string;
  name: string;
  content: string;
  proxied: boolean;
}

export class CloudflareClient {
  private baseUrl = "https://api.cloudflare.com/client/v4";
  private headers: Record<string, string>;
  private rateLimit: number;

  constructor(email: string, apiKey: string, rateLimit = 250) {
    this.headers = {
      "X-Auth-Email": email,
      "X-Auth-Key": apiKey,
      "Content-Type": "application/json",
    };
    this.rateLimit = rateLimit;
  }

  private async request<T>(method: string, endpoint: string, body?: object): Promise<CloudflareResponse<T>> {
    await new Promise((r) => setTimeout(r, this.rateLimit));
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method,
      headers: this.headers,
      body: body ? JSON.stringify(body) : undefined,
    });
    return (await response.json()) as CloudflareResponse<T>;
  }

  async verifyToken(): Promise<boolean> {
    try {
      // 先尝试 Global API Key 验证方式
      const result = await this.request<{ id: string }>("GET", "/user");
      console.log("[CF API] /user 响应:", JSON.stringify(result));
      return result.success;
    } catch (err) {
      console.error("[CF API] 验证异常:", err);
      return false;
    }
  }

  async getAccountId(): Promise<string | null> {
    const result = await this.request<Array<{ id: string }>>("GET", "/accounts?per_page=1");
    return result.result?.[0]?.id ?? null;
  }

  async listZones(): Promise<CloudflareZone[]> {
    const result = await this.request<CloudflareZone[]>("GET", "/zones?per_page=50");
    return result.result || [];
  }

  async getZone(domain: string): Promise<CloudflareZone | null> {
    const result = await this.request<CloudflareZone[]>("GET", `/zones?name=${domain}`);
    return result.result?.[0] || null;
  }

  async addZone(domain: string, accountId: string): Promise<{ success: boolean; zone?: CloudflareZone; error?: string }> {
    const result = await this.request<CloudflareZone>("POST", "/zones", {
      account: { id: accountId },
      name: domain,
      type: "full",
    });
    if (result.success) {
      return { success: true, zone: result.result };
    }
    return { success: false, error: result.errors.map(e => e.message).join("; ") };
  }

  async addDnsRecord(zoneId: string, type: string, name: string, content: string, proxied: boolean) {
    const result = await this.request<DnsRecord>("POST", `/zones/${zoneId}/dns_records`, {
      type,
      name,
      content,
      proxied,
      ttl: proxied ? 1 : 300,
    });
    return result;
  }

  async setSecurityLevel(zoneId: string, level: string) {
    const result = await this.request<{ value: string }>("PATCH", `/zones/${zoneId}/settings/security_level`, {
      value: level,
    });
    return result;
  }

  async getDnsRecords(zoneId: string): Promise<DnsRecord[]> {
    const result = await this.request<DnsRecord[]>("GET", `/zones/${zoneId}/dns_records`);
    return result.result || [];
  }

  async getSecurityLevel(zoneId: string): Promise<string> {
    const result = await this.request<{ value: string }>("GET", `/zones/${zoneId}/settings/security_level`);
    return result.result?.value || "unknown";
  }

  async updateDnsProxy(zoneId: string, recordId: string, proxied: boolean) {
    const result = await this.request<DnsRecord>("PATCH", `/zones/${zoneId}/dns_records/${recordId}`, {
      proxied,
    });
    return result;
  }

  // WAF 自定义规则相关
  async listFirewallRules(zoneId: string) {
    const result = await this.request<any[]>("GET", `/zones/${zoneId}/firewall/rules`);
    return result.result || [];
  }

  async listFilters(zoneId: string) {
    const result = await this.request<any[]>("GET", `/zones/${zoneId}/filters`);
    return result.result || [];
  }

  async createFilter(zoneId: string, expression: string) {
    const result = await this.request<{ id: string }>("POST", `/zones/${zoneId}/filters`, [
      { expression }
    ]);
    return result;
  }

  async deleteFilter(zoneId: string, filterId: string) {
    const result = await this.request<any>("DELETE", `/zones/${zoneId}/filters/${filterId}`);
    return result;
  }

  async createFirewallRule(zoneId: string, filterId: string, action: string, description: string) {
    const result = await this.request<any>("POST", `/zones/${zoneId}/firewall/rules`, [
      {
        filter: { id: filterId },
        action,
        description,
        paused: false
      }
    ]);
    return result;
  }

  async deleteFirewallRule(zoneId: string, ruleId: string) {
    const result = await this.request<any>("DELETE", `/zones/${zoneId}/firewall/rules/${ruleId}`);
    return result;
  }

  // 使用新版 Rulesets API (WAF Custom Rules)
  async getRulesets(zoneId: string) {
    const result = await this.request<any[]>("GET", `/zones/${zoneId}/rulesets`);
    return result.result || [];
  }

  async getCustomRuleset(zoneId: string) {
    const rulesets = await this.getRulesets(zoneId);
    return rulesets.find((r: any) => r.phase === "http_request_firewall_custom");
  }

  async createOrUpdateBotBlockRule(zoneId: string, bots: string[], action: string) {
    // 构建表达式
    const conditions = bots.map(bot => `(http.user_agent contains "${bot}")`).join(" or ");
    const expression = conditions;
    
    const ruleName = "Block Bad Bots";
    
    try {
      // 获取现有的自定义规则集
      let ruleset = await this.getCustomRuleset(zoneId);
      
      if (!ruleset) {
        // 创建新的规则集
        const createResult = await this.request<any>("POST", `/zones/${zoneId}/rulesets`, {
          name: "Custom Rules",
          kind: "zone",
          phase: "http_request_firewall_custom",
          rules: [{
            action,
            expression,
            description: ruleName,
            enabled: true
          }]
        });
        return createResult;
      }
      
      // 获取完整规则集
      const fullRuleset = await this.request<any>("GET", `/zones/${zoneId}/rulesets/${ruleset.id}`);
      const rules = fullRuleset.result?.rules || [];
      
      // 查找是否已存在同名规则
      const existingIndex = rules.findIndex((r: any) => r.description === ruleName);
      
      if (existingIndex >= 0) {
        // 更新现有规则
        rules[existingIndex] = {
          ...rules[existingIndex],
          action,
          expression,
          enabled: true
        };
      } else {
        // 添加新规则
        rules.push({
          action,
          expression,
          description: ruleName,
          enabled: true
        });
      }
      
      // 更新规则集
      const updateResult = await this.request<any>("PUT", `/zones/${zoneId}/rulesets/${ruleset.id}`, {
        rules
      });
      return updateResult;
    } catch (err) {
      console.error("创建/更新规则失败:", err);
      throw err;
    }
  }

  async removeBotBlockRule(zoneId: string) {
    const ruleName = "Block Bad Bots";
    
    try {
      const ruleset = await this.getCustomRuleset(zoneId);
      if (!ruleset) return { success: true };
      
      const fullRuleset = await this.request<any>("GET", `/zones/${zoneId}/rulesets/${ruleset.id}`);
      const rules = fullRuleset.result?.rules || [];
      
      // 过滤掉目标规则
      const newRules = rules.filter((r: any) => r.description !== ruleName);
      
      if (newRules.length === rules.length) {
        return { success: true, message: "规则不存在" };
      }
      
      // 更新规则集
      const updateResult = await this.request<any>("PUT", `/zones/${zoneId}/rulesets/${ruleset.id}`, {
        rules: newRules
      });
      return updateResult;
    } catch (err) {
      console.error("移除规则失败:", err);
      throw err;
    }
  }

  // API 防护规则
  async createApiProtectRule(zoneId: string, config: {
    paths: string[];
    rules: string[];
    whitelist: string[];
  }) {
    const ruleName = "API Protection";
    
    // 构建路径匹配表达式
    const pathConditions = config.paths.map(path => {
      if (path.endsWith("*")) {
        const prefix = path.slice(0, -1);
        return `starts_with(http.request.uri.path, "${prefix}")`;
      }
      return `http.request.uri.path eq "${path}"`;
    }).join(" or ");

    // 构建白名单排除条件
    let whitelistCondition = "";
    if (config.whitelist.length > 0) {
      const ipConditions = config.whitelist.map(ip => {
        if (ip.includes("/")) {
          return `ip.src in {${ip}}`;
        }
        return `ip.src eq ${ip}`;
      }).join(" or ");
      whitelistCondition = ` and not (${ipConditions})`;
    }

    // 构建各种防护规则
    const ruleExpressions: Array<{ expression: string; action: string; description: string }> = [];

    if (config.rules.includes("no_referer")) {
      ruleExpressions.push({
        expression: `(${pathConditions}) and not any(http.request.headers["referer"][*] contains ".")${whitelistCondition}`,
        action: "block",
        description: `${ruleName} - No Referer`
      });
    }

    if (config.rules.includes("no_browser_ua")) {
      ruleExpressions.push({
        expression: `(${pathConditions}) and not http.user_agent contains "Mozilla"${whitelistCondition}`,
        action: "block",
        description: `${ruleName} - No Browser UA`
      });
    }

    if (config.rules.includes("empty_ua")) {
      ruleExpressions.push({
        expression: `(${pathConditions}) and http.user_agent eq ""${whitelistCondition}`,
        action: "block",
        description: `${ruleName} - Empty UA`
      });
    }

    if (config.rules.includes("block_countries")) {
      ruleExpressions.push({
        expression: `(${pathConditions}) and ip.geoip.country in {"RU" "KP" "IR"}${whitelistCondition}`,
        action: "block",
        description: `${ruleName} - Block Countries`
      });
    }

    if (config.rules.includes("challenge_suspicious")) {
      ruleExpressions.push({
        expression: `(${pathConditions}) and cf.threat_score gt 10${whitelistCondition}`,
        action: "managed_challenge",
        description: `${ruleName} - Challenge Suspicious`
      });
    }

    if (ruleExpressions.length === 0) {
      return { success: true, message: "没有选择任何规则" };
    }

    try {
      let ruleset = await this.getCustomRuleset(zoneId);
      
      if (!ruleset) {
        // 创建新规则集
        const createResult = await this.request<any>("POST", `/zones/${zoneId}/rulesets`, {
          name: "Custom Rules",
          kind: "zone",
          phase: "http_request_firewall_custom",
          rules: ruleExpressions.map(r => ({
            action: r.action,
            expression: r.expression,
            description: r.description,
            enabled: true
          }))
        });
        return createResult;
      }

      // 获取现有规则
      const fullRuleset = await this.request<any>("GET", `/zones/${zoneId}/rulesets/${ruleset.id}`);
      let rules = fullRuleset.result?.rules || [];

      // 移除旧的 API Protection 规则
      rules = rules.filter((r: any) => !r.description?.startsWith(ruleName));

      // 添加新规则
      for (const expr of ruleExpressions) {
        rules.push({
          action: expr.action,
          expression: expr.expression,
          description: expr.description,
          enabled: true
        });
      }

      // 更新规则集
      const updateResult = await this.request<any>("PUT", `/zones/${zoneId}/rulesets/${ruleset.id}`, {
        rules
      });
      return updateResult;
    } catch (err) {
      console.error("创建 API 防护规则失败:", err);
      throw err;
    }
  }

  async removeApiProtectRule(zoneId: string) {
    const rulePrefix = "API Protection";
    
    try {
      const ruleset = await this.getCustomRuleset(zoneId);
      if (!ruleset) return { success: true };
      
      const fullRuleset = await this.request<any>("GET", `/zones/${zoneId}/rulesets/${ruleset.id}`);
      const rules = fullRuleset.result?.rules || [];
      
      const newRules = rules.filter((r: any) => !r.description?.startsWith(rulePrefix));
      
      if (newRules.length === rules.length) {
        return { success: true, message: "规则不存在" };
      }
      
      const updateResult = await this.request<any>("PUT", `/zones/${zoneId}/rulesets/${ruleset.id}`, {
        rules: newRules
      });
      return updateResult;
    } catch (err) {
      console.error("移除 API 防护规则失败:", err);
      throw err;
    }
  }
}

export function getClient(): CloudflareClient | null {
  const email = ConfigService.get("cf_email");
  const apiKey = ConfigService.get("cf_api_key");
  if (!email || !apiKey) return null;
  return new CloudflareClient(email, apiKey);
}
