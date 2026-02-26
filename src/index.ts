const HTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Bun on Cloudflare Workers</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      min-height: 100vh;
      background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
    }
    .container {
      background: rgba(255,255,255,0.1);
      backdrop-filter: blur(10px);
      border-radius: 20px;
      padding: 40px;
      max-width: 500px;
      width: 100%;
      box-shadow: 0 8px 32px rgba(0,0,0,0.3);
    }
    h1 { margin-bottom: 10px; font-size: 2rem; }
    .subtitle { color: #88c0d0; margin-bottom: 30px; }
    .card {
      background: rgba(0,0,0,0.2);
      border-radius: 12px;
      padding: 20px;
      margin-bottom: 20px;
    }
    .card h3 { color: #88c0d0; margin-bottom: 10px; }
    button {
      background: #88c0d0;
      color: #1a1a2e;
      border: none;
      padding: 12px 24px;
      border-radius: 8px;
      font-size: 1rem;
      cursor: pointer;
      transition: transform 0.2s, background 0.2s;
    }
    button:hover { transform: scale(1.05); background: #81a1c1; }
    .result { margin-top: 15px; font-family: monospace; background: #000; padding: 10px; border-radius: 6px; min-height: 40px; }
  </style>
</head>
<body>
  <div class="container">
    <h1>🚀 Bun + Cloudflare</h1>
    <p class="subtitle">Full-stack app running on Workers</p>
    
    <div class="card">
      <h3>API Endpoint</h3>
      <button onclick="fetchMessage()">Call /api/hello</button>
      <div class="result" id="apiResult">Click to test...</div>
    </div>

    <div class="card">
      <h3>Server Time</h3>
      <button onclick="fetchTime()">Get Current Time</button>
      <div class="result" id="timeResult">Click to test...</div>
    </div>
  </div>

  <script>
    async function fetchMessage() {
      const res = await fetch('/api/hello');
      const data = await res.json();
      document.getElementById('apiResult').textContent = JSON.stringify(data, null, 2);
    }
    async function fetchTime() {
      const res = await fetch('/api/time');
      const data = await res.json();
      document.getElementById('timeResult').textContent = JSON.stringify(data, null, 2);
    }
  </script>
</body>
</html>`;

interface Env {
  ASSETS: Fetcher;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === "/" || url.pathname === "") {
      return new Response(HTML, {
        headers: { "Content-Type": "text/html" },
      });
    }

    if (url.pathname === "/api/hello") {
      return new Response(JSON.stringify({
        message: "Hello from Bun on Cloudflare Workers!",
        runtime: "Cloudflare Workers",
        framework: "Bun"
      }), {
        headers: { "Content-Type": "application/json" },
      });
    }

    if (url.pathname === "/api/time") {
      return new Response(JSON.stringify({
        time: new Date().toISOString(),
        timezone: "UTC"
      }), {
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response("Not Found", { status: 404 });
  },
} satisfies ExportedHandler<Env>;
