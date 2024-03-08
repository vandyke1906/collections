import { View, FlatList, TextInput, TouchableOpacity } from 'react-native'
import React from 'react'
import { useRoute } from '@react-navigation/native';
import { router, useNavigation } from "expo-router";
import Customer from "../../../../components/Customer";
import { useQuery } from "@realm/react";
import moment from "moment";
import { ROUTES } from "../../../../common/common";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import useSelection from "../../../../store/selectionStore";

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
        return col.filtered("deletedAt == 0 && code BEGINSWITH[c] $0 || name CONTAINS[c] $0", searchKey).sorted("name");
    }, [searchKey]);

    const fetchMoreData = () => { };

    return (
        <View className="m-2 h-full mb-5">
            <View className="relative">
                <TextInput
                    className="text-sm pr-10 my-2 p-2 appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                    placeholder="Search Customer..."
                    value={searchKey}
                    onChangeText={(text) => setSearchKey(text)}
                />

            </View>

            <FlatList
                showsVerticalScrollIndicator={false}
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

            {!!+params?.allowAdd && (
                <TouchableOpacity
                    className="bg-blue-700 w-14 h-14 rounded-full flex justify-center items-center"
                    style={{ position: "absolute", bottom: 30, right: 15  }}
                    onPress={() => {
                        router.navigate({ pathname: ROUTES.CUSTOMER_FORM });
                    }}
                >
                    <FontAwesome size={20} name="plus" color="white" />
                </TouchableOpacity>
            )}

        </View>
    )
}

export default customerSelection