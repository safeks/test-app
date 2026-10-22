// Статусы, которые сейчас встречаются в данных. Сервер может прислать и новый —
// поэтому в Match поле status имеет тип string, а не MatchStatus.
export type MatchStatus = 'scheduled' | 'live' | 'finished' | 'postponed';

export type Team = {
  id: string;
  name: string;
  city: string;
};

export type Score = {
  home: number;
  away: number;
};

export type Match = {
  id: string;
  // ISO-строка в UTC. null — дата ещё не назначена (например, у перенесённого матча).
  startsAt: string | null;
  status: string;
  // Минута матча, есть только у идущих.
  minute?: number;
  home: Team;
  away: Team;
  // null — матч ещё не начался.
  score: Score | null;
};

export type MatchesResponse = {
  round: number;
  matches: Match[];
};
