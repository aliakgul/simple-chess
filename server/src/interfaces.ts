export interface IChessInstance {
  fen: string;
  gameover: boolean;
}

export interface IShortMove {
  from: string;
  to: string;
  promotion: "n" | "b" | "r" | "q" | undefined;
}
