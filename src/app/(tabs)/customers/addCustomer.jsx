import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { useCallback } from "react";
import { useRealm } from "@realm/react";
import { useForm, Controller } from 'react-hook-form';
import { useNavigation } from "expo-router";

const addCustomer = () => {
    const inputClass = "my-4 p-4 appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500";

    const {  control, handleSubmit, formState: { errors }  } = useForm();
    const realm = useRealm();
    const navigation = useNavigation();

    const handleAddCustomer = useCallback((data) => {
        try {
            realm.write(() => {
                realm.create("customers", data);
                navigation.goBack();
            });
        } catch (error) {
            console.error({error});
        }
    }, [realm]);
    return (
        <View className="p-5">
            <Text>New Customer</Text>
             <Controller
                control={control}
                rules={{ required: false }}
                name="code"
                defaultValue=""
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
                rules={{ required: false }}
                name="address"
                defaultValue=""
                render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput className={inputClass} autoCapitalize="characters" placeholder="Address" onBlur={onBlur} onChangeText={onChange} value={value}  multiline={true} numberOfLines={4} />
                )}
            />

            <TouchableOpacity className="p-4 bg-blue-500 hover:bg-blue-700 text-white font-bold rounded-full" onPress={handleSubmit(handleAddCustomer)}>
                <Text className="text-white text-center text-[16px]">Save</Text>
            </TouchableOpacity>

             <Text>
                {!!Object.keys(errors).length && JSON.stringify(errors)}
            </Text>
        </View>
    );
};


export default addCustomer;