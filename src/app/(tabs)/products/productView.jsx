import { View, Text, StatusBar, ScrollView, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { useQuery, useRealm } from "@realm/react";
import { useRoute } from "@react-navigation/native";
import { router, useNavigation } from "expo-router";
import ProductSummary from "src/components/reports/salesProducts/ProductSummary";
import { FontAwesome } from "@expo/vector-icons";
import { ROUTES } from "src/common/common";

const productView = () => {
    const navigation = useNavigation();
    const realm = useRealm();
    const route = useRoute();
    const product = route.params || {};
    const [dateRange, setDateRange] = useState({ from: 0, to: 0 });
    const data = useQuery("salesInvoices", (coll) => {
        const salesProducts = realm.objects("salesProducts").filtered("productId == $0", product._id);
        if (!salesProducts || !salesProducts.length) return salesProducts;
        if (dateRange.from && dateRange.to)
            return coll.filtered(`ANY products == {${salesProducts.map((s) => `obj('salesProducts', '${s._id}')`).join(",")}} && dateOfSI BETWEEN { $0, $1 }`, dateRange.from, dateRange.to).sorted("dateOfSI");
        else if (dateRange.from)
            return coll.filtered(`ANY products == {${salesProducts.map((s) => `obj('salesProducts', '${s._id}')`).join(",")}} && dateOfSI >= $0`, dateRange.from).sorted("dateOfSI");
        else
            return coll.filtered(`ANY products == {${salesProducts.map((s) => `obj('salesProducts', '${s._id}')`).join(",")}}`).sorted("dateOfSI");
    }, [dateRange]);

    useEffect(() => {
        navigation.setOptions({
            title: `Code: ${product.code || "Customer"}`,
            headerRight: () => (
                <TouchableOpacity className="py-3 pl-10 pr-3" onPress={() => { router.push({ pathname: ROUTES.PRODUCT_REPORT, params: route.params }); }}>
                    <FontAwesome size={18} name="line-chart" />
                </TouchableOpacity>
            ),
        });
    }, [navigation]);

    return (
        <ScrollView>
            <View className="block rounded-lg bg-white p-2 m-2">
                <Text className="mb-2 block font-sans text-xs antialiased font-bold leading-normal text-gray-900">
                    {product?.name || ""}
                </Text>
                <View className="flex flex-row items-center justify-between">
                    {!!product?.code && (
                        <Text className="block font-sans text-xs antialiased font-xs leading-normal text-gray-700 opacity-75">
                            Code: {product.code}
                        </Text>
                    )}
                    {!!product?.unit && (
                        <Text className="block font-sans text-xs antialiased font-xs leading-normal text-gray-700 opacity-75">
                            Unit: {product.unit}
                        </Text>
                    )}
                    {!!product?.group && (
                        <Text className="block font-sans text-xs antialiased font-xs leading-normal text-gray-700 opacity-75">
                            Group: {product.group}
                        </Text>
                    )}
                </View>
            </View>


            <ProductSummary
                product={product}
                data={data}
                onSearch={(from, to) => {
                    if (!from && !to) return;
                    if (from === dateRange.from && to === dateRange.to) return;
                    setDateRange({ from, to });
                }}
            />

            <StatusBar style="auto" />
        </ScrollView>
    );
};

export default productView;
