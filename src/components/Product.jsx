import { View, Text } from 'react-native'
import React, { memo } from 'react'

const Product = ({data}) => {
    return (
    <View className="block w-full rounded-lg bg-white text-left p-2 my-2">
        <View className="p-6">
            <Text className="text-base font-medium leading-tight text-neutral-500 dark:text-neutral-50">{data?.code || ""} ({data?.unit || ""})</Text>
            <Text className="text-base leading-normal text-neutral-600 dark:text-neutral-200">{data?.name || ""}</Text>
        </View>
        {data.group &&
        (<View className="border-t-2 border-neutral-100 px-6 py-2 dark:border-neutral-600 dark:text-neutral-5">
            <Text>{data?.group || ""}</Text>
        </View>)
        }
    </View>
  )
}

export default memo(Product)