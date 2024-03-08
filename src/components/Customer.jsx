import { View, Text, TouchableOpacity } from 'react-native'
import React, { memo } from 'react'
import PropTypes from "prop-types";

const Customer = ({ data, onEdit, enableButtons, onSelect, isActive, onDelete }) => {
    return (
        <TouchableOpacity disabled={typeof onSelect !== "function"} onPress={() => typeof onSelect === "function" ? onSelect() : () => { }}>
            <View className={`block w-full rounded-lgbg-white text-left p-2 my-2 ${isActive ? "bg-blue-100" : "bg-white"}`}>
                <View className="p-2">
                    {data?.code && <Text className="block font-sans text-xs antialiased font-normal leading-normal text-gray-700 opacity-75">{data.code}</Text>}
                    {data?.name && <Text className="block font-sans text-xs antialiased font-medium leading-relaxed text-blue-gray-900">{data.name}</Text>}
                    {data?.address && <Text className="block font-sans  text-xs antialiased font-normal leading-normal text-gray-700 opacity-75">{data.address}</Text>}
                </View>
                {enableButtons && (
                    <View className="pt-2 flex flex-row items-center justify-between border-t-2 border-neutral-100 font-sans text-xs antialiased font-normal leading-normal text-gray-700 opacity-75">
                        <TouchableOpacity className="flex items-center justify-center" onPress={onEdit}>
                            <Text className="pointer-events-auto px-5 inline-block cursor-pointer rounded text-sm font-normal leading-normal text-blue-700">Edit</Text>
                        </TouchableOpacity>
                         <TouchableOpacity className="flex items-center justify-center" onPress={onDelete}>
                            <Text className="pointer-events-auto px-5 inline-block cursor-pointer rounded text-sm font-normal leading-normal text-red-700">Delete</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </View>
    </TouchableOpacity>
  )
}

Customer.propTypes = {
    data: PropTypes.shape({
        id: PropTypes.string,
        code: PropTypes.string,
        name: PropTypes.string.isRequired,
        address: PropTypes.string,
    }).isRequired,
    onEdit: PropTypes.func,
    onDelete: PropTypes.func,
    onSelect: PropTypes.func,
    enableButtons: PropTypes.bool,
    isActive: PropTypes.bool,
};

Customer.defaultProps = {
    onEdit: () => {},
    onDelete: () => {}
};

export default memo(Customer)