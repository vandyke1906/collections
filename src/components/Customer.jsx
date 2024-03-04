import { View, Text, TouchableOpacity } from 'react-native'
import React, { memo } from 'react'
import PropTypes from "prop-types";

const Customer = ({data, onEdit }) => {
    return (
    <View className="block w-full rounded-lg bg-white text-left p-2 my-2">
        <View className="p-4">
            <Text className="block font-sans text-base antialiased font-medium leading-relaxed text-blue-gray-500">{data?.code || ""}</Text>
            <Text className="block font-sans text-base antialiased font-medium leading-relaxed text-blue-gray-900">{data?.name || ""}</Text>
            <Text className="block text-gray-700 text-base">{data?.address || ""}</Text>
        </View>
        <View className="flex flex-row items-center justify-end border-t-2 border-neutral-100 font-sans text-sm antialiased font-normal leading-normal text-gray-700 opacity-75">
                <TouchableOpacity onPress={onEdit}>
                    <Text className="pointer-events-auto mr-5 inline-block cursor-pointer rounded text-base font-normal leading-normal text-blue-700">Edit</Text>
                </TouchableOpacity>

        </View>
    </View>
  )
}

Customer.propTypes = {
    data: PropTypes.shape({
        id: PropTypes.string,
        code: PropTypes.string,
        name: PropTypes.string.isRequired,
        address: PropTypes.string,
    }).isRequired,
    onEdit: PropTypes.func
};

Customer.defaultProps = {
    onEdit: () => {}
};

export default memo(Customer)