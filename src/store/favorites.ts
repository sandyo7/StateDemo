import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

type FavoritesState = {
  ids: number[];
  toggle: (id: number) => void;
  sortAsc: boolean;
  toggleSort: () => void;
};

export const useFavorites = create<FavoritesState>()(
  persist(
    set => ({
      ids: [],
      sortAsc: true,
      toggle: id =>
        set(s => ({
          ids: s.ids.includes(id)
            ? s.ids.filter(x => x !== id)
            : [...s.ids, id],
        })),
      toggleSort: () => set(s => ({ sortAsc: !s.sortAsc })),
    }),
    { name: 'favorites', storage: createJSONStorage(() => AsyncStorage) },
  ),
);
