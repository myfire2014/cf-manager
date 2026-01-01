import { Layout } from "../components/Layout";
import { CountrySelector, CountrySelectorScript } from "../components/CountrySelector";

export const ApiProtect = () => (
  <Layout title="API 防护 - CF Manager">
    <div class="space-y-6">
      <div class="bg-white rounded-lg shadow p-6">
        <h2 class="text-2xl font-bold border-b pb-3 mb-4">🛡️ API 防护（防 CC 攻击）</h2>
        
        <div class="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6 rounded">
          <p class="text-sm text-gray-600">
            通过 Cloudflare WAF 规则保护 API 接口，防止 CC 攻击和恶意请求。
            规则会应用到所有域名。
          </p>
        </div>

        <form hx-post="/api/api-protect/apply" hx-target="#result" hx-indicator="#loading" class="space-y-6">
          {/* 保护路径 */}
          <div>
            <h3 class="font-medium mb-2">📍 保护路径（每行一个）：</h3>
            <textarea 
              name="paths" 
              rows={3} 
              class="w-full border border-gray-300 p-3 rounded-lg text-sm" 
              placeholder="/api/*&#10;/login&#10;/register&#10;/user/*"
            >/api/*</textarea>
            <p class="text-xs text-gray-500 mt-1">支持通配符 *，如 /api/* 匹配所有 /api/ 开头的路径</p>
          </div>

          {/* 防护规则 */}
          <div>
            <h3 class="font-medium mb-3">🔒 防护规则（勾选要启用的）：</h3>
            <div class="space-y-3">
              <label class="flex items-start gap-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                <input type="checkbox" name="rules" value="challenge_no_referer" checked class="mt-1 w-4 h-4 rounded" />
                <div>
                  <span class="font-medium">质询无 Referer 请求</span>
                  <p class="text-xs text-gray-500">对没有来源页面的请求进行 JS 质询（比直接屏蔽更温和）</p>
                </div>
              </label>
              <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-xs text-yellow-700">
                ⚠️ <strong>注意：</strong>移动端 APP、第三方回调（支付/短信）、书签访问等场景通常没有 Referer，请确保已加入白名单或取消此规则
              </div>
              
              <label class="flex items-start gap-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                <input type="checkbox" name="rules" value="no_browser_ua" checked class="mt-1 w-4 h-4 rounded" />
                <div>
                  <span class="font-medium">屏蔽非浏览器 User-Agent</span>
                  <p class="text-xs text-gray-500">阻止 UA 中不含 Mozilla 的请求（过滤脚本工具）</p>
                </div>
              </label>

              <label class="flex items-start gap-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                <input type="checkbox" name="rules" value="empty_ua" checked class="mt-1 w-4 h-4 rounded" />
                <div>
                  <span class="font-medium">屏蔽空 User-Agent</span>
                  <p class="text-xs text-gray-500">阻止没有 UA 的请求</p>
                </div>
              </label>

              <label class="flex items-start gap-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                <input type="checkbox" name="rules" value="block_countries" id="block_countries_toggle" class="mt-1 w-4 h-4 rounded" />
                <div>
                  <span class="font-medium">屏蔽指定国家/地区</span>
                  <p class="text-xs text-gray-500">阻止来自选定国家/地区的请求（支持 240+ 国家/地区，含搜索功能）</p>
                </div>
              </label>
              <CountrySelector />
              <CountrySelectorScript />

              <label class="flex items-start gap-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                <input type="checkbox" name="rules" value="challenge_suspicious" class="mt-1 w-4 h-4 rounded" />
                <div>
                  <span class="font-medium">质询可疑请求（威胁分数 &gt; 10）</span>
                  <p class="text-xs text-gray-500">对 CF 判定为可疑的请求进行 JS 质询</p>
                </div>
              </label>
            </div>
          </div>

          {/* 速率限制 */}
          <div class="border-t pt-4">
            <h3 class="font-medium mb-3">⏱️ 速率限制（Rate Limiting）：</h3>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label class="block text-sm mb-1">时间窗口：</label>
                <select name="rate_period" class="w-full border border-gray-300 p-2 rounded-lg">
                  <option value="10">10 秒</option>
                  <option value="60" selected>1 分钟</option>
                  <option value="300">5 分钟</option>
                </select>
              </div>
              <div>
                <label class="block text-sm mb-1">最大请求数：</label>
                <input type="number" name="rate_limit" value={100} class="w-full border border-gray-300 p-2 rounded-lg" />
              </div>
              <div>
                <label class="block text-sm mb-1">超限处理：</label>
                <select name="rate_action" class="w-full border border-gray-300 p-2 rounded-lg">
                  <option value="block">屏蔽</option>
                  <option value="challenge">JS 质询</option>
                  <option value="managed_challenge">托管质询</option>
                </select>
              </div>
            </div>
            <p class="text-xs text-gray-500 mt-2">⚠️ 免费版 Rate Limiting 有限制，此功能通过 WAF 规则模拟实现基础防护</p>
          </div>

          {/* 白名单 */}
          <div class="border-t pt-4">
            <h3 class="font-medium mb-2">✅ IP 白名单（每行一个，可选）：</h3>
            <textarea name="whitelist" rows={2} class="w-full border border-gray-300 p-3 rounded-lg text-sm" placeholder="1.2.3.4&#10;5.6.7.0/24"></textarea>
            <p class="text-xs text-gray-500 mt-1">白名单 IP 不受上述规则限制，支持 CIDR 格式</p>
          </div>

          <div class="flex gap-4">
            <button type="submit" class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition font-medium">🚀 应用防护规则</button>
            <button type="button" hx-post="/api/api-protect/remove" hx-target="#result" hx-confirm="确定要移除所有域名的 API 防护规则吗？" class="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition font-medium">🗑️ 移除规则</button>
            <span id="loading" class="htmx-indicator text-gray-500 self-center">处理中...</span>
          </div>
        </form>

        <div id="result" class="mt-6"></div>
      </div>

      {/* 说明 */}
      <div class="bg-white rounded-lg shadow p-6">
        <h3 class="font-bold mb-3">📖 防护说明</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div class="border rounded p-3">
            <h4 class="font-medium text-green-700">✅ 适合场景</h4>
            <ul class="text-gray-600 mt-1 space-y-1">
              <li>• 登录/注册接口防暴力破解</li>
              <li>• API 接口防 CC 攻击</li>
              <li>• 防止爬虫批量请求</li>
            </ul>
          </div>
          <div class="border rounded p-3">
            <h4 class="font-medium text-yellow-700">⚠️ 注意事项</h4>
            <ul class="text-gray-600 mt-1 space-y-1">
              <li>• 如有移动端 APP，需加入白名单或调整规则</li>
              <li>• 第三方回调接口需排除在外</li>
              <li>• 规则过严可能影响正常用户</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </Layout>
);

export const ApiProtectResult = ({ results }: { results: Array<{ domain: string; success: boolean; message: string }> }) => {
  const successCount = results.filter(r => r.success).length;
  const failCount = results.filter(r => !r.success).length;

  return (
    <div class="space-y-3">
      <div class={`p-4 rounded-lg ${failCount === 0 ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
        API 防护规则应用完成：成功 {successCount} / 失败 {failCount}
      </div>
      <div class="max-h-60 overflow-y-auto space-y-1">
        {results.map(r => (
          <div class={`text-sm p-2 rounded ${r.success ? "bg-green-50" : "bg-red-50"}`}>
            {r.success ? "✅" : "❌"} {r.domain}: {r.message}
          </div>
        ))}
      </div>
    </div>
  );
};
