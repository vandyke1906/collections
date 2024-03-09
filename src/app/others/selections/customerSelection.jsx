import { View, FlatList, TextInput, TouchableOpacity, Text, Pressable } from 'react-native';
import React, { useEffect, useState } from 'react';
import { FontAwesome } from "@expo/vector-icons";
import { useRoute } from '@react-navigation/native';
import { router, useNavigation } from "expo-router";
import { useQuery, useRealm } from "@realm/react";
import moment from "moment";
import Customer from "src/components/Customer";
import { ROUTES, customHeaderBackButton } from "src/common/common";
import useSelection from "src/store/selectionStore";
// import useCustomer from "src/store/customerStore";

const customerSelection = () => {
    const navigation = useNavigation();
    const realm = useRealm();
    const route = useRoute();
    const params = route.params || {};

    const { selections, addToSelection, removeToSelection, count } = useSelection();
    // const { dataList, counter, limit, nextCounter, resetCounter, setDataList, addToDataList, isEnd, setIsEnd } = useCustomer();

    const [searchKey, setSearchKey] = useState("");

    useEffect(() => {
        navigation.setOptions({
            headerShown: true,
            title: `Select Customer (${selections.length})`,
            headerLeft: () => customHeaderBackButton(() => {
                router.back();
            }),
            headerRight: () => !!(+params?.multipleSelect) && (
                <TouchableOpacity onPress={() => {
                    router.back();
                    router.setParams({ key: moment().valueOf(), type: "customerList" });
                }}>
                    <FontAwesome size={18} name="check" color="green" />
                </TouchableOpacity>
            ),
        });
    }, [navigation, selections]);

    useEffect(() => {

    }, []);

    const dataList = useQuery("customers", (col) => {
        return col.filtered("deletedAt == 0 && (code BEGINSWITH[c] $0 || name CONTAINS[c] $0)", searchKey).sorted("name");
    }, [searchKey]);


    // useEffect(() => {
    //     resetCounter();
    //     const result = getRecords(searchKey);
    //     setDataList(result);
    // }, [realm, searchKey]);

    // const getRecords = (searchKey) => {
    //     try {
    //         let result = realm.objects("customers").filtered("deletedAt == 0 && (code BEGINSWITH[c] $0 || name CONTAINS[c] $0)", searchKey)
    //             .sorted("name").slice((counter - 1) * limit, counter * limit);
    //         if (!result.length) setIsEnd(true);
    //         nextCounter();
    //         return Array.from(result) || [];
    //     } catch (error) {
    //         console.error(error);
    //         return [];
    //     }
    // };

    // const fetchMoreData = () => {
    //     if (isEnd) return console.info("End of record");
    //     const nextResult = getRecords(searchKey);
    //     addToDataList(nextResult);
    // };

    return (
        <View className="m-2 h-full mb-5">
            <View className="relative">
                <TextInput
                    className="text-sm pr-10 my-2 p-2 appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                    placeholder="Search Customer..."
                    value={searchKey}
                    onChangeText={(text) => setSearchKey(text.toUpperCase())}
                />

            </View>

            <FlatList
                showsVerticalScrollIndicator={false}
                className="w-full"
                data={dataList}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => {
                    const isExist = !!selections.find(sel => sel._id === item._id);
                    return (
                        <Customer data={item} enableButtons={false} isActive={isExist} onSelect={() => {
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
            // onEndReached={fetchMoreData}
            // onEndReachedThreshold={0.1}
            />

            {!!+params?.allowAdd && (
                <TouchableOpacity
                    className="bg-blue-700 w-14 h-14 rounded-full flex justify-center items-center"
                    style={{ position: "absolute", bottom: 30, right: 15 }}
                    onPress={() => {
                        router.push({ pathname: ROUTES.CUSTOMER_FORM });
                    }}
                >
                    <FontAwesome size={20} name="plus" color="white" />
                </TouchableOpacity>
            )}

        </View>
    );
};

export default customerSelection;