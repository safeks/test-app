import { MATCHES_URL } from '../config';
import type { MatchesResponse } from '../types/match';

export async function fetchMatches(): Promise<MatchesResponse> {
  const response = await fetch(MATCHES_URL);
  // fetch не бросает ошибку на 404/500 — проверяем статус сами.
  if (!response.ok) {
    throw new Error(`Сервер ответил с ошибкой ${response.status}`);
  }

  const data = await response.json();
  if (!data || !Array.isArray(data.matches)) {
    throw new Error('Сервер вернул данные в неожиданном формате');
  }
  return data as MatchesResponse;
}
