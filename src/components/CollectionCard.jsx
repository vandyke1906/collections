import { View, Text, TouchableOpacity } from 'react-native'
import React, { memo } from 'react'
import PropTypes from "prop-types";
import moment from "moment";
import { DATE_FORMAT, amountFormat, formatDate, isMOPCheque } from "src/common/common";

const CollectionCard = ({ data, onEdit, enableButtons, onSelect }) => {
    return (
        <TouchableOpacity disabled={typeof onSelect !== "function"} onPress={() => typeof onSelect === "function" ? onSelect() : () => { }}>
            <View className="block w-full rounded-lg bg-white text-left p-2 my-2">
                <View className="p-2">
                    {data?.corNo && <Text className="block font-sans text-xs antialiased leading-normal text-gray-900 font-bold">{data?.corNo}</Text>}
                    {data.details?.customerName && <Text className="block font-sans text-xs antialiased font-bold leading-normal text-gray-900">{data.details?.customerName}</Text>}

                    {data?.paymentDate && <Text className="block font-sans text-xs antialiased font-normal leading-normal text-gray-700 opacity-75">Payment Date: {moment(data?.paymentDate).format(DATE_FORMAT)}</Text>}
                    {data?.corDate && <Text className="block font-sans text-xs antialiased font-normal leading-normal text-gray-700 opacity-75">COR Date: {moment(data?.corDate).format(DATE_FORMAT)}</Text>}
                    {data.details?.invoiceNo && <Text className="block font-sans text-xs antialiased font-normal leading-normal text-gray-700 opacity-75">Invoice #:{data.details?.invoiceNo}</Text>}

                     <View className="flex flex-row items-center justify-between">
                        {data.modeOfPayment && <Text className="block font-sans text-xs antialiased font-normal leading-normal text-gray-700 opacity-75">Mode of Payment: {data.modeOfPayment}</Text>}
                        {!isNaN(data?.amount) && <Text className="block font-sans text-xs antialiased font-normal leading-normal text-gray-700 opacity-75">Amount: {amountFormat(data?.amount)}</Text>}
                    </View>

                    {isMOPCheque(data.modeOfPayment) && (
                        <View className="flex">
                            {data.modeOfPayment && <Text className="block font-sans text-xs antialiased font-normal leading-normal text-gray-700 opacity-75">Cheque #: {data?.chequeNo}</Text>}
                            {!isNaN(data?.amount) && <Text className="block font-sans text-xs antialiased font-normal leading-normal text-gray-700 opacity-75">Date of Cheque: {formatDate(data?.chequeDate)}</Text>}
                        </View>
                    )}

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

CollectionCard.propTypes = {
    data: PropTypes.shape({
        _id: PropTypes.any,
        corNo: PropTypes.string,
        corDate: PropTypes.oneOfType([PropTypes.oneOf([null]), PropTypes.number]),
        paymentDate: PropTypes.oneOfType([PropTypes.oneOf([null]), PropTypes.number]),
        modeOfPayment: PropTypes.string,
        amount: PropTypes.number,
        details: PropTypes.shape({
            customerName: PropTypes.string,
            invoiceNo: PropTypes.string,
        }),
        chequeNo:  PropTypes.oneOfType([PropTypes.oneOf([null]), PropTypes.string]),
        chequeDate:  PropTypes.oneOfType([PropTypes.oneOf([null]), PropTypes.number]),
    }).isRequired,
    onEdit: PropTypes.func,
    onSelect: PropTypes.func,
    enableButtons: PropTypes.bool,
};

CollectionCard.defaultProps = {
    onEdit: () => {}
};

export default memo(CollectionCard)