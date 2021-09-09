import express from "express";
import { createServer } from "http";
import { Server, Socket } from "socket.io";
import { IChessInstance } from "./interfaces";
const SimpleChessGame = require("./simpleChessGame");

const app = express();
const httpServer = createServer();
const serverOptions = { cors: { origin: "*" } };
const PORT_EXPRESS: Number = 3001;
const PORT_SOCKET: Number = 3002;
const io = new Server(httpServer, serverOptions);

// comment before deployment
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");
  next();
});

app.get("/", (req, res) => {
  res.send(
    `<h2>Simple Chess Game Server</h2><p>You are connected to PORT ${PORT_EXPRESS}<p/>`
  );
});

io.on("connection", (socket: Socket) => {
  //console.log(`\nUser connected:\t` + socket.id);

  const updateTablePositions = () => {
    const distChessInstance: IChessInstance = {
      fen: SimpleChessGame.chessInstance.fen(),
      gameover: SimpleChessGame.chessInstance.game_over(),
    };
    socket.emit("updateTablePositions", distChessInstance);
  };

  socket.on("getTablePositions", () => {
    updateTablePositions();
  });

  socket.on("shortMove", (move) => {
    if (SimpleChessGame.handleMove(move)) {
      updateTablePositions();
    }
    if (SimpleChessGame.chessInstance.game_over()) {
      setTimeout(() => {
        SimpleChessGame.chessInstance.reset();
        updateTablePositions();
      }, 5000);
    }
  });
});

app.listen(PORT_EXPRESS, () => {
  console.log(
    `\n-----\n-----\nThe application is listening on port ${PORT_EXPRESS}!`
  );
});

httpServer.listen(PORT_SOCKET, () => {
  console.log(`The socket is listening on port ${PORT_SOCKET}!`);
});
