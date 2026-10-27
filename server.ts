import express from 'express';
import path from 'path';
import http from 'http';
import { spawn, ChildProcess } from 'child_process';
import { createServer as createViteServer } from 'vite';

const PORT = parseInt(process.env.PORT || '3000', 10);
const PYTHON_PORT = 8765;
const __dirname = path.resolve();

let pythonProcess: ChildProcess | null = null;

function startPythonBackend() {
  console.log('[PQlocalAgentOSv3] Запуск Python бэкенда server.py на порту ' + PYTHON_PORT + '...');
  
  pythonProcess = spawn('python3', ['server.py'], {
    cwd: __dirname,
    env: {
      ...process.env,
      PQ_PORT: String(PYTHON_PORT),
      HOST: '127.0.0.1',
    },
    stdio: 'inherit',
  });

  pythonProcess.on('exit', (code, signal) => {
    console.warn(`[PQlocalAgentOSv3] Python процесс завершился с кодом ${code} (сигнал ${signal}). Перезапуск через 2 сек...`);
    setTimeout(startPythonBackend, 2000);
  });

  pythonProcess.on('error', (err) => {
    console.error('[PQlocalAgentOSv3] Ошибка запуска python server.py:', err);
  });
}

async function startServer() {
  const app = express();

  // Start the Python server.py backend
  startPythonBackend();

  // Wait a short moment for Python server to initialize
  await new Promise((resolve) => setTimeout(resolve, 800));

  // Proxy helper for Python backend requests
  const proxyToPython = (req: express.Request, res: express.Response) => {
    const options: http.RequestOptions = {
      hostname: '127.0.0.1',
      port: PYTHON_PORT,
      path: req.originalUrl,
      method: req.method,
      headers: {
        ...req.headers,
        host: `127.0.0.1:${PYTHON_PORT}`,
      },
    };

    const proxyReq = http.request(options, (proxyRes) => {
      res.writeHead(proxyRes.statusCode || 200, proxyRes.headers);
      proxyRes.pipe(res);
    });

    proxyReq.on('error', (err) => {
      console.warn(`[Proxy Error] ${req.method} ${req.originalUrl}:`, err.message);
      if (!res.headersSent) {
        res.status(502).json({
          error: 'Локальный Python сервер временно недоступен',
          detail: err.message,
          suggestion: 'Проверьте запуск python server.py',
        });
      }
    });

    req.pipe(proxyReq);
  };

  // 1. Route API and logo requests to python server.py
  app.use('/api', proxyToPython);
  app.use('/project/logo', proxyToPython);

  // 2. Serve static assets from frontend folder (icons, styles, avatars)
  const frontendDir = path.join(__dirname, 'frontend');
  app.use('/styles', express.static(path.join(frontendDir, 'styles')));
  app.use('/icons', express.static(path.join(frontendDir, 'icons')));
  app.use('/avatars', express.static(path.join(frontendDir, 'avatars')));

  // 3. Keep classic v3 HTML interface available at /classic
  app.get('/classic', (_req, res) => {
    res.sendFile(path.join(frontendDir, 'index.html'));
  });
  app.get('/chat.html', (_req, res) => {
    res.sendFile(path.join(frontendDir, 'chat.html'));
  });
  app.get('/telemetry.html', (_req, res) => {
    res.sendFile(path.join(frontendDir, 'telemetry.html'));
  });

  // 4. Mount Vite development server for modern React PQlocalAgentOSv4 UI on root '/'
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'spa',
  });
  app.use(vite.middlewares);

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[PQlocalAgentOSv4] Сервер готов и доступен на http://0.0.0.0:${PORT}`);
    console.log(`[PQlocalAgentOSv4] Главная страница: Современная React-платформа PQlocalAgentOSv4`);
    console.log(`  - React Workspace v4: http://localhost:${PORT}/`);
    console.log(`  - Классический интерфейс v3: http://localhost:${PORT}/classic`);
    console.log(`  - Чат: http://localhost:${PORT}/chat.html`);
    console.log(`  - Телеметрия: http://localhost:${PORT}/telemetry.html`);
  });
}

startServer().catch((err) => {
  console.error('[PQlocalAgentOSv3] Фатальная ошибка запуска:', err);
  process.exit(1);
});
