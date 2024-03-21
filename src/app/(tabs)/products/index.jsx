import { router } from "expo-router";
import { FlatList, View, TouchableOpacity, TextInput, ToastAndroid, Alert, StatusBar } from "react-native";
import { useCallback, useState } from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { ROUTES } from "src/common/common";
import Product from "src/components/Product";
import { useRealm, useQuery } from "@realm/react";
import moment from "moment";
import useUserData from "src/store/userDataStore";

const ProductPage = () => {
    const realm = useRealm();
    const [searchKey, setSearchKey] = useState("");
    const { isAdmin } = useUserData();

    const dataList = useQuery("products", (coll) => {
        return coll.filtered("deletedAt == 0 && (code BEGINSWITH[c] $0 || name CONTAINS[c] $0)", searchKey).sorted("indexedName");
    }, [searchKey]);

    const handleDeleteProduct = useCallback(() => {
        if (realm) {
            const prodObj = realm.objectForPrimaryKey("products", item._id);
            if (prodObj) {
                realm.write(() => {
                    try {
                        prodObj.deletedAt = moment().valueOf();
                    } catch (error) {
                        ToastAndroid.show(
                            error.message || error,
                            ToastAndroid.SHORT
                        );
                    }
                });
            }
        }
    }, [realm]);

    return (
        <View className="flex-1 mb-5">
            <View className="m-2">
                <TextInput
                    className="text-sm my-2 p-2 appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                    placeholder="Search Product..."
                    value={searchKey}
                    onChangeText={(text) => setSearchKey(text.toUpperCase())}
                />
                <FlatList
                    showsVerticalScrollIndicator={false}
                    className="w-full"
                    data={dataList}
                    keyExtractor={(item) => item._id}
                    renderItem={({ item }) => (
                        <Product
                            data={item}
                            enableButtons={true}
                            onSelect={() => router.push({ pathname: ROUTES.PRODUCT_VIEW, params: item })}
                            onEdit={() => router.push({ pathname: ROUTES.PRODUCT_FORM, params: item })}
                            onDelete={() => {
                                if (!isAdmin) ToastAndroid.show("Permission denied. Only admin can delete a product.");
                                else
                                    Alert.alert("Delete Product", `Do you want to delete ${item.name}?`, [
                                        { text: "Cancel" },
                                        {
                                            text: "Continue",
                                            onPress: () => handleDeleteProduct(item),
                                        },
                                    ]);
                            }}
                        />
                    )}
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

export default ProductPage;
