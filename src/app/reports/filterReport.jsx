import { View, Text, TouchableOpacity, TouchableWithoutFeedback, TextInput, Keyboard, ScrollView, ToastAndroid } from 'react-native';
import React, { useEffect, useState } from 'react';
import { router, useNavigation } from "expo-router";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { DATE_FORMAT, REPORT_TYPE, ROUTES, formatDate, getDateValueOf, showDatePicker } from "../../common/common";
import { Picker } from "@react-native-picker/picker";
import moment from "moment";
import useReportStore from "../../store/reportStore";
import { useRoute } from '@react-navigation/native';
import useSelection from "../../store/selectionStore";
import MiniCardData from "../../components/MiniCardData";

const filterReport = () => {
    const inputClass = "my-2 p-2 appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500";

    const navigation = useNavigation();
    const route = useRoute();
    const params = route.params || {};
    const {
        reportType, setReportType, clearSummary,
        dateFrom, setDateFrom, dateTo, setDateTo,
        setGroups, groups, removeGroup,
        setProducts, products, removeProduct,
        setCustomers, customers, removeCustomer,
        setSalesInvoices, salesInvoices, removeSalesInvoice,

    } = useReportStore();
    const { selections, resetSelection, setSelections } = useSelection();

    useEffect(() => {
        navigation.setOptions({
            headerShown: true,
            title: "Filter Reports",
            headerRight: () => (
                <TouchableOpacity onPress={() => {
                    if (!dateFrom) {
                        ToastAndroid.show("Date from is required.", ToastAndroid.SHORT);
                        return;
                    }
                    clearSummary();
                    router.navigate({ pathname: ROUTES.VIEW_REPORT })
                }}>
                    <FontAwesome size={18} name="check" color="green" />
                </TouchableOpacity>
            ),
        });
    }, [navigation, dateFrom]);

    useEffect(() => {
        switch (params.type) {
            case "groupList": {
                setGroups(selections);
                resetSelection();
                break;
            }
            case "productList": {
                setProducts(selections);
                resetSelection();
                break;
            }
            case "customerList": {
                setCustomers(selections);
                resetSelection();
                break;
            }
            case "salesInvoiceList": {
                setSalesInvoices(selections);
                resetSelection();
                break;
            }
        }
    }, [params?.key]);

    return (
        <ScrollView>
            <View className="mt-5 p-2">
                <View className="">

                    <Text className="text-slate-500">Type</Text>
                    <Picker selectedValue={reportType} onValueChange={setReportType}>
                        {Object.keys(REPORT_TYPE).map((objKey) => (
                            <Picker.Item key={objKey} value={REPORT_TYPE[objKey]} label={objKey} />
                        ))}
                    </Picker>
                </View>

                <View className="bg-gray-100 rounded-lg p-2">
                    <Text className="text-slate-500 my-2">Date Range</Text>

                    <TouchableWithoutFeedback onPress={() => {
                        Keyboard.dismiss();
                        showDatePicker((event, date) => {
                            if (event.type === "set") {
                                const startDate = moment(date).startOf("day").valueOf();
                                setDateFrom(startDate);
                            }
                        });
                    }}>
                        <View>
                            <Text className="text-slate-500 mx-2">From: </Text>
                            <TextInput className={inputClass} placeholder="Start Date" value={formatDate(dateFrom)} editable={false} />
                        </View>
                    </TouchableWithoutFeedback>

                    <TouchableWithoutFeedback onPress={() => {
                        Keyboard.dismiss();
                        showDatePicker((event, date) => {
                            if (event.type === "set") {
                                const endDate = moment(date).endOf("day").valueOf();
                                setDateFrom(endDate);
                            }
                                setDateTo(getDateValueOf(date));
                        });
                    }}>
                        <View>
                            <Text className="text-slate-500 mx-2">To: </Text>
                            <TextInput className={inputClass} placeholder="End Date" value={formatDate(dateTo)} editable={false} />
                        </View>
                    </TouchableWithoutFeedback>
                </View>

                {/* CUSTOMERS */}
                <View className="mt-2 mb-10 flex border-t border-gray-300">
                    <View className="flex flex-row items-center justify-between">
                        <Text className="mx-2 block font-sans text-sm antialiased leading-normal text-gray-500 uppercase">Customers</Text>
                        <TouchableOpacity onPress={() => {
                            setSelections(customers);
                            router.navigate({ pathname: ROUTES.CUSTOMER_SELECTION, params: { multipleSelect: 1 } });
                        }}>
                            <Text className="pointer-events-auto inline-block cursor-pointer rounded text-base font-normal leading-normal text-blue-700 uppercase">Select Customer</Text>
                        </TouchableOpacity>
                    </View>

                    <View className="flex flex-wrap flex-row">
                        {customers.map((item, index) => (
                            <MiniCardData key={index} parentClass="flex space-x-2 m-1 text-xs font-medium text-center text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-full text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700">
                                <View className="flex flex-row">
                                    <Text className="block font-sans text-sm antialiased leading-normal text-gray-500 uppercase">{item.name}</Text>
                                    <TouchableOpacity className="ml-2" onPress={() => {
                                        removeCustomer(item._id);
                                    }}>
                                        <FontAwesome size={18} name="times" color="gray" />
                                    </TouchableOpacity>
                                </View>
                            </MiniCardData>
                        ))}
                    </View>
                </View>

                {reportType === REPORT_TYPE.SALES && (
                    <View>
                        {/* GROUPS */}
                        <View className="mt-2 mb-10 flex border-t border-gray-300">
                            <View className="flex flex-row items-center justify-between">
                                <Text className="mx-2 block font-sans text-sm antialiased leading-normal text-gray-500 uppercase">Groups</Text>
                                <TouchableOpacity onPress={() => {
                                    setSelections(groups);
                                    router.navigate({ pathname: ROUTES.GROUP_SELECTION, params: { multipleSelect: 1 } });
                                }}>
                                    <Text className="pointer-events-auto inline-block cursor-pointer rounded text-base font-normal leading-normal text-blue-700 uppercase">Select Group</Text>
                                </TouchableOpacity>
                            </View>

                            <View className="flex flex-wrap flex-row">
                                {groups.map((item, index) => (
                                    <MiniCardData key={index} parentClass="flex space-x-2 m-1 text-xs font-medium text-center text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-full text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700">
                                        <View className="flex flex-row">
                                            <Text className="block font-sans text-sm antialiased leading-normal text-gray-500 uppercase">{item._id}</Text>
                                            <TouchableOpacity className="ml-2" onPress={() => {
                                                removeGroup(item._id);
                                            }}>
                                                <FontAwesome size={18} name="times" color="gray" />
                                            </TouchableOpacity>
                                        </View>
                                    </MiniCardData>
                                ))}
                            </View>
                        </View>

                        {/* PRODUCTS */}
                        <View className="mt-2 mb-10 flex border-t border-gray-300">
                            <View className="flex flex-row items-center justify-between">
                                <Text className="mx-2 block font-sans text-sm antialiased leading-normal text-gray-500 uppercase">Products</Text>
                                <TouchableOpacity onPress={() => {
                                    setSelections(products);
                                    router.navigate({ pathname: ROUTES.PRODUCT_SELECTION, params: { multipleSelect: 1 } });
                                }}>
                                    <Text className="pointer-events-auto inline-block cursor-pointer rounded text-base font-normal leading-normal text-blue-700 uppercase">Select Product</Text>
                                </TouchableOpacity>
                            </View>

                            <View className="flex flex-wrap flex-row">
                                {products.map((item, index) => (
                                    <MiniCardData key={index} parentClass="flex space-x-2 m-1 text-xs font-medium text-center text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-full text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700">
                                        <View className="flex flex-row">
                                            <Text className="block font-sans text-sm antialiased leading-normal text-gray-500 uppercase">{item.name}</Text>
                                            <TouchableOpacity className="ml-2" onPress={() => {
                                                removeProduct(item._id);
                                            }}>
                                                <FontAwesome size={18} name="times" color="gray" />
                                            </TouchableOpacity>
                                        </View>
                                    </MiniCardData>
                                ))}
                            </View>
                        </View>

                    </View>
                )}

                {reportType === REPORT_TYPE.COLLECTIONS && (
                    <View>
                        {/* SALES INVOICE */}
                        <View className="mt-2 mb-10 flex border-t border-gray-300">
                            <View className="flex flex-row items-center justify-between">
                                <Text className="mx-2 block font-sans text-sm antialiased leading-normal text-gray-500 uppercase">Invoices</Text>
                                <TouchableOpacity onPress={() => {
                                    setSelections(salesInvoices);
                                    router.navigate({ pathname: ROUTES.SALES_INVOICE_SELECTION, params: { multipleSelect: 1 } });
                                }}>
                                    <Text className="pointer-events-auto inline-block cursor-pointer rounded text-base font-normal leading-normal text-blue-700 uppercase">Select Invoices</Text>
                                </TouchableOpacity>
                            </View>

                            <View className="flex flex-wrap flex-row">
                                {salesInvoices.map((item, index) => (
                                    <MiniCardData key={index} parentClass="flex space-x-2 m-1 text-xs font-medium text-center text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-full text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700">
                                        <View className="flex flex-row">
                                            <Text className="block font-sans text-sm antialiased leading-normal text-gray-500 uppercase">{item.invoiceNo}</Text>
                                            <TouchableOpacity className="ml-2" onPress={() => {
                                                removeSalesInvoice(item._id);
                                            }}>
                                                <FontAwesome size={18} name="times" color="gray" />
                                            </TouchableOpacity>
                                        </View>
                                    </MiniCardData>
                                ))}
                            </View>
                        </View>
                    </View>
                )}

            </View>
        </ScrollView>
    );
};

export default filterReport;