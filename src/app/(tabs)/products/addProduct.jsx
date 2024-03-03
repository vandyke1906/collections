import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import {Picker} from '@react-native-picker/picker';
import { useCallback, useRef, useState } from "react";
import { GROUP_LIST } from "../../../.data/data";
import { useQuery, useRealm } from "@realm/react";
import useProductStore from "../../../store/productStore";
import { useForm, Controller } from 'react-hook-form';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';

const addProduct = () => {
    const inputClass = "my-4 p-4 appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500";
    const refBottomSheet = useRef<BottomSheet>(null);


    const {  control, handleSubmit, formState: { errors }  } = useForm();
    const realm = useRealm();
    // const products = useQuery("products");
    const groups = useQuery("groups");
    const handleAddProduct = useCallback((data) => {
        realm.write(() => {
            return realm.create("products", data);
        });
    }, [realm]);
    // const handleAddProduct = useProductStore((state) => state.addProduct)
    // const handleAddProduct = (data) => {
    //     const add = useProductStore((state) => state.addProduct);
    //     console.info({ data });
    //     add(data);
    // };
    // const [currentGroupId, setCurrentGroupId] = useState(GROUP_LIST[0].id);
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
                rules={{ required: true }}
                name="group"
                render={({ field: { onChange, value } }) => (
                    <Picker className={inputClass} selectedValue={value} onValueChange={(item) => onChange(item)}>
                        {groups.map((group, index) => <Picker.Item key={index} value={group.name} label={group.name} />)}
                    </Picker>
                )}
            />


            <TouchableOpacity className="p-4 bg-blue-500 hover:bg-blue-700 text-white font-bold rounded-full" onPress={handleSubmit((data) => {
                console.info({ data });
                handleAddProduct(data);

            })}>
                <Text className="text-white text-center text-[16px]">Save</Text>
            </TouchableOpacity>
             <Text>
                {errors && JSON.stringify(errors)}
            </Text>
            <Text>
                {/* {JSON.stringify(products)} */}
            </Text>
            <BottomSheet
                ref={refBottomSheet}
                snapPoints={["30%"]}
                enablePanDownToClose={true}
            >
                <Text>test</Text>
            </BottomSheet>
        </View>
    );
};

export default addProduct;