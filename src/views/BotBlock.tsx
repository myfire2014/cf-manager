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

export const BotBlock = () => (
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

        <form id="bot-block-form" class="space-y-6">
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
            <div class="flex gap-4 flex-wrap">
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
            <div class="space-y-3">
              <label class="flex items-center gap-2">
                <input type="radio" name="scope" value="all" id="scope_all" checked class="w-4 h-4" />
                <span>应用到所有域名</span>
              </label>
              <label class="flex items-center gap-2">
                <input type="radio" name="scope" value="selected" id="scope_selected" class="w-4 h-4" />
                <span>仅应用到指定域名</span>
              </label>
              <div id="domains_input" class="ml-6 hidden">
                <textarea 
                  name="domains" 
                  rows="3" 
                  class="w-full border border-gray-300 p-3 rounded-lg text-sm" 
                  placeholder="example.com&#10;example.org&#10;mydomain.net"
                ></textarea>
                <p class="text-xs text-gray-500 mt-1">每行一个主域名</p>
              </div>
            </div>
          </div>

          <div class="flex gap-4">
            <button type="button" id="apply_btn" class="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition font-medium">
              🚀 应用规则
            </button>
            <button type="button" id="remove_btn" class="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition font-medium">
              🗑️ 移除规则
            </button>
          </div>
        </form>

        {/* 实时日志区域 */}
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

    <script>
      {`
        // 切换域名输入框显示
        document.querySelectorAll('input[name="scope"]').forEach(function(radio) {
          radio.addEventListener('change', function() {
            document.getElementById('domains_input').classList.toggle('hidden', this.value !== 'selected');
          });
        });

        // 收集表单数据
        function collectFormData() {
          var form = document.getElementById('bot-block-form');
          var data = {};
          
          // bots
          var botsCheckboxes = form.querySelectorAll('input[name="bots"]:checked');
          data.bots = Array.from(botsCheckboxes).map(function(cb) { return cb.value; }).join(',');
          
          // customBots
          var customBotsTextarea = form.querySelector('textarea[name="customBots"]');
          data.customBots = customBotsTextarea ? customBotsTextarea.value.split('\\n').filter(function(b) { return b.trim(); }).join(',') : '';
          
          // action
          var actionRadio = form.querySelector('input[name="action"]:checked');
          data.action = actionRadio ? actionRadio.value : 'block';
          
          // scope
          var scopeRadio = form.querySelector('input[name="scope"]:checked');
          data.scope = scopeRadio ? scopeRadio.value : 'all';
          
          // domains
          var domainsTextarea = form.querySelector('textarea[name="domains"]');
          data.domains = domainsTextarea ? domainsTextarea.value.split('\\n').filter(function(d) { return d.trim(); }).join(',') : '';
          
          return data;
        }

        // 构建 URL 查询参数
        function buildQueryString(data) {
          return Object.keys(data).map(function(key) {
            return encodeURIComponent(key) + '=' + encodeURIComponent(data[key] || '');
          }).join('&');
        }

        // 执行 SSE 请求
        function executeSSE(url, actionText) {
          var resultDiv = document.getElementById('result');
          resultDiv.innerHTML = '<div class="border rounded-lg overflow-hidden"><div class="bg-gray-100 px-4 py-2 font-medium">📋 执行日志</div><div id="log-container" class="p-4 bg-gray-50 max-h-96 overflow-y-auto font-mono text-sm space-y-1"></div><div id="summary" class="px-4 py-3 bg-gray-100 hidden"></div></div>';
          
          var logContainer = document.getElementById('log-container');
          var summary = document.getElementById('summary');
          var isDone = false;
          
          var eventSource = new EventSource(url);
          
          eventSource.onmessage = function(event) {
            var data = JSON.parse(event.data);
            var logLine = document.createElement('div');
            
            if (data.type === 'log') {
              logLine.className = 'text-gray-600';
              logLine.textContent = '⏳ ' + data.message;
            } else if (data.type === 'success') {
              logLine.className = 'text-green-600';
              logLine.textContent = '✅ ' + data.domain + ': ' + data.message;
            } else if (data.type === 'fail') {
              logLine.className = 'text-red-600';
              logLine.textContent = '❌ ' + data.domain + ': ' + data.message;
            } else if (data.type === 'error') {
              logLine.className = 'text-red-600 font-medium';
              logLine.textContent = '⚠️ 错误: ' + data.message;
              isDone = true;
              eventSource.close();
            } else if (data.type === 'done') {
              isDone = true;
              summary.classList.remove('hidden');
              var statusClass = data.failCount === 0 ? 'text-green-700' : 'text-yellow-700';
              summary.innerHTML = '<span class="' + statusClass + ' font-medium">' + actionText + '完成：成功 ' + data.successCount + ' / 失败 ' + data.failCount + ' (共 ' + data.total + ' 个域名)</span>';
              eventSource.close();
              return;
            }
            
            logContainer.appendChild(logLine);
            logContainer.scrollTop = logContainer.scrollHeight;
          };
          
          eventSource.onerror = function() {
            eventSource.close();
            if (!isDone) {
              var errorLine = document.createElement('div');
              errorLine.className = 'text-red-600';
              errorLine.textContent = '⚠️ 连接已断开';
              logContainer.appendChild(errorLine);
            }
          };
        }

        // 应用规则按钮
        document.getElementById('apply_btn').addEventListener('click', function() {
          var data = collectFormData();
          
          if (!data.bots && !data.customBots) {
            alert('请至少选择一个要屏蔽的蜘蛛');
            return;
          }
          
          var url = '/api/bot-block/apply-stream?' + buildQueryString(data);
          executeSSE(url, '应用规则');
        });

        // 移除规则按钮
        document.getElementById('remove_btn').addEventListener('click', function() {
          var scopeRadio = document.querySelector('input[name="scope"]:checked');
          var scope = scopeRadio ? scopeRadio.value : 'all';
          var scopeText = scope === 'all' ? '所有域名' : '指定域名';
          
          if (!confirm('确定要移除' + scopeText + '的蜘蛛屏蔽规则吗？')) {
            return;
          }
          
          var data = {
            scope: scope,
            domains: ''
          };
          
          if (scope === 'selected') {
            var domainsTextarea = document.querySelector('textarea[name="domains"]');
            data.domains = domainsTextarea ? domainsTextarea.value.split('\\n').filter(function(d) { return d.trim(); }).join(',') : '';
          }
          
          var url = '/api/bot-block/remove-stream?' + buildQueryString(data);
          executeSSE(url, '移除规则');
        });
      `}
    </script>
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
