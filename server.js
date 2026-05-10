const WebSocket = require("ws");

const server = new WebSocket.Server({ port: 3000 });

// 全プレイヤー情報
const players = {};

server.on("connection", (socket) => {

  console.log("player connected");

  // プレイヤーID
  const id = Math.random().toString(36).substr(2, 9);

  // 初期位置
  players[id] = {
    x: 100,
    y: 100
  };

  socket.on("message", (message) => {

    const data = JSON.parse(message);

    // 移動データ受信
    if (data.type === "move") {

      players[id].x = data.x;
      players[id].y = data.y;

    }

    // 全員へ送信
    const packet = JSON.stringify({
      type: "players",
      players: players
    });

    server.clients.forEach((client) => {

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

console.log("server started");