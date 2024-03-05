import { View, Text, TextInput } from 'react-native'
import React, { memo } from 'react'

const SIProduct = ({ data, onQtyChange, onAmountChange }) => {
    const defaultQty = data.hasOwnProperty("qty") ? data.qty.toString() : "";
    const defaultAmount = data.hasOwnProperty("amount") ? data.amount.toString() : "";
    const [qty, setQty] = React.useState(defaultQty);
    const [amount, setAmount] = React.useState(defaultAmount);
    return (
        <View className="block w-full rounded-lg bg-white text-left p-2 my-2">
            <Text>{data.code || ""}</Text>
            <Text>{data.name || ""}</Text>
            <Text>{data.unit || ""}</Text>
            <TextInput placeholder="Quantity" keyboardType="number-pad" value={qty} onChangeText={(text) => {
                setQty(text);
                if (text && typeof onQtyChange === "function")
                    onQtyChange(text);
            }} />
            <TextInput placeholder="Amount" keyboardType="number-pad" value={amount} onChangeText={(text) => {
                setAmount(text);
                if (text && typeof onAmountChange === "function")
                    onAmountChange(text);
            }} />
        </View>
    )
}

export default memo(SIProduct)