import { router } from "expo-router";
import { FlatList, View, TouchableOpacity, TextInput, ToastAndroid, Alert, StatusBar } from "react-native";
import { useState } from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { ROUTES } from "src/common/common";
import Product from "src/components/Product";
import { useRealm, useQuery } from "@realm/react";
import moment from "moment";
// import useProduct from "src/store/productStore";

const ProductPage = () => {
    const realm = useRealm();
    const [searchKey, setSearchKey] = useState("");
    // const { dataList, counter, limit, nextCounter, resetCounter, setDataList, addToDataList, isEnd, setIsEnd } = useProduct();

    const dataList = useQuery(
        "products",
        (col) => {
            return col
                .filtered("deletedAt == 0 && (code BEGINSWITH[c] $0 || name CONTAINS[c] $0)", searchKey)
                .sorted("indexedName");
        },
        [searchKey]
    );

    // useEffect(() => {
    //     resetCounter();
    //     const result = getRecords(searchKey);
    //     setDataList(result);
    // }, [realm, searchKey]);

    // const getRecords = (searchKey) => {
    //     try {
    //         const products = realm.objects("products");
    //         products.removeAllListeners();
    //         products.addListener((coll, changes) => {
    //             console.info({ coll, changes });
    //             // Handle deleted Dog objects
    //             changes.deletions.forEach((index) => {
    //                 console.log(`Looks like Dog #${index} has left the realm.`);
    //             });
    //             // Handle newly added Dog objects
    //             changes.insertions.forEach((index) => {
    //                 const insertedDog = coll[index];
    //                 console.log(`Welcome our new friend, ${insertedDog.name}!`);
    //             });
    //             // Handle Dog objects that were modified
    //             changes.newModifications.forEach((index) => {
    //                 const modifiedDog = coll[index];
    //                 console.log(`Hey ${modifiedDog.name}, you look different!`);
    //             });
    //             // Handle Dog objects that were modified
    //             changes.oldModifications.forEach((index) => {
    //                 const modifiedDog = coll[index];
    //                 console.log(`Old Modif ${modifiedDog.name}, you look different!`);
    //             });
    //         });

    //         let result = products.filtered("deletedAt == 0 && (code BEGINSWITH[c] $0 || name CONTAINS[c] $0)", searchKey)
    //             .sorted("indexedName").slice((counter - 1) * limit, counter * limit);

    //         if (!result.length) setIsEnd(true);
    //         nextCounter();
    //         return result || [];
    //     } catch (error) {
    //         console.error(error);
    //         return [];
    //     }
    // };

    // const fetchMoreData = () => {
    //     console.info("fetch data");
    //     if (isEnd) return console.info("End of record");
    //     const nextResult = getRecords(searchKey);
    //     addToDataList(nextResult, { isArray: true, checkBeforeAdd: true });
    // };

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
                            data={item}
                            enableButtons={true}
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
                                                            ToastAndroid.show(
                                                                error.message || error,
                                                                ToastAndroid.SHORT
                                                            );
                                                        }
                                                    });
                                                }
                                            }
                                        },
                                    },
                                ]);
                            }}
                        />
                    )}
                    // onEndReached={fetchMoreData}
                    // onEndReachedThreshold={0.1}
                />
            </View>

            <TouchableOpacity
                className="bg-blue-700 w-14 h-14 rounded-full flex justify-center items-center"
                style={{
                    position: "absolute",
                    bottom: 30,
                    right: 15,
                }}
                onPress={() => {
                    router.push(ROUTES.PRODUCT_FORM);
                }}
            >
                <FontAwesome size={20} name="plus" color="white" />
            </TouchableOpacity>

            <StatusBar style="auto" />
        </View>
    );
};

export default ProductPage;
