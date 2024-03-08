import { View, Text, ScrollView, Keyboard, Pressable } from 'react-native';
import React, { useState } from 'react';
import { INVOICE_STATUS, formatAmount, formatDate, showDatePicker } from "src/common/common";
import { TextInput } from "react-native-paper";
import moment from "moment";
import { FontAwesome } from "@expo/vector-icons";

const InvoiceSummary = ({ data, onSearch }) => {
    const inputClass = "text-sm text-center appearance-none block bg-gray-200 text-gray-700 border border-gray-200 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500";
    let accPaidAmount = 0;
    let accUnpaidAmount = 0;

    const [dateFrom, setDateFrom] = useState(0);
    const [dateTo, setDateTo] = useState(0);

    const getStatus = (paid, unpaid) => {
        if (!unpaid) return INVOICE_STATUS.PAID;
        else if (!paid) return INVOICE_STATUS.UNPAID;
        else return INVOICE_STATUS.PARTIAL;
    };

    const renderTable = (_data) => {
        return (
            <View className="mt-2">
                <View className="flex flex-row items-center justify-between border-b border-gray-400 pb-1 mb-1 bg-gray-200 pt-2">
                    <View className="flex-1 flex-row items-center justify-center">
                        <Text className="text-xs">SI #</Text>
                    </View>
                    <View className="flex-1 flex-row items-center justify-center">
                        <Text className="text-xs">SI Date</Text>
                    </View>
                    <View className="flex-1 flex-row items-center justify-center">
                        <Text className="text-xs">Status</Text>
                    </View>
                    <View className="flex-1 flex-row items-center justify-center">
                        <Text className="text-xs">Paid</Text>
                    </View>
                    <View className="flex-1 flex-row items-center justify-center">
                        <Text className="text-xs">Balance</Text>
                    </View>
                </View>

                {(_data || []).map((item, index) => {
                    const paidAmount = item.totalAmount - item.unpaidAmount;

                    accPaidAmount += +paidAmount;
                    accUnpaidAmount += +item.unpaidAmount;
                    return (
                        <View key={index} className="flex flex-row items-center justify-between py-1">
                            <View className="flex-1 flex-row items-center justify-start pl-1">
                                <Text className="text-xs">{item.invoiceNo}</Text>
                            </View>
                            <View className="flex-1 flex-row items-center justify-center">
                                <Text className="text-xs">{formatDate(item.dateOfSI, { format: "DD-MMM-YYYY" }).toUpperCase()}</Text>
                            </View>
                            <View className="flex-1 flex-row items-center justify-center">
                                <Text className="text-xs">{getStatus(paidAmount, item.unpaidAmount)}</Text>
                            </View>
                            <View className="flex-1 flex-row items-center justify-end">
                                <Text className={`text-xs ${!item.paidAmount ? "text-red-900" : "text-green-900"}`}>{formatAmount(paidAmount)}</Text>
                            </View>
                            <View className="flex-1 flex-row items-center justify-end pr-1">
                                <Text className={`text-xs ${item.unpaidAmount ? "text-red-900" : "text-green-900"}`}>{formatAmount(item.unpaidAmount)}</Text>
                            </View>
                        </View>
                    );
                })}

                {/* FOOTER */}
                <View className="flex flex-row items-center justify-between border-t border-gray-400 pt-1 mt-1 bg-gray-200 pb-2">
                    <View className="flex-1 flex-row items-center justify-center">
                    </View>
                    <View className="flex-1 flex-row items-center justify-center">
                    </View>
                    <View className="flex-1 flex-row items-center justify-center">
                    </View>
                    <View className="flex-1 flex-row items-center justify-end">
                        <Text className={`text-xs font-bold ${!accPaidAmount ? "text-red-900" : "text-green-900"}`}>{formatAmount(accPaidAmount)}</Text>
                    </View>
                    <View className="flex-1 flex-row items-center justify-end pr-1">
                        <Text className={`text-xs font-bold ${accUnpaidAmount ? "text-red-900" : "text-green-900"}`}>{formatAmount(accUnpaidAmount)}</Text>
                    </View>
                </View>

            </View>
        );
    };

    const renderDateRange = () => {
        return (
            <View className="flex flex-row items-center justify-center bg-gray-100 rounded-lg p-2">
                <View className="flex pr-2">
                    <Text className="text-xs text-slate-500 my-2">Date Range</Text>
                </View>

                <View className="flex-1 mr-2">
                    <Pressable className="flex-1" onPress={() => {
                        Keyboard.dismiss();
                        showDatePicker((event, date) => {
                            if (event.type === "set") {
                                const startDate = moment(date).startOf("day").valueOf();
                                setDateFrom(startDate);
                            }
                        });
                    }}>
                        <TextInput className={inputClass} placeholder="Start Date" value={formatDate(dateFrom, { format: "DD-MMM-YYYY" }).toUpperCase()} editable={false} />
                    </Pressable>
                </View>

                <View className="flex-1">
                    <Pressable className="flex-1" onPress={() => {
                        Keyboard.dismiss();
                        showDatePicker((event, date) => {
                            if (event.type === "set") {
                                const endDate = moment(date).endOf("day").valueOf();
                                setDateTo(endDate);
                            }
                        });
                    }}>
                        <TextInput className={inputClass} placeholder="End Date" value={formatDate(dateTo, { format: "DD-MMM-YYYY" }).toUpperCase()} editable={false} />
                    </Pressable>
                </View>

                <View className="flex p-5">
                    <Pressable onPress={() => typeof onSearch === "function" && onSearch(dateFrom, dateTo)}>
                        <FontAwesome size={18} name="search" color="gray" />
                    </Pressable>
                </View>

            </View>
        );
    };

    return (
        <ScrollView showsVerticalScrollIndicator={false}>
            {renderDateRange()}
            {renderTable(data)}
        </ScrollView>
    );
};

export default InvoiceSummary;