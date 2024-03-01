import { create } from "zustand";

const useProductStore = create((set) => ({
    list: [],
    addProduct: (product) => set((state) => {
        const hasProduct = state.list.find(p => p.code === product.code);
        if (!hasProduct)
            return { list: [...state.list, product] }
    }),
}));


export default useProductStore;