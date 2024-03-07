import { View } from 'react-native'
import React, { memo } from 'react'

const MiniCardData = (props) => {
    return (
        <View className={props.parentClass || ""}>
                {props.children}
        </View>
  )
}

export default memo(MiniCardData)