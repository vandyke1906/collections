import { create } from "zustand";

const useProductStore = create((set) => ({
    list: [],
    addProduct: (product, realm) =>
        set((state) => {
            const hasProduct = state.list.find((p) => p.code === product.code);
            if (!hasProduct) {
                if (realm)
                    realm.write("products", {
                        code: product.code,
                        name: product.name,
                        unit: product.unit,
                        groupId: product.groupId
                    });
                return { list: [...state.list, product] };
            }
        }),
}));

export default useProductStore;
