const WebSocket = require('ws');
const http = require('http');

const PORT = process.env.PORT || 10000;

const server = http.createServer();
const wss = new WebSocket.Server({ server });

wss.on('connection', function connection(ws, req) {
  const ip = req.socket.remoteAddress;
  console.log(`[+] Client connected: ${ip}`);

  const pingInterval = setInterval(() => {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ type: 'ping', timestamp: Date.now() }));
    }
  }, 10000);

  ws.on('message', function incoming(message) {
    console.log(`[${ip}] ↪️ Received:`, message.toString());
  });

  ws.on('close', () => {
    console.log(`[-] Client disconnected: ${ip}`);
    clearInterval(pingInterval);
  });

  ws.on('error', (err) => {
    console.error(`[!] WebSocket error:`, err);
  });
});

server.listen(PORT, () => {
  console.log(`🚀 WebSocket server running on port ${PORT}`);
});
