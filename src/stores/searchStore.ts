import { create } from "zustand";

type SearchStore = {
    isSearchOpen: boolean;
    setIsSearchOpen: (value: boolean) => void;
    isSearchLoaded: boolean;
    setIsSearchLoaded: (value: boolean) => void;
};

export const useSearchStore = create<SearchStore>((set) => ({
    isSearchOpen: false,
    setIsSearchOpen: (value) =>
        set({
            isSearchOpen: value,
        }),
    isSearchLoaded: false,
    setIsSearchLoaded: (value) => set({ isSearchLoaded: value }),
}));
