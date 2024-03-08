import { create } from "zustand";

const useRouteNavigate = create((set) => {
    return {
        lastRoute: null,
        setLastRoute: (route) => set(() => {
            return { lastRoute: route };
        }),
        clearLastRoute: () => set(() => {
            return { lastRoute: null };
        }),
    };
});

export default useRouteNavigate;
