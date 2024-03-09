import { QUERY_LIMIT } from "src/common/common";
import { create } from "zustand";

const OWNERS = {};

const ownUseList = () => {
    return create((set) => {
        return {
            dataList: [],
            isEnd: false,
            counter: 1,
            limit: QUERY_LIMIT,
            resetCounter: () => set(() => ({ counter: 1, isEnd: false })),
            nextCounter: () => set((state) => ({ counter: state.counter + 1 })),
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

// const useQueryList = ownUseList;
// export default useQueryList;
// export default ownUseList;
const useQueryList = (id = "") => {
    if (typeof id !== "string") throw new Error("ID must be a string.");
    id = id.toUpperCase().replace(/\s/g, "");
    if (!OWNERS[id])
        OWNERS[id] = ownUseList;
    return OWNERS[id];
};
export default useQueryList;
