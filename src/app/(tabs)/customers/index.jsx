import {  router } from "expo-router";
import { FlatList, View, TouchableOpacity, TextInput } from "react-native";
import Customer from "../../../components/Customer";
import { useState } from "react";
import { useQuery } from "@realm/react";
import FontAwesome from "@expo/vector-icons/FontAwesome";

const CustomerPage = () => {
    const [searchKey, setSearchKey] = useState("");
    const customers = useQuery("customers", (col) => {
        return col.filtered("code BEGINSWITH[c] $0 || name CONTAINS[c] $0", searchKey);
    }, [searchKey]);
    const fetchMoreData = () => {};
    return (
        <View className="flex-1">
            <View className="items-center justify-center m-2">
                <TextInput
                    className="my-2 p-2 appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                    placeholder="Search Customer..."
                    value={searchKey}
                    onChangeText={(text) => setSearchKey(text)}
                />
                <FlatList
                    className="w-full"
                    data={customers}
                    keyExtractor={(item) => item._id}
                    renderItem={({ item }) => <Customer data={item} onEdit={() => router.navigate("/customers/addCustomer")} />}
                    onEndReached={fetchMoreData}
                    onEndReachedThreshold={0.1}
                    />
            </View>

            <TouchableOpacity
                className="bg-blue-600 w-14 h-14 rounded-full flex justify-center items-center"
                style={{
                    position: "absolute",
                    bottom: 10,
                    right: 10
                }}
                onPress={() => {
                    router.navigate("/customers/addCustomer");
                }}
            >
                <FontAwesome size={20} name="plus" color="white" />
            </TouchableOpacity>
        </View>
    );
}

export default CustomerPage