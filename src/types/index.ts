export type SignalStatus = 'OPEN' | 'FILLED' | 'CLOSED';
export type SignalResult = 'WIN' | 'LOSS' | 'PUSH' | null;

export interface Signal {
  id: string;
  game: string;
  time: string; // ISO 8601
  market: 'Moneyline' | 'Run Line' | 'Total';
  edge: number; // e.g. 0.048 = 4.8%
  probability: number; // 0-1
  kellyStake: number; // Recommended units
  odds: number; // decimal odds
  status: SignalStatus;
  result: SignalResult;
  createdAt: any; // Firestore Timestamp
}

export interface User {
  uid: string;
  email: string | null;
  kellyFraction: number;
  minEdge: number;
  plan: 'free' | 'pro';
  createdAt: any;
}

export interface Bet {
  id: string;
  userId: string;
  signalId: string;
  stake: number;
  odds: number;
  result: SignalResult;
  loggedAt: any;
}

export interface ModelMetric {
  aucRoc: number;
  brierScore: number;
  accuracy: number;
  sampleN: number;
  updatedAt: any;
}
