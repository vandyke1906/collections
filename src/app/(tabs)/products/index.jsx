import {  router } from "expo-router";
import { FlatList, View, TouchableOpacity, TextInput, ToastAndroid } from "react-native";
import Product from "../../../components/Product";
import { useState } from "react";
import { useQuery } from "@realm/react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { ROUTES } from "../../../common/common";

const ProductPage = () => {
    const [searchKey, setSearchKey] = useState("");
    const products = useQuery("products", (col) => {
        return col.filtered("deletedAt == 0 && code BEGINSWITH[c] $0 || name CONTAINS[c] $0", searchKey).sorted("name");
    }, [searchKey]);
    const fetchMoreData = () => {};
    return (
        <View className="flex-1 mb-5">
            <View className="m-2">
                <TextInput
                    className="text-sm my-2 p-2 appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                    placeholder="Search Product..."
                    value={searchKey}
                    onChangeText={(text) => setSearchKey(text)}
                />
                <FlatList
                    showsVerticalScrollIndicator={false}
                    className="w-full"
                    data={products}
                    keyExtractor={(item) => item._id}
                    renderItem={({ item }) => (
                        <Product
                            data={item} enableButtons={true}
                            onEdit={() => router.navigate({ pathname: ROUTES.PRODUCT_FORM, params: item })}
                            onDelete={() => {
                                Alert.alert("Delete Customer", `Do you want to delete ${item.name}?`, [
                                    { text: "Cancel" },
                                    {
                                        text: "Continue",
                                        onPress: () => {
                                            if (realm) {
                                                const prodObj = realm.objectForPrimaryKey("products", item._id);
                                                if (prodObj) {
                                                    try {
                                                        realm.write(() => {
                                                            prodObj.deleteAt = moment().valueOf();
                                                            // realm.delete(custObj);
                                                        });
                                                    } catch (error) {
                                                        ToastAndroid.show(error.message || error, ToastAndroid.SHORT);
                                                    }
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
                    router.navigate(ROUTES.PRODUCT_FORM);
                }}>
                    <FontAwesome size={20} name="plus" color="white" />
            </TouchableOpacity>
        </View>
    );
};

export default ProductPage;
