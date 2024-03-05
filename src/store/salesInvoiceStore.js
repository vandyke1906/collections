import { create } from "zustand";

const DEFAULT_DETAILS = Object.freeze({ dateOfSI: null, customerId: null, poNo: "", soNo: "", dateDelivered: null, totalAmount: 0 });

const useSalesInvoiceStore = create((set) => {
    const calculateTotalAmount = (_list) => {
        const totalAmount = _list.reduce((acc, current) => {
            return acc + (current.amount || 0);
        }, 0);
        return totalAmount;
    };
    return {
        list: [],
        details: DEFAULT_DETAILS,
        updateDetails: (data = {}) => set((state) => {
            const { dateOfSI, customerId, poNo, soNo, dateDelivered, totalAmount } = data;
            const newDetails = { ...state.details };
            if (dateOfSI != null) newDetails.dateOfSI = dateOfSI;
            if (customerId != null) newDetails.customerId = customerId;
            if (poNo != null) newDetails.poNo = poNo;
            if (soNo != null) newDetails.soNo = soNo;
            if (dateDelivered != null) newDetails.dateDelivered = dateDelivered;
            if (totalAmount != null) newDetails.totalAmount = totalAmount;
            return { details: newDetails };
        }),
        clearDetails: () => set(() => {
            return { details: DEFAULT_DETAILS };
        }),
        addProduct: (product) => set((state) => {
            const hasProduct = state.list.find((p) => p.code === product.code);
            if (!hasProduct) {
                const newList = [...state.list, product];
                const totalAmount = calculateTotalAmount(newList);
                return { list: newList, details: { ...state.details, totalAmount } };
            }
            else
                return { list: state.list };
        }),
        updateProductDetail: (id, data) => set((state) => {
            const productIndex = state.list.findIndex((p) => p._id === id);
            let list = state.list;
            let { qty, amount } = data;
            if (qty == null) qty = 1;
            if (amount == null) amount = 0.00;
            if (productIndex > -1) {
                const prevData = list[productIndex];
                list[productIndex] = { ...prevData, qty, amount };
            }
            const totalAmount = calculateTotalAmount(list);
            return { list, details: { ...state.details, totalAmount } };
        }),
        removeProduct: (id) => set((state) => {
            const filteredProduct = state.list.filter((p) => p._id !== id);
            const totalAmount = calculateTotalAmount(filteredProduct);
            return { list: filteredProduct, details: { ...state.details, totalAmount } };
        }),
        clearList: () => set((state) => {
            return { list: [], details: { ...state.details, totalAmount: 0 } };
        })
    };
});

export default useSalesInvoiceStore;
