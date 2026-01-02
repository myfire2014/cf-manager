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

          <form id="batch-add-form" class="space-y-4">
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
                <select name="recordType" class="w-full border border-gray-300 p-2 rounded-lg">
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
                type="button"
                id="submit_btn"
                class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition font-medium"
              >
                🚀 开始执行
              </button>
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

      <script>
        {`
          // 收集表单数据
          function collectFormData() {
            var form = document.getElementById('batch-add-form');
            var data = {};
            
            // domains
            var domainsTextarea = form.querySelector('textarea[name="domains"]');
            data.domains = domainsTextarea ? domainsTextarea.value.split('\\n').filter(function(d) { return d.trim(); }).join(',') : '';
            
            // target
            var targetInput = form.querySelector('input[name="target"]');
            data.target = targetInput ? targetInput.value : '';
            
            // recordType
            var recordTypeSelect = form.querySelector('select[name="recordType"]');
            data.recordType = recordTypeSelect ? recordTypeSelect.value : 'A';
            
            // proxied
            var proxiedSelect = form.querySelector('select[name="proxied"]');
            data.proxied = proxiedSelect ? proxiedSelect.value : 'true';
            
            // records
            var recordsCheckboxes = form.querySelectorAll('input[name="records"]:checked');
            data.records = Array.from(recordsCheckboxes).map(function(cb) { return cb.value; }).join(',');
            
            // customRecords
            var customRecordsInput = form.querySelector('input[name="customRecords"]');
            data.customRecords = customRecordsInput ? customRecordsInput.value : '';
            
            // securityLevel
            var securityLevelSelect = form.querySelector('select[name="securityLevel"]');
            data.securityLevel = securityLevelSelect ? securityLevelSelect.value : '';
            
            // wildcardProxied
            var wildcardProxiedSelect = form.querySelector('select[name="wildcardProxied"]');
            data.wildcardProxied = wildcardProxiedSelect ? wildcardProxiedSelect.value : 'false';
            
            return data;
          }

          // 构建 URL 查询参数
          function buildQueryString(data) {
            return Object.keys(data).map(function(key) {
              return encodeURIComponent(key) + '=' + encodeURIComponent(data[key] || '');
            }).join('&');
          }

          // 执行 SSE 请求
          function executeSSE(url) {
            var resultDiv = document.getElementById('result-area');
            resultDiv.innerHTML = '<div class="border rounded-lg overflow-hidden"><div class="bg-gray-100 px-4 py-2 font-medium">📋 执行日志</div><div id="log-container" class="p-4 bg-gray-50 max-h-96 overflow-y-auto font-mono text-sm space-y-2"></div><div id="summary" class="px-4 py-3 bg-gray-100 hidden"></div></div>';
            
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
                logContainer.appendChild(logLine);
              } else if (data.type === 'success') {
                logLine.className = 'p-2 bg-green-50 border-l-4 border-green-500 rounded-r';
                var html = '<div class="flex justify-between items-start"><span class="font-medium text-green-700">✅ ' + data.domain + '</span>';
                if (data.nameservers && data.nameservers.length > 0) {
                  html += '<code class="text-xs bg-gray-200 px-2 py-1 rounded">' + data.nameservers.join(', ') + '</code>';
                }
                html += '</div>';
                if (data.details && data.details.length > 0) {
                  html += '<div class="mt-1 text-sm text-gray-600">' + data.details.join('<br>') + '</div>';
                }
                logLine.innerHTML = html;
                logContainer.appendChild(logLine);
              } else if (data.type === 'fail') {
                logLine.className = 'p-2 bg-red-50 border-l-4 border-red-500 rounded-r';
                var html = '<div class="font-medium text-red-700">❌ ' + data.domain + ': ' + data.message + '</div>';
                if (data.details && data.details.length > 0) {
                  html += '<div class="mt-1 text-sm text-gray-600">' + data.details.join('<br>') + '</div>';
                }
                logLine.innerHTML = html;
                logContainer.appendChild(logLine);
              } else if (data.type === 'error') {
                logLine.className = 'text-red-600 font-medium';
                logLine.textContent = '⚠️ 错误: ' + data.message;
                isDone = true;
                eventSource.close();
                logContainer.appendChild(logLine);
              } else if (data.type === 'done') {
                isDone = true;
                summary.classList.remove('hidden');
                var statusClass = data.failCount === 0 ? 'text-green-700 bg-green-100' : 'text-yellow-700 bg-yellow-100';
                summary.innerHTML = '<span class="' + statusClass + ' px-3 py-1 rounded font-medium">📊 处理完成：成功 ' + data.successCount + ' / 失败 ' + data.failCount + ' (共 ' + data.total + ' 个域名)</span>';
                eventSource.close();
                return;
              }
              
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

          // 提交按钮
          document.getElementById('submit_btn').addEventListener('click', function() {
            var data = collectFormData();
            
            if (!data.domains) {
              alert('请输入至少一个域名');
              return;
            }
            if (!data.target) {
              alert('请输入解析目标（IP 或 CNAME 域名）');
              return;
            }
            
            var url = '/api/batch-add-stream?' + buildQueryString(data);
            executeSSE(url);
          });
        `}
      </script>
    </Layout>
  );
};
