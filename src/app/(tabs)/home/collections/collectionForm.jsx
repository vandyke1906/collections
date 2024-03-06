import { View, Text, TouchableOpacity, ScrollView, TouchableWithoutFeedback, TextInput, Keyboard, ToastAndroid } from 'react-native'
import React, { useCallback, useEffect } from 'react'
import { router, useNavigation } from "expo-router";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import useSalesInvoiceStore from "../../../../store/salesInvoiceStore";
import { DATE_FORMAT, MODE_OF_PAYMENT, amountFormat, formatDate, showDatePicker } from "../../../../common/common";
import { Controller, useForm } from "react-hook-form";
import { Picker } from "@react-native-picker/picker";
import { useRealm } from "@realm/react";
import { BSON } from "realm";
import moment from "moment";

const inputClass = "my-2 p-2 appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500";

const collectionForm = () => {
    const navigation = useNavigation();
    const realm = useRealm();
    const selectedInvoice = useSalesInvoiceStore(state => state.selected);

    const { control, handleSubmit, setValue, formState: { errors }  } = useForm();

    const handleSubmitCollection = useCallback((data) => {
        try {
            realm.write(() => {
                const collectionData = {
                    corNo: data.corNo,
                    corDate: moment(data.corDate, DATE_FORMAT).valueOf(),
                    paymentDate: moment(data.paymentDate, DATE_FORMAT).valueOf(),
                    amount: +data.amount,
                    modeOfPayment: data.modeOfPayment,
                    salesInvoices: selectedInvoice
                };
                realm.create("collections", collectionData);
                const currentSalesInvoice = realm.objectForPrimaryKey("salesInvoices", selectedInvoice._id);

                if (currentSalesInvoice)
                    currentSalesInvoice.unpaidAmount -= collectionData.amount;

                router.back();
                ToastAndroid.show(`Collection on Invoice#: ${selectedInvoice.invoiceNo} added.`, ToastAndroid.SHORT);
            });
        } catch (error) {
            console.error({error})
            ToastAndroid.show(error.message || error, ToastAndroid.SHORT);
        }
    }, [realm, selectedInvoice]);

    useEffect(() => {
        navigation.setOptions({
            headerShown: true,
            title: "New Collection",
            headerRight: () => (
                <TouchableOpacity onPress={handleSubmit(handleSubmitCollection)}>
                    <FontAwesome size={18} name="check" color="green" />
                </TouchableOpacity>
            ),
        });
    }, [navigation, selectedInvoice]);

    const renderForm = () => {
        return (
            <View className="flex-1">
                <Controller
                    control={control}
                    rules={{ required: true }}
                    name="corNo"
                    render={({ field: { onChange, onBlur, value } }) => (
                        <View>
                            <Text className="text-slate-500">Collection Receipt Number</Text>
                            <TextInput className={inputClass} autoCapitalize="characters" placeholder="Collection Receipt Number" onBlur={onBlur} onChangeText={onChange} value={value} />
                        </View>
                    )}
                />

                <Controller
                    control={control}
                    rules={{ required: true }}
                    name="corDate"
                    render={({ field: { value } }) => (
                        <TouchableWithoutFeedback onPress={() => {
                            Keyboard.dismiss();
                            showDatePicker((event, date) => {
                                if (event.type === "set")
                                    setValue("corDate", formatDate(date));
                            });
                        }}>
                            <View>
                                <Text className="text-slate-500">Collection Receipt Date</Text>
                                <TextInput className={inputClass} placeholder="Collection Receipt Date" value={value} editable={false} />
                            </View>
                        </TouchableWithoutFeedback>
                    )}
                />

                <Controller
                    control={control}
                    rules={{ required: true }}
                    name="paymentDate"
                    render={({ field: { value } }) => (
                        <TouchableWithoutFeedback onPress={() => {
                            Keyboard.dismiss();
                            showDatePicker((event, date) => {
                                if (event.type === "set")
                                    setValue("paymentDate", formatDate(date));
                            });
                        }}>
                            <View>
                                <Text className="text-slate-500">Payment Date</Text>
                                <TextInput className={inputClass} placeholder="Payment Date" value={value} editable={false} />
                            </View>
                        </TouchableWithoutFeedback>
                    )}
                />

                 <Controller
                    control={control}
                    rules={{ required: false }}
                    name="amount"
                    render={({ field: { value, onChange, onBlur } }) => (
                        <View>
                            <Text className="text-slate-500">Amount Paid</Text>
                            <TextInput className={`${inputClass} text-right`} keyboardType="decimal-pad" placeholder="Amount Paid" value={value} onBlur={onBlur} onChangeText={onChange} />
                        </View>
                    )}
                />

                <Controller
                    control={control}
                    rules={{ required: true }}
                    name="modeOfPayment"
                    defaultValue={Object.keys(MODE_OF_PAYMENT)[0]}
                    render={({ field: { value, onChange } }) => (
                        <View>
                            <Text className="text-slate-500">Mode of Payment</Text>
                            <Picker selectedValue={value} onValueChange={onChange}>
                                {Object.keys(MODE_OF_PAYMENT).map((mopKey) => (
                                    <Picker.Item key={mopKey} value={mopKey} label={MODE_OF_PAYMENT[mopKey]} />
                                ))}
                            </Picker>
                        </View>
                    )}
                />
            </View>
        )
    };

     const renderDetails = (data) => {
        return (
            <View className="block w-fulltext-left p-2 my-2">
                <View className="p-2">
                    {data?.invoiceNo && <Text className="block font-sans text-sm antialiased leading-normal text-gray-900 font-bold">{data?.invoiceNo}</Text>}
                    {data?.customerName && <Text className="block font-sans text-sm antialiased font-bold leading-normal text-gray-900">{data?.customerName}</Text>}
                    {data?.poNo && <Text className="block font-sans text-sm antialiased font-normal leading-normal text-gray-700 opacity-75">PO #:{data?.poNo}</Text>}
                    {data?.soNo && <Text className="block font-sans text-sm antialiased font-normal leading-normal text-gray-700 opacity-75">SO #: {data?.soNo}</Text>}

                    {data?.dateOfSI && <Text className="block font-sans text-sm antialiased font-normal leading-normal text-gray-700 opacity-75">SI Date: {formatDate(data?.dateOfSI)}</Text>}
                    {data?.dateDelivered && <Text className="block font-sans text-sm antialiased font-normal leading-normal text-gray-700 opacity-75">Delivered Date: {formatDate(data?.dateDelivered)}</Text>}

                     <View className="flex flex-row items-center justify-between mb-5">
                        {!isNaN(data?.totalAmount) && <Text className="block font-sans text-sm antialiased font-normal leading-normal text-gray-700 opacity-75">Revenue: {amountFormat(data?.totalAmount)}</Text>}
                        {!isNaN(data?.unpaidAmount) && <Text className="block font-sans text-sm antialiased font-normal leading-normal text-gray-700 opacity-75">Unpaid: {amountFormat(data?.unpaidAmount)}</Text>}
                    </View>

                    {renderForm()}

                </View>
            </View>
        )
    };


    return (
        <ScrollView className="flex w-full" showsVerticalScrollIndicator={false}>
            {!!selectedInvoice && renderDetails(selectedInvoice)}
            <Text>{JSON.stringify(errors)}</Text>
        </ScrollView>
  )
}

export default collectionForm