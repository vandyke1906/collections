import { Link } from "expo-router";
import { SafeAreaView, ScrollView, Text, FlatList, View } from "react-native";
import { PRODUCT_LIST } from "../../../.data/data";
import Product from "../../../components/Product";
import { useEffect, useState } from "react";
import { useQuery, useRealm } from "@realm/react";

const addProduct = () => {
    const fetchMoreData = () => {};
  const products = useQuery("products");
    return (
        <View className="flex-1 items-center justify-center">
            <Text className="text-red-400">Index of Product Page</Text>
            <Link
                href="/products/addProduct"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
            >
                Add Product
            </Link>
            <FlatList
                data={products}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => <Product data={item} />}
                onEndReached={fetchMoreData}
                onEndReachedThreshold={0.2}
            />
        </View>
    );
};

export default addProduct;
