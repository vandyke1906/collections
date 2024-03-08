import { create } from "zustand";
import { REPORT_TYPE } from "src/common/common";
import moment from "moment";

const useReportStore = create((set) => {
    return {
        reportType: Object.values(REPORT_TYPE)[0],
        dateFrom: 0,
        dateTo: 0,
        groups: [],
        products: [],
        customers: [],
        salesInvoices: [],
        summary: {},
        resetReportData: () => set(() => {
            return {
                reportType: Object.values(REPORT_TYPE)[0],
                dateFrom: 0,
                dateTo: 0,
                groups: [],
                products: [],
                customers: [],
                salesInvoices: [],
                summary: {}
            };
        }),
        setSummary: (data = {}) => set((state) => {
            return { summary: { ...state.summary, ...data } };
        }),
        clearSummary: () => set(() => {
            return { summary: {} };
        }),
        setReportType: (type) => set(() => {
            if (Object.values(REPORT_TYPE).includes(type))
                return { reportType: type };
        }),
        setDateFrom: (number) => set(() => {
            if (moment(number).isValid())
                return { dateFrom: number };
        }),
        setDateTo: (number) => set(() => {
            if (moment(number).isValid())
                return { dateTo: number };
        }),
        setGroups: (list) => set(() => {
            if (list)
                return { groups: list };
        }),
        addGroup: (group) => set((state) => {
            if (group)
                return { groups: [...state.groups, group] };
        }),
        removeGroup: (group) => set((state) => {
            if (group) return { groups: state.groups.filter((g) => g._id !== group._id) };
        }),
        setProducts: (list) => set(() => {
            if (list)
                return { products: list };
        }),
        addProduct: (product) => set((state) => {
            if (product)
                return { products: [...state.product, product] };
        }),
        removeProduct: (id) => set((state) => {
            if (id) return { products: state.products.filter((p) => p._id !== id) };
        }),
        setCustomers: (list) => set(() => {
            if (list)
                return { customers: list };
        }),
        addCustomer: (customer) => set((state) => {
            if (customer)
                return { customers: [...state.customers, customer] };
        }),
        removeCustomer: (id) => set((state) => {
            if (id) return { customers: state.customers.filter((c) => c._id !== id) };
        }),
        setSalesInvoices: (list) => set(() => {
            if (list)
                return { salesInvoices: list };
        }),
        addSalesInvoice: (customer) => set((state) => {
            if (customer)
                return { salesInvoices: [...state.salesInvoices, customer] };
        }),
        removeSalesInvoice: (id) => set((state) => {
            if (id) return { salesInvoices: state.salesInvoices.filter((c) => c._id !== id) };
        }),
        /** @param {("groups" | "products" | "customers"|"salesInvoices")[]} types default empty will clear all */
        clearList: (types) => set(() => {
            const latestState = {};
            for (const type of types) {
                if (type === "groups")
                    latestState.groups = [];
                if (type === "products")
                    latestState.products = [];
                if (type === "customers")
                    latestState.customers = [];
                if (type === "salesInvoices")
                    latestState.salesInvoices = [];
            }
            return types.length ? { ...latestState } : { groups: [], products: [], customers: [], salesInvoices: [] };
        })
    };
});

export default useReportStore;
