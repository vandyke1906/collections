import { } from "@react-native-community/datetimepicker";
import { View, Text, TextInput, TouchableOpacity, ToastAndroid, Pressable, TouchableOpacityBase, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { useCallback, useRef, useState } from "react";
import { useRealm } from "@realm/react";
import { useForm, Controller } from 'react-hook-form';
import { useLocalSearchParams, useNavigation } from "expo-router";
import { BSON } from "realm";
import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import moment from "moment";


const salesForm = () => {
    const inputClass = "my-2 p-2 appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500";

    const {  control, handleSubmit, formState: { errors }  } = useForm();
    const realm = useRealm();
    const navigation = useNavigation();
    const params = useLocalSearchParams();

    const refDateSI = useRef(null);
    const refDateDelivered = useRef(null);

    const handleSubmitCustomer = useCallback((data) => {
        // try {
        //     realm.write(() => {
        //         let isNew = true;
        //         const isCodeExist = (_code, _id) => {
        //             const regexPattern = new RegExp(data.code, 'i');
        //             const customer = realm.objects("customers").find((c) => regexPattern.test(c.code));
        //             if (customer && _id)
        //                 if (customer._id.toString() === _id) return false;
        //             return !!customer;
        //         };

        //         if (isCodeExist(data.code, params._id))
        //             throw new Error(`Code [${data.code}] already exist.`);

        //         if (params._id) {
        //             const customer = realm.objectForPrimaryKey("customers", new BSON.UUID(params._id));
        //             if (customer) {
        //                 customer.code = data.code;
        //                 customer.name = data.name;
        //                 customer.address = data.address;
        //                 isNew = false;
        //             }
        //         }

        //         if (isNew)
        //             realm.create("customers", data);

        //         ToastAndroid.show(`Customer ${isNew ? "created" : "updated"}.`, ToastAndroid.SHORT);

        //         navigation.goBack();
        //     });
        // } catch (error) {
        //     ToastAndroid.show(error.message || error, ToastAndroid.SHORT);
        // }
    }, [realm]);

    const showDatePicker = (onChange = () => { }) => {
        DateTimePickerAndroid.open({
            value: new Date(),
            mode: "date",
            display: "calendar",
            onChange: typeof onChange === "function" ? onChange : () => {}
        });
    };

    return (
        <View className="p-5">
            <Text className="mb-5 font-bold">New Sales</Text>

            <Controller
                control={control}
                rules={{ required: false }}
                name="dateOfSI"
                defaultValue={params.dateOfSI || ""}
                render={({ field: { value } }) => (
                    <TouchableWithoutFeedback onPress={() => {
                        Keyboard.dismiss();
                        showDatePicker((_, date) => {
                            if (refDateSI && refDateSI.current)
                                refDateSI.current.setNativeProps({
                                    text: moment(date).format("(dddd), MMMM DD, YYYY")
                                });
                        });
                    }}>
                        <View>
                            <Text className="text-slate-500">SI Date</Text>
                            <TextInput ref={refDateSI} className={inputClass} placeholder="Sales Invoice Date" value={value} editable={false} />
                        </View>
                    </TouchableWithoutFeedback>
                )}
            />

             <Controller
                control={control}
                rules={{ required: true }}
                name="customerName"
                defaultValue={params.name || ""}
                render={({ field: { onChange, onBlur, value } }) => (
                    <View>
                        <Text className="text-slate-500">Customer</Text>
                        <TextInput className={inputClass} autoCapitalize="characters" placeholder="Customer" onBlur={onBlur} onChangeText={onChange} value={value} />
                    </View>
                )}
            />

             <Controller
                control={control}
                rules={{ required: false }}
                name="poNo"
                defaultValue={params.address || ""}
                render={({ field: { onChange, onBlur, value } }) => (
                    <View>
                        <Text className="text-slate-500">PO Number</Text>
                        <TextInput className={inputClass} autoCapitalize="characters" placeholder="Purchase Order Number" onBlur={onBlur} onChangeText={onChange} value={value} />
                    </View>
                )}
            />

            <Controller
                control={control}
                rules={{ required: false }}
                name="soNo"
                defaultValue={params.address || ""}
                render={({ field: { onChange, onBlur, value } }) => (
                    <View>
                        <Text className="text-slate-500">SO Number</Text>
                        <TextInput className={inputClass} autoCapitalize="characters" placeholder="Sales Order Number" onBlur={onBlur} onChangeText={onChange} value={value} />
                    </View>
                )}
            />

            <Controller
                control={control}
                rules={{ required: false }}
                name="dateDelivered"
                defaultValue={params.dateDelivered || ""}
                render={({ field: { value } }) => (
                    <TouchableWithoutFeedback onPress={() => {
                        Keyboard.dismiss();
                        showDatePicker((_, date) => {
                            if (refDateDelivered && refDateDelivered.current)
                                refDateDelivered.current.setNativeProps({
                                    text: moment(date).format("(dddd), MMMM DD, YYYY")
                                });
                        });
                    }}>
                        <View>
                            <Text className="text-slate-500">Date Delivered</Text>
                            <TextInput ref={refDateDelivered} className={inputClass} placeholder="Date Delivered" value={value} editable={false} />
                        </View>
                    </TouchableWithoutFeedback>
                )}
            />

            <TouchableOpacity className="p-4 bg-blue-500 hover:bg-blue-700 text-white font-bold rounded-full" onPress={handleSubmit(handleSubmitCustomer)}>
                <Text className="text-white text-center text-[16px]">Save</Text>
            </TouchableOpacity>

             <Text>
                {!!Object.keys(errors).length && JSON.stringify(errors)}
            </Text>

            {/* {showDatePicker && (
                <DateTimePicker mode="date" display="spinner" value={date} onChange={(event, date) => {
                    console.info({ event, date });
                }} />
            )} */}
        </View>
    );
};


export default salesForm;
