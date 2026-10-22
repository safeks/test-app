import { useCallback, useState } from 'react';

// Избранные матчи (по id). Хранятся только в памяти, пока открыто приложение.
export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>([]);

  const isFavorite = (id: string) => favorites.includes(id);

  // Состояние не мутируем: создаём новый массив, иначе React увидит ту же ссылку
  // и не перерисует компонент. Функциональная форма setFavorites берёт актуальное
  // значение, а не то, что было захвачено замыканием при рендере.
  const toggle = useCallback((id: string) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((favoriteId) => favoriteId !== id) : [...prev, id],
    );
  }, []);

  return { favorites, isFavorite, toggle };
}
