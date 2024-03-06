import { View, TouchableOpacity, TextInput, FlatList } from 'react-native';
import FontAwesome from "@expo/vector-icons/FontAwesome";
import React, { useState } from 'react';
import { ROUTES } from "../../../../common/common";
import { router } from "expo-router";
import moment from "moment";
import { useQuery } from "@realm/react";
import SalesInvoiceCard from "../../../../components/SalesInvoiceCard";

const salesPage = () => {
    const [searchKey, setSearchKey] = useState("");
    const salesInvoices = useQuery("salesInvoices", (col) => {
        return col.filtered("invoiceNo BEGINSWITH[c] $0 || poNo BEGINSWITH[c] $0 || soNo BEGINSWITH[c] $0 || customerName CONTAINS[c] $0", searchKey);
    }, [searchKey]);
    const fetchMoreData = () => {};

    return (
        <View className="flex-1">

            <View className="items-center justify-center m-2">
                <TextInput
                    className="my-2 p-2 appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                    placeholder="Search by invoice#, customer, PO#, SO#..."
                    value={searchKey}
                    onChangeText={(text) => setSearchKey(text)}
                />
                <FlatList
                    className="w-full"
                    data={salesInvoices}
                    keyExtractor={(item) => item._id}
                    renderItem={({ item }) => (
                        <SalesInvoiceCard data={item} onEdit={() => router.navigate({ pathname: ROUTES.SALES_INVOICE_DETAILS, params: item })} enableButtons={false} onSelect={() => {
                            router.navigate(ROUTES.SALES_INVOICE_DETAILS);
                        }} />
                    )}
                    onEndReached={fetchMoreData}
                    onEndReachedThreshold={0.1}
                    />
            </View>

            <TouchableOpacity
                className="bg-blue-700 w-14 h-14 rounded-full flex justify-center items-center"
                style={{
                    position: "absolute",
                    bottom: 30,
                    right: 15
                }}
                onPress={() => {
                    router.navigate({ pathname: ROUTES.SALES_FORM, params: { key: moment().valueOf(), type: "clearList" } });
                }}
            >
                <FontAwesome size={20} name="plus" color="white" />
            </TouchableOpacity>
        </View>
    );
};

export default salesPage;