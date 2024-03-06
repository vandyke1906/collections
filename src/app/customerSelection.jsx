import { View, FlatList, TextInput } from 'react-native'
import React from 'react'
import { router, useNavigation } from "expo-router";
import Customer from "../components/Customer";
import { useQuery } from "@realm/react";
import moment from "moment";

const customerSelection = () => {
    const navigation = useNavigation();

    const [searchKey, setSearchKey] = React.useState("");

    React.useEffect(() => {
        navigation.setOptions({
            headerShown: true,
            title: "Select Customer"
        });
    }, [navigation]);

    const customers = useQuery("customers", (col) => {
        return col.filtered("code BEGINSWITH[c] $0 || name CONTAINS[c] $0", searchKey).sorted("name");
    }, [searchKey]);

    const fetchMoreData = () => { };

    return (
        <View className="m-2">
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
                renderItem={({ item }) => <Customer data={item} enableButtons={false} onSelect={() => {
                    router.back();
                    const params = {
                        key: moment().valueOf(),
                        type: "customer",
                        ...item,
                        _id: item._id.toString()
                    };
                    router.setParams(params);
                }} />}
                onEndReached={fetchMoreData}
                onEndReachedThreshold={0.1}
                />
        </View>
    )
}

export default customerSelection