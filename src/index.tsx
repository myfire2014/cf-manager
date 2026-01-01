import { Elysia } from "elysia";
import { html } from "@elysiajs/html";
import { Home } from "./views/Home";
import { Settings } from "./views/Settings";
import { Domains, ZoneList } from "./views/Domains";
import { BotBlock, BotBlockResult } from "./views/BotBlock";
import { ApiProtect, ApiProtectResult } from "./views/ApiProtect";
import { Alert } from "./components/Alert";
import { ConfigService, LogService } from "./services/db";
import { CloudflareClient, getClient } from "./services/cloudflare";

const app = new Elysia()
  .use(html())
  
  // ========== 页面路由 ==========
  .get("/", () => <Home />)
  .get("/settings", () => <Settings />)
  .get("/bot-block", () => <BotBlock />)
  .get("/api-protect", () => <ApiProtect />)
  .get("/domains", async () => {
    const client = getClient();
    if (!client) {
      return <Domains zones={[]} />;
    }
    
    const zones = await client.listZones();
    // 获取每个域名的安全级别
    const zonesWithSecurity = await Promise.all(
      zones.map(async (zone) => {
        try {
          const securityLevel = await client.getSecurityLevel(zone.id);
          return { ...zone, securityLevel };
        } catch {
          return { ...zone, securityLevel: "unknown" };
        }
      })
    );
    return <Domains zones={zonesWithSecurity} />;
  })

  // ========== API 路由 ==========
  
  // 保存配置
  .post("/api/save-config", async ({ body }) => {
    const { email, apiKey, defaultIp } = body as { email: string; apiKey: string; defaultIp: string };
    
    if (email) ConfigService.set("cf_email", email);
    if (apiKey) ConfigService.set("cf_api_key", apiKey);
    if (defaultIp) ConfigService.set("default_ip", defaultIp);
    
    return <Alert type="success" message="配置已保存！" />;
  })

  // 验证配置
  .post("/api/verify-config", async ({ body }) => {
    const { email, apiKey } = body as { email: string; apiKey: string };
    
    // 如果表单传了值，用表单的；否则用已保存的
    const useEmail = email || ConfigService.get("cf_email");
    const useApiKey = apiKey || ConfigService.get("cf_api_key");
    
    LogService.add("system", "verify-config", "info", `开始验证, 邮箱: ${useEmail}, API Key 长度: ${useApiKey?.length || 0}`);
    
    if (!useEmail || !useApiKey) {
      LogService.add("system", "verify-config", "error", "缺少 API 凭证");
      return <Alert type="error" message="请先填写 API 凭证" />;
    }
    
    const client = new CloudflareClient(useEmail, useApiKey);
    
    try {
      const valid = await client.verifyToken();
      
      if (valid) {
        const accountId = await client.getAccountId();
        LogService.add("system", "verify-config", "success", `验证成功, Account ID: ${accountId}`);
        return <Alert type="success" message={`连接成功！Account ID: ${accountId}`} />;
      }
      LogService.add("system", "verify-config", "error", "API 凭证无效");
      return <Alert type="error" message="API 凭证无效，请检查邮箱和 API Key" />;
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : String(err);
      LogService.add("system", "verify-config", "error", `验证异常: ${errMsg}`);
      return <Alert type="error" message={`验证出错: ${errMsg}`} />;
    }
  })

  // 获取域名列表
  .get("/api/zones", async () => {
    const client = getClient();
    if (!client) {
      return <Alert type="error" message="请先配置 API 凭证" />;
    }
    const zones = await client.listZones();
    // 获取每个域名的安全级别
    const zonesWithSecurity = await Promise.all(
      zones.map(async (zone) => {
        try {
          const securityLevel = await client.getSecurityLevel(zone.id);
          return { ...zone, securityLevel };
        } catch {
          return { ...zone, securityLevel: "unknown" };
        }
      })
    );
    return <ZoneList zones={zonesWithSecurity} />;
  })

  // 设置安全级别
  .post("/api/zone/:zoneId/security", async ({ params, body }) => {
    const client = getClient();
    if (!client) {
      return <Alert type="error" message="请先配置 API 凭证" />;
    }
    
    const { level } = body as { level: string };
    const result = await client.setSecurityLevel(params.zoneId, level);
    
    if (result.success) {
      return <Alert type="success" message={`安全级别已设置为: ${level}`} />;
    }
    return <Alert type="error" message={`设置失败: ${result.errors?.[0]?.message || "未知错误"}`} />;
  })

  // 单个域名开启/关闭所有记录的 CDN
  .post("/api/zone/:zoneId/proxy", async ({ params, body }) => {
    const client = getClient();
    if (!client) {
      return <Alert type="error" message="请先配置 API 凭证" />;
    }
    
    const { proxied } = body as { proxied: string };
    const enableProxy = proxied === "true";
    
    try {
      const records = await client.getDnsRecords(params.zoneId);
      // 只处理 A 和 CNAME 记录（这些支持 CDN 代理）
      const proxyableRecords = records.filter(r => r.type === "A" || r.type === "CNAME");
      
      if (proxyableRecords.length === 0) {
        return <Alert type="warning" message="没有可代理的 DNS 记录" />;
      }
      
      let success = 0;
      let failed = 0;
      const details: string[] = [];
      
      for (const record of proxyableRecords) {
        const result = await client.updateDnsProxy(params.zoneId, record.id, enableProxy);
        if (result.success) {
          success++;
          details.push(`${record.name}: ${enableProxy ? "已开启" : "已关闭"}`);
        } else {
          failed++;
          details.push(`${record.name}: 失败`);
        }
      }
      
      return (
        <div class="space-y-2">
          <div class={`p-3 rounded ${failed === 0 ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
            CDN 设置完成: 成功 {success} / 失败 {failed}
          </div>
          <div class="text-sm text-gray-600 max-h-32 overflow-y-auto">
            {details.map(d => <div>{d}</div>)}
          </div>
        </div>
      );
    } catch (err) {
      return <Alert type="error" message={`操作失败: ${err instanceof Error ? err.message : String(err)}`} />;
    }
  })

  // 批量设置安全级别
  .post("/api/zones/batch-security", async ({ body }) => {
    const client = getClient();
    if (!client) {
      return <Alert type="error" message="请先配置 API 凭证" />;
    }
    
    const { level } = body as { level: string };
    const zones = await client.listZones();
    
    let success = 0;
    let failed = 0;
    
    for (const zone of zones) {
      const result = await client.setSecurityLevel(zone.id, level);
      if (result.success) {
        success++;
      } else {
        failed++;
      }
    }
    
    const levelLabel = level === "under_attack" ? "攻击模式" : level;
    return <Alert type={failed === 0 ? "success" : "warning"} message={`批量设置完成: 成功 ${success} / 失败 ${failed}，安全级别: ${levelLabel}`} />;
  })

  // 批量开启/关闭泛域名 CDN
  .post("/api/zones/batch-wildcard-proxy", async ({ body }) => {
    const client = getClient();
    if (!client) {
      return <Alert type="error" message="请先配置 API 凭证" />;
    }
    
    const { proxied } = body as { proxied: string };
    const enableProxy = proxied === "true";
    const zones = await client.listZones();
    
    let success = 0;
    let failed = 0;
    const details: string[] = [];
    
    for (const zone of zones) {
      try {
        // 获取该域名的所有 DNS 记录
        const records = await client.getDnsRecords(zone.id);
        // 找到泛域名记录 (name 以 * 开头或等于 *)
        const wildcardRecords = records.filter(r => r.name.startsWith("*") || r.name === `*.${zone.name}`);
        
        if (wildcardRecords.length === 0) {
          details.push(`${zone.name}: 无泛域名记录`);
          continue;
        }
        
        for (const record of wildcardRecords) {
          const result = await client.updateDnsProxy(zone.id, record.id, enableProxy);
          if (result.success) {
            success++;
            details.push(`${zone.name}: ${record.name} CDN ${enableProxy ? "已开启" : "已关闭"}`);
          } else {
            failed++;
            details.push(`${zone.name}: ${record.name} 失败 - ${result.errors?.[0]?.message || "未知错误"}`);
          }
        }
      } catch (err) {
        failed++;
        details.push(`${zone.name}: 处理异常`);
      }
    }
    
    return (
      <div class="space-y-2">
        <div class={`p-3 rounded ${failed === 0 ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
          泛域名 CDN 批量设置完成: 成功 {success} / 失败 {failed}
        </div>
        <div class="text-sm text-gray-600 max-h-40 overflow-y-auto">
          {details.map(d => <div>{d}</div>)}
        </div>
      </div>
    );
  })

  // 批量添加域名
  .post("/api/batch-add", async ({ body }) => {
    const { domains, target, recordType, securityLevel, proxied, records, customRecords, wildcardProxied } = body as {
      domains: string;
      target: string;
      recordType: string;
      securityLevel: string;
      proxied: string;
      records: string | string[];
      customRecords: string;
      wildcardProxied: string;
    };

    const client = getClient();
    if (!client) {
      return <Alert type="error" message="请先配置 API 凭证" />;
    }

    const domainList = domains
      .split("\n")
      .map((d) => d.trim())
      .filter(Boolean);

    if (domainList.length === 0) {
      return <Alert type="warning" message="请输入至少一个域名" />;
    }

    if (!target) {
      return <Alert type="warning" message="请输入解析目标（IP 或 CNAME 域名）" />;
    }

    const dnsType = recordType || "A";

    // 解析要添加的记录类型
    let recordTypes: string[] = [];
    if (records) {
      recordTypes = Array.isArray(records) ? records : [records];
    }
    // 添加自定义记录
    if (customRecords) {
      const custom = customRecords.split(",").map(r => r.trim()).filter(Boolean);
      recordTypes = [...recordTypes, ...custom];
    }
    if (recordTypes.length === 0) {
      recordTypes = ["@", "www", "*"]; // 默认
    }

    const accountId = await client.getAccountId();
    if (!accountId) {
      return <Alert type="error" message="无法获取 Account ID" />;
    }

    const results: Array<{ domain: string; success: boolean; message: string; nameservers?: string[]; details?: string[] }> = [];
    const isProxied = proxied === "true";
    const isWildcardProxied = wildcardProxied === "true";

    for (const domain of domainList) {
      const details: string[] = [];
      try {
        // 检查域名是否已存在
        let zone = await client.getZone(domain);
        
        if (!zone) {
          // 添加新域名
          const addResult = await client.addZone(domain, accountId);
          if (!addResult.success) {
            results.push({ domain, success: false, message: addResult.error || "添加失败" });
            LogService.add(domain, "add_zone", "error", addResult.error || "添加失败");
            continue;
          }
          zone = addResult.zone!;
          details.push("✓ 域名已添加");
        } else {
          details.push("○ 域名已存在");
        }

        // 添加 DNS 记录
        for (const name of recordTypes) {
          // 泛域名特殊处理 CDN 设置
          const shouldProxy = name === "*" ? isWildcardProxied : isProxied;
          const result = await client.addDnsRecord(zone.id, dnsType, name, target, shouldProxy);
          if (result.success) {
            details.push(`✓ ${name} -> ${target} (${dnsType}) ${shouldProxy ? "[CDN]" : ""}`);
          } else {
            const errMsg = result.errors?.[0]?.message || "失败";
            if (errMsg.includes("already exists")) {
              details.push(`○ ${name} 记录已存在`);
            } else {
              details.push(`✗ ${name}: ${errMsg}`);
            }
          }
        }

        // 设置安全级别
        if (securityLevel) {
          const secResult = await client.setSecurityLevel(zone.id, securityLevel);
          if (secResult.success) {
            details.push(`✓ 安全级别: ${securityLevel}`);
          }
        }

        results.push({
          domain,
          success: true,
          message: "配置完成",
          nameservers: zone.name_servers,
          details,
        });
        LogService.add(domain, "batch_add", "success", details.join("; "));
      } catch (error) {
        const msg = error instanceof Error ? error.message : String(error);
        results.push({ domain, success: false, message: msg, details });
        LogService.add(domain, "batch_add", "error", msg);
      }
    }

    const successCount = results.filter((r) => r.success).length;
    const failCount = results.filter((r) => !r.success).length;

    return (
      <div class="space-y-4">
        <div class={`p-4 rounded-lg ${failCount === 0 ? "bg-green-100" : "bg-yellow-100"}`}>
          <span class="font-bold">
            📊 处理完成: 成功 {successCount} / 失败 {failCount}
          </span>
          <span class="ml-4 text-sm text-gray-600">
            记录类型: {recordTypes.join(", ")}
          </span>
        </div>
        
        <div class="space-y-3">
          {results.map((r) => (
            <div class={`p-3 border-l-4 ${r.success ? "border-green-500 bg-green-50" : "border-red-500 bg-red-50"} rounded-r`}>
              <div class="flex justify-between items-start">
                <span class="font-medium">{r.success ? "✅" : "❌"} {r.domain}</span>
                {r.nameservers && (
                  <code class="text-xs bg-gray-200 px-2 py-1 rounded">
                    {r.nameservers.join(", ")}
                  </code>
                )}
              </div>
              {r.details && r.details.length > 0 && (
                <div class="mt-2 text-sm text-gray-600 space-y-1">
                  {r.details.map(d => <div>{d}</div>)}
                </div>
              )}
              {!r.success && <div class="text-red-600 text-sm mt-1">{r.message}</div>}
            </div>
          ))}
        </div>

        {results.some((r) => r.success && r.nameservers) && (
          <div class="mt-4 p-4 bg-blue-50 rounded-lg">
            <h4 class="font-bold mb-2">📝 请到域名注册商处设置 NS 记录</h4>
          </div>
        )}
      </div>
    );
  })

  // ========== 蜘蛛屏蔽 API ==========
  
  // 应用蜘蛛屏蔽规则
  .post("/api/bot-block/apply", async ({ body }) => {
    const { bots, customBots, action } = body as {
      bots: string | string[];
      customBots: string;
      action: string;
    };

    const client = getClient();
    if (!client) {
      return <Alert type="error" message="请先配置 API 凭证" />;
    }

    // 合并预设和自定义蜘蛛
    let botList: string[] = [];
    if (bots) {
      botList = Array.isArray(bots) ? bots : [bots];
    }
    if (customBots) {
      const custom = customBots.split("\n").map(b => b.trim()).filter(Boolean);
      botList = [...botList, ...custom];
    }

    if (botList.length === 0) {
      return <Alert type="warning" message="请至少选择一个要屏蔽的蜘蛛" />;
    }

    // 获取所有域名
    const zones = await client.listZones();
    if (zones.length === 0) {
      return <Alert type="warning" message="没有找到域名" />;
    }

    const results: Array<{ domain: string; success: boolean; message: string }> = [];

    for (const zone of zones) {
      try {
        await client.createOrUpdateBotBlockRule(zone.id, botList, action);
        results.push({ domain: zone.name, success: true, message: "规则已应用" });
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        results.push({ domain: zone.name, success: false, message: msg });
      }
    }

    return <BotBlockResult results={results} />;
  })

  // 移除蜘蛛屏蔽规则
  .post("/api/bot-block/remove", async () => {
    const client = getClient();
    if (!client) {
      return <Alert type="error" message="请先配置 API 凭证" />;
    }

    const zones = await client.listZones();
    const results: Array<{ domain: string; success: boolean; message: string }> = [];

    for (const zone of zones) {
      try {
        await client.removeBotBlockRule(zone.id);
        results.push({ domain: zone.name, success: true, message: "规则已移除" });
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        results.push({ domain: zone.name, success: false, message: msg });
      }
    }

    return <BotBlockResult results={results} />;
  })

  // ========== API 防护 ==========
  
  // 应用 API 防护规则
  .post("/api/api-protect/apply", async ({ body }) => {
    const { paths, rules, whitelist, action, blocked_countries, enable_rate_limit, rate_period, rate_limit, rate_action, scope, domains } = body as {
      paths: string;
      rules: string | string[];
      whitelist: string;
      action: string;
      blocked_countries: string | string[];
      enable_rate_limit: string;
      rate_period: string;
      rate_limit: string;
      rate_action: string;
      scope: string;
      domains: string;
    };

    const client = getClient();
    if (!client) {
      return <Alert type="error" message="请先配置 API 凭证" />;
    }

    // 解析路径
    const pathList = paths.split("\n").map(p => p.trim()).filter(Boolean);
    if (pathList.length === 0) {
      return <Alert type="warning" message="请输入要保护的路径" />;
    }

    // 解析规则
    let ruleList: string[] = [];
    if (rules) {
      ruleList = Array.isArray(rules) ? rules : [rules];
    }
    if (ruleList.length === 0) {
      return <Alert type="warning" message="请至少选择一个防护规则" />;
    }

    // 解析白名单
    const whitelistIps = whitelist ? whitelist.split("\n").map(ip => ip.trim()).filter(Boolean) : [];

    // 解析屏蔽的国家
    let blockedCountries: string[] = [];
    if (blocked_countries) {
      blockedCountries = Array.isArray(blocked_countries) ? blocked_countries : [blocked_countries];
    }

    // 解析速率限制
    const rateLimitConfig = enable_rate_limit === "on" ? {
      enabled: true,
      period: parseInt(rate_period) || 60,
      limit: parseInt(rate_limit) || 100,
      action: rate_action || "block"
    } : undefined;

    // 获取所有域名
    const allZones = await client.listZones();
    
    // 根据范围筛选域名
    let targetZones = allZones;
    if (scope === "selected" && domains) {
      const domainList = domains.split("\n").map(d => d.trim().toLowerCase()).filter(Boolean);
      if (domainList.length === 0) {
        return <Alert type="warning" message="请输入要应用规则的域名" />;
      }
      // 筛选匹配的域名
      targetZones = allZones.filter(zone => domainList.includes(zone.name.toLowerCase()));
      
      if (targetZones.length === 0) {
        return <Alert type="warning" message={`未找到匹配的域名。输入的域名: ${domainList.join(", ")}`} />;
      }
    }

    const results: Array<{ domain: string; success: boolean; message: string }> = [];

    // 获取处理方式的中文描述
    const actionLabels: Record<string, string> = {
      "js_challenge": "JS 质询",
      "managed_challenge": "托管质询",
      "block": "直接屏蔽"
    };
    const actionLabel = actionLabels[action] || action;

    for (const zone of targetZones) {
      try {
        await client.createApiProtectRule(zone.id, {
          paths: pathList,
          rules: ruleList,
          whitelist: whitelistIps,
          action: action || "managed_challenge",
          blockedCountries,
          rateLimit: rateLimitConfig
        });
        results.push({ domain: zone.name, success: true, message: `防护规则已应用 (${actionLabel})` });
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        results.push({ domain: zone.name, success: false, message: msg });
      }
    }

    return <ApiProtectResult results={results} />;
  })

  // 移除 API 防护规则
  .post("/api/api-protect/remove", async ({ body }) => {
    const { scope, domains } = body as { scope?: string; domains?: string };
    
    const client = getClient();
    if (!client) {
      return <Alert type="error" message="请先配置 API 凭证" />;
    }

    // 获取所有域名
    const allZones = await client.listZones();
    
    // 根据范围筛选域名
    let targetZones = allZones;
    if (scope === "selected" && domains) {
      const domainList = domains.split("\n").map(d => d.trim().toLowerCase()).filter(Boolean);
      if (domainList.length > 0) {
        targetZones = allZones.filter(zone => domainList.includes(zone.name.toLowerCase()));
      }
    }

    const results: Array<{ domain: string; success: boolean; message: string }> = [];

    for (const zone of targetZones) {
      try {
        await client.removeApiProtectRule(zone.id);
        results.push({ domain: zone.name, success: true, message: "规则已移除" });
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        results.push({ domain: zone.name, success: false, message: msg });
      }
    }

    return <ApiProtectResult results={results} />;
  })

  .listen(3000);

console.log(`
☁️  Cloudflare 批量助手已启动
🌐 访问地址: http://localhost:${app.server?.port}
`);
