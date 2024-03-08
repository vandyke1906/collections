import { View, Text } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useQuery, useRealm } from "@realm/react";
import { useRoute } from '@react-navigation/native';
import { useNavigation } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";
import ProductSummary from "src/components/reports/salesProducts/ProductSummary";

const productPage = () => {
    const navigation = useNavigation();
    const realm = useRealm();
    const route = useRoute();
    const product = route.params || {};
    const [dateRange, setDateRange] = useState({ from: 0, to: 0 });
    const data = useQuery("salesInvoices", (coll) => {
        const salesProducts = realm.objects("salesProducts").filtered("productId == $0", product._id);
        if (!salesProducts || !salesProducts.length) return [];
        if (dateRange.from && dateRange.to)
            return coll.filtered(`ANY products == {${salesProducts.map((s) => `obj('salesProducts', '${s._id}')`).join(",")}} && dateOfSI BETWEEN { $0, $1 }`, dateRange.from, dateRange.to).sorted("dateOfSI");
        else if (dateRange.from)
            return coll.filtered(`ANY products == {${salesProducts.map((s) => `obj('salesProducts', '${s._id}')`).join(",")}} && dateOfSI >= $0`, dateRange.from).sorted("dateOfSI");
        else
            return coll.filtered(`ANY products == {${salesProducts.map((s) => `obj('salesProducts', '${s._id}')`).join(",")}}`).sorted("dateOfSI");
    }, [dateRange]);

    useEffect(() => {
        navigation.setOptions({
            title: product.code || "Customer",
            // headerRight: () => (
            //     <TouchableOpacity className="py-3 pl-10 pr-3" onPress={() => { }}>
            //         <FontAwesome size={18} name="check" color="green" />
            //     </TouchableOpacity>
            // ),
        });
    }, [navigation]);

    return (
        <View className="w-full">
            <View className="block rounded-lg bg-white p-2 m-2">
                {product?.name && <Text className="block font-sans text-xs antialiased font-bold leading-relaxed text-blue-gray-900">{product.name}</Text>}
                {product?.code && <Text className="block font-sans text-xs antialiased font-normal leading-normal text-gray-700 opacity-75">Account #: {product.code}</Text>}
                {product?.address && <Text className="block font-sans  text-xs antialiased font-normal leading-normal text-gray-700 opacity-75">Address: {product.address}</Text>}
            </View>

            <ProductSummary data={data} onSearch={(from, to) => {
                if (!from && !to) return;
                if (from === dateRange.from && to === dateRange.to) return;
                setDateRange({ from, to });
            }} />
        </View>
    );
};

export default productPage;