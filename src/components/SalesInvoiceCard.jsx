import { View, Text, TouchableOpacity } from 'react-native';
import React, { memo } from 'react';
import PropTypes from "prop-types";
import moment from "moment";
import { DATE_FORMAT, amountFormat } from "src/common/common";

const SalesInvoiceCard = ({ data, onEdit, enableButtons, onSelect }) => {
    return (
        <View className="block w-full rounded-lg bg-white text-left p-2 my-2">
            <TouchableOpacity disabled={typeof onSelect !== "function"} onPress={() => typeof onSelect === "function" ? onSelect() : () => { }}>
                <View className="p-2">
                    {data?.invoiceNo && <Text className="block font-sans text-xs antialiased leading-normal text-gray-900 font-bold">{data?.invoiceNo}</Text>}
                    {data?.customerName && <Text className="block font-sans text-xs antialiased font-bold leading-normal text-gray-900">{data?.customerName}</Text>}

                    <View className="flex flex-row items-center justify-between">
                        {data?.poNo && <Text className="block font-sans text-xs antialiased font-normal leading-normal text-gray-700 opacity-75">PO #:{data?.poNo}</Text>}
                        {data?.soNo && <Text className="block font-sans text-xs antialiased font-normal leading-normal text-gray-700 opacity-75">SO #: {data?.soNo}</Text>}
                    </View>

                    {data?.dateOfSI && <Text className="block font-sans text-xs antialiased font-normal leading-normal text-gray-700 opacity-75">SI Date: {moment(data?.dateOfSI).format(DATE_FORMAT)}</Text>}
                    {data?.dateDelivered && <Text className="block font-sans text-xs antialiased font-normal leading-normal text-gray-700 opacity-75">Delivered Date: {moment(data?.dateDelivered).format(DATE_FORMAT)}</Text>}

                    <View className="pt-2 flex flex-row items-center justify-between">
                        {!isNaN(data?.totalAmount) && <Text className="block font-sans text-xs antialiased font-normal leading-normal text-gray-700 opacity-75">Sales: {amountFormat(data?.totalAmount)}</Text>}
                        {!isNaN(data?.totalAmount) && (
                            <View className="flex flex-row">
                                <Text className="block font-sans text-xs antialiased font-normal leading-normal text-gray-700 opacity-75">Paid: </Text>
                                <Text className={`block font-sans text-xs antialiased font-bold leading-normal opacity-75 ${data.unpaidAmount ? "text-green-700" : "text-gray-700"}`}>{amountFormat(data?.totalAmount - (data?.unpaidAmount || 0))}</Text>
                            </View>
                        )}
                        {!isNaN(data?.unpaidAmount) && (
                            <View className="flex flex-row">
                                <Text className="block font-sans text-xs antialiased font-normal leading-normal text-gray-700 opacity-75">Unpaid: </Text>
                                <Text className={`block font-sans text-xs antialiased font-bold leading-normal opacity-75 ${data.unpaidAmount ? "text-red-700" : "text-gray-700"}`}>{amountFormat(data?.unpaidAmount)}</Text>
                            </View>
                        )}
                    </View>

                </View>
            </TouchableOpacity>

            {enableButtons && <View className="flex flex-row items-center justify-end border-t-2 border-neutral-100 font-sans text-xs antialiased font-normal leading-normal text-gray-700 opacity-75">
                <TouchableOpacity onPress={onEdit}>
                    <Text className="pointer-events-auto mr-5 inline-block cursor-pointer rounded text-base font-normal leading-normal text-blue-700">Edit</Text>
                </TouchableOpacity>
            </View>}
        </View>
    );
};

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
    onEdit: () => { }
};

export default memo(SalesInvoiceCard);