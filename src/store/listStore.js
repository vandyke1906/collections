import { create } from "zustand";

const ownUseList = () => {
    return create((set) => {
        return {
            dataList: [],
            lastRef: null,
            isEnd: false,
            counter: 1,
            limit: 1,
            nextCounter: () => set((state) => ({ counter: state.counter + 1 })),
            setLastRef: (lastRef) => set(() => ({ lastId: lastRef })),
            setIsEnd: (isEnd) => set(() => ({ isEnd: !!isEnd })),
            setDataList: (dataList) => set(() => ({ dataList })),
            addToDataList: (item) => set((state) => {
                if (Array.isArray(item))
                    return { dataList: [...state.dataList, ...item] };
                else
                    return { dataList: [...state.dataList, item] };
            }),
            removeToDataList: ({ key, value }, isObject = false) =>
                set((state) => {
                    if (isObject) {
                        return { dataList: state.dataList.filter((c) => c[key] !== value) };
                    } else {
                        return { dataList: state.dataList.filter((c) => c !== value) };
                    }
                }),
            clearDataList: () => set(() => ({ dataList: [] })),
        };
    });
};

const useQueryList = ownUseList();

export default useQueryList;
