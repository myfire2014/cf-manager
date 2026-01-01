import { Layout } from "../components/Layout";
import { ConfigService } from "../services/db";

export const Home = () => {
  const hasConfig = ConfigService.get("cf_email") && ConfigService.get("cf_api_key");
  
  return (
    <Layout title="仪表盘 - CF Manager">
      <div class="space-y-6">
        <div class="bg-white rounded-lg shadow p-6">
          <h2 class="text-2xl font-bold border-b pb-3 mb-4">🚀 批量操作控制台</h2>
          
          {!hasConfig && (
            <div class="bg-yellow-100 border-l-4 border-yellow-500 p-4 mb-6 rounded">
              <span class="font-medium">⚠️ 请先配置 Cloudflare API 凭证</span>
              <a href="/settings" class="ml-2 text-blue-600 underline">前往设置</a>
            </div>
          )}

          <form hx-post="/api/batch-add" hx-target="#result-area" hx-indicator="#loading" class="space-y-4">
            <div>
              <label class="block font-medium mb-2">域名列表 (每行一个):</label>
              <textarea 
                name="domains" 
                rows="6" 
                class="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                placeholder="example.com&#10;test.com&#10;mysite.org"
              ></textarea>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label class="block font-medium mb-2">记录类型:</label>
                <select name="recordType" class="w-full border border-gray-300 p-2 rounded-lg" id="recordType" onchange="toggleTargetInput()">
                  <option value="A">A 记录 (IP 地址)</option>
                  <option value="CNAME">CNAME 记录 (域名)</option>
                </select>
              </div>
              <div>
                <label class="block font-medium mb-2">解析目标:</label>
                <input 
                  type="text" 
                  name="target" 
                  class="w-full border border-gray-300 p-2 rounded-lg" 
                  placeholder="IP 地址或 CNAME 目标域名"
                  value={ConfigService.get("default_ip") || ""}
                />
                <p class="text-xs text-gray-500 mt-1">A 记录填 IP，CNAME 填目标域名</p>
              </div>
              <div>
                <label class="block font-medium mb-2">CDN 代理:</label>
                <select name="proxied" class="w-full border border-gray-300 p-2 rounded-lg">
                  <option value="true">开启 (Orange Cloud)</option>
                  <option value="false">关闭 (Grey Cloud)</option>
                </select>
              </div>
            </div>

            <div>
              <label class="block font-medium mb-2">DNS 记录类型:</label>
              <div class="flex flex-wrap gap-4 p-3 bg-gray-50 rounded-lg">
                <label class="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" name="records" value="@" checked class="w-4 h-4 rounded" />
                  <span>@ (根域名)</span>
                </label>
                <label class="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" name="records" value="www" checked class="w-4 h-4 rounded" />
                  <span>www</span>
                </label>
                <label class="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" name="records" value="*" checked class="w-4 h-4 rounded" />
                  <span>* (泛域名)</span>
                </label>
                <label class="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" name="records" value="api" class="w-4 h-4 rounded" />
                  <span>api</span>
                </label>
                <label class="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" name="records" value="m" class="w-4 h-4 rounded" />
                  <span>m (移动端)</span>
                </label>
                <label class="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" name="records" value="cdn" class="w-4 h-4 rounded" />
                  <span>cdn</span>
                </label>
              </div>
              <div class="mt-2">
                <label class="block text-sm text-gray-600 mb-1">自定义记录 (逗号分隔):</label>
                <input 
                  type="text" 
                  name="customRecords" 
                  class="w-full border border-gray-300 p-2 rounded-lg text-sm" 
                  placeholder="blog, shop, app"
                />
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block font-medium mb-2">安全级别:</label>
                <select name="securityLevel" class="w-full border border-gray-300 p-2 rounded-lg">
                  <option value="">不修改</option>
                  <option value="off">Off</option>
                  <option value="essentially_off">Essentially Off</option>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="under_attack">Under Attack</option>
                </select>
              </div>
              <div>
                <label class="block font-medium mb-2">泛域名 CDN:</label>
                <select name="wildcardProxied" class="w-full border border-gray-300 p-2 rounded-lg">
                  <option value="false">关闭 (推荐，避免证书问题)</option>
                  <option value="true">开启</option>
                </select>
                <p class="text-xs text-gray-500 mt-1">泛域名开启 CDN 需要企业版证书</p>
              </div>
            </div>

            <div class="flex items-center gap-4">
              <button 
                type="submit" 
                class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition font-medium"
              >
                🚀 开始执行
              </button>
              <span id="loading" class="htmx-indicator text-gray-500">
                ⏳ 正在处理，请稍候...
              </span>
            </div>
          </form>
        </div>

        <div class="bg-white rounded-lg shadow p-6">
          <h3 class="text-lg font-bold mb-4">📋 操作结果</h3>
          <div id="result-area" class="min-h-[100px]">
            <p class="text-gray-400">操作日志将显示在这里...</p>
          </div>
        </div>
      </div>
    </Layout>
  );
};
