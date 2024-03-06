import { View, Text, TextInput, TouchableOpacity, ToastAndroid } from 'react-native';
import { useCallback } from "react";
import { useRealm } from "@realm/react";
import { useForm, Controller } from 'react-hook-form';
import { router, useLocalSearchParams } from "expo-router";
import { BSON } from "realm";

const customerForm = () => {
    const inputClass = "my-4 p-4 appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500";

    const {  control, handleSubmit, formState: { errors }  } = useForm();
    const realm = useRealm();
    const params = useLocalSearchParams();

    const handleSubmitCustomer = useCallback((data) => {
        try {
            realm.write(() => {
                let isNew = true;
                const isCodeExist = (_code, _id) => {
                    const regexPattern = new RegExp(data.code, 'i');
                    const customer = realm.objects("customers").find((c) => regexPattern.test(c.code));
                    if (customer && _id)
                        if (customer._id.toString() === _id) return false;
                    return !!customer;
                };

                if (isCodeExist(data.code, params._id))
                    throw new Error(`Code [${data.code}] already exist.`);

                if (params._id) {
                    const customer = realm.objectForPrimaryKey("customers", new BSON.UUID(params._id));
                    if (customer) {
                        customer.code = data.code;
                        customer.name = data.name;
                        customer.address = data.address;
                        isNew = false;
                    }
                }

                if (isNew)
                    realm.create("customers", data);

                ToastAndroid.show(`Customer ${isNew ? "created" : "updated"}.`, ToastAndroid.SHORT);
                router.back();
            });
        } catch (error) {
            ToastAndroid.show(error.message || error, ToastAndroid.SHORT);
        }
    }, [realm]);
    return (
        <View className="p-5">
            <Text>New Customer</Text>
             <Controller
                control={control}
                rules={{ required: false }}
                name="code"
                defaultValue={params.code || ""}
                render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput className={inputClass} autoCapitalize="characters" placeholder="Code" onBlur={onBlur} onChangeText={onChange} value={value} />
                )}
            />

             <Controller
                control={control}
                rules={{ required: true }}
                name="name"
                defaultValue={params.name || ""}
                render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput className={inputClass} autoCapitalize="characters" placeholder="Name" onBlur={onBlur} onChangeText={onChange} value={value} />
                )}
            />

             <Controller
                control={control}
                rules={{ required: false }}
                name="address"
                defaultValue={params.address || ""}
                render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput className={inputClass} autoCapitalize="characters" placeholder="Address" onBlur={onBlur} onChangeText={onChange} value={value}  multiline={true} numberOfLines={4} />
                )}
            />

            <TouchableOpacity className="p-4 bg-blue-500 hover:bg-blue-700 text-white font-bold rounded-full" onPress={handleSubmit(handleSubmitCustomer)}>
                <Text className="text-white text-center text-[16px]">Save</Text>
            </TouchableOpacity>

             <Text>
                {!!Object.keys(errors).length && JSON.stringify(errors)}
            </Text>
        </View>
    );
};


export default customerForm;