import { Chess, Square, Move } from "chess.js";
import { IShortMove } from "./interfaces";

const chessInstance = new Chess();

const handleMove: (move: IShortMove) => Move | null = (move: IShortMove) => {
  return chessInstance.move({
    from: move.from as Square,
    to: move.to as Square,
    promotion: move.promotion as "n" | "b" | "r" | "q" | undefined,
  });
};

const handleResetGame = () => {
  chessInstance.reset();
};

module.exports = {
  chessInstance,
  handleMove,
  handleResetGame,
};
