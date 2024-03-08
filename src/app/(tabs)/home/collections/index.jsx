import { View, TouchableOpacity, FlatList, TextInput, Modal, Text, Pressable, ToastAndroid } from 'react-native'
import FontAwesome from "@expo/vector-icons/FontAwesome";
import React, { useEffect, useState } from 'react'
import { router, useNavigation } from "expo-router";
import { useQuery, useRealm } from "@realm/react";
import { ROUTES } from "src/common/common";
import useSalesInvoiceStore from "src/store/salesInvoiceStore";
import CollectionCard from "src/components/CollectionCard";

const collections = () => {
    const navigation = useNavigation();
    const realm = useRealm();

    const [searchKey, setSearchKey] = useState("");
    const [invoiceNumber, setInvoiceNumber] = useState("");
    const [showInvoiceModal, setShowInvoiceModal] = useState(false);
    const setSelectedInvoice = useSalesInvoiceStore(state => state.setSelected);

    const collections = useQuery("collections", (col) => {
        return col.filtered("corNo BEGINSWITH[c] $0 || details.invoiceNo BEGINSWITH[c] $0 || details.customerName CONTAINS[c] $0", searchKey).sorted("corDate");
    }, [searchKey]);
    const fetchMoreData = () => { };

    useEffect(() => {
        navigation.setOptions({ headerShown: true, title: "Collections" });
    }, [navigation]);


    const getSalesInvoiceDetails = ({ _id, invoiceNo = "" }) => {
        let salesInvoice;
        if (_id)
            salesInvoice = realm.objectForPrimaryKey("salesInvoices", _id);
        else if (invoiceNo)
            salesInvoice = realm.objects("salesInvoices").find((s) => s.invoiceNo.toUpperCase() === invoiceNo.toUpperCase());

        if (salesInvoice) {
            const customer = realm.objectForPrimaryKey("customers", salesInvoice.customerId);
            const siProducts = salesInvoice.products.map((p) => realm.objectForPrimaryKey("salesProducts", p._id));
            customer.customerId = customer._id;
            delete customer._id;
            setSelectedInvoice({ ...customer, ...salesInvoice, products: siProducts });
        }
        return !!salesInvoice;
    }

    const renderShowModalInvocie = () => {
        return (
            <Modal
                animationType="fade"
                transparent={false}
                visible={showInvoiceModal}>
                <View className="flex justify-center items-center h-full bg-slate-300">
                    <View className="shadow-md drop-shadow-sm rounded-md ring-1 w-11/12 p-5 bg-white">
                         <View className="relative">
                            <TextInput
                                className="text-sm pr-20 my-2 p-2 appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                placeholder="Invoice Number"
                                value={invoiceNumber}
                                onChangeText={(text) => setInvoiceNumber(text)}
                            />
                            <TouchableOpacity className="absolute inset-y-0 right-0 flex items-center justify-center pr-10" onPress={() => {
                                const found = getSalesInvoiceDetails({ invoiceNo: invoiceNumber });
                                if (found) {
                                    setShowInvoiceModal(false);
                                    setInvoiceNumber("");
                                    router.push({ pathname: ROUTES.COLLECTIONS_FORM });
                                }
                                else
                                    ToastAndroid.show(`Invoice#: ${invoiceNumber} not found.`, ToastAndroid.SHORT);
                            }}>
                                <FontAwesome size={18} name="arrow-right" color="green" />
                            </TouchableOpacity>

                            <TouchableOpacity className="absolute inset-y-0 right-0 flex items-center justify-center pr-4" onPress={() => {
                                    setShowInvoiceModal(false);
                                    setInvoiceNumber("");
                            }}>
                                <FontAwesome size={18} name="times" color="gray" />
                            </TouchableOpacity>

                        </View>
                    </View>
                </View>
            </Modal>
        )
    }

    return (
        <View className="flex-1 mb-5">
            <View className="items-center justify-center m-2">
                <TextInput
                    className="text-sm my-2 p-2 appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                    placeholder="Search by COR#, invoice#, customer..."
                    value={searchKey}
                    onChangeText={(text) => setSearchKey(text)}
                />
                <FlatList
                    showsVerticalScrollIndicator={false}
                    className="w-full"
                    data={collections}
                    keyExtractor={(item) => item._id}
                    renderItem={({ item }) => (
                        <CollectionCard data={item} onEdt={() => router.push({ pathname: ROUTES.SALES_INVOICE_DETAILS, params: item })} enableButtons={false} onSelect={() => {
                            getSalesInvoiceDetails({ _id : item.salesInvoice?._id});
                            router.push(ROUTES.SALES_INVOICE_DETAILS);
                        }} />
                    )}
                    onEndReached={fetchMoreData}
                    onEndReachedThreshold={0.1}
                    />
            </View>

            {renderShowModalInvocie()}

            <TouchableOpacity
                className="bg-blue-700 w-14 h-14 rounded-full flex justify-center items-center"
                style={{
                    position: "absolute",
                    bottom: 30,
                    right: 15
                }}
                onPress={() => {
                    setShowInvoiceModal(true);
                }}
            >
                <FontAwesome size={20} name="plus" color="white" />
            </TouchableOpacity>
        </View>
    );
}

export default collections