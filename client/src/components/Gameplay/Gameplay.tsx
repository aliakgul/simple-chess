import React, { useState } from "react";
import Chessboard from "chessboardjsx";
import "./Gameplay.css";
import { io } from "socket.io-client";
import { IShortMove, IChessInstance } from "../Interfaces";

const Gameplay: React.FC = () => {
  const SOCKET_PORT: number = 3002;
  const socket = io(`http://localhost:${SOCKET_PORT}/`);

  const [gameover, updateGameOver] = useState<boolean>(false);
  const [fen, updateFen] = useState<string>("");
  socket.emit("getTablePositions", null);

  socket.on("updateTablePositions", (chessInstance: IChessInstance) => {
    updateFen(chessInstance.fen);
    updateGameOver(chessInstance.gameover);
  });

  const handleShortMove = (move: IShortMove) => {
    move.promotion = "q";
    socket.emit("shortMove", move);
  };

  return (
    <div className="gameplay">
      <h1>Simple Chess Game</h1>
      <Chessboard
        width={400}
        position={fen}
        onDrop={(move) =>
          !gameover &&
          handleShortMove({
            from: move.sourceSquare,
            to: move.targetSquare,
            promotion: undefined,
          })
        }
      />
      <p>{fen}</p>
      {gameover && (
        <div>
          <h2>Game Over:</h2>
          <p>It will restart in 5 seconds.</p>
        </div>
      )}
    </div>
  );
};

export default Gameplay;
