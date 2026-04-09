// WebSocket proxy server for JARVIS Core voice on a separate port
const { createServer } = require("http");
const { WebSocketServer } = require("ws");

const PORT = 3457;
const JARVIS_WS = "ws://localhost:8080/ws/voice";

const server = createServer();
const wss = new WebSocketServer({ server });

wss.on("connection", (clientWs) => {
  const backend = new WebSocket(JARVIS_WS);

  backend.on("open", () => console.log("[WS] Connected to JARVIS Core"));
  backend.on("message", (data) => {
    if (clientWs.readyState === 1) clientWs.send(data);
  });
  backend.on("close", () => clientWs.close());
  backend.on("error", () => clientWs.close());

  clientWs.on("message", (data) => {
    if (backend.readyState === 1) backend.send(data);
  });
  clientWs.on("close", () => backend.close());
});

server.listen(PORT, "0.0.0.0", () => {
  console.log(`> JARVIS WebSocket proxy running on ws://0.0.0.0:${PORT}`);
});
