import { Layout } from "../components/Layout";

interface ZoneInfo {
  id: string;
  name: string;
  status: string;
  name_servers: string[];
  securityLevel?: string;
}

const securityLevelMap: Record<string, { label: string; color: string }> = {
  off: { label: "关闭", color: "bg-gray-100 text-gray-600" },
  essentially_off: { label: "基本关闭", color: "bg-gray-100 text-gray-600" },
  low: { label: "低", color: "bg-blue-100 text-blue-700" },
  medium: { label: "中等", color: "bg-yellow-100 text-yellow-700" },
  high: { label: "高", color: "bg-orange-100 text-orange-700" },
  under_attack: { label: "攻击模式", color: "bg-red-100 text-red-700" },
  unknown: { label: "未知", color: "bg-gray-100 text-gray-500" },
};

export const Domains = ({ zones }: { zones: ZoneInfo[] }) => (
  <Layout title="域名管理 - CF Manager">
    <div class="bg-white rounded-lg shadow p-6">
      <div class="flex justify-between items-center border-b pb-3 mb-4">
        <h2 class="text-2xl font-bold">🌐 域名列表</h2>
        <div class="flex flex-wrap gap-2">
          <button 
            hx-post="/api/zones/batch-wildcard-proxy"
            hx-vals='{"proxied": "true"}'
            hx-target="#action-result"
            hx-indicator="#action-loading"
            hx-confirm="确定要对所有域名开启泛域名 CDN 吗？（需要企业版证书）"
            class="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition text-sm"
          >
            ☁️ 泛域名CDN开
          </button>
          <button 
            hx-post="/api/zones/batch-wildcard-proxy"
            hx-vals='{"proxied": "false"}'
            hx-target="#action-result"
            hx-indicator="#action-loading"
            hx-confirm="确定要对所有域名关闭泛域名 CDN 吗？"
            class="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition text-sm"
          >
            ☁️ 泛域名CDN关
          </button>
          <button 
            hx-post="/api/zones/batch-security"
            hx-vals='{"level": "under_attack"}'
            hx-target="#action-result"
            hx-indicator="#action-loading"
            hx-confirm="确定要对所有域名开启 Under Attack 模式吗？"
            class="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition text-sm"
          >
            🛡️ 全部高防
          </button>
          <button 
            hx-post="/api/zones/batch-security"
            hx-vals='{"level": "medium"}'
            hx-target="#action-result"
            hx-indicator="#action-loading"
            hx-confirm="确定要将所有域名恢复为中等安全级别吗？"
            class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition text-sm"
          >
            🔄 全部恢复
          </button>
          <button 
            hx-get="/api/zones" 
            hx-target="#zone-list"
            hx-indicator="#action-loading"
            class="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition text-sm"
          >
            🔄 刷新
          </button>
          <span id="action-loading" class="htmx-indicator text-gray-500 self-center">处理中...</span>
        </div>
      </div>

      <div id="action-result" class="mb-4"></div>

      <div id="zone-list">
        <ZoneList zones={zones} />
      </div>
    </div>
  </Layout>
);

export const ZoneList = ({ zones }: { zones: ZoneInfo[] }) => {
  if (zones.length === 0) {
    return (
      <div class="text-center py-8 text-gray-500">
        <p>暂无域名数据</p>
        <p class="text-sm mt-2">请先在设置中配置 API 凭证，或添加新域名</p>
      </div>
    );
  }

  return (
    <div class="overflow-x-auto">
      <table class="w-full">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-4 py-3 text-left text-sm font-medium text-gray-600">域名</th>
            <th class="px-4 py-3 text-left text-sm font-medium text-gray-600">状态</th>
            <th class="px-4 py-3 text-left text-sm font-medium text-gray-600">安全级别</th>
            <th class="px-4 py-3 text-left text-sm font-medium text-gray-600">NS 服务器</th>
            <th class="px-4 py-3 text-left text-sm font-medium text-gray-600">操作</th>
          </tr>
        </thead>
        <tbody class="divide-y">
          {zones.map((zone) => {
            const security = securityLevelMap[zone.securityLevel || "unknown"] ?? securityLevelMap.unknown;
            return (
              <tr class="hover:bg-gray-50">
                <td class="px-4 py-3 font-medium">{zone.name}</td>
                <td class="px-4 py-3">
                  <span class={`px-2 py-1 rounded text-xs ${
                    zone.status === "active" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                  }`}>
                    {zone.status}
                  </span>
                </td>
                <td class="px-4 py-3">
                  <span class={`px-2 py-1 rounded text-xs ${security?.color || "bg-gray-100 text-gray-500"}`}>
                    {security?.label || "未知"}
                  </span>
                </td>
                <td class="px-4 py-3 text-sm text-gray-600 max-w-xs truncate" title={zone.name_servers?.join(", ")}>
                  {zone.name_servers?.slice(0, 2).join(", ") || "-"}
                </td>
                <td class="px-4 py-3 whitespace-nowrap">
                  <button 
                    hx-post={`/api/zone/${zone.id}/proxy`}
                    hx-vals='{"proxied": "true"}'
                    hx-target="#action-result"
                    class="text-orange-600 hover:text-orange-800 text-sm mr-2"
                    title="开启所有记录的 CDN"
                  >
                    ☁️开
                  </button>
                  <button 
                    hx-post={`/api/zone/${zone.id}/proxy`}
                    hx-vals='{"proxied": "false"}'
                    hx-target="#action-result"
                    class="text-gray-600 hover:text-gray-800 text-sm mr-2"
                    title="关闭所有记录的 CDN"
                  >
                    ☁️关
                  </button>
                  <button 
                    hx-post={`/api/zone/${zone.id}/security`}
                    hx-vals='{"level": "under_attack"}'
                    hx-target="#action-result"
                    hx-confirm={`确定要对 ${zone.name} 开启 Under Attack 模式吗？`}
                    class="text-red-600 hover:text-red-800 text-sm mr-2"
                    title="开启高防模式"
                  >
                    🛡️
                  </button>
                  <button 
                    hx-post={`/api/zone/${zone.id}/security`}
                    hx-vals='{"level": "medium"}'
                    hx-target="#action-result"
                    class="text-blue-600 hover:text-blue-800 text-sm"
                    title="恢复中等安全级别"
                  >
                    🔄
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <p class="text-sm text-gray-500 mt-4">共 {zones.length} 个域名</p>
    </div>
  );
};
