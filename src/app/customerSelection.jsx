import { View, FlatList, TextInput, TouchableOpacity } from 'react-native'
import React from 'react'
import { useRoute } from '@react-navigation/native';
import { router, useNavigation } from "expo-router";
import Customer from "../components/Customer";
import { useQuery } from "@realm/react";
import moment from "moment";
import { ROUTES } from "../common/common";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import useSelection from "../store/selectionStore";

const customerSelection = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const params = route.params || {};
    const { selections, addToSelection, removeToSelection } = useSelection();

    const [searchKey, setSearchKey] = React.useState("");

    React.useEffect(() => {
        navigation.setOptions({
            headerShown: true,
            title: "Select Customer",
            headerRight: () => !!(+params?.multipleSelect) && (
                <TouchableOpacity onPress={() => {
                    router.back();
                    router.setParams({ key: moment().valueOf(), type: "customerList" });
                }}>
                    <FontAwesome size={18} name="check" color="green" />
                </TouchableOpacity>
            ),
        });
    }, [navigation]);

    const customers = useQuery("customers", (col) => {
        return col.filtered("code BEGINSWITH[c] $0 || name CONTAINS[c] $0", searchKey).sorted("name");
    }, [searchKey]);

    const fetchMoreData = () => { };

    return (
        <View className="m-2">
            <View className="relative">
                <TextInput
                    className="pr-10 my-2 p-2 appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                    placeholder="Search Customer..."
                    value={searchKey}
                    onChangeText={(text) => setSearchKey(text)}
                />
                {!!+params?.allowAdd && (
                    <TouchableOpacity className="absolute inset-y-0 right-0 flex items-center justify-center pr-4" onPress={() => {
                        router.navigate({ pathname: ROUTES.CUSTOMER_FORM });
                    }}>
                        <FontAwesome size={18} name="plus" color="gray" />
                    </TouchableOpacity>
                )}
            </View>

            <FlatList
                className="w-full"
                data={customers}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => {
                    const isExist = !!selections.find(sel => sel._id === item._id);
                    return (
                        <Customer data={item} enableButtons={false}  isActive={isExist} onSelect={() => {
                            const items = {
                                key: moment().valueOf(),
                                type: "customer",
                                ...item,
                            };
                            if (+params?.multipleSelect)
                                isExist ? removeToSelection({ key: "_id", value: item._id }, true) : addToSelection(item);
                            else {
                                router.back();
                                router.setParams(items);
                            }
                        }} />
                    );
                }}
                onEndReached={fetchMoreData}
                onEndReachedThreshold={0.1}
            />

        </View>
    )
}

export default customerSelection