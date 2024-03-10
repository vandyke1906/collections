import { View, Text, TextInput, TouchableOpacity, ToastAndroid, StatusBar } from "react-native";
import { useCallback, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import { useRealm } from "@realm/react";
import FontAwesome from "@expo/vector-icons/FontAwesome";

const customerForm = () => {
    const inputClass =
        "text-sm my-2 p-2 appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500";

    const navigation = useNavigation();
    const realm = useRealm();
    const params = useLocalSearchParams();
    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm();

    useEffect(() => {
        navigation.setOptions({
            title: "Customer",
            headerRight: () => (
                <TouchableOpacity className="py-3 pl-10 pr-3" onPress={handleSubmit(handleSubmitCustomer)}>
                    <FontAwesome size={18} name="check" color="green" />
                </TouchableOpacity>
            ),
        });
    }, [navigation]);

    const handleSubmitCustomer = useCallback(
        (data) => {
            realm.write(() => {
                try {
                    let isNew = true;
                    const isCodeExist = (_code, _id) => {
                        const regexPattern = new RegExp(data.code, "i");
                        const customer = realm.objects("customers").find((c) => regexPattern.test(c.code));
                        if (customer && _id) if (customer._id === _id) return false;
                        return !!customer;
                    };

                    if (isCodeExist(data.code, params._id)) throw new Error(`Code [${data.code}] already exist.`);

                    if (params._id) {
                        const customer = realm.objectForPrimaryKey("customers", params._id);
                        if (customer) {
                            //update related fields in other collections
                            if (customer.name !== data.name) {
                                const collections = realm.objects("collections");
                                const filtered = collections.filter((c) => c.customerId === customer._id);
                                filtered.forEach((coll) => {
                                    if (coll.details) coll.details.customerName = data.name;
                                });
                            }

                            customer.code = data.code.trim();
                            customer.name = data.name.trim();
                            customer.address = data.address.trim();
                            customer.indexedName = data.name.toLowerCase().replace(/\s/g, "");
                            isNew = false;
                        } else {
                            data.indexedName = data.name.toLowerCase().replace(/\s/g, "");
                        }
                    }

                    if (isNew) realm.create("customers", data);

                    ToastAndroid.show(`Customer ${isNew ? "created" : "updated"}.`, ToastAndroid.SHORT);
                    router.back();
                } catch (error) {
                    ToastAndroid.show(error.message || error, ToastAndroid.SHORT);
                }
            });
        },
        [realm]
    );

    return (
        <View className="p-5">
            <Controller
                control={control}
                rules={{ required: false }}
                name="code"
                defaultValue={params.code || ""}
                render={({ field: { onChange, onBlur, value } }) => (
                    <View>
                        <Text className="text-slate-500">Account Number</Text>
                        <TextInput
                            className={`${inputClass} border ${errors.code ? "border-red-500" : ""}`}
                            placeholder="Customer Account Number"
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
                name="name"
                defaultValue={params.name || ""}
                render={({ field: { onChange, onBlur, value } }) => (
                    <View>
                        <Text className="text-slate-500">Account Name</Text>
                        <TextInput
                            className={`${inputClass} border ${errors.name ? "border-red-500" : ""}`}
                            placeholder="Customer Name"
                            onBlur={onBlur}
                            onChangeText={(text) => onChange(text.toUpperCase())}
                            value={value}
                        />
                    </View>
                )}
            />

            <Controller
                control={control}
                rules={{ required: false }}
                name="address"
                defaultValue={params.address || ""}
                render={({ field: { onChange, onBlur, value } }) => (
                    <View>
                        <Text className="text-slate-500">Address</Text>
                        <TextInput
                            className={inputClass}
                            placeholder="Address"
                            onBlur={onBlur}
                            onChangeText={(text) => onChange(text.toUpperCase())}
                            value={value}
                            multiline={true}
                            numberOfLines={6}
                        />
                    </View>
                )}
            />

            <StatusBar style="auto" />
        </View>
    );
};

export default customerForm;
