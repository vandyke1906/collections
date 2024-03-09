import { View, FlatList, TextInput, TouchableOpacity, Alert, ToastAndroid } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useRoute } from '@react-navigation/native';
import { router, useNavigation } from "expo-router";
import { useQuery, useRealm } from "@realm/react";
import moment from "moment";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import useSelection from "@store/selectionStore";
import GroupCard from "src/components/GroupCard";
import { customHeaderBackButton } from "src/common/common";
// import useGroup from "src/store/groupStore";

const groupSelection = () => {
    const navigation = useNavigation();
    const realm = useRealm();
    const route = useRoute();
    const params = route.params || {};

    const { selections, addToSelection, removeToSelection } = useSelection();
    // const { dataList, counter, limit, nextCounter, resetCounter, setDataList, addToDataList, isEnd, setIsEnd } = useGroup();

    const [searchKey, setSearchKey] = useState("");

    useEffect(() => {
        navigation.setOptions({
            headerShown: true,
            title: `Select Group (${selections.length})`,
            headerLeft: () => customHeaderBackButton(() => {
                router.back();
            }),
            headerRight: () => !!(+params?.multipleSelect) && (
                <TouchableOpacity onPress={() => {
                    router.back();
                    router.setParams({ key: moment().valueOf(), type: "groupList" });
                }}>
                    <FontAwesome size={18} name="check" color="green" />
                </TouchableOpacity>
            ),
        });
    }, [navigation]);

    const groupList = useQuery("groups", (col) => {
        return col.filtered("_id CONTAINS[c] $0", searchKey).sorted("_id");
    }, [searchKey]);


    // useEffect(() => {
    //     resetCounter();
    //     const result = getRecords(searchKey);
    //     setDataList(result);
    // }, [realm, searchKey]);

    // const getRecords = (searchKey) => {
    //     try {
    //         let result = realm.objects("groups").filtered("_id CONTAINS[c] $0", searchKey)
    //             .sorted("_id").slice((counter - 1) * limit, counter * limit);
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
    //     addToDataList(nextResult, { isArray: true, checkBeforeAdd: true });
    // };

    const showAddConfirmation = () => {
        Alert.alert("Add Group", `Do you want to add ${searchKey.toUpperCase()}?`, [
            { text: "Cancel", onPress: () => { }, },
            {
                text: "Continue",
                onPress: () => {
                    if (!realm) ToastAndroid.show("Transaction is not ready.", ToastAndroid.SHORT);
                    realm.write(() => {
                        try {
                            const newGroup = searchKey.trim().toUpperCase();
                            const group = realm.create("groups", { _id: newGroup });
                            addToDataList(group, { isFirst: true, checkBeforeAdd: true });
                            ToastAndroid.show(`Group ${newGroup} added.`, ToastAndroid.SHORT);
                        } catch (error) {
                            ToastAndroid.show(error.message || error, ToastAndroid.SHORT);
                        }
                    });
                }
            },
        ]);
    };

    return (
        <View className="m-2 mb-3">
            <View className="relative">
                <TextInput
                    className="text-sm pr-10 my-2 p-2 appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                    placeholder="Search Group..."
                    value={searchKey}
                    onChangeText={(text) => setSearchKey(text.toUpperCase())}
                />
                {!!+params?.allowAdd && !groupList.length && !!searchKey && (
                    <TouchableOpacity className="absolute inset-y-0 right-0 flex items-center justify-center pr-4" onPress={() => {
                        showAddConfirmation();
                    }}>
                        <FontAwesome size={18} name="plus" color="gray" />
                    </TouchableOpacity>
                )}
            </View>
            <FlatList
                showsVerticalScrollIndicator={false}
                className="w-full"
                data={dataList}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => {
                    const group = item._id;
                    const isExist = !!selections.find(p => p._id === item._id);
                    return (
                        <GroupCard data={item} enableButtons={false} isActive={isExist} onSelect={() => {
                            const item = {
                                key: moment().valueOf(),
                                type: "group",
                                _id: group
                            };
                            if (+params?.multipleSelect)
                                isExist ? removeToSelection({ key: "_id", value: group }, true) : addToSelection(item);
                            else {
                                router.back();
                                router.setParams(item);
                            }
                        }} />
                    );
                }}
            // onEndReached={fetchMoreData}
            // onEndReachedThreshold={0.1}
            />
        </View>
    );
};

export default groupSelection;