import { View, Text, TextInput, TouchableOpacity, ToastAndroid } from 'react-native';
import { useCallback } from "react";
import { useRealm } from "@realm/react";
import { useForm, Controller } from 'react-hook-form';
import { useLocalSearchParams, useNavigation } from "expo-router";

const productForm = () => {
    const inputClass = "my-4 p-4 appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500";

    const {  control, handleSubmit, formState: { errors }  } = useForm();
    const realm = useRealm();
    const navigation = useNavigation();
    const params = useLocalSearchParams();

    const handleSubmitProduct = useCallback((data) => {
        try {
            realm.write(() => {
                let isNew = true;

                const isCodeExist = (_code, _id) => {
                    const regexPattern = new RegExp(data.code, 'i');
                    const product = realm.objects("products").find((c) => regexPattern.test(c.code));
                    if (product && _id)
                        if (product._id === _id) return false;
                    return !!product;
                };

                if (isCodeExist(data.code, params._id))
                    throw new Error(`Code [${data.code}] already exist.`);

                const groupName = data.group && data.group.toUpperCase();
                if (groupName) {
                    const group = realm.objectForPrimaryKey("groups", groupName);
                    if (!group) realm.create("groups", { _id: groupName });
                    data.group = groupName;
                }

                if (params._id) {
                    const product = realm.objectForPrimaryKey("products", params._id);
                    if (product) {
                        product.code = data.code;
                        product.name = data.name;
                        product.unit = data.unit;
                        product.group = data.group;
                        isNew = false;
                    }
                }

                if(isNew)
                    realm.create("products", data);

                ToastAndroid.show(`Product ${isNew ? "created" : "updated"}.`, ToastAndroid.SHORT);
                navigation.goBack();
            });
        } catch (error) {
                ToastAndroid.show(error.message || error, ToastAndroid.SHORT);
        }
    }, [realm]);
    return (
        <View className="p-5">
            <Text>New Product</Text>

            <Controller
                control={control}
                rules={{ required: true }}
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
                rules={{ required: true }}
                name="unit"
                defaultValue={params.unit || ""}
                render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput className={inputClass} autoCapitalize="characters" placeholder="Unit" onBlur={onBlur} onChangeText={onChange} value={value} />
                )}
            />

            <Controller
                control={control}
                rules={{ required: false }}
                name="group"
                defaultValue={params.group || ""}
                render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput className={inputClass} autoCapitalize="characters" placeholder="group" onBlur={onBlur} onChangeText={onChange} value={value} />
                )}
            />


            <TouchableOpacity className="p-4 bg-blue-500 hover:bg-blue-700 text-white font-bold rounded-full" onPress={handleSubmit(handleSubmitProduct)}>
                <Text className="text-white text-center text-[16px]">Save</Text>
            </TouchableOpacity>

             <Text>
                {!!Object.keys(errors).length && JSON.stringify(errors)}
            </Text>
            </View>
    );
};

export default productForm;