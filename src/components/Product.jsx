import { View, Text, TouchableOpacity } from 'react-native'
import React, { memo } from 'react'
import PropTypes from "prop-types";

const Product = ({ data, onEdit, enableButtons, onSelect, isActive }) => {
    return (
        <TouchableOpacity disabled={typeof onSelect !== "function"} onPress={() => typeof onSelect === "function" ? onSelect() : () => { }}>
            <View className={`block w-full rounded-lg text-left p-2 my-2 ${isActive ? "bg-blue-100" : "bg-white"}`}>
                <View className="p-4">
                    <View className="flex flex-row items-e justify-between mb-2">
                        <View className="block font-sans text-sm antialiased font-normal leading-normal text-gray-700 opacity-75">
                            <Text>{data?.code || ""}</Text>
                        </View>
                        <View className="block font-sans text-sm antialiased font-normal leading-normal text-gray-700 opacity-75">
                            <Text>({data?.unit || ""})</Text>
                        </View>
                    </View>
                    <Text className="block font-sans text-base antialiased font-medium leading-relaxed text-blue-gray-900">{data?.name || ""}</Text>
                </View>
                <View className="flex flex-row items-center justify-between border-t-2 border-neutral-100 font-sans text-sm antialiased font-normal leading-normal text-gray-700 opacity-75">
                        <View className="block font-sans text-sm antialiased font-normal leading-normal text-gray-700 opacity-75">
                            <Text>{data?.group || ""}</Text>
                        </View>
                        {enableButtons && <TouchableOpacity onPress={onEdit}>
                            <Text className="pointer-events-auto mr-5 inline-block cursor-pointer rounded text-base font-normal leading-normal text-blue-700">Edit</Text>
                        </TouchableOpacity>}
                </View>
            </View>
        </TouchableOpacity>
  )
}

Product.propTypes = {
    data: PropTypes.shape({
        id: PropTypes.string,
        code: PropTypes.string,
        name: PropTypes.string.isRequired,
        unit: PropTypes.string.isRequired,
        group: PropTypes.string,
    }).isRequired,
    onEdit: PropTypes.func,
    onSelect: PropTypes.func,
    enableButtons: PropTypes.bool,
    isActive: PropTypes.bool,
};

Product.defaultProps = {
    onEdit: () => {}
};

export default memo(Product)