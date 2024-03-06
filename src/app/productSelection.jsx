import { View, FlatList, TextInput, ToastAndroid, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { router, useNavigation } from "expo-router";
import Product from "../components/Product";
import { useQuery } from "@realm/react";
import moment from "moment";
import { useRoute } from '@react-navigation/native';
import FontAwesome from "@expo/vector-icons/FontAwesome";
import useSalesInvoiceStore from "../store/salesInvoiceStore";


const customerSelection = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const params = route.params || {};
    const addProduct = useSalesInvoiceStore(state => state.addProduct);
    const removeProduct = useSalesInvoiceStore(state => state.removeProduct);
    const productList = useSalesInvoiceStore(state => state.list);

    const [searchKey, setSearchKey] = React.useState("");

    React.useEffect(() => {
        navigation.setOptions({
            headerShown: true,
            title: "Select Product",
            headerRight: () => (+params?.multipleSelect) && (
                <TouchableOpacity onPress={() => {
                    router.back();
                    router.setParams({ key: moment().valueOf(), type: "productList" });
                }}>
                    <FontAwesome size={18} name="check" color="green" />
                </TouchableOpacity>
            ),
        });
    }, [navigation]);

    const customers = useQuery("products", (col) => {
        return col.filtered("code BEGINSWITH[c] $0 || name CONTAINS[c] $0", searchKey).sorted("name");;
    }, [searchKey]);

    const fetchMoreData = () => { };
    return (
        <View className="m-2 border-2 h-auto">
            <TextInput
                className="my-2 p-2 appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                placeholder="Search Product..."
                value={searchKey}
                onChangeText={(text) => setSearchKey(text)}
            />
            <FlatList
                className="w-full"
                data={customers}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => {
                    const productId = item._id.toString();
                    const productExist = !!productList.find(p => p._id === productId);
                    return (
                        <Product data={item} enableButtons={false} isActive={productExist} onSelect={() => {
                            const product = {
                                key: moment().valueOf(),
                                type: "product",
                                ...item,
                                _id: productId
                            };
                            if (+params?.multipleSelect) {
                                productExist ? removeProduct(productId) : addProduct(product);
                            } else {
                                router.back();
                                router.setParams(product);
                            }
                        }} />
                    )
                }}
                onEndReached={fetchMoreData}
                onEndReachedThreshold={0.1}
                />
        </View>
    )
}

export default customerSelection