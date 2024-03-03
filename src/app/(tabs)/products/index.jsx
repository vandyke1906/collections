import { Link } from "expo-router";
import { SafeAreaView, ScrollView, Text, FlatList, View } from "react-native";
import { PRODUCT_LIST } from "../../../.data/data";
import Product from "../../../components/Product";
import { useEffect, useState } from "react";
import { useQuery, useRealm } from "@realm/react";

const addProduct = () => {
    const [data, setData] = useState(PRODUCT_LIST.slice(0, 24));
    const fetchMoreData = () => {
        console.info({ len: data.length, less: data.length < 26 });
        if (data.length < 26) {
            const newData = [...data, ...PRODUCT_LIST.slice(25, 50)];
            setData(newData);
        }
    };
    // console.info({ products: useQuery("products") })

    const realm = useRealm();

    // useEffect(() => {
    //     realm.subscriptions.update((subs) => {
    //         subs.add(realm.objects("products"));
    //     });
    // }, [realm])

    return (
        <View className="flex-1 items-center bg-white">
            <Text className="text-red-400">Index of Product Page</Text>
            <Link
                href="/products/addProduct"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
            >
                Add Product
            </Link>
            <FlatList
                data={data}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => <Product data={item} />}
                onEndReached={fetchMoreData}
                onEndReachedThreshold={0.2}
            />
        </View>
    );
};

export default addProduct;
