import { View, Text, TouchableOpacity } from 'react-native'
import React, { memo } from 'react'
import PropTypes from "prop-types";

const InvoiceCard = ({ data, onSelect, isActive }) => {
    return (
        <TouchableOpacity disabled={typeof onSelect !== "function"} onPress={() => typeof onSelect === "function" ? onSelect() : () => { }}>
            <View className={`block w-full rounded-lg bg-white text-left p-2 my-2 ${isActive ? "bg-blue-100" : "bg-white"}`}>
                <View className="p-2 flex flex-row">
                    <Text className="block font-sans text-xs antialiased font-normal leading-normal text-gray-700 opacity-75">Invoice No: </Text>
                    <Text className="block font-sans text-xs antialiased font-bold leading-normal text-gray-900">{data.invoiceNo}</Text>
                </View>
            </View>
    </TouchableOpacity>
  )
}

InvoiceCard.propTypes = {
    data: PropTypes.shape({
        invoiceNo: PropTypes.string.isRequired,
    }).isRequired,
    onSelect: PropTypes.func,
    isActive: PropTypes.bool,
};

InvoiceCard.defaultProps = {
    onEdit: () => {}
};

export default memo(InvoiceCard)