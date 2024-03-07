import { View, Text, ScrollView } from 'react-native';
import React, { useEffect, useState } from 'react';
import useReportStore from "../../../store/reportStore";
import { useQuery, useRealm } from "@realm/react";
import { useNavigation } from "expo-router";
import { REPORT_TYPE } from "../../../common/common";

const reportView = () => {
    const navigation = useNavigation();
    const realm = useRealm();
    const { reportType, dateFrom, dateTo, groups, products, customers } = useReportStore();

    const [results, setResults] = useState([]);

    useEffect(() => {
        const isSales = reportType === REPORT_TYPE.SALES;
        if (isSales) {
            let filteredResult = realm.objects("salesInvoices");
            if (dateFrom)
                filteredResult = filteredResult.filtered("dateOfSI >= $0", dateFrom);
            if (dateTo)
                filteredResult = filteredResult.filtered("dateOfSI <= $0", dateTo);


            if (groups.length) {
                const groupSet = new Set(groups.map(group => group._id));
                filteredResult = filteredResult.map(item => ({
                ...item, products: item.products.filter(product => groupSet.has(product.group))
                })).filter(entry => entry.products.length);
            }
                // filteredResult = filteredResult.map((item) => {
                //     const filteredProducts = item.products.filter(product => {
                //         return groups.some((g) => g._id === product.group);
                //     });
                //     return { ...item, products: filteredProducts };
                // }).filter((entry) => entry.products.length);

                // filteredResult = filteredResult.filter((item) => item.products.some((product) => groups.includes(product.group)));

            // console.info(JSON.stringify(filteredResult, null, 2));
            setResults(filteredResult);
        }

    }, [reportType]);

    useEffect(() => {
        navigation.setOptions({
            headerShown: true,
            title: `${reportType === REPORT_TYPE.SALES ? "Sales" : "Collection"} Report`
        });
    }, [navigation]);

    const renderSummary = () => {
        return (
            <View className="block w-fulltext-left p-2 my-2">
                <View className="p-2">

                    <View className="flex flex-row items-center justify-start">
                        <Text className="block font-sans text-sm antialiased font-normal leading-normal text-gray-700 opacity-75">Revenue: </Text>
                        <Text className="block font-sans text-sm antialiased font-bold leading-normal text-gray-900 uppercase">Unpaid</Text>
                    </View>

                </View>
            </View>
        );
    };

    return (
        <ScrollView className="flex w-full" showsVerticalScrollIndicator={false}>
            {renderSummary()}

            <Text className="mt-5">{JSON.stringify(results, null, 2)}</Text>
        </ScrollView>
    )
}

export default reportView;