import { View, Text, TextInput } from 'react-native'
import React, { memo } from 'react'

const SIProduct = ({ data }) => {
    const [qty, setQty] = React.useState(data.qty || 1);
    const [amount, setAmount] = React.useState(data.amount || 0);
    return (
        <View className="block w-full rounded-lg bg-white text-left p-2 my-2">
            <Text>{data.code || ""}</Text>
            <Text>{data.name || ""}</Text>
            <Text>{data.unit || ""}</Text>
            <TextInput placeholder="Quantity" inputMode="numeric" keyboardType="number-pad" value={`${qty}`} onChangeText={(text) => setQty(text)} />
            <TextInput placeholder="Amount" inputMode="decimal" keyboardType="number-pad" value={`${amount}`} onChangeText={(text) => setAmount(text)} />
        </View>
    )
}

export default memo(SIProduct)