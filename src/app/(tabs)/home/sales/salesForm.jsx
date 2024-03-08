import { View, Text, TextInput, TouchableOpacity, ToastAndroid, Keyboard, TouchableWithoutFeedback, Button, FlatList, ScrollView, SectionList, VirtualizedList, Alert } from 'react-native';
import { useCallback, useEffect, useMemo, useState } from "react";
import { useRealm } from "@realm/react";
import { useForm, Controller } from 'react-hook-form';
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import moment from "moment";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import useSalesInvoiceStore from "src/store/salesInvoiceStore";
import SIProduct from "src/components/SIProduct";
import useSelection from "src/store/selectionStore";
import { DATE_FORMAT, ROUTES } from "src/common/common";

const salesForm = () => {
    const inputClass = "text-sm my-2 p-2 appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500";

    const { control, handleSubmit, setValue, formState: { errors } } = useForm();
    const realm = useRealm();
    const navigation = useNavigation();
    const params = useLocalSearchParams();

    const {
        list: productList, details, setProducts,
        updateDetails, updateProductDetail, clearList
    } = useSalesInvoiceStore();
    const { selections, resetSelection, setSelections } = useSelection();

    const [list, setList] = useState(productList);

    useEffect(() => {
        navigation.setOptions({
            headerShown: true,
            title: "Create Sales",
            headerRight: () => (
                <TouchableOpacity className="py-3 pl-10 pr-3" onPress={() => {
                    const latestDetails = useSalesInvoiceStore.getState().details;
                    Alert.alert("Sales Invoice", `Do you want to save ${latestDetails.invoiceNo}?`, [
                        { text: "Cancel" },
                        {
                            text: "Continue",
                            onPress: handleSubmit(handleSubmitCustomer)
                        }
                    ]);
                }}>
                    <FontAwesome size={18} name="check" color="green" />
                </TouchableOpacity>
            ),
        });
    }, [navigation, productList, details]);

    const handleSubmitCustomer = useCallback((data) => {
        realm.write(() => {
            try {
                if (!productList.length) throw new Error("Add atleast one(1) product.");
                updateDetails(data);
                const latestDetails = useSalesInvoiceStore.getState().details;

                const getSalesInvoice = (_invNo) => {
                    const salesInvoice = realm.objects("salesInvoices").find((c) => c.invoiceNo.toUpperCase() === _invNo.toUpperCase());
                    return salesInvoice;
                };

                if (getSalesInvoice(latestDetails.invoiceNo))
                    throw new Error(`Invoice [${latestDetails.invoiceNo}] already exist.`);

                const products = [];
                let totalAmount = 0;
                for (const product of productList) {
                    totalAmount += +product.amount;
                    const productData = {
                        productId: product._id,
                        code: product.code || "",
                        name: product.name,
                        unit: product.unit,
                        qty: +product.qty,
                        amount: +product.amount,
                        group: product.group
                    };
                    products.push(realm.create("salesProducts", productData));
                }
                const salesInvoiceData = {
                    customerId: latestDetails.customerId,
                    customerName: latestDetails.customerName,
                    invoiceNo: latestDetails.invoiceNo,
                    dateOfSI: moment(latestDetails.dateOfSI, DATE_FORMAT).valueOf(),
                    dateDelivered: moment(latestDetails.dateDelivered, DATE_FORMAT).valueOf(),
                    poNo: latestDetails.poNo,
                    soNo: latestDetails.soNo,
                    totalAmount: totalAmount,
                    unpaidAmount: totalAmount,
                    products: products
                };
                realm.create("salesInvoices", salesInvoiceData);
                router.push({ pathname: ROUTES.SALES });
                ToastAndroid.show("Sales invoice created.", ToastAndroid.SHORT);
            } catch (error) {
                ToastAndroid.show(error.message || error, ToastAndroid.SHORT);
            }
        });
    }, [realm, productList, details]);

    const showDatePicker = (onChange = () => { }) => {
        DateTimePickerAndroid.open({
            value: new Date(),
            mode: "date",
            display: "calendar",
            onChange: typeof onChange === "function" ? onChange : () => { }
        });
    };

    const totalAmount = useMemo(() => {
        return Number(details.totalAmount || 0).toFixed(2);
    }, [details?.totalAmount]);

    useEffect(() => {
        switch (params.type) {
            case "customer": {
                setValue("customerName", params.name);
                updateDetails({ customerId: params._id });
                break;
            }
            case "product": {
                setList(prev => ([...prev, params]));
                break;
            }
            case "productList": {
                setList(selections);
                setProducts(selections);
                resetSelection();
                break;
            }
            case "clearList": {
                clearList();
                setList([]);
                break;
            }
        }
    }, [params?.key]);

    return (
        <ScrollView showsVerticalScrollIndicator={false}>
            <View className="flex flex-col h-full justify-between p-5">
                <View className="flex-1">
                    <Controller
                        control={control}
                        rules={{ required: false }}
                        name="invoiceNo"
                        defaultValue={params.invoiceNo || ""}
                        render={({ field: { onChange, onBlur, value } }) => (
                            <View>
                                <Text className="text-slate-500">Invoice Number</Text>
                                <TextInput className={`${inputClass} border ${errors.invoiceNo ? "border-red-500" : ""}`} autoCapitalize="characters" placeholder="Invoice Number" onBlur={onBlur} onChangeText={(text) => onChange(text.toUpperCase())} value={value} />
                            </View>
                        )}
                    />
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
                                        setValue("dateOfSI", moment(date).format(DATE_FORMAT));
                                });
                            }}>
                                <View>
                                    <Text className="text-slate-500">SI Date</Text>
                                    <TextInput className={`${inputClass} border ${errors.dateOfSI ? "border-red-500" : ""}`} placeholder="Sales Invoice Date" value={value} editable={false} />
                                </View>
                            </TouchableWithoutFeedback>
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
                                        setValue("dateDelivered", moment(date).format(DATE_FORMAT));
                                });
                            }}>
                                <View>
                                    <Text className="text-slate-500">Date Delivered</Text>
                                    <TextInput className={`${inputClass} border ${errors.dateDelivered ? "border-red-500" : ""}`} placeholder="Date Delivered" value={value} editable={false} />
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
                                        <TextInput className={`${inputClass} pr-10 border ${errors.customerName ? "border-red-500" : ""}`} autoCapitalize="characters" placeholder="Customer" value={value} editable={false} />
                                        <TouchableOpacity className="absolute inset-y-0 right-0 flex items-center justify-center pr-4" onPress={() => {
                                            router.push({ pathname: ROUTES.CUSTOMER_SELECTION });
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
                                <TextInput className={inputClass} autoCapitalize="characters" placeholder="Purchase Order Number" onBlur={onBlur} onChangeText={(text) => onChange(text.toUpperCase())} value={value} />
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
                                <TextInput className={inputClass} autoCapitalize="characters" placeholder="Sales Order Number" onBlur={onBlur} onChangeText={(text) => onChange(text.toUpperCase())} value={value} />
                            </View>
                        )}
                    />

                    <Controller
                        control={control}
                        rules={{ required: false }}
                        name="totalAmount"
                        render={({ field: { } }) => (
                            <View>
                                <Text className="text-slate-500">Total Revenue</Text>
                                <TextInput className={`${inputClass} text-right`} placeholder="Total Revenue" value={totalAmount} editable={false} />
                            </View>
                        )}
                    />

                    <View className="mt-2 mb-5 flex border-t border-gray-300">
                        <View className="flex flex-row items-center justify-between">
                            <Text className="mt-2 block font-sans text-xs antialiased leading-normal text-gray-500 uppercase">product list ({list.length})</Text>
                            <TouchableOpacity onPress={() => {
                                setSelections(list);
                                router.push({ pathname: ROUTES.PRODUCT_SELECTION, params: { multipleSelect: 1 } });
                            }}>
                                <Text className="pointer-events-auto inline-block cursor-pointer rounded text-sm font-bold leading-normal text-blue-700 uppercase">Add Products</Text>
                            </TouchableOpacity>
                        </View>

                        {list.map((item, index) => (
                            <SIProduct
                                key={index}
                                data={item}
                                onQtyChange={(text) => {
                                    if (text)
                                        updateProductDetail(item._id, { qty: +text });
                                }}
                                onAmountChange={(text) => {
                                    if (text) {
                                        updateProductDetail(item._id, { amount: +text });
                                    }
                                }}
                            />
                        ))}
                    </View>

                </View>
            </View>
        </ScrollView>
    );
};


export default salesForm;
