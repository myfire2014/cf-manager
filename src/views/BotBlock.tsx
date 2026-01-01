import { Layout } from "../components/Layout";

const defaultBots = [
  { name: "AhrefsBot", desc: "Ahrefs SEO 爬虫", checked: true },
  { name: "MJ12bot", desc: "Majestic SEO 爬虫", checked: true },
  { name: "SemrushBot", desc: "Semrush SEO 爬虫", checked: true },
  { name: "DotBot", desc: "Moz SEO 爬虫", checked: false },
  { name: "GPTBot", desc: "OpenAI GPT 爬虫", checked: true },
  { name: "ChatGPT-User", desc: "ChatGPT 浏览插件", checked: false },
  { name: "anthropic-ai", desc: "Anthropic Claude 爬虫", checked: true },
  { name: "Claude-Web", desc: "Claude 网页爬虫", checked: true },
  { name: "CCBot", desc: "Common Crawl 爬虫", checked: false },
  { name: "Bytespider", desc: "字节跳动爬虫", checked: false },
  { name: "PetalBot", desc: "华为花瓣搜索爬虫", checked: false },
];

export const BotBlock = ({ currentRules }: { currentRules?: string[] }) => (
  <Layout title="蜘蛛屏蔽 - CF Manager">
    <div class="space-y-6">
      <div class="bg-white rounded-lg shadow p-6">
        <h2 class="text-2xl font-bold border-b pb-3 mb-4">🤖 蜘蛛/爬虫屏蔽</h2>
        
        <div class="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6 rounded">
          <p class="text-sm text-gray-600">
            通过 Cloudflare WAF 自定义规则，批量屏蔽指定的爬虫/蜘蛛。
            规则基于 User-Agent 匹配，会对所有选中的域名生效。
          </p>
        </div>

        <form hx-post="/api/bot-block/apply" hx-target="#result" hx-indicator="#loading" class="space-y-6">
          {/* 预设蜘蛛列表 */}
          <div>
            <h3 class="font-medium mb-3">📋 常见爬虫（勾选要屏蔽的）：</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {defaultBots.map(bot => (
                <label class="flex items-start gap-2 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                  <input 
                    type="checkbox" 
                    name="bots" 
                    value={bot.name} 
                    checked={bot.checked}
                    class="mt-1 w-4 h-4 rounded" 
                  />
                  <div>
                    <span class="font-medium">{bot.name}</span>
                    <p class="text-xs text-gray-500">{bot.desc}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* 自定义蜘蛛 */}
          <div>
            <h3 class="font-medium mb-2">✏️ 自定义 User-Agent 特征（每行一个）：</h3>
            <textarea 
              name="customBots" 
              rows="3" 
              class="w-full border border-gray-300 p-3 rounded-lg text-sm" 
              placeholder="YandexBot&#10;Sogou&#10;360Spider"
            ></textarea>
            <p class="text-xs text-gray-500 mt-1">填写 User-Agent 中包含的关键词即可</p>
          </div>

          {/* 操作选项 */}
          <div>
            <h3 class="font-medium mb-2">⚙️ 操作方式：</h3>
            <div class="flex gap-4">
              <label class="flex items-center gap-2">
                <input type="radio" name="action" value="block" checked class="w-4 h-4" />
                <span>🚫 屏蔽（返回 403）</span>
              </label>
              <label class="flex items-center gap-2">
                <input type="radio" name="action" value="challenge" class="w-4 h-4" />
                <span>🔒 质询（JS Challenge）</span>
              </label>
              <label class="flex items-center gap-2">
                <input type="radio" name="action" value="managed_challenge" class="w-4 h-4" />
                <span>🛡️ 托管质询</span>
              </label>
            </div>
          </div>

          {/* 应用范围 */}
          <div>
            <h3 class="font-medium mb-2">🌐 应用范围：</h3>
            <div class="flex gap-4">
              <label class="flex items-center gap-2">
                <input type="radio" name="scope" value="all" checked class="w-4 h-4" />
                <span>所有域名</span>
              </label>
              <label class="flex items-center gap-2">
                <input type="radio" name="scope" value="selected" class="w-4 h-4" />
                <span>指定域名</span>
              </label>
            </div>
          </div>

          <div class="flex gap-4">
            <button 
              type="submit" 
              class="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition font-medium"
            >
              🚀 应用规则
            </button>
            <button 
              type="button"
              hx-post="/api/bot-block/remove"
              hx-target="#result"
              hx-confirm="确定要移除所有域名的蜘蛛屏蔽规则吗？"
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
        <h3 class="font-bold mb-3">📖 说明</h3>
        <ul class="text-sm text-gray-600 space-y-2">
          <li>• 规则名称：<code class="bg-gray-100 px-1">Block Bad Bots</code>（由本工具创建和管理）</li>
          <li>• 规则会匹配 User-Agent 中包含指定关键词的请求</li>
          <li>• 屏蔽 AI 爬虫（GPTBot、anthropic-ai）可防止内容被用于训练</li>
          <li>• 屏蔽 SEO 爬虫可减少服务器负载，但可能影响 SEO 分析</li>
          <li>• 建议保留 Googlebot、Bingbot 等搜索引擎蜘蛛</li>
        </ul>
      </div>
    </div>
  </Layout>
);

export const BotBlockResult = ({ results }: { results: Array<{ domain: string; success: boolean; message: string }> }) => {
  const successCount = results.filter(r => r.success).length;
  const failCount = results.filter(r => !r.success).length;

  return (
    <div class="space-y-3">
      <div class={`p-4 rounded-lg ${failCount === 0 ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
        规则应用完成：成功 {successCount} / 失败 {failCount}
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
