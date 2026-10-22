import { useCallback, useEffect, useRef, useState } from 'react';
import { fetchMatches } from '../api/matches';
import type { Match } from '../types/match';

export function useMatches() {
  const [matches, setMatches] = useState<Match[] | null>(null);
  const [round, setRound] = useState<number | null>(null);
  const [updatedAt, setUpdatedAt] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Номер последнего запроса: ответ устаревшего запроса не должен
  // перезаписать данные более свежего (например, при быстрых повторных нажатиях).
  const requestId = useRef(0);

  const load = useCallback(async (mode: 'initial' | 'refresh') => {
    const id = ++requestId.current;
    if (mode === 'initial') setIsLoading(true);
    else setIsRefreshing(true);
    setError(null);

    try {
      const data = await fetchMatches();
      if (id !== requestId.current) return;
      setMatches(data.matches);
      setRound(data.round);
      setUpdatedAt(new Date());
    } catch (e) {
      if (id !== requestId.current) return;
      setError(e instanceof Error ? e.message : 'Не удалось загрузить матчи');
    } finally {
      if (id === requestId.current) {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    }
  }, []);

  useEffect(() => {
    load('initial');
  }, [load]);

  const retry = useCallback(() => load('initial'), [load]);
  const refresh = useCallback(() => load('refresh'), [load]);

  return { matches, round, updatedAt, error, isLoading, isRefreshing, retry, refresh };
}
