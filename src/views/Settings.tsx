import { Layout } from "../components/Layout";
import { ConfigService } from "../services/db";

export const Settings = () => {
  const email = ConfigService.get("cf_email") || "";
  const apiKey = ConfigService.get("cf_api_key") || "";
  const defaultIp = ConfigService.get("default_ip") || "";

  return (
    <Layout title="设置 - CF Manager">
      <div class="max-w-2xl mx-auto">
        <div class="bg-white rounded-lg shadow p-6">
          <h2 class="text-2xl font-bold border-b pb-3 mb-6">⚙️ 系统设置</h2>

          <form hx-post="/api/save-config" hx-target="#save-result" hx-swap="innerHTML" class="space-y-6">
            <div>
              <label class="block font-medium mb-2">Cloudflare 邮箱:</label>
              <input 
                type="email" 
                name="email" 
                value={email}
                class="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500" 
                placeholder="your@email.com"
              />
            </div>

            <div>
              <label class="block font-medium mb-2">Global API Key:</label>
              <input 
                type="password" 
                name="apiKey" 
                value={apiKey}
                class="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500" 
                placeholder="你的 Cloudflare Global API Key"
              />
              <p class="text-sm text-gray-500 mt-1">
                在 Cloudflare 控制台 → My Profile → API Tokens → Global API Key 获取
              </p>
            </div>

            <div>
              <label class="block font-medium mb-2">默认解析 IP:</label>
              <input 
                type="text" 
                name="defaultIp" 
                value={defaultIp}
                class="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500" 
                placeholder="1.2.3.4"
              />
            </div>

            <div class="flex items-center gap-4">
              <button 
                type="submit" 
                class="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition font-medium"
              >
                💾 保存配置
              </button>
              <button 
                type="button"
                hx-post="/api/verify-config"
                hx-target="#save-result"
                hx-include="[name='email'], [name='apiKey']"
                class="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition font-medium"
              >
                🔍 验证连接
              </button>
            </div>

            <div id="save-result"></div>
          </form>
        </div>
      </div>
    </Layout>
  );
};
