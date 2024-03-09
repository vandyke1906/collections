import { View, Text, ScrollView, Keyboard, Pressable } from 'react-native';
import React, { useState } from 'react';
import { DATE_FORMAT, INVOICE_STATUS, formatAmount, formatDate, getDateValueOf, showDatePicker } from "src/common/common";
import { TextInput } from "react-native-paper";
import moment from "moment";
import { FontAwesome } from "@expo/vector-icons";

const ProductSummary = ({ product, data, onSearch }) => {
    const inputClass = "text-sm text-center appearance-none block bg-gray-200 text-gray-700 border border-gray-200 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500";
    let accQty = 0;
    let accAmount = 0;

    console.info(JSON.stringify(data, null, 2));

    const [dateFrom, setDateFrom] = useState(0);
    const [dateTo, setDateTo] = useState(0);

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
                        <Text className="text-xs">Qty</Text>
                    </View>
                    <View className="flex-1 flex-row items-center justify-center">
                        <Text className="text-xs">Amound</Text>
                    </View>
                </View>

                {(_data || []).map((item, index) => {

                    (item.products || []).forEach((p) => {
                        if (p.productId === product._id) {
                            accQty += p.qty;
                            accAmount += p.amount;
                        }
                    });

                    return (
                        <View key={index} className="flex border border-gray-200 py-1">
                            <View className="items-center justify-center pt-2">
                                <Text className="text-xs font-bold">{item.customerName}</Text>
                            </View>

                            <View className="flex flex-row items-center justify-between py-1">
                                <View className="flex-1 flex-row items-center justify-start pl-1">
                                    <Text className="text-xs">{item.invoiceNo}</Text>
                                </View>
                                <View className="flex-1 items-center justify-center">
                                    <Text className="text-xs">{formatDate(item.dateOfSI, { format: "DD-MMM-YYYY" }).toUpperCase()}</Text>
                                </View>
                                <View className="flex-1 items-center justify-end">
                                    <Text className={`text-xs text-gray-90`}>{accQty || 0}</Text>
                                </View>
                                <View className="flex-1 items-center justify-end pr-1">
                                    <Text className={`text-xs text-gray-90`}>{formatAmount(accAmount)}</Text>
                                </View>
                            </View>
                        </View>
                    );
                })}

                {/* FOOTER */}
                <View className="flex flex-row items-center justify-between border-t border-gray-400 pt-1 mt-1 bg-gray-200 pb-2">
                    <View className="flex-1 items-center justify-center">
                    </View>
                    <View className="flex-1 items-center justify-center">
                    </View>
                    <View className="flex-1 items-center justify-end">
                        <Text className="text-xs font-bold text-green-900">{accQty}</Text>
                    </View>
                    <View className="flex-1 items-center justify-end pr-1">
                        <Text className="text-xs font-bold text-green-900">{formatAmount(accAmount)}</Text>
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
                        showDatePicker({
                            date: getDateValueOf(value, { format: DATE_FORMAT }),
                            onChange: (event, date) => {
                                if (event.type === "set") {
                                    const startDate = moment(date).startOf("day").valueOf();
                                    setDateFrom(startDate);
                                }
                            }
                        });
                    }}>
                        <TextInput className={inputClass} placeholder="Start Date" value={formatDate(dateFrom, { format: "DD-MMM-YYYY" }).toUpperCase()} editable={false} />
                    </Pressable>
                </View>

                <View className="flex-1">
                    <Pressable className="flex-1" onPress={() => {
                        Keyboard.dismiss();
                        showDatePicker({
                            date: getDateValueOf(value, { format: DATE_FORMAT }),
                            onChange: (event, date) => {
                                if (event.type === "set") {
                                    const endDate = moment(date).endOf("day").valueOf();
                                    setDateTo(endDate);
                                }
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

export default ProductSummary;