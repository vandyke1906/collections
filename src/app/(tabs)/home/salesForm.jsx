import { } from "@react-native-community/datetimepicker";
import { View, Text, TextInput, TouchableOpacity, ToastAndroid, Pressable, TouchableOpacityBase, Keyboard, TouchableWithoutFeedback, Button, FlatList } from 'react-native';
import { useCallback, useEffect, useRef, useState } from "react";
import { useRealm } from "@realm/react";
import { useForm, Controller } from 'react-hook-form';
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import { BSON } from "realm";
import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import moment from "moment";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { ROUTES } from "../../../common/common";
import useSaleProductStore from "../../../store/saleProductStore";


const salesForm = () => {
    const inputClass = "my-2 p-2 appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500";

    const { control, handleSubmit, setValue, formState: { errors }  } = useForm();
    const realm = useRealm();
    const navigation = useNavigation();
    const params = useLocalSearchParams();
    const productList = useSaleProductStore(state => state.list);

    const [list, setList] = useState([]);

    const handleSubmitCustomer = useCallback((data) => {
        console.info({ data });
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

    useEffect(() => {
        navigation.setOptions({
            headerShown: true,
            title: "Create Sales",
            headerRight: () => (
                <TouchableOpacity onPress={handleSubmit(handleSubmitCustomer)}>
                    <FontAwesome size={18} name="check" color="green" />
                </TouchableOpacity>
            ),
        });
    }, [navigation]);

    useEffect(() => {
        console.info({params})
        switch (params.type) {
            case "customer": {
                setValue("customerName", `${params.code && `(${params.code})`} ${params.name}`);
                break;
            }
            case "product": {
                setList(prev => ([...prev, params ]))
                break;
            }
            case "productList": {
                setList(productList);
                break;
            }
        }
    }, [params?.key]);

    useEffect(() => {
        if (Object.keys(errors).length)
            ToastAndroid.show(JSON.stringify(errors), ToastAndroid.SHORT);
    }, [errors]);

    return (
        <View className="flex flex-col h-full justify-between p-5">
            <View className="flex-1">
                <Controller
                    control={control}
                    rules={{ required: true }}
                    name="dateOfSI"
                    defaultValue={params.dateOfSI || ""}
                    render={({ field: { value } }) => (
                        <TouchableWithoutFeedback onPress={() => {
                            Keyboard.dismiss();
                            showDatePicker((event, date) => {
                                if (event.type === "set")
                                    setValue("dateOfSI", moment(date).format("(dddd), MMMM DD, YYYY"));
                            });
                        }}>
                            <View>
                                <Text className="text-slate-500">SI Date</Text>
                                <TextInput className={inputClass} placeholder="Sales Invoice Date" value={value} editable={false} />
                            </View>
                        </TouchableWithoutFeedback>
                    )}
                />

                <Controller
                    control={control}
                    rules={{ required: true }}
                    name="customerName"
                    defaultValue={params.customerName || ""}
                    render={({ field: { value } }) => (
                        <TouchableWithoutFeedback onPress={() => {
                            Keyboard.dismiss();
                        }}>
                            <View>
                                <Text className="text-slate-500">Customer</Text>
                                <View className="relative">
                                    <TextInput className={`${inputClass} pr-10`} autoCapitalize="characters" placeholder="Customer" value={value} editable={false} />
                                    <TouchableOpacity className="absolute inset-y-0 right-0 flex items-center justify-center pr-4" onPress={() => {
                                        router.navigate({ pathname: ROUTES.CUSTOMER_SELECTION });
                                    }}>
                                        <FontAwesome size={18} name="search" color="gray" />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </TouchableWithoutFeedback>
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
                    rules={{ required: true }}
                    name="dateDelivered"
                    defaultValue={params.dateDelivered || ""}
                    render={({ field: { value } }) => (
                        <TouchableWithoutFeedback onPress={() => {
                            Keyboard.dismiss();
                            showDatePicker((event, date) => {
                                if (event.type === "set")
                                    setValue("dateDelivered", moment(date).format("(dddd), MMMM DD, YYYY"));
                            });
                        }}>
                            <View>
                                <Text className="text-slate-500">Date Delivered</Text>
                                <TextInput className={inputClass} placeholder="Date Delivered" value={value} editable={false} />
                            </View>
                        </TouchableWithoutFeedback>
                    )}
                />

                <FlatList
                    className="w-full"
                    data={list}
                    keyExtractor={(item) => item._id}
                    renderItem={({ item, index }) => (
                        <View key={index}>
                            <Text>{item.code || ""}</Text>
                            <Text>{item.name || ""}</Text>
                            <Text>{item.unit || ""}</Text>
                            <Text>{item.qty || ""}</Text>
                            <Text>{item.price || ""}</Text>
                        </View>
                    )}
                />

            </View>

            <View className="m-2">
                <TouchableOpacity className="p-2 bg-blue-500 hover:bg-blue-700 text-white font-bold rounded-full" onPress={() => {
                    router.navigate({ pathname: ROUTES.PRODUCT_SELECTION, params: { multipleSelect: 1 } });
                }}>
                    <Text className="text-white text-center text-[16px]">Add Products</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};


export default salesForm;
