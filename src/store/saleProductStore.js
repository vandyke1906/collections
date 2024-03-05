import { create } from "zustand";

const useSaleProductStore = create((set) => ({
    list: [],
    addProduct: (product) =>
        set((state) => {
            const hasProduct = state.list.find((p) => p.code === product.code);
            if (!hasProduct)
                return { list: [...state.list, product] };
            else
                return { list: state.list };
        }),
}));

export default useSaleProductStore;
