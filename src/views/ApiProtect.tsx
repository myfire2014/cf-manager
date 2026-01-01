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
              rows="3" 
              class="w-full border border-gray-300 p-3 rounded-lg text-sm" 
              placeholder="/api/*&#10;/login&#10;/register&#10;/user/*"
            >/api/*</textarea>
            <p class="text-xs text-gray-500 mt-1">支持通配符 *，如 /api/* 匹配所有 /api/ 开头的路径</p>
          </div>

          {/* 统一安全级别 */}
          <div class="border-t pt-4">
            <h3 class="font-medium mb-3">🔐 触发规则后的处理方式：</h3>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
              <label class="flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50 has-[:checked]:border-blue-500 has-[:checked]:bg-blue-50">
                <input type="radio" name="action" value="js_challenge" class="w-4 h-4" />
                <div>
                  <span class="font-medium">🧩 JS 质询</span>
                  <p class="text-xs text-gray-500">要求浏览器执行 JavaScript 验证</p>
                </div>
              </label>
              <label class="flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50 has-[:checked]:border-blue-500 has-[:checked]:bg-blue-50">
                <input type="radio" name="action" value="managed_challenge" checked class="w-4 h-4" />
                <div>
                  <span class="font-medium">🤖 托管质询</span>
                  <p class="text-xs text-gray-500">Cloudflare 智能判断验证方式（推荐）</p>
                </div>
              </label>
              <label class="flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50 has-[:checked]:border-red-500 has-[:checked]:bg-red-50">
                <input type="radio" name="action" value="block" class="w-4 h-4" />
                <div>
                  <span class="font-medium">🚫 直接屏蔽</span>
                  <p class="text-xs text-gray-500">拒绝请求并返回错误页面</p>
                </div>
              </label>
            </div>
          </div>

          {/* 防护规则 */}
          <div class="border-t pt-4">
            <h3 class="font-medium mb-3">🔒 防护规则（勾选要启用的）：</h3>
            <div class="space-y-3">
              <label class="flex items-start gap-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                <input type="checkbox" name="rules" value="challenge_no_referer" checked class="mt-1 w-4 h-4 rounded" />
                <div>
                  <span class="font-medium">拦截无 Referer 请求</span>
                  <p class="text-xs text-gray-500">对没有来源页面的请求进行处理</p>
                </div>
              </label>
              <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-xs text-yellow-700">
                ⚠️ <strong>注意：</strong>移动端 APP、第三方回调（支付/短信）、书签访问等场景通常没有 Referer，请确保已加入白名单或取消此规则
              </div>
              
              <label class="flex items-start gap-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                <input type="checkbox" name="rules" value="no_browser_ua" checked class="mt-1 w-4 h-4 rounded" />
                <div>
                  <span class="font-medium">拦截非浏览器 User-Agent</span>
                  <p class="text-xs text-gray-500">阻止 UA 中不含 Mozilla 的请求（过滤脚本工具）</p>
                </div>
              </label>

              <label class="flex items-start gap-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                <input type="checkbox" name="rules" value="empty_ua" checked class="mt-1 w-4 h-4 rounded" />
                <div>
                  <span class="font-medium">拦截空 User-Agent</span>
                  <p class="text-xs text-gray-500">阻止没有 UA 的请求</p>
                </div>
              </label>

              <label class="flex items-start gap-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                <input type="checkbox" name="rules" value="block_countries" id="block_countries_toggle" class="mt-1 w-4 h-4 rounded" />
                <div>
                  <span class="font-medium">拦截指定国家/地区</span>
                  <p class="text-xs text-gray-500">阻止来自选定国家/地区的请求（支持 240+ 国家/地区）</p>
                </div>
              </label>
              <CountrySelector />
              <CountrySelectorScript />

              <label class="flex items-start gap-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                <input type="checkbox" name="rules" value="challenge_suspicious" class="mt-1 w-4 h-4 rounded" />
                <div>
                  <span class="font-medium">拦截可疑请求（威胁分数 &gt; 10）</span>
                  <p class="text-xs text-gray-500">对 Cloudflare 判定为可疑的请求进行处理</p>
                </div>
              </label>
            </div>
          </div>

          {/* 速率限制 */}
          <div class="border-t pt-4">
            <h3 class="font-medium mb-3">⏱️ 速率限制（Rate Limiting）：</h3>
            <label class="flex items-center gap-2 mb-3">
              <input type="checkbox" name="enable_rate_limit" id="enable_rate_limit" class="w-4 h-4 rounded" />
              <span class="text-sm">启用速率限制</span>
            </label>
            <div id="rate_limit_options" class="grid grid-cols-1 md:grid-cols-3 gap-4 opacity-50 pointer-events-none">
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
                <input type="number" name="rate_limit" value="100" class="w-full border border-gray-300 p-2 rounded-lg" />
              </div>
              <div>
                <label class="block text-sm mb-1">超限处理：</label>
                <select name="rate_action" class="w-full border border-gray-300 p-2 rounded-lg">
                  <option value="block">屏蔽</option>
                  <option value="js_challenge">JS 质询</option>
                  <option value="managed_challenge">托管质询</option>
                </select>
              </div>
            </div>
            <p class="text-xs text-gray-500 mt-2">⚠️ 速率限制通过 WAF 规则模拟实现，可能有一定延迟</p>
            <script>
              {`
                document.getElementById('enable_rate_limit').addEventListener('change', function() {
                  const options = document.getElementById('rate_limit_options');
                  if (this.checked) {
                    options.classList.remove('opacity-50', 'pointer-events-none');
                  } else {
                    options.classList.add('opacity-50', 'pointer-events-none');
                  }
                });
              `}
            </script>
          </div>

          {/* 白名单 */}
          <div class="border-t pt-4">
            <h3 class="font-medium mb-2">✅ IP 白名单（每行一个，可选）：</h3>
            <textarea name="whitelist" rows="2" class="w-full border border-gray-300 p-3 rounded-lg text-sm" placeholder="1.2.3.4&#10;5.6.7.0/24"></textarea>
            <p class="text-xs text-gray-500 mt-1">白名单 IP 不受上述规则限制，支持 CIDR 格式</p>
          </div>

          <div class="flex gap-4">
            <button type="submit" class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition font-medium">🚀 应用防护规则</button>
            <button 
              type="button"
              hx-post="/api/api-protect/remove"
              hx-target="#result"
              hx-confirm="确定要移除所有域名的 API 防护规则吗？"
              class="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition font-medium"
            >
              🗑️ 移除规则
            </button>
            <span id="loading" class="htmx-indicator text-gray-500 self-center">处理中...</span>
          </div>
        </form>

        <div id="result" class="mt-6"></div>
      </div>

      {/* 说明 */}
      <div class="bg-white rounded-lg shadow p-6">
        <h3 class="font-bold mb-3">📖 处理方式说明</h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div class="border rounded p-3">
            <h4 class="font-medium text-blue-700">🧩 JS 质询</h4>
            <ul class="text-gray-600 mt-1 space-y-1">
              <li>• 要求浏览器执行 JavaScript</li>
              <li>• 可过滤简单脚本和爬虫</li>
              <li>• 对用户体验影响较小</li>
            </ul>
          </div>
          <div class="border rounded p-3">
            <h4 class="font-medium text-green-700">🤖 托管质询（推荐）</h4>
            <ul class="text-gray-600 mt-1 space-y-1">
              <li>• Cloudflare 智能判断</li>
              <li>• 可能显示验证码或直接放行</li>
              <li>• 平衡安全性和用户体验</li>
            </ul>
          </div>
          <div class="border rounded p-3">
            <h4 class="font-medium text-red-700">🚫 直接屏蔽</h4>
            <ul class="text-gray-600 mt-1 space-y-1">
              <li>• 直接拒绝请求</li>
              <li>• 最严格的防护方式</li>
              <li>• 可能误伤正常用户</li>
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
