const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;
const DIST_DIR = path.join(__dirname, 'dist');

let telemetryStore = {};

const MIME_TYPES = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf'
};

const server = http.createServer((req, res) => {
  const url = req.url || '/';

  // Global CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    res.end();
    return;
  }

  // IoT Real-Time Telemetry Endpoints
  if (url.startsWith('/streetlights') || url.startsWith('/api/iot') || url.startsWith('/api/telemetry')) {
    res.setHeader('Content-Type', 'application/json');

    if (req.method === 'PUT' || req.method === 'POST') {
      let body = '';
      req.on('data', chunk => { body += chunk; });
      req.on('end', () => {
        try {
          const parsed = JSON.parse(body);
          const deviceId = parsed.deviceId || 'NG-001';
          telemetryStore[deviceId] = {
            ...parsed,
            receivedAt: Date.now()
          };
          console.log(`[IoT Server] Live update from ${deviceId} -> Status: ${parsed.status}, LDR: ${parsed.ldr}, Location: ${parsed.location?.area}`);
          res.statusCode = 200;
          res.end(JSON.stringify({ status: 'ok', deviceId, message: 'Telemetry processed successfully' }));
        } catch (e) {
          res.statusCode = 400;
          res.end(JSON.stringify({ error: 'Invalid JSON format' }));
        }
      });
      return;
    }

    if (req.method === 'GET') {
      res.statusCode = 200;
      res.end(JSON.stringify(telemetryStore));
      return;
    }
  }

  // Static Production Files (dist/)
  let cleanUrl = url.split('?')[0];
  let filePath = path.join(DIST_DIR, cleanUrl);

  // If root or SPA route (no extension), serve index.html
  if (cleanUrl === '/' || !path.extname(cleanUrl)) {
    filePath = path.join(DIST_DIR, 'index.html');
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      filePath = path.join(DIST_DIR, 'index.html');
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    fs.readFile(filePath, (err, content) => {
      if (err) {
        res.statusCode = 500;
        res.end('Server Error');
        return;
      }
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content);
    });
  });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`=======================================================`);
  console.log(`[Awaaz-AI IoT & Static Server] Running on http://0.0.0.0:${PORT}`);
  console.log(`- IoT Telemetry Receiver: http://0.0.0.0:${PORT}/streetlights`);
  console.log(`- Production Web App:     http://0.0.0.0:${PORT}/`);
  console.log(`=======================================================`);
});
