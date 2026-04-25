export enum GameState {
  IDLE = 'IDLE',
  PLAYING = 'PLAYING',
  GAMEOVER = 'GAMEOVER',
}

export interface Point {
  x: number;
  y: number;
}

export interface Track {
  id: string;
  title: string;
  author: string;
  duration: string;
  color: string;
}
