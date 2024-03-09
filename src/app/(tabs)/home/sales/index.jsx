import { View, TouchableOpacity, TextInput, FlatList } from 'react-native';
import FontAwesome from "@expo/vector-icons/FontAwesome";
import React, { useEffect, useState } from 'react';
import { router, useNavigation } from "expo-router";
import moment from "moment";
import { useQuery, useRealm } from "@realm/react";
import { ROUTES } from "src/common/common";
import SalesInvoiceCard from "src/components/SalesInvoiceCard";
import useSalesInvoiceStore from "src/store/salesInvoiceStore";
// import useInvoice from "src/store/invoiceStore";


const salesPage = () => {
    const navigation = useNavigation();
    const realm = useRealm();

    const [searchKey, setSearchKey] = useState("");
    const setSelectedInvoice = useSalesInvoiceStore(state => state.setSelected);
    // const { dataList, counter, limit, nextCounter, resetCounter, setDataList, addToDataList, isEnd, setIsEnd } = useInvoice();


    const dataList = useQuery("salesInvoices", (col) => {
        return col.filtered("invoiceNo BEGINSWITH[c] $0 || poNo BEGINSWITH[c] $0 || soNo BEGINSWITH[c] $0 || customerName CONTAINS[c] $0", searchKey).sorted("dateOfSI");
    }, [searchKey]);

    useEffect(() => {
        navigation.setOptions({ headerShown: true, title: "Sales Invoices" });
    }, [navigation]);

    // useEffect(() => {
    //     resetCounter();
    //     const result = getRecords(searchKey);
    //     setDataList(result);
    // }, [realm, searchKey]);


    // const getRecords = (searchKey) => {
    //     try {
    //         let result = realm.objects("salesInvoices").filtered("invoiceNo BEGINSWITH[c] $0 || poNo BEGINSWITH[c] $0 || soNo BEGINSWITH[c] $0 || customerName CONTAINS[c] $0", searchKey)
    //             .sorted("dateOfSI").slice((counter - 1) * limit, counter * limit);
    //         if (!result.length) setIsEnd(true);
    //         nextCounter();
    //         return Array.from(result) || [];
    //     } catch (error) {
    //         console.error(error);
    //         return [];
    //     }
    // };

    // const fetchMoreData = () => {
    //     if (isEnd) return console.info("End of record");
    //     const nextResult = getRecords(searchKey);
    //     addToDataList(nextResult);
    // };

    const getSalesInvoiceDetails = (item) => {
        const salesInvoice = realm.objectForPrimaryKey("salesInvoices", item._id);
        if (salesInvoice) {
            const customer = realm.objectForPrimaryKey("customers", salesInvoice.customerId);
            const siProducts = salesInvoice.products.map((p) => realm.objectForPrimaryKey("salesProducts", p._id));
            customer.customerId = customer._id;
            delete customer._id;
            setSelectedInvoice({ ...customer, ...salesInvoice, products: siProducts });
        }
    };

    return (
        <View className="flex-1 mb-5">

            <View className="items-center justify-center m-2">
                <TextInput
                    className="text-sm my-2 p-2 appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                    placeholder="Search by invoice#, customer, PO#, SO#..."
                    value={searchKey}
                    onChangeText={(text) => setSearchKey(text.toUpperCase())}
                />
                <FlatList
                    className="w-full"
                    data={dataList}
                    keyExtractor={(item) => item._id}
                    renderItem={({ item }) => (
                        <SalesInvoiceCard data={item} onEdit={() => router.push({ pathname: ROUTES.SALES_INVOICE_DETAILS, params: item })} enableButtons={false} onSelect={() => {
                            getSalesInvoiceDetails(item);
                            router.push(ROUTES.SALES_INVOICE_DETAILS);
                        }} />
                    )}
                // onEndReached={fetchMoreData}
                // onEndReachedThreshold={0.1}
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
                    router.push({ pathname: ROUTES.SALES_FORM, params: { key: moment().valueOf(), type: "clearList" } });
                }}
            >
                <FontAwesome size={20} name="plus" color="white" />
            </TouchableOpacity>
        </View>
    );
};

export default salesPage;
