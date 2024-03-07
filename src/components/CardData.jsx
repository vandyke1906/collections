import { View, Text } from 'react-native'
import React, { memo } from 'react'

const CardData = (props) => {
    return (
      <View className={`block w-full rounded-lg bg-white text-left p-2 my-2`}>
            <View className="p-2">
                {props.children}
        </View>
    </View>
  )
}

export default memo(CardData)