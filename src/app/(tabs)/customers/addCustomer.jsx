import { View, Text, TextInput, TouchableOpacity } from 'react-native';

const addCustomer = () => {
    const inputClass = "my-4 p-4 appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500";
    const handleAddCustomer = () => {

    };
    return (
        <View className="p-5">
            <Text>New Customer</Text>
            <TextInput className={inputClass} placeholder="Code" />
            <TextInput className={inputClass} placeholder="Name" />
            <TextInput className={inputClass} placeholder="Address" multiline={true} numberOfLines={4} />
            <TouchableOpacity className="p-4 bg-blue-500 hover:bg-blue-700 text-white font-bold rounded-full" onPress={handleAddCustomer}>
                <Text className="text-white text-center text-[16px]">Save</Text>
            </TouchableOpacity>
        </View>
    );
};


export default addCustomer;