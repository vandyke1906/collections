import { router } from "expo-router";
import { FlatList, View, TouchableOpacity, TextInput, ToastAndroid, Alert, Pressable } from "react-native";
import { useEffect, useState } from "react";
import { useQuery } from "@realm/react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { ROUTES } from "src/common/common";
import Product from "src/components/Product";
import { useRealm } from "@realm/react";
import moment from "moment";
import useQueryList from "src/store/listStore";

const ProductPage = () => {
    const realm = useRealm();
    const [searchKey, setSearchKey] = useState("");
    const { dataList, counter, limit, nextCounter, setDataList, addToDataList, clearDataList, isEnd, setIsEnd } = useQueryList();

    // const products = useQuery("products", (col) => {
    //     return col.filtered("deletedAt == 0 && (code BEGINSWITH[c] $0 || name CONTAINS[c] $0)", searchKey).sorted("name");
    // }, [searchKey]);

    useEffect(() => {
        setIsEnd(false);
        clearDataList();
        const result = getRecords(searchKey);
        setDataList(result);
    }, [realm, searchKey]);

    const getRecords = (searchKey) => {
        try {
            let result = realm.objects("products").filtered("deletedAt == 0 && (code BEGINSWITH[c] $0 || name CONTAINS[c] $0)", searchKey)
                .sorted("indexedName", false).slice((counter - 1) * limit, counter * limit);
            if (!result.length) setIsEnd(true);
            nextCounter();
            return Array.from(result) || [];
        } catch (error) {
            console.error(error);
            return [];
        }
    };

    const fetchMoreData = () => {
        if (isEnd) return console.info("End of record");
        const nextResult = getRecords(searchKey);
        addToDataList(nextResult);
    };

    return (
        <View className="flex-1 mb-5">
            <View className="m-2">
                <TextInput
                    className="text-sm my-2 p-2 appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                    placeholder="Search Product..."
                    value={searchKey}
                    onChangeText={(text) => setSearchKey(text.toUpperCase())}
                />
                <FlatList
                    showsVerticalScrollIndicator={false}
                    className="w-full"
                    data={dataList}
                    keyExtractor={(item) => item._id}
                    renderItem={({ item }) => (
                        <Product
                            data={item} enableButtons={true}
                            onSelect={() => router.push({ pathname: ROUTES.PRODUCT_PAGE, params: item })}
                            onEdit={() => router.push({ pathname: ROUTES.PRODUCT_FORM, params: item })}
                            onDelete={() => {
                                Alert.alert("Delete Customer", `Do you want to delete ${item.name}?`, [
                                    { text: "Cancel" },
                                    {
                                        text: "Continue",
                                        onPress: () => {
                                            if (realm) {
                                                const prodObj = realm.objectForPrimaryKey("products", item._id);
                                                if (prodObj) {
                                                    realm.write(() => {
                                                        try {
                                                            prodObj.deletedAt = moment().valueOf();
                                                            // realm.delete(custObj);
                                                        } catch (error) {
                                                            ToastAndroid.show(error.message || error, ToastAndroid.SHORT);
                                                        }
                                                    });
                                                }
                                            }
                                        }
                                    }
                                ]);
                            }}
                        />
                    )}
                    onEndReached={fetchMoreData}
                    onEndReachedThreshold={0.1}
                />
            </View>

            <TouchableOpacity
                className="bg-blue-700 w-14 h-14 rounded-full flex justify-center items-center"
                style={{
                    position: "absolute",
                    bottom: 30,
                    right: 15
                }}
                onPress={() => {
                    router.push(ROUTES.PRODUCT_FORM);
                }}>
                <FontAwesome size={20} name="plus" color="white" />
            </TouchableOpacity>
        </View>
    );
};

export default ProductPage;
