import { View, Text } from 'react-native'
import React from 'react'

const Product = (props) => {
  return (
    <View className="p-2">
          <Text>{props.data?.name || ""}</Text>
    </View>
  )
}

export default Product