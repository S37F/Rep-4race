export type Category = 'Fruits' | 'Cars' | 'Animals' | 'Colors';

export interface Chit {
  id: string;
  category: Category;
  name: string;
  emoji: string;
}

export interface Player {
  id: string;
  name: string;
  chits: Chit[];
  position: number; // 0-3 for clockwise positions
  isReady: boolean;
  rank?: number; // Final ranking 1-4
}

export interface GameState {
  id: string;
  players: Player[];
  currentTurn: number;
  phase: 'lobby' | 'playing' | 'passing' | 'finished';
  winner?: Player;
  rankings: Player[];
  createdAt: string;
  joinCode: string;
}

export interface PassingState {
  fromPlayerId: string;
  toPlayerId: string;
  chitId: string;
  isAnimating: boolean;
}

export interface GameHistory {
  gameId: string;
  rankings: Player[];
  finishedAt: string;
}
