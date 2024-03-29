import { View, Text, ScrollView, TouchableOpacity, StatusBar } from "react-native";
import React, { useEffect } from "react";
import { router, useNavigation } from "expo-router";
import moment from "moment";
import { useQuery, useRealm } from "@realm/react";
import useSalesInvoiceStore from "src/store/salesInvoiceStore";
import { DATE_FORMAT, MODE_OF_PAYMENT, ROUTES, formatAmount, formatDate } from "src/common/common";

const salesInvoiceDetails = () => {
    const navigation = useNavigation();
    const realm = useRealm();

    const selectedInvoice = useSalesInvoiceStore((state) => state.selected);

    const collections = useQuery(
        "collections",
        (col) => {
            const currentSalesInvoice = realm.objectForPrimaryKey("salesInvoices", selectedInvoice?._id || "");
            return col.filtered("salesInvoice == $0", currentSalesInvoice).sorted("paymentDate");
        },
        [selectedInvoice?._id]
    );

    useEffect(() => {
        navigation.setOptions({ headerShown: true, title: "Sales Invoice Details" });
    }, [navigation]);

    const renderProducts = (products) => {
        return (
            <View className="mt-2 mb-5 flex border-t border-gray-300">
                <Text className="mt-2 block font-sans text-xs antialiased leading-normal text-gray-500 uppercase">
                    products
                </Text>
                {products.map((item, index) => (
                    <View key={index} className="rounded-lg bg-white mt-5 p-2">
                        {item?.name && (
                            <Text className="block font-sans text-xs antialiased leading-normal text-gray-900 font-bold">
                                {item?.name}
                            </Text>
                        )}
                        <View className="flex flex-row items-center justify-between">
                            <View className="flex flex-row items-center justify-between gap-2">
                                {item?.code && (
                                    <Text className="block font-sans text-xs antialiased leading-normal text-gray-700 opacity-75">
                                        Code: {item?.code}
                                    </Text>
                                )}
                                {item?.qty && (
                                    <Text className="block font-sans text-xs antialiased leading-normal text-gray-700 opacity-75">
                                        Qty: ({item?.qty})
                                    </Text>
                                )}
                                {item?.unit && (
                                    <Text className="block font-sans text-xs antialiased leading-normal text-gray-700 opacity-75">
                                        Unit: {item?.unit}
                                    </Text>
                                )}
                            </View>
                            {item?.amount && (
                                <Text className="block font-sans text-xs antialiased leading-normal text-gray-900 font-bold">
                                    {formatAmount(item?.amount)}
                                </Text>
                            )}
                        </View>
                    </View>
                ))}
            </View>
        );
    };

    const renderCollections = (unpaidAmount = 0) => {
        return (
            <View className="mt-2 mb-5 flex border-t border-gray-300">
                <View className="flex flex-row items-center justify-between">
                    <View className="flex flex-row items-start">
                        <Text className="mt-2 block font-sans text-xs antialiased leading-normal text-gray-500 uppercase">
                            TOTAL PAID:
                        </Text>
                        <Text className="mt-2 block font-sans text-xs antialiased leading-normal text-green-900 font-bold">
                            {formatAmount(collections.reduce((acc, item) => acc + item.amount, 0))}
                        </Text>
                    </View>
                    {!!unpaidAmount && (
                        <TouchableOpacity onPress={() => router.push({ pathname: ROUTES.COLLECTIONS_FORM })}>
                            <Text className="pointer-events-auto inline-block cursor-pointer rounded text-sm font-bold leading-normal text-blue-700 uppercase">
                                New Collection
                            </Text>
                        </TouchableOpacity>
                    )}
                </View>

                {collections.map((item, index) => (
                    <View key={index} className="rounded-lg bg-white mt-5 p-2">
                        {!!item?.paymentDate && (
                            <Text className="block font-sans text-xs antialiased leading-normal text-gray-700 opacity-75">
                                Payment Date: {formatDate(item?.paymentDate)}
                            </Text>
                        )}
                        {!!item?.corDate && (
                            <Text className="block font-sans text-xs antialiased leading-normal text-gray-700 opacity-75">
                                COR Date: {formatDate(item?.corDate)}
                            </Text>
                        )}
                        {!!item?.corNo && (
                            <Text className="block font-sans text-xs antialiased leading-normal text-gray-700 opacity-75">
                                COR #: {item?.corNo}
                            </Text>
                        )}
                        <View className="flex flex-row items-center justify-between">
                            {!!item?.modeOfPayment && (
                                <Text className="block font-sans text-xs antialiased leading-normal text-gray-700 opacity-75">
                                    {MODE_OF_PAYMENT[item?.modeOfPayment]}
                                </Text>
                            )}
                            {!!item?.amount && (
                                <Text className="block font-sans text-xs antialiased leading-normal text-gray-900 font-bold">
                                    {formatAmount(item?.amount)}
                                </Text>
                            )}
                        </View>
                    </View>
                ))}
            </View>
        );
    };

    const renderDetails = (data) => {
        return (
            <View className="block w-fulltext-left p-2 my-2">
                <View className="p-2">
                    {!!data?.invoiceNo && (
                        <Text className="block font-sans text-xs antialiased leading-normal text-gray-900 font-bold">
                            {data?.invoiceNo}
                        </Text>
                    )}
                    {!!data?.customerName && (
                        <Text className="block font-sans text-xs antialiased font-bold leading-normal text-gray-900">
                            {data?.customerName}
                        </Text>
                    )}

                    {!!data?.customerCode && (
                        <Text className="block font-sans text-xs antialiased font-normal leading-normal text-gray-700 opacity-75">
                            Customer Account #:{data?.customerCode}
                        </Text>
                    )}
                    {!!data?.poNo && (
                        <Text className="block font-sans text-xs antialiased font-normal leading-normal text-gray-700 opacity-75">
                            PO #:{data?.poNo}
                        </Text>
                    )}
                    {!!data?.soNo && (
                        <Text className="block font-sans text-xs antialiased font-normal leading-normal text-gray-700 opacity-75">
                            SO #: {data?.soNo}
                        </Text>
                    )}

                    {!!data?.dateOfSI && (
                        <Text className="block font-sans text-xs antialiased font-normal leading-normal text-gray-700 opacity-75">
                            SI Date: {moment(data?.dateOfSI).format(DATE_FORMAT)}
                        </Text>
                    )}
                    {!!data?.dateDelivered && (
                        <Text className="block font-sans text-xs antialiased font-normal leading-normal text-gray-700 opacity-75">
                            Delivered Date: {moment(data?.dateDelivered).format(DATE_FORMAT)}
                        </Text>
                    )}

                    <View className="pt-2 flex flex-row items-center justify-between">
                        {!isNaN(data?.totalAmount) && (
                            <View className="flex flex-row">
                                <Text className="block font-sans text-xs antialiased font-normal leading-normal text-gray-700 opacity-75">
                                    Sales:
                                </Text>
                                <Text className="block font-sans text-xs antialiased font-bold leading-normal text-green-700 opacity-75">
                                    : {formatAmount(data?.totalAmount)}
                                </Text>
                            </View>
                        )}
                        {!isNaN(data?.unpaidAmount) && (
                            <View className="flex flex-row">
                                <Text className="block font-sans text-xs antialiased font-normal leading-normal text-gray-700 opacity-75">
                                    Unpaid:
                                </Text>
                                <Text className={`block font-sans text-xs antialiased font-bold leading-normal opacity-75 ${data?.unpaidAmount ? "text-red-700" : "text-green-700"}`}>
                                    {formatAmount(data?.unpaidAmount)}
                                </Text>
                            </View>
                        )}
                    </View>

                    {renderProducts(data.products)}
                    {renderCollections(data.unpaidAmount)}
                </View>
            </View>
        );
    };

    return (
        <ScrollView className="flex w-full" showsVerticalScrollIndicator={false}>
            {!!selectedInvoice && renderDetails(selectedInvoice)}
            <StatusBar style="auto" />
        </ScrollView>
    );
};

export default salesInvoiceDetails;
