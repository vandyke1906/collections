import { View, FlatList, TextInput, TouchableOpacity, StatusBar } from "react-native";
import React, { useEffect, useState } from "react";
import { useRoute } from "@react-navigation/native";
import { router, useNavigation } from "expo-router";
import { useQuery, useRealm } from "@realm/react";
import moment from "moment";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { ROUTES } from "@common/common";
import useSelection from "@store/selectionStore";
import InvoiceCard from "@components/InvoiceCard";
import { customHeaderBackButton } from "src/common/common";
// import useInvoice from "src/store/invoiceStore";

const salesInvoiceSelection = () => {
    const navigation = useNavigation();
    const realm = useRealm();
    const route = useRoute();
    const params = route.params || {};

    const { selections, addToSelection, removeToSelection, resetSelection } = useSelection();
    // const { dataList, counter, limit, nextCounter, resetCounter, setDataList, addToDataList, isEnd, setIsEnd } = useInvoice();

    const [searchKey, setSearchKey] = useState("");

    useEffect(() => {
        navigation.setOptions({
            headerShown: true,
            title: `Select Sales Invoice (${selections.length})`,
            headerLeft: () =>
                customHeaderBackButton(() => {
                    router.back();
                }),
            headerRight: () => (
                <TouchableOpacity
                    onPress={() => {
                        router.back();
                        router.setParams({
                            key: moment().valueOf(),
                            type: +params?.multipleSelect ? "salesInvoiceList" : "salesInvoice",
                        });
                    }}
                >
                    <FontAwesome size={18} name="check" color="green" />
                </TouchableOpacity>
            ),
        });
    }, [navigation, selections]);

    const dataList = useQuery(
        "salesInvoices",
        (col) => {
            return col.filtered("invoiceNo BEGINSWITH[c] $0", searchKey).sorted("dateOfSI");
        },
        [searchKey]
    );

    return (
        <View className="m-2 mb-5">
            <View className="relative">
                <TextInput
                    className="text-sm pr-10 my-2 p-2 appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                    placeholder="Search by Invoice Number..."
                    value={searchKey}
                    onChangeText={(text) => setSearchKey(text.toUpperCase())}
                />
                {!!+params?.allowAdd && (
                    <TouchableOpacity
                        className="absolute inset-y-0 right-0 flex items-center justify-center pr-4"
                        onPress={() => {
                            router.push({ pathname: ROUTES.SALES_FORM });
                        }}
                    >
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
                    const isExist = !!selections.find((sel) => sel._id === item._id);
                    return (
                        <InvoiceCard
                            data={item}
                            isActive={isExist}
                            onSelect={() => {
                                const currentData = {
                                    key: moment().valueOf(),
                                    type: "salesInvoice",
                                    ...item,
                                };
                                if (+params?.multipleSelect)
                                    isExist
                                        ? removeToSelection({ key: "_id", value: item._id }, true)
                                        : addToSelection(currentData);
                                else {
                                    resetSelection();
                                    addToSelection(currentData);
                                }
                            }}
                        />
                    );
                }}
            // onEndReached={fetchMoreData}
            // onEndReachedThreshold={0.1}
            />

            <StatusBar style="auto" />
        </View>
    );
};

export default salesInvoiceSelection;
