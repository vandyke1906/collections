import { router } from "expo-router";
import { FlatList, View, TouchableOpacity, TextInput, ToastAndroid, Text, StatusBar, Pressable, Alert } from "react-native";
import { useEffect, useState } from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { ROUTES } from "src/common/common";
import { useUser } from "@realm/react";
import CardData from "src/components/CardData";
import useUserData from "src/store/userDataStore";

const UserPage = () => {
    const user = useUser();
    const [searchKey, setSearchKey] = useState("");
    const [dataList, setDaList] = useState([]);
    const { isAdmin, isConnected } = useUserData();

    const getUserList = () => {
        const userData = user.mongoClient("mongodb-atlas").db("collectionDB").collection("userData");
        userData.find({}).then((userList) => {
            const filteredList = userList.filter((u) => u.email.toLowerCase().includes(searchKey.toLowerCase()));
            setDaList(filteredList);
        });
    };;

    useEffect(() => {
        if (isConnected) {
            getUserList();
        }
    }, [searchKey, isConnected]);


    const handleActivateUser = (item) => {
        if (isAdmin && isConnected) {
            Alert.alert("Activate User", `Do you want to activate ${item.email}?`, [
                { text: "Cancel" },
                {
                    text: "Continue", onPress: async () => {
                        const userData = user.mongoClient("mongodb-atlas").db("collectionDB").collection("userData");
                        if (userData) {
                            try {
                                const filter = { userId: item.userId };
                                const updateDoc = { $set: { isActive: true } };
                                await userData.updateOne(filter, updateDoc);
                                getUserList();
                                ToastAndroid.show("User activated.", ToastAndroid.SHORT);
                            } catch (error) {
                                ToastAndroid.show("User failed to activate.", ToastAndroid.SHORT);
                            }
                        }
                    }
                },
            ]);
        }
    };


    const handleDeleteUser = (item) => {
        ToastAndroid.show("This feature is not yet implemented.", ToastAndroid.SHORT);
        // const currentUser = app.
        // if (currentUser) {
        //     Alert.alert("Delete User", `Do you want to delete ${item.email}?`, [
        //         { text: "Cancel" },
        //         {
        //             text: "Continue", onPress: () => {
        //                 app.deleteUser(currentUser);
        //             }
        //         },
        //     ]);
        // }
    };

    return (
        <View className="flex-1 mb-5">
            <View className="m-2">
                <TextInput
                    className="text-sm my-2 p-2 appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                    placeholder="Search Users..."
                    value={searchKey}
                    onChangeText={(text) => setSearchKey(text.toUpperCase())}
                />
                <FlatList
                    showsVerticalScrollIndicator={false}
                    className="w-full"
                    data={dataList}
                    keyExtractor={(item) => item.userId}
                    renderItem={({ item }) => {
                        return (
                            <CardData key={item.userId}>
                                <View className="p-2">
                                    <Text className="mb-2 block font-sans text-xs antialiased font-bold leading-normal text-gray-900">{item?.email || ""}</Text>
                                    {!!item?.location && <Text className="block font-sans text-xs antialiased font-xs leading-normal text-gray-700 opacity-75">Area/Location: {item.location}</Text>}
                                </View>
                                {!item.isAdmin && (
                                    <View className="pt-3 flex flex-row items-center justify-between border-t-2 border-neutral-100 font-sans text-xs antialiased font-normal leading-normal text-gray-700 opacity-75">
                                        {item.isActive ? <View cclassName="flex items-center justify-center"></View> : (
                                            <TouchableOpacity className="flex items-center justify-center" onPress={() => {
                                                handleActivateUser(item);
                                            }}>
                                                <Text className="pointer-events-auto px-5 inline-block cursor-pointer rounded text-sm font-normal leading-normal text-green-700">Confirm</Text>
                                            </TouchableOpacity>
                                        )}
                                        <TouchableOpacity className="flex items-center justify-center" onPress={() => {
                                            handleDeleteUser(item);
                                        }}>
                                            <Text className="pointer-events-auto px-5 inline-block cursor-pointer rounded text-sm font-normal leading-normal text-red-700">Delete</Text>
                                        </TouchableOpacity>
                                    </View>
                                )}
                            </CardData>
                        );
                    }}
                // onEndReached={fetchMoreData}
                // onEndReachedThreshold={0.1}
                />
            </View>

            <TouchableOpacity
                className="bg-blue-700 w-14 h-14 rounded-full flex justify-center items-center"
                style={{
                    position: "absolute",
                    bottom: 30,
                    right: 15,
                }}
                onPress={() => {
                    router.push(ROUTES.PRODUCT_FORM);
                }}
            >
                <FontAwesome size={20} name="plus" color="white" />
            </TouchableOpacity>

            <StatusBar style="auto" />
        </View>
    );
};

export default UserPage;
