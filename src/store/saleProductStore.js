import { create } from "zustand";

const useSaleProductStore = create((set) => ({
    list: [],
    addProduct: (product) => set((state) => {
        const hasProduct = state.list.find((p) => p.code === product.code);
        if (!hasProduct)
            return { list: [...state.list, product] };
        else
            return { list: state.list };
    }),
    updateProduct: (id, { qty = 1, amount = 0 }) => set((state) => {
        const productIndex = state.list.findIndex((p) => p._id === id);
        let list = state.list;
        if (productIndex > -1)
            list[productIndex] = { ...list[productIndex], qty, amount };
        return { list };
    }),
    removeProduct: (id) => set((state) => {
        const filteredProduct = state.list.filter((p) => p._id !== id);
        return { list: filteredProduct };
    }),
    clearList: () => set(() => {
        return { list: [] };
    })
}));

export default useSaleProductStore;
