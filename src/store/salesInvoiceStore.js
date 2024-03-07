import { create } from "zustand";

const DEFAULT_DETAILS = Object.freeze({ invoiceNo: "", dateOfSI: null, customerId: null, customerName: "", poNo: "", soNo: "", dateDelivered: null, totalAmount: 0, unpaidAmount: 0 });

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
        selected: null,
        setSelected: (selected = {}) => set((state) => {
            return { selected: { ...state.selected, ...selected } };
        }),
        clearSelected: () => set(() => {
            return { selected: null };
        }),
        updateDetails: (data = {}) => set((state) => {
            const { dateOfSI, customerId, customerName, poNo, soNo, dateDelivered, totalAmount, invoiceNo } = data;
            const newDetails = { ...state.details };
            if (invoiceNo != null) newDetails.invoiceNo = invoiceNo;
            if (dateOfSI != null) newDetails.dateOfSI = dateOfSI;
            if (dateDelivered != null) newDetails.dateDelivered = dateDelivered;
            if (customerId != null) newDetails.customerId = customerId;
            if (customerName != null) newDetails.customerName = customerName;
            if (poNo != null) newDetails.poNo = poNo;
            if (soNo != null) newDetails.soNo = soNo;
            if (totalAmount != null) newDetails.totalAmount = newDetails.unpaidAmount = totalAmount;
            return { details: newDetails };
        }),
        clearDetails: () => set(() => {
            return { details: DEFAULT_DETAILS };
        }),
        setProducts: (list) => set(() => {
            return { list };
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
