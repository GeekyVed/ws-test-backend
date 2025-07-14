const WebSocket = require('ws');
const http = require('http');

const PORT = process.env.PORT || 10000;

const server = http.createServer();
const wss = new WebSocket.Server({ server });

wss.on('connection', function connection(ws, req) {
  const ip = req.socket.remoteAddress;
  console.log(`[+] Client connected: ${ip}`);

  // Send timestamp every 5 seconds
  const interval = setInterval(() => {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({
        type: 'timestamp',
        timestamp: new Date().toISOString(),
      }));
    }
  }, 5000);

  ws.on('message', function incoming(message) {
    console.log(`[${ip}] ↪️ Received from client:`, message.toString());
  });

  ws.on('close', () => {
    console.log(`[-] Client disconnected: ${ip}`);
    clearInterval(interval);
  });

  ws.on('error', (err) => {
    console.error(`[!] WebSocket error:`, err);
  });
});

server.listen(PORT, () => {
  console.log(`🚀 WebSocket server running on port ${PORT}`);
});
