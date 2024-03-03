import { View, Text } from 'react-native'
import React, { memo } from 'react'

const Product = (props) => {
  return (
    <View className="p-2">
          <Text>{props.data?.name || ""}</Text>
    </View>
  )
}

export default memo(Product)