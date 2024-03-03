import { View, Text } from 'react-native'
import React, { memo } from 'react'

const Product = ({data}) => {
    return (
    <View className="block w-full rounded-lg bg-white text-left p-2 my-2">
        <View className="p-4">
            <View className="flex flex-row items-center justify-between mb-2">
                <View className="block font-sans text-sm antialiased font-normal leading-normal text-gray-700 opacity-75">
                    <Text>{data?.code || ""}</Text>
                </View>
                <View className="block font-sans text-sm antialiased font-normal leading-normal text-gray-700 opacity-75">
                    <Text>({data?.unit || ""})</Text>
                </View>
            </View>
            <Text className="block font-sans text-base antialiased font-medium leading-relaxed text-blue-gray-900">{data?.name || ""}</Text>
        </View>
        {data.group &&
        (<View className="border-t-2 border-neutral-100 px-6 py-3 font-sans text-sm antialiased font-normal leading-normal text-gray-700 opacity-75">
            <Text>{data?.group || ""}</Text>
        </View>)
        }
    </View>
  )
}

export default memo(Product)