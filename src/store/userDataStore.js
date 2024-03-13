import { create } from "zustand";

const useUserData = create((set) => {
    return {
        location: null,
        setLocation: (location) => set(() => ({ location })),
    };
});

export default useUserData;