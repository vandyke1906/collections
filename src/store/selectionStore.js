import { create } from "zustand";

const useSelection = create((set, get) => {
    return {
        selections: [],
        setSelections: (list) => set(() => {
            return { selections: list };
        }),
        addToSelection: (item) => set((state) => {
            if (item)
                return { selections: [...state.selections, item] };
        }),
        removeToSelection: ({ key, value }, isObject = false) => set((state) => {
            if (isObject) {
                return { selections: state.selections.filter((c) => c[key] !== value) };
            } else {
                return { selections: state.selections.filter((c) => c !== value) };
            }
        }),
        resetSelection: () => set(() => {
            return { selections: [] };
        })
    };
});

export default useSelection;
