import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import {Picker} from '@react-native-picker/picker';
import { useState } from "react";
import { GROUP_LIST } from "../../../.data/data";

const addProduct = () => {
    const inputClass = "my-4 p-4 appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500";
    const handleAddProduct = () => {

    };
    const [currentGroupId, setCurrentGroupId] = useState(GROUP_LIST[0].id);
    return (
        <View className="p-5">
            <Text>New Product</Text>
            <TextInput className={inputClass} placeholder="Code" />
            <TextInput className={inputClass} placeholder="Name" />
            <TextInput className={inputClass} placeholder="Unit" />
            <Picker className={inputClass} selectedValue={currentGroupId} onValueChange={(id) => setCurrentGroupId(id)}>
                {GROUP_LIST.map((group) => (
                    <Picker.Item key={group.id} value={group.id} label={group.name} />
                ))}
            </Picker>
            <TouchableOpacity className="p-4 bg-blue-500 hover:bg-blue-700 text-white font-bold rounded-full" onPress={handleAddProduct}>
                <Text className="text-white text-center text-[16px]">Save</Text>
            </TouchableOpacity>
        </View>
    );
};

export default addProduct;