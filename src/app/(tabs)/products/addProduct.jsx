import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { useCallback } from "react";
import { useQuery, useRealm } from "@realm/react";
import { useForm, Controller } from 'react-hook-form';
import { useNavigation } from "expo-router";

const addProduct = () => {
    const inputClass = "my-4 p-4 appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500";

    const {  control, handleSubmit, formState: { errors }  } = useForm();
    const realm = useRealm();
    const navigation = useNavigation();

    const products = useQuery("products");
    const groups = useQuery("groups");

    const handleAddProduct = useCallback((data) => {
        try {
            realm.write(() => {
                if (data.group) {
                    const group = realm.objectForPrimaryKey("groups", data.group);
                    console.info({ group });
                    if (!group) realm.create("groups", { _id: data.group });
                }
                realm.create("products", data);
                navigation.goBack();
            });
        } catch (error) {
            console.error({error});
        }
    }, [realm]);
    return (
        <View className="p-5">
            <Text>New Product</Text>

            <Controller
                control={control}
                rules={{ required: true }}
                name="code"
                render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput className={inputClass} autoCapitalize="characters" placeholder="Code" onBlur={onBlur} onChangeText={onChange} value={value} />
                )}
            />

            <Controller
                control={control}
                rules={{ required: true }}
                name="name"
                render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput className={inputClass} autoCapitalize="characters" placeholder="Name" onBlur={onBlur} onChangeText={onChange} value={value} />
                )}
            />

            <Controller
                control={control}
                rules={{ required: true }}
                name="unit"
                render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput className={inputClass} autoCapitalize="characters" placeholder="Unit" onBlur={onBlur} onChangeText={onChange} value={value} />
                )}
            />

            <Controller
                control={control}
                rules={{ required: false }}
                name="group"
                render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput className={inputClass} autoCapitalize="characters" placeholder="group" onBlur={onBlur} onChangeText={onChange} value={value} />
                )}
            />


            <TouchableOpacity className="p-4 bg-blue-500 hover:bg-blue-700 text-white font-bold rounded-full" onPress={handleSubmit(handleAddProduct)}>
                <Text className="text-white text-center text-[16px]">Save</Text>
            </TouchableOpacity>

             <Text>
                {!!Object.keys(errors).length && JSON.stringify(errors)}
            </Text>
            </View>
    );
};

export default addProduct;