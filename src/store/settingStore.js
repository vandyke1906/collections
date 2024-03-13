import { create } from "zustand";

const useSettings = create((set) => {
    return {
        location: null,
        setLocation: (location) => set(() => ({ location })),
    };
});

export default useSettings;