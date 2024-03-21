import { View, TouchableOpacity, TextInput, FlatList, StatusBar } from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import React, { useEffect, useState } from "react";
import { router, useNavigation } from "expo-router";
import moment from "moment";
import { useQuery, useRealm } from "@realm/react";
import { ROUTES } from "src/common/common";
import SalesInvoiceCard from "src/components/SalesInvoiceCard";
import useSalesInvoiceStore from "src/store/salesInvoiceStore";
import useUserData from "src/store/userDataStore";

const salesPage = () => {
    const navigation = useNavigation();
    const realm = useRealm();

    const [searchKey, setSearchKey] = useState("");
    const { setSelected: setSelectedInvoice } = useSalesInvoiceStore();
    const { currentYear } = useUserData();

    const dataList = useQuery("salesInvoices", (col) => {
        const currentStartDate = moment(currentYear, "YYYY").startOf("year").valueOf();
        const currentEndDate = moment(currentYear, "YYYY").endOf("year").valueOf();
        const statusRegex = /^#STATUS:(PAID|UNPAID|PARTIAL)$/i;
        if (statusRegex.test(searchKey)) {
            const status = searchKey.toUpperCase().match(/(PAID|UNPAID|PARTIAL)/)[0];
            switch (status) {
                case "PAID":
                    return col.filtered("unpaidAmount == 0").sorted("dateOfSI");
                case "UNPAID":
                    return col.filtered("totalAmount == unpaidAmount").sorted("dateOfSI");
                case "PARTIAL":
                    return col.filtered("unpaidAmount < totalAmount ").sorted("dateOfSI");
                default:
                    break;
            }
        }
        return col.filtered("(invoiceNo BEGINSWITH[c] $0 || poNo BEGINSWITH[c] $0 || soNo BEGINSWITH[c] $0 || customerName CONTAINS[c] $0) &&dateOfSI BETWEEN { $1 , $2 }", searchKey, currentStartDate, currentEndDate).sorted("dateOfSI");
    }, [searchKey]);

    useEffect(() => {
        navigation.setOptions({
            headerShown: true,
            title: `${currentYear} Sales Invoices (${dataList.length})`,
            // headerRight: () => (
            //     <TouchableOpacity className="py-3 pl-10 pr-2" onPress={() => { }}>
            //         <FontAwesome size={18} name="filter" />
            //     </TouchableOpacity>
            // ),
        });
    }, [navigation, dataList]);

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
                    placeholder="Search by invoice #, customer, PO #, SO #, #STATUS:PAID|UNPAID|PARTIAL..."
                    value={searchKey}
                    onChangeText={(text) => setSearchKey(text.toUpperCase())}
                />
                <FlatList
                    className="w-full"
                    data={dataList}
                    keyExtractor={(item) => item._id}
                    renderItem={({ item }) => (
                        <SalesInvoiceCard
                            data={item}
                            onEdit={() => router.push({ pathname: ROUTES.SALES_INVOICE_DETAILS, params: item })}
                            enableButtons={false}
                            onSelect={() => {
                                getSalesInvoiceDetails(item);
                                router.push(ROUTES.SALES_INVOICE_DETAILS);
                            }}
                        />
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
                    right: 15,
                }}
                onPress={() => {
                    router.push({
                        pathname: ROUTES.SALES_FORM,
                        params: { key: moment().valueOf(), type: "clearList" },
                    });
                }}
            >
                <FontAwesome size={20} name="plus" color="white" />
            </TouchableOpacity>

            <StatusBar style="auto" />
        </View>
    );
};

export default salesPage;
