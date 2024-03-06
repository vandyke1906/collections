import { View, Text, TouchableOpacity } from 'react-native'
import React, { memo } from 'react'
import PropTypes from "prop-types";
import moment from "moment";
import { DATE_FORMAT } from "../common/common";

const SalesInvoiceCard = ({ data, onEdit, enableButtons, onSelect }) => {
    return (
        <TouchableOpacity disabled={typeof onSelect !== "function"} onPress={() => typeof onSelect === "function" ? onSelect() : () => { }}>
            <View className="block w-full rounded-lg bg-white text-left p-2 my-2">
                <View className="p-2">
                    {data?.invoiceNo && <Text className="block font-sans text-sm antialiased leading-normal text-gray-900 font-bold">{data?.invoiceNo}</Text>}
                    {data?.customerName && <Text className="block font-sans text-sm antialiased font-bold leading-normal text-gray-900">{data?.customerName}</Text>}
                    {data?.poNo && <Text className="block font-sans text-sm antialiased font-normal leading-normal text-gray-700 opacity-75">PO #:{data?.poNo}</Text>}
                    {data?.soNo && <Text className="block font-sans text-sm antialiased font-normal leading-normal text-gray-700 opacity-75">SO #: {data?.soNo}</Text>}

                    {data?.dateOfSI && <Text className="block font-sans text-sm antialiased font-normal leading-normal text-gray-700 opacity-75">SI Date: {moment(data?.dateOfSI).format(DATE_FORMAT)}</Text>}
                    {data?.dateDelivered && <Text className="block font-sans text-sm antialiased font-normal leading-normal text-gray-700 opacity-75">Delivered Date: {moment(data?.dateDelivered).format(DATE_FORMAT)}</Text>}

                    {data?.totalAmount && <Text className="block font-sans text-sm antialiased font-normal leading-normal text-gray-700 opacity-75">Revenue: {Number(data?.totalAmount).toFixed(2)}</Text>}
                </View>
                {enableButtons && <View className="flex flex-row items-center justify-end border-t-2 border-neutral-100 font-sans text-sm antialiased font-normal leading-normal text-gray-700 opacity-75">
                    <TouchableOpacity onPress={onEdit}>
                        <Text className="pointer-events-auto mr-5 inline-block cursor-pointer rounded text-base font-normal leading-normal text-blue-700">Edit</Text>
                    </TouchableOpacity>
                </View>}
            </View>
    </TouchableOpacity>
  )
}

SalesInvoiceCard.propTypes = {
    data: PropTypes.shape({
        _id: PropTypes.any,
        customerName: PropTypes.string,
        invoiceNo: PropTypes.string,
        poNo: PropTypes.string,
        soNo: PropTypes.string,
        totalAmount: PropTypes.number,
        dateDelivered: PropTypes.oneOfType([PropTypes.oneOf([null]), PropTypes.number]),
        dateOfSI: PropTypes.oneOfType([PropTypes.oneOf([null]), PropTypes.number]),
    }).isRequired,
    onEdit: PropTypes.func,
    onSelect: PropTypes.func,
    enableButtons: PropTypes.bool,
};

SalesInvoiceCard.defaultProps = {
    onEdit: () => {}
};

export default memo(SalesInvoiceCard)