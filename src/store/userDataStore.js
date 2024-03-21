import moment from "moment";
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
        // startOfYear: moment().startOf("year"),
        currentYear: moment().year(),
        availableYears: [moment().year()],
        setIsConnected: (isConnected) => set(() => ({ isConnected })),
        setTotalUsers: (totalUsers) => set(() => ({ totalUsers })),
        setLocation: (location) => set(() => ({ location })),
        setUserId: (userId) => set(() => ({ userId })),
        setEmail: (email) => set(() => {
            const isAdmin = ADMIN_EMAILS.includes(email);
            return { email, isAdmin };
        }),
        setStartOfYear: (date) => set(() => {
            const startOfYear = moment(date || "").startOf("year");
            return { startOfYear };
        }),
        setCurrentYear: (currentYear) => set(() => {
            if (typeof currentYear !== "number") currentYear = moment().year();
            return { currentYear };
        }),
        setAvailableYears: (years) => set(() => {
            const currentYear = moment().year();
            let availableYears = [...new Set([currentYear, ...years])];
            return { availableYears };
        }),
    };
});

export default useUserData;