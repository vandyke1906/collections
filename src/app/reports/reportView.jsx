import { View, Text, ScrollView } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useRealm } from "@realm/react";
import { useNavigation } from "expo-router";
import useReportStore from "src/store/reportStore";
import { REPORT_TYPE, amountFormat, formatDate, isMOPCheque } from "src/common/common";
import CardData from "src/components/CardData";

const reportView = () => {
    const navigation = useNavigation();
    const realm = useRealm();
    const { reportType, dateFrom, dateTo, groups, customers, products, salesInvoices, setSummary, summary } = useReportStore();

    const [results, setResults] = useState([]);

    useEffect(() => {
        const isSales = reportType === REPORT_TYPE.SALES;
        const isCollections = reportType === REPORT_TYPE.COLLECTIONS;
        const data = [];
        if (isSales) {
            let filteredResult = realm.objects("salesInvoices");
            if (dateFrom && dateTo) {
                filteredResult = filteredResult.filtered("dateOfSI BETWEEN { $0 , $1 }", dateFrom, dateTo).sorted("dateOfSI");
            }
            else
                filteredResult = filteredResult.filtered("dateOfSI >= $0", dateFrom).sorted("dateOfSI");

            if (customers.length) {
                const customerSet = new Set(customers.map(c => c._id));
                filteredResult = filteredResult.filter((f) => customerSet.has(f.customerId));
            }

            if (salesInvoices.length) {
                const siSet = new Set(salesInvoices.map(c => c._id));
                filteredResult = filteredResult.filter((f) => siSet.has(f._id));
            }

            if (groups.length || products.length) {
                const groupSet = new Set(groups.map(group => group._id));
                const productSet = new Set(products.map(p => p._id));
                filteredResult = filteredResult.map(item => ({
                    ...item, products: item.products.filter(product => groupSet.has(product.group) || productSet.has(product.productId))
                })).filter(entry => entry.products.length);
            }

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
        }
        else if (isCollections) {
            let filteredResult = realm.objects("collections");

            if (dateFrom && dateTo) {
                filteredResult = filteredResult.filtered("corDate BETWEEN { $0 , $1 }", dateFrom, dateTo).sorted("corDate");
            }
            else
                filteredResult = filteredResult.filtered("corDate >= $0", dateFrom).sorted("corDate");

            if (customers.length) {
                const customerSet = new Set(customers.map(c => c._id));
                filteredResult = filteredResult.filter((f) => customerSet.has(f.customerId));
            }

            if (salesInvoices.length) {
                const siSet = new Set(salesInvoices.map(c => c._id));
                filteredResult = filteredResult.filter((f) => siSet.has(f.salesInvoice));
            }

            let totalCollected = 0;
            for (const collection of filteredResult) {
                data.push({ collection });
                totalCollected += collection.amount;
            }
            setSummary({ totalCollected });
        }
        setResults(data);

    }, [reportType]);

    useEffect(() => {
        navigation.setOptions({
            headerShown: true,
            title: `${reportType === REPORT_TYPE.SALES ? "Sales" : "Collection"} Report`
        });
    }, [navigation]);

    const renderSummary = () => {
        return (
            <View className="p-2 mb-2 flex">
                {!!dateFrom && (
                    <View className="flex flex-row items-center justify-start">
                        <Text className="block font-sans text-xs antialiased font-normal leading-normal text-gray-700 opacity-75">Date From: </Text>
                        <Text className="block font-sans text-xs antialiased font-bold leading-normal text-gray-900 uppercase">{formatDate(dateFrom)}</Text>
                    </View>
                )}

                {!!dateTo && (
                    <View className="flex flex-row items-center justify-start">
                        <Text className="block font-sans text-xs antialiased font-normal leading-normal text-gray-700 opacity-75">Date To: </Text>
                        <Text className="block font-sans text-xs antialiased font-bold leading-normal text-gray-900 uppercase">{formatDate(dateTo)}</Text>
                    </View>
                )}

                {!!groups.length && (
                    <View className="flex flex-row items-center justify-start">
                        <Text className="block font-sans text-xs antialiased font-normal leading-normal text-gray-700 opacity-75">Groups: </Text>
                        {groups.map((g, index) => (
                            <View key={index} className="p-2 flex space-x-2 m-1 text-xs font-medium text-center text-gray-900 bg-white border border-gray-300">
                                <Text className="block font-sans text-xs antialiased font-bold leading-normal text-gray-900 uppercase">{g._id}</Text>
                            </View>
                        ))}
                    </View>
                )}

                {!!products.length && (
                    <View className="flex flex-row items-center justify-start">
                        <Text className="block font-sans text-xs antialiased font-normal leading-normal text-gray-700 opacity-75">Products: </Text>
                        {products.map((p, index) => (
                            <View key={index} className="p-2 flex space-x-2 m-1 text-xs font-medium text-center text-gray-900 bg-white border border-gray-300">
                                <Text className="block font-sans text-xs antialiased font-bold leading-normal text-gray-900 uppercase">{p.code}</Text>
                            </View>
                        ))}
                    </View>
                )}

                {!!customers.length && (
                    <View className="flex flex-row items-center justify-start">
                        <Text className="block font-sans text-xs antialiased font-normal leading-normal text-gray-700 opacity-75">Customers: </Text>
                        {customers.map((c, index) => (
                            <View key={index} className="p-2 flex space-x-2 m-1 text-xs font-medium text-center text-gray-900 bg-white border border-gray-300">
                                <Text className="block font-sans text-xs antialiased font-bold leading-normal text-gray-900 uppercase">{c.code}</Text>
                            </View>
                        ))}
                    </View>
                )}

                {!!results.length && (
                    <View className="py-2 my-2 block w-fulltext-left border-t border-gray-300">
                        <View className="flex flex-row items-center justify-between">
                            {!!summary.totalQty && (
                                <View className="flex flex-row items-center justify-start">
                                    <Text className="block font-sans text-xs antialiased font-normal leading-normal text-gray-700 opacity-75">Total Product Quantities: </Text>
                                    <Text className="block font-sans text-xs antialiased font-bold leading-normal text-green-900 uppercase">{summary.totalQty || 0}</Text>
                                </View>
                            )}
                            {!!summary.totalRevenue && (
                                <View className="flex flex-row items-center justify-start">
                                    <Text className="block font-sans text-xs antialiased font-normal leading-normal text-gray-700 opacity-75">Total Revenue: </Text>
                                    <Text className="block font-sans text-xs antialiased font-bold leading-normal text-green-900 uppercase">{amountFormat(summary.totalRevenue || 0)}</Text>
                                </View>
                            )}
                            {!!summary.totalCollected && (
                                <View className="flex flex-row items-center justify-start">
                                    <Text className="block font-sans text-xs antialiased font-normal leading-normal text-gray-700 opacity-75">Total Collected: </Text>
                                    <Text className="block font-sans text-xs antialiased font-bold leading-normal text-green-900 uppercase">{amountFormat(summary.totalCollected || 0)}</Text>
                                </View>
                            )}
                        </View>
                    </View>
                )}
            </View>
        );
    };

    const renderResults = () => {
        return (
            <View className="m-2 mb-2 flex border-t border-gray-300">
                <View className="flex flex-row">
                    <Text className="mt-2 block font-sans text-xs antialiased leading-normal text-gray-500 uppercase">results found</Text>
                    <Text className="mt-2 block font-sans text-xs antialiased leading-normal font-bold text-gray-500 uppercase">({results.length})</Text>
                </View>

                {results.map((data = {}, index) => {
                    return (
                        <CardData key={index}>
                            {!!data.product && (
                                <View>
                                    <Text className="block font-sans text-xs antialiased font-bold leading-normal text-gray-900">{data.product.name}</Text>

                                    <View className="flex flex-row items-center justify-between">
                                        <View className="flex flex-row items-center justify-start">
                                            <Text className="block font-sans text-xs antialiased font-normal leading-normal text-gray-400 opacity-75">Code: </Text>
                                            <Text className="block font-sans text-xs antialiased font-bold leading-normal text-gray-700 opacity-75">{data.product.code}</Text>
                                        </View>

                                        <View className="flex flex-row items-center justify-start">
                                            <Text className="block font-sans text-xs antialiased font-normal leading-normal text-gray-400 opacity-75">Qty: </Text>
                                        <Text className="block font-sans text-xs antialiased font-bold leading-normal text-gray-700 uppercase">{data.product.qty}</Text>
                                        </View>

                                        <View className="flex flex-row items-center justify-start">
                                            <Text className="block font-sans text-xs antialiased font-normal leading-normal text-gray-400 opacity-75">Unit: </Text>
                                        <Text className="block font-sans text-xs antialiased font-bold leading-normal text-gray-700 uppercase">{data.product.unit}</Text>
                                        </View>

                                        <View className="flex flex-row items-center justify-start">
                                            <Text className="block font-sans text-xs antialiased font-normal leading-normal text-gray-400 opacity-75">Code: </Text>
                                        <Text className="block font-sans text-xs antialiased font-bold leading-normal text-green-700 uppercase">{amountFormat(data.product.amount)}</Text>
                                        </View>
                                    </View>
                                </View>
                            )}

                            {!!data.invoice && (
                                <View className="mt-2">
                                    <View className="flex flex-row items-center justify-start">
                                        <Text className="block font-sans text-xs antialiased font-bold leading-normal text-gray-900 uppercase">Invoice #: </Text>
                                        <Text className="block font-sans text-xs antialiased font-bold leading-normal text-gray-900 uppercase">{data.invoice.invoiceNo}</Text>
                                    </View>

                                    <View className="flex flex-row items-center justify-start">
                                        <Text className="block font-sans text-xs antialiased font-normal leading-normal text-gray-700 opacity-75">Customer: </Text>
                                        <Text className="block font-sans text-xs antialiased font-bold leading-normal text-gray-900 uppercase">{data.invoice.customerName}</Text>
                                    </View>

                                    <View className="flex flex-row items-center justify-start">
                                        <Text className="block font-sans text-xs antialiased font-normal leading-normal text-gray-700 opacity-75">Invoice Date: </Text>
                                        <Text className="block font-sans text-xs antialiased font-bold leading-normal text-gray-900 uppercase">{formatDate(data.invoice.dateOfSI)}</Text>
                                    </View>

                                    <View className="flex flex-row items-center justify-start">
                                        <Text className="block font-sans text-xs antialiased font-normal leading-normal text-gray-700 opacity-75">Date Delivered: </Text>
                                        <Text className="block font-sans text-xs antialiased font-bold leading-normal text-gray-900 uppercase">{formatDate(data.invoice.dateDelivered)}</Text>
                                    </View>


                                    <View className="flex flex-row items-center justify-between">
                                        <View className="flex flex-row items-center justify-start">
                                            <Text className="block font-sans text-xs antialiased font-normal leading-normal text-gray-700 opacity-75">PO #: </Text>
                                            <Text className="block font-sans text-xs antialiased font-bold leading-normal text-gray-900 uppercase">{data.invoice.poNo}</Text>
                                        </View>

                                        <View className="flex flex-row items-center justify-start">
                                            <Text className="block font-sans text-xs antialiased font-normal leading-normal text-gray-700 opacity-75">SO #: </Text>
                                            <Text className="block font-sans text-xs antialiased font-bold leading-normal text-gray-900 uppercase">{data.invoice.soNo}</Text>
                                        </View>
                                    </View>
                                </View>
                            )}

                            {!!data.collection && (
                                <View className="flex">
                                    <View className="flex flex-row items-center justify-start">
                                        <Text className="block font-sans text-xs antialiased font-normal leading-normal text-gray-700 opacity-75">COR #: </Text>
                                        <Text className="block font-sans text-xs antialiased font-bold leading-normal text-gray-900 uppercase">{data.collection.corNo}</Text>
                                    </View>

                                    <View className="flex">
                                        <Text className="block font-sans text-xs antialiased font-bold leading-normal text-gray-700 opacity-75">COR Date: {formatDate(data.collection.corDate)}</Text>
                                        <Text className="block font-sans text-xs antialiased font-bold leading-normal text-gray-700 opacity-75">Payment Date: {formatDate(data.collection.paymentDate)}</Text>
                                        <Text className="block font-sans text-xs antialiased font-bold leading-normal text-gray-700 opacity-75">Customer: {data.collection?.details?.customerName}</Text>
                                        <Text className="block font-sans text-xs antialiased font-bold leading-normal text-gray-700 opacity-75">Invoice #: {data.collection?.details?.invoiceNo}</Text>

                                        <View className="flex flex-row items-center justify-between">

                                            <View className="flex flex-row  items-center justify-start">
                                                <Text className="block font-sans text-xs antialiased font-normal leading-normal text-gray-700 opacity-75">Mode of Payment: </Text>
                                                <Text className="block font-sans text-xs antialiased font-bold leading-normal text-gray-900 uppercase">{data.collection.modeOfPayment}</Text>
                                            </View>

                                            <View className="flex flex-row  items-center justify-start">
                                                <Text className="block font-sans text-xs antialiased font-normal leading-normal text-gray-700 opacity-75">Amount Collected: </Text>
                                                <Text className="block font-sans text-xs antialiased font-bold leading-normal text-gray-900 uppercase">{amountFormat(data.collection.amount || 0)}</Text>
                                            </View>
                                        </View>



                                        {isMOPCheque(data.collection.modeOfPayment) && (
                                            <View className="flex flex-row items-center justify-between">

                                                <View className="flex flex-row  items-center justify-start">
                                                    <Text className="block font-sans text-xs antialiased font-normal leading-normal text-gray-700 opacity-75">Cheque Number: </Text>
                                                    <Text className="block font-sans text-xs antialiased font-bold leading-normal text-gray-900 uppercase">{data.collection.chequeNo}</Text>
                                                </View>

                                                <View className="flex flex-row  items-center justify-start">
                                                    <Text className="block font-sans text-xs antialiased font-normal leading-normal text-gray-700 opacity-75">Date of Cheque: </Text>
                                                    <Text className="block font-sans text-xs antialiased font-bold leading-normal text-gray-900 uppercase">{formatDate(data.collection.chequeDate)}</Text>
                                                </View>
                                            </View>
                                        )}

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
        <ScrollView className="flex w-full p-2bg-slate-50" showsVerticalScrollIndicator={false}>
            {renderSummary()}
            {renderResults()}
        </ScrollView>
    );
};

export default reportView;