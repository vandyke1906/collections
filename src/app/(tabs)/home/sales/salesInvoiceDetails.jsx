import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import React, { useEffect } from 'react';
import { router, useNavigation } from "expo-router";
import useSalesInvoiceStore from "../../../../store/salesInvoiceStore";
import moment from "moment";
import { DATE_FORMAT, ROUTES } from "../../../../common/common";

const salesInvoiceDetails = () => {
    const navigation = useNavigation();

    const selectedInvoice = useSalesInvoiceStore(state => state.selected);

    useEffect(() => {
        navigation.setOptions({ headerShown: true, title: "Sales Invoice Details" });
    }, [navigation]);


    const renderDetails = (data) => {
        return (
            <View className="block w-fulltext-left p-2 my-2">
                <View className="p-2">
                    {data?.invoiceNo && <Text className="block font-sans text-sm antialiased leading-normal text-gray-900 font-bold">{data?.invoiceNo}</Text>}
                    {data?.customerName && <Text className="block font-sans text-sm antialiased font-bold leading-normal text-gray-900">{data?.customerName}</Text>}
                    {data?.poNo && <Text className="block font-sans text-sm antialiased font-normal leading-normal text-gray-700 opacity-75">PO #:{data?.poNo}</Text>}
                    {data?.soNo && <Text className="block font-sans text-sm antialiased font-normal leading-normal text-gray-700 opacity-75">SO #: {data?.soNo}</Text>}

                    {data?.dateOfSI && <Text className="block font-sans text-sm antialiased font-normal leading-normal text-gray-700 opacity-75">SI Date: {moment(data?.dateOfSI).format(DATE_FORMAT)}</Text>}
                    {data?.dateDelivered && <Text className="block font-sans text-sm antialiased font-normal leading-normal text-gray-700 opacity-75">Delivered Date: {moment(data?.dateDelivered).format(DATE_FORMAT)}</Text>}

                    {data?.totalAmount && <Text className="block font-sans text-sm antialiased font-normal leading-normal text-gray-700 opacity-75">Revenue: {Number(data?.totalAmount).toFixed(2)}</Text>}


                    <TouchableOpacity onPress={() => {
                        router.navigate({ pathname: ROUTES.COLLECTIONS_FORM });
                    }}>
                        <Text className="pointer-events-auto mr-5 inline-block cursor-pointer rounded text-base font-normal leading-normal text-blue-700">Add Collection</Text>
                    </TouchableOpacity>

                    <View className="rounded-lg bg-white mt-5 p-2">
                        {data.products.map((product, index) => (
                            <View key={index}>
                                {product?.code && <Text className="block font-sans text-sm antialiased leading-normal text-gray-900 font-bold">{product?.code}</Text>}
                                {product?.name && <Text className="block font-sans text-sm antialiased leading-normal text-gray-900 font-bold">{product?.name}</Text>}
                                {product?.unit && <Text className="block font-sans text-sm antialiased leading-normal text-gray-900 font-bold">{product?.unit}</Text>}
                                {product?.qty && <Text className="block font-sans text-sm antialiased leading-normal text-gray-900 font-bold">{product?.qty}</Text>}
                                {product?.amount && <Text className="block font-sans text-sm antialiased leading-normal text-gray-900 font-bold">{Number(product?.amount).toFixed(2)}</Text>}
                            </View>
                        ))}
                    </View>
                </View>
            </View>
        )
    };

  return (
      <ScrollView className="flex w-full">
          {!!selectedInvoice && renderDetails(selectedInvoice)}
    </ScrollView>
  )
}

export default salesInvoiceDetails