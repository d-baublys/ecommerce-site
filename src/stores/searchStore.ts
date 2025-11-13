import { create } from "zustand";

type SearchStore = {
    isSearchOpen: boolean;
    isSearchLoaded: boolean;
    setIsSearchOpen: (value: boolean) => void;
    setIsSearchLoaded: (value: boolean) => void;
    openSearch: () => void;
    closeSearchSmooth: () => void;
    closeSearchInstant: () => void;
};

export const useSearchStore = create<SearchStore>((set) => ({
    isSearchOpen: false,
    isSearchLoaded: false,
    setIsSearchOpen: (value) =>
        set({
            isSearchOpen: value,
        }),
    setIsSearchLoaded: (value) => set({ isSearchLoaded: value }),
    openSearch: () => {
        set(() => {
            setTimeout(() => set({ isSearchLoaded: true }), 10);
            return { isSearchOpen: true };
        });
    },
    closeSearchSmooth: () => {
        set(() => {
            setTimeout(() => set({ isSearchOpen: false }), 200);
            return {
                isSearchLoaded: false,
            };
        });
    },
    closeSearchInstant: () => {
        set({ isSearchLoaded: false, isSearchOpen: false });
    },
}));
