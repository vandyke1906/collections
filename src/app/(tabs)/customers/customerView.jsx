import { View, Text, TouchableOpacity, StatusBar, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import { useQuery, useRealm } from "@realm/react";
import { useRoute } from "@react-navigation/native";
import { router, useNavigation } from "expo-router";
import InvoiceSummary from "src/components/reports/salesInvoices/InvoiceSummary";
import { ROUTES } from "src/common/common";
import { FontAwesome } from "@expo/vector-icons";

const customerView = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const customer = route.params || {};
    const [dateRange, setDateRange] = useState({ from: 0, to: 0 });
    const data = useQuery("salesInvoices", (coll) => {
        if (dateRange.from && dateRange.to)
            return coll.filtered("customerId == $0 && dateOfSI BETWEEN { $1, $2 }", customer._id, dateRange.from, dateRange.to).sorted("dateOfSI");
        else if (dateRange.from)
            return coll.filtered("customerId == $0 && dateOfSI >= $1", customer._id, dateRange.from).sorted("dateOfSI");
        else return coll.filtered("customerId == $0", customer._id).sorted("dateOfSI");
    }, [dateRange]);

    useEffect(() => {
        navigation.setOptions({
            title: `CAN: ${customer.code || "Customer"}`,
            headerRight: () => (
                <TouchableOpacity className="py-3 pl-10 pr-3" onPress={() => { router.push({ pathname: ROUTES.CUSTOMER_REPORT, params: route.params }); }}>
                    <FontAwesome size={18} name="line-chart" />
                </TouchableOpacity>
            ),
        });
    }, [navigation]);

    return (
        <ScrollView>
            <View className="block rounded-lg bg-white p-2 m-2">
                {customer?.name && (
                    <Text className="block font-sans text-xs antialiased font-bold leading-relaxed text-blue-gray-900">
                        {customer.name || ""}
                    </Text>
                )}
                {customer?.code && (
                    <Text className="block font-sans text-xs antialiased font-normal leading-normal text-gray-700 opacity-75">
                        Account #: {customer.code || ""}
                    </Text>
                )}
                {customer?.address && (
                    <Text className="block font-sans  text-xs antialiased font-normal leading-normal text-gray-700 opacity-75">
                        Address: {customer.address || ""}
                    </Text>
                )}
            </View>

            <InvoiceSummary
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

export default customerView;
