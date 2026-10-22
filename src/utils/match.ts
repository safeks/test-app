import type { Match, MatchStatus } from '../types/match';

const STATUS_LABELS: Record<MatchStatus, string> = {
  scheduled: 'Запланирован',
  live: 'Идёт',
  finished: 'Завершён',
  postponed: 'Перенесён',
};

function isKnownStatus(status: string): status is MatchStatus {
  return status in STATUS_LABELS;
}

export type MatchFilter = 'all' | 'upcoming' | 'finished';
export type MatchGroup = Exclude<MatchFilter, 'all'>;

// «Завершённые» — только матчи с окончательным результатом.
// «Предстоящие» — всё, что ещё будет сыграно или идёт сейчас:
// идущий (live) и перенесённый (postponed) матчи в том числе.
// Неизвестный статус не относим ни к одной группе — такой матч виден только во «Все».
const STATUS_GROUPS: Record<MatchStatus, MatchGroup> = {
  scheduled: 'upcoming',
  live: 'upcoming',
  postponed: 'upcoming',
  finished: 'finished',
};

export function getMatchGroup(status: string): MatchGroup | null {
  return isKnownStatus(status) ? STATUS_GROUPS[status] : null;
}

export function filterMatches(matches: Match[], filter: MatchFilter): Match[] {
  if (filter === 'all') return matches;
  return matches.filter((match) => getMatchGroup(match.status) === filter);
}

export function getStatusLabel(match: Match): string {
  if (!isKnownStatus(match.status)) return 'Статус неизвестен';
  const label = STATUS_LABELS[match.status];
  if (match.status === 'live' && match.minute !== undefined) {
    return `${label} · ${match.minute}'`;
  }
  return label;
}

// Дата и время начала в часовом поясе устройства (timeZone не передаём намеренно).
export function formatStartsAt(startsAt: string | null): string {
  if (startsAt === null) return 'Дата не назначена';
  const date = new Date(startsAt);
  if (Number.isNaN(date.getTime())) return 'Дата не назначена';
  return date.toLocaleString('ru-RU', {
    weekday: 'short',
    day: 'numeric',
    month: 'long',
    hour: '2-digit',
    minute: '2-digit',
  });
}

// Сравниваем с null явно: счёт 0:0 — валидный, его нельзя проверять на «истинность».
export function formatScore(match: Match): string {
  if (match.score === null) return '– : –';
  return `${match.score.home} : ${match.score.away}`;
}
