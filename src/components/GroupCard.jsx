import { View, Text, TouchableOpacity } from 'react-native'
import React, { memo } from 'react'
import PropTypes from "prop-types";

const GroupCard = ({ data, onEdit, enableButtons, onSelect, isActive }) => {
    return (
        <TouchableOpacity disabled={typeof onSelect !== "function"} onPress={() => typeof onSelect === "function" ? onSelect() : () => { }}>
            <View className={`block w-full rounded-lg bg-white text-left p-2 my-2 ${isActive ? "bg-blue-100" : "bg-white"}`}>
                <View className="p-2">
                    <Text className="block font-sans text-xs antialiased font-normal leading-normal text-gray-700 opacity-75">{data._id}</Text>
                </View>
                {enableButtons && <View className="flex flex-row items-center justify-end border-t-2 border-neutral-100 font-sans text-xs antialiased font-normal leading-normal text-gray-700 opacity-75">
                    <TouchableOpacity onPress={onEdit}>
                        <Text className="pointer-events-auto mr-5 inline-block cursor-pointer rounded text-base font-normal leading-normal text-blue-700">Edit</Text>
                    </TouchableOpacity>
                </View>}
            </View>
    </TouchableOpacity>
  )
}

GroupCard.propTypes = {
    data: PropTypes.shape({
        _id: PropTypes.string.isRequired,
    }).isRequired,
    onEdit: PropTypes.func,
    onSelect: PropTypes.func,
    enableButtons: PropTypes.bool,
    isActive: PropTypes.bool,
};

GroupCard.defaultProps = {
    onEdit: () => {}
};

export default memo(GroupCard)