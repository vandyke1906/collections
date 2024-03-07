import { View, TouchableOpacity, FlatList, TextInput, Modal, Text, Pressable, ToastAndroid } from 'react-native'
import FontAwesome from "@expo/vector-icons/FontAwesome";
import React, { useEffect, useState } from 'react'
import { ROUTES } from "../../../../common/common";
import { router, useNavigation } from "expo-router";
import { useQuery, useRealm } from "@realm/react";
import useSalesInvoiceStore from "../../../../store/salesInvoiceStore";
import CollectionCard from "../../../../components/CollectionCard";

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
        navigation.setOptions({ headerShown: true, title: "Collecations" });
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
                visible={showInvoiceModal}
                onRequestClose={() => {
                    setModalVisible(!modalVisible);
                }}>
                <View className="flex justify-center items-center">
                    <View className="border-r-2 h-full w-full">
                         <View className="relative">
                            <TextInput
                                className="my-2 p-2 appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                placeholder="Invoice Number"
                                value={invoiceNumber}
                                onChangeText={(text) => setInvoiceNumber(text)}
                            />
                            <TouchableOpacity className="absolute inset-y-0 right-0 flex items-center justify-center pr-4" onPress={() => {
                                const found = getSalesInvoiceDetails({ invoiceNo: invoiceNumber });
                                if (found)
                                    router.navigate({ pathname: ROUTES.COLLECTIONS_FORM });
                                else
                                    ToastAndroid.show(`Invoice#: ${invoiceNumber} not found.`, ToastAndroid.SHORT);
                            }}>
                                <FontAwesome size={18} name="arrow-right" color="gray" />
                            </TouchableOpacity>
                        </View>

                        <Pressable onPress={() => setShowInvoiceModal((prevState) => !prevState)}>
                            <Text>Hide Modal</Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>
        )
    }

    return (
        <View className="flex-1">

            <View className="items-center justify-center m-2">
                <TextInput
                    className="my-2 p-2 appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                    placeholder="Search by COR#, invoice#, customer..."
                    value={searchKey}
                    onChangeText={(text) => setSearchKey(text)}
                />
                <FlatList
                    className="w-full"
                    data={collections}
                    keyExtractor={(item) => item._id}
                    renderItem={({ item }) => (
                        <CollectionCard data={item} onEdt={() => router.navigate({ pathname: ROUTES.SALES_INVOICE_DETAILS, params: item })} enableButtons={false} onSelect={() => {
                            getSalesInvoiceDetails({ _id : item.salesInvoice?._id});
                            router.navigate(ROUTES.SALES_INVOICE_DETAILS);
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