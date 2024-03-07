import { View, Text, TouchableOpacity } from 'react-native'
import React, { memo } from 'react'
import PropTypes from "prop-types";

const Customer = ({ data, onEdit, enableButtons, onSelect, isActive }) => {
    return (
        <TouchableOpacity disabled={typeof onSelect !== "function"} onPress={() => typeof onSelect === "function" ? onSelect() : () => { }}>
            <View className={`block w-full rounded-lg bg-white text-left p-2 my-2 ${isActive ? "bg-blue-100" : "bg-white"}`}>
                <View className="p-2">
                    {data?.code && <Text className="block font-sans text-sm antialiased font-normal leading-normal text-gray-700 opacity-75">{data.code}</Text>}
                    {data?.name && <Text className="block font-sans text-base antialiased font-medium leading-relaxed text-blue-gray-900">{data.name}</Text>}
                    {data?.address && <Text className="block font-sans text-sm antialiased font-normal leading-normal text-gray-700 opacity-75">{data.address}</Text>}
                </View>
                {enableButtons && (
                    <View className="flex flex-row items-center justify-end border-t-2 border-neutral-100 font-sans text-sm antialiased font-normal leading-normal text-gray-700 opacity-75">
                        <TouchableOpacity onPress={onEdit}>
                            <Text className="pointer-events-auto mr-5 inline-block cursor-pointer rounded text-base font-normal leading-normal text-blue-700">Edit</Text>
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
    onSelect: PropTypes.func,
    enableButtons: PropTypes.bool,
    isActive: PropTypes.bool,
};

Customer.defaultProps = {
    onEdit: () => {}
};

export default memo(Customer)