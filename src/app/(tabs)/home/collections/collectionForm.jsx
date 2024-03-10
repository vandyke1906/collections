import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    TouchableWithoutFeedback,
    TextInput,
    Keyboard,
    ToastAndroid,
    Alert,
    StatusBar,
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { router, useNavigation } from "expo-router";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import useSalesInvoiceStore from "src/store/salesInvoiceStore";
import {
    DATE_FORMAT,
    MODE_OF_PAYMENT,
    formatAmount,
    formatDate,
    getDateValueOf,
    isMOPCheque,
    showDatePicker,
} from "src/common/common";
import { Controller, useForm } from "react-hook-form";
import { Picker } from "@react-native-picker/picker";
import { useRealm } from "@realm/react";
import moment from "moment";

const collectionForm = () => {
    const inputClass =
        "text-sm my-2 p-2 appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500";
    const navigation = useNavigation();
    const realm = useRealm();
    const selectedInvoice = useSalesInvoiceStore((state) => state.selected);
    const setSelectedInvoice = useSalesInvoiceStore((state) => state.setSelected);

    const [isCheque, setIsCheque] = useState(false);
    const {
        control,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm();

    useEffect(() => {
        navigation.setOptions({
            headerShown: true,
            title: "New Collection",
            headerRight: () => (
                <TouchableOpacity
                    className="py-3 pl-10 pr-3"
                    onPress={() => {
                        Alert.alert(
                            "Collection",
                            `Do you want to save collection for invoice ${selectedInvoice.invoiceNo}?`,
                            [
                                { text: "Cancel" },
                                {
                                    text: "Continue",
                                    onPress: handleSubmit(handleSubmitCollection),
                                },
                            ]
                        );
                    }}
                >
                    <FontAwesome size={18} name="check" color="green" />
                </TouchableOpacity>
            ),
        });
    }, [navigation, selectedInvoice]);

    const handleSubmitCollection = useCallback(
        (data) => {
            realm.write(() => {
                try {
                    const currentSalesInvoice = realm.objectForPrimaryKey("salesInvoices", selectedInvoice._id);
                    const currentCollection = realm
                        .objects("collections")
                        .find((c) => c.corNo.toUpperCase() === (data.corNo || "").toUpperCase());
                    if (currentCollection)
                        throw new Error(`Collection Receipt#: ${data.corNo.toUpperCase()} already exist.`);

                    if (currentSalesInvoice) {
                        const amountCollected = +data.amount;
                        if (amountCollected && currentSalesInvoice.unpaidAmount < amountCollected)
                            throw new Error("Payment exceeds outstanding balance.");

                        currentSalesInvoice.unpaidAmount -= amountCollected;

                        const collectionData = {
                            corNo: data.corNo,
                            corDate: moment(data.corDate, DATE_FORMAT).valueOf(),
                            paymentDate: moment(data.paymentDate, DATE_FORMAT).valueOf(),
                            amount: amountCollected,
                            modeOfPayment: data.modeOfPayment,
                            salesInvoice: currentSalesInvoice,
                            details: {
                                invoiceNo: currentSalesInvoice.invoiceNo,
                                customerName: selectedInvoice.customerName,
                            },
                            customerId: currentSalesInvoice.customerId,
                        };

                        if (isMOPCheque(data.modeOfPayment)) {
                            collectionData.chequeNo = data.chequeNo;
                            collectionData.chequeDate = moment(data.chequeDate, DATE_FORMAT).valueOf();
                        }
                        realm.create("collections", collectionData);
                        setSelectedInvoice({ unpaidAmount: currentSalesInvoice.unpaidAmount });
                        router.back();
                        ToastAndroid.show(
                            `Collection on Invoice#: ${selectedInvoice.invoiceNo} added.`,
                            ToastAndroid.SHORT
                        );
                    } else ToastAndroid.show(`Invoice is not ready.`, ToastAndroid.SHORT);
                } catch (error) {
                    ToastAndroid.show(error.message || error, ToastAndroid.SHORT);
                }
            });
        },
        [realm, selectedInvoice]
    );

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
                            <TextInput
                                className={`${inputClass} border ${errors.corNo ? "border-red-500" : ""}`}
                                autoCapitalize="characters"
                                placeholder="Collection Receipt Number"
                                onBlur={onBlur}
                                onChangeText={(text) => onChange(text.toUpperCase())}
                                value={value}
                            />
                        </View>
                    )}
                />

                <Controller
                    control={control}
                    rules={{ required: true }}
                    name="corDate"
                    render={({ field: { value } }) => (
                        <TouchableWithoutFeedback
                            onPress={() => {
                                Keyboard.dismiss();
                                showDatePicker({
                                    date: getDateValueOf(value, { format: DATE_FORMAT }),
                                    onChange: (event, date) => {
                                        if (event.type === "set") setValue("corDate", formatDate(date));
                                    },
                                });
                            }}
                        >
                            <View>
                                <Text className="text-slate-500">Collection Receipt Date</Text>
                                <TextInput
                                    className={`${inputClass} border ${errors.corDate ? "border-red-500" : ""}`}
                                    placeholder="Collection Receipt Date"
                                    value={value}
                                    editable={false}
                                />
                            </View>
                        </TouchableWithoutFeedback>
                    )}
                />

                <Controller
                    control={control}
                    rules={{ required: true }}
                    name="paymentDate"
                    render={({ field: { value } }) => (
                        <TouchableWithoutFeedback
                            onPress={() => {
                                Keyboard.dismiss();
                                showDatePicker({
                                    date: getDateValueOf(value, { format: DATE_FORMAT }),
                                    onChange: (event, date) => {
                                        if (event.type === "set") setValue("paymentDate", formatDate(date));
                                    },
                                });
                            }}
                        >
                            <View>
                                <Text className="text-slate-500">Payment Date</Text>
                                <TextInput
                                    className={`${inputClass} border ${errors.paymentDate ? "border-red-500" : ""}`}
                                    placeholder="Payment Date"
                                    value={value}
                                    editable={false}
                                />
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
                            <TextInput
                                className={`${inputClass} text-right border ${errors.amount ? "border-red-500" : ""}`}
                                keyboardType="decimal-pad"
                                placeholder="Amount Paid"
                                value={value}
                                onBlur={onBlur}
                                onChangeText={(text) => onChange(text.toUpperCase())}
                            />
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
                            <View className={`${inputClass} border ${errors.modeOfPayment ? "border-red-500" : ""}`}>
                                <Picker
                                    selectedValue={value}
                                    onValueChange={(value) => {
                                        setIsCheque(isMOPCheque(value));
                                        onChange(value);
                                    }}
                                >
                                    {Object.keys(MODE_OF_PAYMENT).map((mopKey) => (
                                        <Picker.Item key={mopKey} value={mopKey} label={MODE_OF_PAYMENT[mopKey]} />
                                    ))}
                                </Picker>
                            </View>
                        </View>
                    )}
                />

                {isCheque && (
                    <View>
                        <Controller
                            control={control}
                            rules={{ required: isCheque }}
                            name="chequeNo"
                            render={({ field: { value, onChange } }) => (
                                <View>
                                    <Text className="text-slate-500">Cheque Number</Text>
                                    <TextInput
                                        className={`${inputClass} border ${errors.chequeNo ? "border-red-500" : ""}`}
                                        placeholder="Cheque Number"
                                        value={value}
                                        onChangeText={(text) => onChange(text.toUpperCase())}
                                    />
                                </View>
                            )}
                        />

                        <Controller
                            control={control}
                            rules={{ required: isCheque }}
                            name="chequeDate"
                            render={({ field: { value } }) => (
                                <TouchableWithoutFeedback
                                    onPress={() => {
                                        Keyboard.dismiss();
                                        showDatePicker({
                                            date: getDateValueOf(value, { format: DATE_FORMAT }),
                                            onChange: (event, date) => {
                                                if (event.type === "set") setValue("chequeDate", formatDate(date));
                                            },
                                        });
                                    }}
                                >
                                    <View>
                                        <Text className="text-slate-500">Date of Cheque</Text>
                                        <TextInput
                                            className={`${inputClass} border ${
                                                errors.chequeDate ? "border-red-500" : ""
                                            }`}
                                            placeholder="Date of Cheque"
                                            value={value}
                                            editable={false}
                                        />
                                    </View>
                                </TouchableWithoutFeedback>
                            )}
                        />
                    </View>
                )}
            </View>
        );
    };

    const renderDetails = (data) => {
        return (
            <View className="block w-fulltext-left p-2 my-2">
                <View className="p-2">
                    {data?.invoiceNo && (
                        <Text className="block font-sans text-xs antialiased leading-normal text-gray-900 font-bold">
                            {data?.invoiceNo}
                        </Text>
                    )}
                    {data?.customerName && (
                        <Text className="block font-sans text-xs antialiased font-bold leading-normal text-gray-900">
                            {data?.customerName}
                        </Text>
                    )}
                    {data?.poNo && (
                        <Text className="block font-sans text-xs antialiased font-normal leading-normal text-gray-700 opacity-75">
                            PO #:{data?.poNo}
                        </Text>
                    )}
                    {data?.soNo && (
                        <Text className="block font-sans text-xs antialiased font-normal leading-normal text-gray-700 opacity-75">
                            SO #: {data?.soNo}
                        </Text>
                    )}

                    {data?.dateOfSI && (
                        <Text className="block font-sans text-xs antialiased font-normal leading-normal text-gray-700 opacity-75">
                            SI Date: {formatDate(data?.dateOfSI)}
                        </Text>
                    )}
                    {data?.dateDelivered && (
                        <Text className="block font-sans text-xs antialiased font-normal leading-normal text-gray-700 opacity-75">
                            Delivered Date: {formatDate(data?.dateDelivered)}
                        </Text>
                    )}

                    <View className="flex flex-row items-center justify-between mb-5">
                        {!isNaN(data?.totalAmount) && (
                            <View className="flex flex-row">
                                <Text className="block font-sans text-xs antialiased font-normal leading-normal text-gray-700 opacity-75">
                                    Sales:{" "}
                                </Text>
                                <Text className="block font-sans text-xs antialiased font-bold leading-normal text-green-700 opacity-75">
                                    : {formatAmount(data?.totalAmount)}
                                </Text>
                            </View>
                        )}
                        {!isNaN(data?.unpaidAmount) && (
                            <View className="flex flex-row">
                                <Text className="block font-sans text-xs antialiased font-normal leading-normal text-gray-700 opacity-75">
                                    Unpaid:{" "}
                                </Text>
                                <Text className="block font-sans text-xs antialiased font-bold leading-normal text-green-700 opacity-75">
                                    : {formatAmount(data?.unpaidAmount)}
                                </Text>
                            </View>
                        )}
                    </View>

                    {renderForm()}
                </View>
            </View>
        );
    };

    return (
        <ScrollView className="flex w-full" showsVerticalScrollIndicator={false}>
            {!!selectedInvoice && renderDetails(selectedInvoice)}
            <StatusBar style="auto" />
        </ScrollView>
    );
};

export default collectionForm;
