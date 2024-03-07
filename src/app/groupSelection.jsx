import { View, FlatList, TextInput, TouchableOpacity, Alert, ToastAndroid } from 'react-native'
import React from 'react'
import { useRoute } from '@react-navigation/native';
import { router, useNavigation } from "expo-router";
import Customer from "../components/Customer";
import { useQuery, useRealm } from "@realm/react";
import moment from "moment";
import { ROUTES } from "../common/common";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import GroupCard from "../components/GroupCard";
import useSelection from "../store/selectionStore";

const groupSelection = () => {
    const navigation = useNavigation();
    const realm = useRealm();
    const route = useRoute();
    const { selections, addToSelection, removeToSelection } = useSelection();
    const params = route.params || {};

    const [searchKey, setSearchKey] = React.useState("");

    React.useEffect(() => {
        navigation.setOptions({
            headerShown: true,
            title: "Select Group",
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
        return col.filtered("_id CONTAINS[c] $0", searchKey);
    }, [searchKey]);

    const fetchMoreData = () => { };

    const showAddConfirmation = () => {
         Alert.alert("Continue", `Do you want to add ${searchKey.toUpperCase()}?`, [
        {
            text: "Cancel",
            onPress: () => {},
        },
             {
                 text: "Add",
                 onPress: () => {
                     try {
                         if (!realm) throw new Error("Transaction is not ready.");
                         realm.write(() => {
                             const newGroup = searchKey.trim().toUpperCase();
                            realm.create("groups", { _id: newGroup });
                            ToastAndroid.show(`Group ${newGroup} added.`, ToastAndroid.SHORT);
                         });
                     } catch (error) {
                         ToastAndroid.show(error.message || error, ToastAndroid.SHORT);
                     }
                 }
             },
        ]);
    };

    return (
        <View className="m-2">
            <View className="relative">
                <TextInput
                    className="pr-10 my-2 p-2 appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                    placeholder="Search Group..."
                    value={searchKey}
                    onChangeText={(text) => setSearchKey(text)}
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
                className="w-full"
                data={groupList}
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
                onEndReached={fetchMoreData}
                onEndReachedThreshold={0.1}
                />
        </View>
    )
}

export default groupSelection