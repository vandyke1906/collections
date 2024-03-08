import { View, Text, TextInput, TouchableOpacity, ToastAndroid, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { useCallback, useEffect } from "react";
import { useRealm } from "@realm/react";
import { useForm, Controller } from 'react-hook-form';
import { router, useNavigation } from "expo-router";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { ROUTES } from "../../../common/common";
import { useRoute } from '@react-navigation/native';

const productForm = () => {
    const inputClass = "text-sm my-4 p-4 appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500";

    const { control, handleSubmit, setValue, formState: { errors } } = useForm();
    const realm = useRealm();
    const navigation = useNavigation();
    const route = useRoute();
    const params = route.params || {};

    useEffect(() => {
        switch (params.type) {
            case "group": {
                setValue("group", params._id);
                break;
            }
        }
    }, [params?.key]);

    const handleSubmitProduct = useCallback((data) => {
        realm.write(() => {
            try {
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
                        product.code = data.code.trim();
                        product.name = data.name.trim();
                        product.unit = data.unit.trim();
                        product.group = data.group.trim();
                        isNew = false;
                    }
                }

                if (isNew)
                    realm.create("products", data);

                ToastAndroid.show(`Product ${isNew ? "created" : "updated"}.`, ToastAndroid.SHORT);
                navigation.goBack();
            } catch (error) {
                ToastAndroid.show(error.message || error, ToastAndroid.SHORT);
            }
        });
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

            {/* <Controller
                control={control}
                rules={{ required: false }}
                name="group"
                defaultValue={params.group || ""}
                render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput className={inputClass} autoCapitalize="characters" placeholder="group" onBlur={onBlur} onChangeText={onChange} value={value} />
                )}
            /> */}
            <Controller
                control={control}
                rules={{ required: true }}
                name="group"
                defaultValue={params.group || ""}
                render={({ field: { value } }) => (
                    <TouchableWithoutFeedback onPress={() => {
                        Keyboard.dismiss();
                    }}>
                        <View>
                            <Text className="text-slate-500">Group</Text>
                            <View className="relative">
                                <TextInput className={`${inputClass} pr-10`} autoCapitalize="characters" placeholder="Group" value={value} editable={false} />
                                <TouchableOpacity className="absolute inset-y-0 right-0 flex items-center justify-center pr-4" onPress={() => {
                                    router.navigate({ pathname: ROUTES.GROUP_SELECTION, params: { allowAdd: 1 } });
                                }}>
                                    <FontAwesome size={18} name="search" color="gray" />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                )}
            />


            <TouchableOpacity className="p-4 bg-blue-500 text-white font-bold rounded-full" onPress={handleSubmit(handleSubmitProduct)}>
                <Text className="text-white text-center text-[16px]">Save</Text>
            </TouchableOpacity>

            <Text>
                {!!Object.keys(errors).length && JSON.stringify(errors)}
            </Text>
        </View>
    );
};

export default productForm;