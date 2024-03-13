import { View, FlatList, TextInput, TouchableOpacity, StatusBar } from "react-native";
import React, { useEffect, useState } from "react";
import { router, useNavigation } from "expo-router";
import { useQuery, useRealm } from "@realm/react";
import moment from "moment";
import { useRoute } from "@react-navigation/native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Product from "src/components/Product";
import { ROUTES, customHeaderBackButton } from "src/common/common";
import useSelection from "src/store/selectionStore";
// import useProduct from "src/store/productStore";

const customerSelection = () => {
    const navigation = useNavigation();
    const realm = useRealm();
    const route = useRoute();
    const params = route.params || {};

    const { selections, addToSelection, removeToSelection } = useSelection();
    // const { dataList, counter, limit, nextCounter, resetCounter, setDataList, addToDataList, isEnd, setIsEnd } = useProduct();

    const [searchKey, setSearchKey] = useState("");

    useEffect(() => {
        navigation.setOptions({
            headerShown: true,
            title: `Select Product (${selections.length})`,
            headerLeft: () =>
                customHeaderBackButton(() => {
                    router.back();
                }),
            headerRight: () =>
                !!+params?.multipleSelect && (
                    <TouchableOpacity
                        onPress={() => {
                            router.back();
                            router.setParams({ key: moment().valueOf(), type: "productList" });
                        }}
                    >
                        <FontAwesome size={18} name="check" color="green" />
                    </TouchableOpacity>
                ),
        });
    }, [navigation, selections]);

    const dataList = useQuery(
        "products",
        (col) => {
            return col.filtered("code BEGINSWITH[c] $0 || name CONTAINS[c] $0", searchKey).sorted("name");
        },
        [searchKey]
    );

    return (
        <View className="m-2 mb-5 h-full">
            <View className="relative">
                <TextInput
                    className="text-sm my-2 p-2 appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                    placeholder="Search Product..."
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
                    const productId = item._id;
                    const isExist = !!selections.find((p) => p._id === productId);
                    return (
                        <Product
                            data={item}
                            enableButtons={false}
                            isActive={isExist}
                            onSelect={() => {
                                const product = {
                                    key: moment().valueOf(),
                                    type: "product",
                                    ...item,
                                    _id: productId,
                                };
                                if (+params?.multipleSelect) {
                                    isExist
                                        ? removeToSelection({ key: "_id", value: productId }, true)
                                        : addToSelection(item);
                                } else {
                                    router.back();
                                    router.setParams(product);
                                }
                            }}
                        />
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
                        router.push({ pathname: ROUTES.PRODUCT_FORM });
                    }}
                >
                    <FontAwesome size={20} name="plus" color="white" />
                </TouchableOpacity>
            )}

            <StatusBar style="auto" />
        </View>
    );
};

export default customerSelection;
