import { View, Text, TouchableOpacity } from 'react-native';
import React, { memo } from 'react';
import PropTypes from "prop-types";

const Product = ({ data, onEdit, enableButtons, onSelect, isActive, onDelete }) => {
    return (
        <View className={`block w-full rounded-lg text-left p-2 my-2 ${isActive ? "bg-blue-100" : "bg-white"}`}>
            <TouchableOpacity disabled={typeof onSelect !== "function"} onPress={() => typeof onSelect === "function" ? onSelect() : () => { }}>
                <View className="p-2">
                    <Text className="mb-2 block font-sans text-xs antialiased font-bold leading-normal text-gray-900">{data?.name || ""}</Text>
                    {!!data?.code && <Text className="block font-sans text-xs antialiased font-xs leading-normal text-gray-700 opacity-75">Code: {data.code}</Text>}
                    {!!data?.unit && <Text className="block font-sans text-xs antialiased font-xs leading-normal text-gray-700 opacity-75">Unit: {data.unit}</Text>}
                    {!!data?.group && <Text className="block font-sans text-xs antialiased font-xs leading-normal text-gray-700 opacity-75">Group: {data.group}</Text>}
                </View>
            </TouchableOpacity>

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
    );
};

Product.propTypes = {
    data: PropTypes.shape({
        id: PropTypes.string,
        code: PropTypes.string,
        name: PropTypes.string.isRequired,
        unit: PropTypes.string.isRequired,
        group: PropTypes.string,
    }).isRequired,
    onEdit: PropTypes.func,
    onDelete: PropTypes.func,
    onSelect: PropTypes.func,
    enableButtons: PropTypes.bool,
    isActive: PropTypes.bool,
};

Product.defaultProps = {
    onEdit: () => { },
    onDelete: () => { }
};

export default memo(Product);