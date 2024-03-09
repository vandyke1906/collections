import { QUERY_LIMIT } from "src/common/common";
import { create } from "zustand";

const useCollection = create((set) => {
    return {
        dataList: [],
        isEnd: false,
        counter: 1,
        limit: QUERY_LIMIT,
        resetCounter: () => set(() => ({ counter: 1, isEnd: false })),
        nextCounter: () => set((state) => ({ counter: state.counter + 1 })),
        setIsEnd: (isEnd) => set(() => ({ isEnd: !!isEnd })),
        setDataList: (dataList) => set(() => ({ dataList })),
        addToDataList: (item, options = { isArray: false, isFirst: false, checkBeforeAdd: false }) => set((state) => {
            if (options.isArray) {
                let dataList = state.dataList;
                if (options.checkBeforeAdd) {
                    dataList = state.dataList;
                    for (const newData of item) {
                        const index = state.dataList.findIndex(s => s._id === newData._id);
                        if (index === -1)
                            options.isFirst ? dataList.unshift(newData) : dataList.push(newData);
                        else {
                            dataList.splice(index, 1);
                            dataList.push(newData);
                        }

                    }
                } else
                    dataList = options.isFirst ? [...item, ...state.dataList] : [...state.dataList, ...item];

                return { dataList };
            }
            else {
                let dataList = state.dataList;
                if (options.checkBeforeAdd) {
                    const index = state.dataList.find(s => s._id === item._id);
                    if (index === -1)
                        options.isFirst ? dataList.unshift(item) : dataList.push(item);
                    else {
                        dataList.splice(index, 1);
                        dataList.push(item);
                    }

                } else
                    dataList = options.isFirst ? [item, ...state.dataList] : [...state.dataList, item];

                return { dataList };
            }
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

export default useCollection;