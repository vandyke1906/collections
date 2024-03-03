    import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import {Picker} from '@react-native-picker/picker';
import { useCallback, useRef, useState } from "react";
import { GROUP_LIST } from "../../../.data/data";
import { useObject, useQuery, useRealm } from "@realm/react";
// import useProductStore from "../../../store/productStore";
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
                    // <Picker className={inputClass} selectedValue={value} onValueChange={(item) => onChange(item)}>
                    //     {groups.map((group, index) => <Picker.Item key={index} value={group.name} label={group.name} />)}
                    // </Picker>
                )}
            />


            <TouchableOpacity className="p-4 bg-blue-500 hover:bg-blue-700 text-white font-bold rounded-full" onPress={handleSubmit(handleAddProduct)}>
                <Text className="text-white text-center text-[16px]">Save</Text>
            </TouchableOpacity>
             <Text>
                {errors && JSON.stringify(errors)}
            </Text>
            <Text>
                {JSON.stringify(products)}
            </Text>
            </View>
    );
};

export default addProduct;