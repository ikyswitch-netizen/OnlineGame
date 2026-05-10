const express = require("express");
const http = require("http");
const WebSocket = require("ws");

const app = express();

// HTMLやJSを配信
app.use(express.static(__dirname));

// HTTPサーバー
const server = http.createServer(app);

// WebSocketサーバー
const wss = new WebSocket.Server({ server });

// プレイヤー一覧
const players = {};

wss.on("connection", (socket) => {

  console.log("player connected");

  const id = Math.random().toString(36).substr(2, 9);

  players[id] = {
    x: 100,
    y: 100
  };

  socket.on("message", (message) => {

    const data = JSON.parse(message);

    if (data.type === "move") {

      players[id].x = data.x;
      players[id].y = data.y;

    }

    // 全員へ送信
    const packet = JSON.stringify({
      type: "players",
      players: players
    });

    wss.clients.forEach((client) => {

      if (client.readyState === WebSocket.OPEN) {
        client.send(packet);
      }

    });

  });

  socket.on("close", () => {

    delete players[id];

    console.log("player disconnected");

  });

});

// Render用PORT
const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log("server started");
});