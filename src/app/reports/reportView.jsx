import { View, Text, ScrollView } from 'react-native';
import React, { useEffect, useState } from 'react';
import useReportStore from "../../store/reportStore";
import { useQuery, useRealm } from "@realm/react";
import { useNavigation } from "expo-router";
import { REPORT_TYPE, amountFormat, formatDate } from "../../common/common";
import CardData from "../../components/CardData";

const reportView = () => {
    const navigation = useNavigation();
    const realm = useRealm();
    const { reportType, dateFrom, dateTo, groups, customers, products, setSummary, summary } = useReportStore();

    const [results, setResults] = useState([]);

    useEffect(() => {
        const isSales = reportType === REPORT_TYPE.SALES;
        if (isSales) {
            let filteredResult = realm.objects("salesInvoices");
            if (dateFrom)
                filteredResult = filteredResult.filtered("dateOfSI >= $0", dateFrom);
            if (dateTo)
                filteredResult = filteredResult.filtered("dateOfSI <= $0", dateTo);

            if (customers.length) {
                const customerSet = new Set(customers.map(c => c._id));
                filteredResult = filteredResult.filter((f) => customerSet.has(f.customerId));
            }

            // console.info(JSON.stringify(filteredResult, null, 2))

            if (groups.length || products.length) {
                const groupSet = new Set(groups.map(group => group._id));
                const productSet = new Set(products.map(p => p._id));
                filteredResult = filteredResult.map(item => ({
                    ...item, products: item.products.filter(product => groupSet.has(product.group) || productSet.has(product.productId))
                })).filter(entry => entry.products.length);
            }

            const data = [];
            let totalRevenue = 0;
            let totalQty = 0;
            for (const invoice of filteredResult) {
                for (const product of invoice.products) {
                    data.push({ invoice, product });
                    totalRevenue += product.amount;
                    totalQty += product.qty;
                }
            }
            setSummary({ totalRevenue, totalQty });
            setResults(data);
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
            <View className="mt-2 mb-2 flex">
                <Text className="mt-2 block font-sans text-sm antialiased leading-normal text-gray-500 uppercase">FILTER DATA</Text>

                {!!dateFrom && (
                    <View className="flex flex-row items-center justify-start">
                        <Text className="block font-sans text-sm antialiased font-normal leading-normal text-gray-700 opacity-75">Date From: </Text>
                        <Text className="block font-sans text-sm antialiased font-bold leading-normal text-gray-900 uppercase">{formatDate(dateFrom)}</Text>
                    </View>
                )}

                {!!dateTo && (
                    <View className="flex flex-row items-center justify-start">
                        <Text className="block font-sans text-sm antialiased font-normal leading-normal text-gray-700 opacity-75">Date To: </Text>
                        <Text className="block font-sans text-sm antialiased font-bold leading-normal text-gray-900 uppercase">{formatDate(dateTo)}</Text>
                    </View>
                )}

                 {!!groups.length && (
                    <View className="flex flex-row items-center justify-start">
                        <Text className="block font-sans text-sm antialiased font-normal leading-normal text-gray-700 opacity-75">Groups: </Text>
                        {groups.map((g, index) => (
                            <View  key={index} className="p-2 flex space-x-2 m-1 text-xs font-medium text-center text-gray-900 bg-white border border-gray-300">
                                <Text className="block font-sans text-sm antialiased font-bold leading-normal text-gray-900 uppercase">{g._id}</Text>
                            </View>
                        ))}
                    </View>
                )}

                {!!products.length && (
                    <View className="flex flex-row items-center justify-start">
                        <Text className="block font-sans text-sm antialiased font-normal leading-normal text-gray-700 opacity-75">Products: </Text>
                        {products.map((p, index) => (
                            <View  key={index} className="p-2 flex space-x-2 m-1 text-xs font-medium text-center text-gray-900 bg-white border border-gray-300">
                                <Text className="block font-sans text-sm antialiased font-bold leading-normal text-gray-900 uppercase">{p.code}</Text>
                            </View>
                        ))}
                    </View>
                )}

                {!!customers.length && (
                    <View className="flex flex-row items-center justify-start">
                        <Text className="block font-sans text-sm antialiased font-normal leading-normal text-gray-700 opacity-75">Customers: </Text>
                        {customers.map((c, index) => (
                            <View  key={index} className="flex space-x-2 m-1 text-xs font-medium text-center text-gray-900 bg-white border border-gray-300">
                                <Text className="block font-sans text-sm antialiased font-bold leading-normal text-gray-900 uppercase">{c.code}</Text>
                            </View>
                        ))}
                    </View>
                )}

                <View className="block w-fulltext-left p-2 my-2 border-t border-gray-300">
                    <View className="flex flex-row items-center justify-between">
                        <View className="flex flex-row items-center justify-start">
                            <Text className="block font-sans text-sm antialiased font-normal leading-normal text-gray-700 opacity-75">Total Product Quantities: </Text>
                            <Text className="block font-sans text-sm antialiased font-bold leading-normal text-gray-900 uppercase">{summary.totalQty || 0}</Text>
                        </View>
                        <View className="flex flex-row items-center justify-start">
                            <Text className="block font-sans text-sm antialiased font-normal leading-normal text-gray-700 opacity-75">Total Revenue: </Text>
                            <Text className="block font-sans text-sm antialiased font-bold leading-normal text-gray-900 uppercase">{amountFormat(summary.totalRevenue || 0)}</Text>
                        </View>
                    </View>
                </View>
            </View>
    );
    };

    const renderResults = () => {
        return (
            <View className="mt-2 mb-5 flex border-t border-gray-300">
                <Text className="mt-2 block font-sans text-sm antialiased leading-normal text-gray-500 uppercase">results</Text>

                {results.map((data, index) => {
                    return (
                        <CardData key={index}>
                            {!!data.product && (
                                <View>
                                    <View className="flex flex-row items-center justify-start">
                                        <Text className="block font-sans text-sm antialiased font-normal leading-normal text-gray-700 opacity-75">Product: </Text>
                                        <Text className="block font-sans text-sm antialiased font-bold leading-normal text-gray-900 uppercase">{data.product.name} ({data.product.code})</Text>
                                    </View>
                                    <View className="flex flex-row items-center justify-between">
                                        <Text className="block font-sans text-sm antialiased font-bold leading-normal text-gray-900 uppercase">Qty: {data.product.qty}</Text>
                                        <Text className="block font-sans text-sm antialiased font-bold leading-normal text-gray-900 uppercase">Unit: {data.product.unit}</Text>
                                        <Text className="block font-sans text-sm antialiased font-bold leading-normal text-gray-900 uppercase">Amount: {amountFormat(data.product.amount)}</Text>
                                    </View>
                                </View>
                            )}

                            {!!data.invoice && (
                                <View className="mt-5">
                                    <View className="flex flex-row items-center justify-start">
                                        <Text className="block font-sans text-sm antialiased font-normal leading-normal text-gray-700 opacity-75">Invoice #: </Text>
                                        <Text className="block font-sans text-sm antialiased font-bold leading-normal text-gray-900 uppercase">{data.invoice.invoiceNo}</Text>
                                    </View>

                                    <View className="flex flex-row items-center justify-start">
                                        <Text className="block font-sans text-sm antialiased font-normal leading-normal text-gray-700 opacity-75">Customer: </Text>
                                        <Text className="block font-sans text-sm antialiased font-bold leading-normal text-gray-900 uppercase">{data.invoice.customerName}</Text>
                                    </View>

                                    <View className="flex flex-row items-center justify-start">
                                        <Text className="block font-sans text-sm antialiased font-normal leading-normal text-gray-700 opacity-75">Invoice Date: </Text>
                                        <Text className="block font-sans text-sm antialiased font-bold leading-normal text-gray-900 uppercase">{formatDate(data.invoice.dateOfSI)}</Text>
                                    </View>

                                    <View className="flex flex-row items-center justify-start">
                                        <Text className="block font-sans text-sm antialiased font-normal leading-normal text-gray-700 opacity-75">Date Delivered: </Text>
                                        <Text className="block font-sans text-sm antialiased font-bold leading-normal text-gray-900 uppercase">{formatDate(data.invoice.dateDelivered)}</Text>
                                    </View>


                                    <View className="flex flex-row items-center justify-between">
                                        <View className="flex flex-row items-center justify-start">
                                            <Text className="block font-sans text-sm antialiased font-normal leading-normal text-gray-700 opacity-75">PO #: </Text>
                                            <Text className="block font-sans text-sm antialiased font-bold leading-normal text-gray-900 uppercase">{data.invoice.poNo}</Text>
                                        </View>

                                        <View className="flex flex-row items-center justify-start">
                                            <Text className="block font-sans text-sm antialiased font-normal leading-normal text-gray-700 opacity-75">SO #: </Text>
                                            <Text className="block font-sans text-sm antialiased font-bold leading-normal text-gray-900 uppercase">{data.invoice.soNo}</Text>
                                        </View>
                                    </View>
                                </View>
                            )}
                        </CardData>
                    );
                })}
            </View>
        );
    };

    return (
        <ScrollView className="flex w-full p-2" showsVerticalScrollIndicator={false}>
            {renderSummary()}
            {renderResults()}
        </ScrollView>
    );
};

export default reportView;