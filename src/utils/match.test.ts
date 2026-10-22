import data from '../../data/matches.json';
import type { Match } from '../types/match';
import { filterMatches, formatScore, formatStartsAt, getMatchGroup, getStatusLabel } from './match';

const matches: Match[] = data.matches;
const ids = (list: Match[]) => list.map((match) => match.id);

describe('getMatchGroup', () => {
  it('относит известные статусы к группам', () => {
    expect(getMatchGroup('scheduled')).toBe('upcoming');
    expect(getMatchGroup('live')).toBe('upcoming');
    expect(getMatchGroup('postponed')).toBe('upcoming');
    expect(getMatchGroup('finished')).toBe('finished');
  });

  it('не относит неизвестный статус ни к одной группе', () => {
    expect(getMatchGroup('cancelled')).toBeNull();
  });
});

describe('filterMatches', () => {
  it('«Все» возвращает все матчи', () => {
    expect(filterMatches(matches, 'all')).toHaveLength(matches.length);
  });

  it('«Предстоящие» включают идущий и перенесённый матчи', () => {
    expect(ids(filterMatches(matches, 'upcoming'))).toEqual(['m4', 'm5', 'm6', 'm7', 'm8']);
  });

  it('«Завершённые» — только с окончательным результатом', () => {
    expect(ids(filterMatches(matches, 'finished'))).toEqual(['m1', 'm2', 'm3']);
  });

  it('матч с неизвестным статусом виден только во «Все»', () => {
    const unknown: Match = { ...matches[0], id: 'x', status: 'cancelled' };
    const list = [...matches, unknown];

    expect(ids(filterMatches(list, 'all'))).toContain('x');
    expect(ids(filterMatches(list, 'upcoming'))).not.toContain('x');
    expect(ids(filterMatches(list, 'finished'))).not.toContain('x');
  });
});

describe('formatScore', () => {
  it('показывает счёт 0:0, а не теряет его', () => {
    expect(formatScore({ ...matches[0], score: { home: 0, away: 0 } })).toBe('0 : 0');
  });

  it('показывает прочерк, если счёта нет', () => {
    expect(formatScore({ ...matches[0], score: null })).toBe('– : –');
  });
});

describe('formatStartsAt', () => {
  it('сообщает, что дата не назначена, если её нет или она некорректна', () => {
    expect(formatStartsAt(null)).toBe('Дата не назначена');
    expect(formatStartsAt('не дата')).toBe('Дата не назначена');
  });
});

describe('getStatusLabel', () => {
  it('добавляет минуту к идущему матчу', () => {
    expect(getStatusLabel({ ...matches[0], status: 'live', minute: 67 })).toBe("Идёт · 67'");
  });

  it('не падает на неизвестном статусе', () => {
    expect(getStatusLabel({ ...matches[0], status: 'cancelled' })).toBe('Статус неизвестен');
  });
});
