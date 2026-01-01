export const Layout = ({ children, title = "CF Manager" }: { children: any; title?: string }) => (
  <html lang="zh-CN">
    <head>
      <title>{title}</title>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <script src="https://cdn.tailwindcss.com"></script>
      <script src="https://unpkg.com/htmx.org@1.9.10"></script>
      <style>{`
        body { font-family: system-ui, sans-serif; }
        .htmx-indicator { display: none; }
        .htmx-request .htmx-indicator { display: inline-block; }
        .htmx-request.htmx-indicator { display: inline-block; }
      `}</style>
    </head>
    <body class="min-h-screen bg-gray-100">
      <nav class="bg-gray-800 text-white p-4 shadow-lg">
        <div class="container mx-auto flex justify-between items-center">
          <h1 class="font-bold text-xl">☁️ Cloudflare 批量助手</h1>
          <div class="space-x-4">
            <a href="/" class="hover:text-blue-300 transition">仪表盘</a>
            <a href="/domains" class="hover:text-blue-300 transition">域名管理</a>
            <a href="/bot-block" class="hover:text-blue-300 transition">蜘蛛屏蔽</a>
            <a href="/api-protect" class="hover:text-blue-300 transition">API防护</a>
            <a href="/settings" class="hover:text-blue-300 transition">设置</a>
          </div>
        </div>
      </nav>
      <main class="container mx-auto p-6">
        {children}
      </main>
    </body>
  </html>
);
