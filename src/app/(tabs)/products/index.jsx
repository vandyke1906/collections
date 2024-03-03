import {  router } from "expo-router";
import { FlatList, View, TouchableOpacity, TextInput } from "react-native";
import Product from "../../../components/Product";
import { useState } from "react";
import { useQuery } from "@realm/react";
import FontAwesome from "@expo/vector-icons/FontAwesome";

const addProduct = () => {
    const [searchKey, setSearchKey] = useState("");
    const products = useQuery("products", (col) => {
        return col.filtered("code BEGINSWITH[c] $0 || name CONTAINS[c] $0", searchKey);
    }, [searchKey]);
    const fetchMoreData = () => {};
    return (
        <View className="flex-1">
            <View className="items-center justify-center">
                <TextInput
                    className="my-2 p-2 appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                    placeholder="Search Product..."
                    value={searchKey}
                    onChangeText={(text) => setSearchKey(text)}
                />
                <FlatList
                    className="w-full"
                    data={products}
                    keyExtractor={(item) => item._id}
                    renderItem={({ item }) => <Product data={item} />}
                    onEndReached={fetchMoreData}
                    onEndReachedThreshold={0.1}
                    />
            </View>

            <View className="items-end">
                <TouchableOpacity className="fixed z-90 bottom-28 right-4 bg-blue-600 w-14 h-14 rounded-full flex justify-center items-center" onPress={() => {
                    router.navigate("/products/addProduct");
                }}>
                    <FontAwesome size={20} name="plus" color="white" />
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default addProduct;
