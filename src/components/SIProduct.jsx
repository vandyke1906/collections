import { View, Text, TextInput } from 'react-native';
import React, { memo } from 'react';

const SIProduct = ({ data, onQtyChange, onAmountChange }) => {
    const inputClass = "text-sm p-1 appearance-none block bg-gray-50 text-gray-700 border border-gray-100 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500";

    const defaultQty = data.hasOwnProperty("qty") ? data.qty.toString() : "";
    const defaultAmount = data.hasOwnProperty("amount") ? data.amount.toString() : "";
    const [qty, setQty] = React.useState(defaultQty);
    const [amount, setAmount] = React.useState(defaultAmount);
    return (
        <View className="block w-full rounded-lg bg-white text-left p-2 my-2">
            <Text className="mb-2 block font-sans text-sm antialiased leading-normal text-gray-900 font-bold">{data.name || ""}</Text>
            <View className="flex flex-row items-center justify-between">
                {!!data?.code && (
                    <View className="flex flex-row">
                        <Text className="block font-sans text-xs antialiased font-normal leading-normal text-gray-700 opacity-75">Code: </Text>
                        <Text className="block font-sans text-xs antialiased font-bold leading-normal text-gray-700 opacity-75">{data.code}</Text>
                    </View>
                )}

                {!!data?.unit && (
                    <View className="flex flex-row">
                        <Text className="block font-sans text-xs antialiased font-normal leading-normal text-gray-700 opacity-75">Unit: </Text>
                        <Text className="block font-sans text-xs antialiased font-bold leading-normal text-gray-700 opacity-75">{data.unit}</Text>
                    </View>
                )}
            </View>

            <View className="flex flex-row items-center justify-between mt-2">
                <View className="flex flex-row items-center justify-center flex-1 mx-2">
                    <Text className="block font-sans text-xs antialiased font-normal leading-normal text-gray-700 opacity-75">Qty: </Text>
                    <TextInput className={`${inputClass} grow`} placeholder="Quantity" keyboardType="numeric" value={qty} onChangeText={(text) => {
                        setQty(text);
                        if (text && typeof onQtyChange === "function")
                            onQtyChange(text);
                    }} />
                </View>

                <View className="flex flex-row items-center justify-center flex-1 mx-2">
                    <Text className="block font-sans text-xs antialiased font-normal leading-normal text-gray-700 opacity-75">Amount: </Text>
                    <TextInput className={`${inputClass} text-right grow`} placeholder="Amount" keyboardType="numeric" value={amount} onChangeText={(text) => {
                        setAmount(text);
                        if (text && typeof onAmountChange === "function")
                            onAmountChange(text);
                    }} />
                </View>

            </View>
        </View>
    );
};

export default memo(SIProduct);