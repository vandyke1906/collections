import { View, Text } from 'react-native'
import React, { memo } from 'react'

const Product = (props) => {
  return (
    <View className="w-full bg-gray-50 rounded-3xl p-5 my-2 border-black">
          <Text>{props.data?.name || ""}</Text>
    </View>
  )
}

export default memo(Product)