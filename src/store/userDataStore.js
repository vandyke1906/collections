import { ADMIN_EMAILS } from "src/common/common";
import { create } from "zustand";

const useUserData = create((set) => {
    return {
        location: null,
        email: "",
        userId: "",
        isAdmin: false,
        totalUsers: 0,
        isConnected: false,
        setIsConnected: (isConnected) => set(() => ({ isConnected })),
        setTotalUsers: (totalUsers) => set(() => ({ totalUsers })),
        setLocation: (location) => set(() => ({ location })),
        setUserId: (userId) => set(() => ({ userId })),
        setEmail: (email) => set(() => {
            const isAdmin = ADMIN_EMAILS.includes(email);
            return { email, isAdmin };
        }),
    };
});

export default useUserData;