import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AppState {
  favorites: number[];
  recentlyViewed: number[];
  selectedType: string | null;
  toggleFavorite: (id: number) => void;
  addRecentlyViewed: (id: number) => void;
  setSelectedType: (type: string | null) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      favorites: [],
      recentlyViewed: [],
      selectedType: null,

      toggleFavorite: (id: number) => {
        const { favorites } = get();
        if (favorites.includes(id)) {
          set({ favorites: favorites.filter((f) => f !== id) });
        } else {
          set({ favorites: [...favorites, id] });
        }
      },

      addRecentlyViewed: (id: number) => {
        const { recentlyViewed } = get();
        const filtered = recentlyViewed.filter((v) => v !== id);
        set({ recentlyViewed: [id, ...filtered].slice(0, 20) });
      },

      setSelectedType: (type: string | null) => {
        set({ selectedType: type });
      },
    }),
    { name: "pokeverse-store" }
  )
);
