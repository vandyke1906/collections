import { router } from "expo-router";
import { FlatList, View, TouchableOpacity, TextInput, ToastAndroid, Alert } from "react-native";
import { useState } from "react";
import moment from "moment";
import { useQuery, useRealm } from "@realm/react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Customer from "src/components/Customer";
import { ROUTES } from "src/common/common";

const CustomerPage = () => {
    const realm = useRealm();
    const [searchKey, setSearchKey] = useState("");
    const customers = useQuery("customers", (col) => {

        return col.filtered("deletedAt == 0 && (code BEGINSWITH[c] $0 || name CONTAINS[c] $0)", searchKey).sorted("name");
    }, [searchKey]);
    const fetchMoreData = () => { };
    return (
        <View className="flex-1 mb-5">
            <View className="items-center justify-center m-2">
                <TextInput
                    className="text-sm my-2 p-2 appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                    placeholder="Search Customer..."
                    value={searchKey}
                    onChangeText={(text) => setSearchKey(text.toUpperCase())}
                />
                <FlatList
                    showsVerticalScrollIndicator={false}
                    className="w-full"
                    data={customers}
                    keyExtractor={(item) => item._id}
                    renderItem={({ item }) => (
                        <Customer
                            data={item} enableButtons={true}
                            onEdit={() => router.push({ pathname: ROUTES.CUSTOMER_FORM, params: item })}
                            onDelete={() => {
                                Alert.alert("Delete Customer", `Do you want to delete ${item.name}?`, [
                                    { text: "Cancel" },
                                    {
                                        text: "Continue",
                                        onPress: () => {
                                            if (realm) {
                                                const custObj = realm.objectForPrimaryKey("customers", item._id);
                                                if (custObj) {
                                                    realm.write(() => {
                                                        try {
                                                            custObj.deletedAt = moment().valueOf();
                                                            // realm.delete(custObj);
                                                        } catch (error) {
                                                            ToastAndroid.show(error.message || error, ToastAndroid.SHORT);
                                                        }
                                                    });
                                                }
                                            }
                                        }
                                    }
                                ]);
                            }}
                        />
                    )}
                    onEndReached={fetchMoreData}
                    onEndReachedThreshold={0.1}
                />
            </View>

            <TouchableOpacity
                className="bg-blue-700 w-14 h-14 rounded-full flex justify-center items-center"
                style={{
                    position: "absolute",
                    bottom: 30,
                    right: 15
                }}
                onPress={() => {
                    router.push(ROUTES.CUSTOMER_FORM);
                }}
            >
                <FontAwesome size={20} name="plus" color="white" />
            </TouchableOpacity>

        </View>
    );
};

export default CustomerPage;