import { router } from "expo-router";
import { FlatList, View, TouchableOpacity, TextInput, ToastAndroid, Alert, Pressable, Text } from "react-native";
import { useEffect, useState } from "react";
import moment from "moment";
import { useQuery, useRealm } from "@realm/react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Customer from "src/components/Customer";
import { REALM_QUERY_LIMIT, ROUTES } from "src/common/common";
import useQueryList from "src/store/listStore";

const CustomerPage = () => {
    const realm = useRealm();
    const [searchKey, setSearchKey] = useState("");
    const { dataList, counter, limit, nextCounter, setDataList, addToDataList, clearDataList, isEnd, setIsEnd } = useQueryList();

    const getRecords = (searchKey) => {
        try {
            console.info({ counter, start: (counter - 1) * limit, end: counter * limit });
            // let query = `deletedAt == 0 && (code BEGINSWITH[c] '${searchKey}' || name CONTAINS[c] '${searchKey}') SORT(indexedName ASC) ${REALM_QUERY_LIMIT}`;
            let query = `deletedAt == 0 && (code BEGINSWITH[c] '${searchKey}' || name CONTAINS[c] '${searchKey}')`;
            console.info(JSON.stringify(realm.objects("customers").filtered(query).sorted("indexedName", false), null, 2));
            let result = realm.objects("customers").filtered(query).sorted("indexedName", false).slice((counter - 1) * limit, counter * limit);
            if (!result.length) setIsEnd(true);
            nextCounter();
            return Array.from(result) || [];
        } catch (error) {
            console.error(error);
            return [];
        }
    };

    useEffect(() => {
        setIsEnd(false);
        clearDataList();
        const result = getRecords(searchKey);
        setDataList(result);
    }, [realm, searchKey]);

    // const customers = useQuery("customers", (col) => {
    //     let query = `deletedAt == 0 && (code BEGINSWITH[c] '${searchKey}' || name CONTAINS[c] '${searchKey}') SORT(name ASC) ${REALM_QUERY_LIMIT}`;
    //     if (queryId) query = `_id > ${queryId} && ${query}`;
    //     const result = col.filtered(query);
    //     const lastId = result[result.length - 1]?._id;
    //     console.info({ lastId });
    //     if (lastId)
    //         setQueryId(lastId);
    //     return result;
    // }, [searchKey]);

    const fetchMoreData = () => {
        if (isEnd) return console.info("End of record");
        console.info("fetch more");
        const nextResult = getRecords(searchKey);
        console.info({ type: typeof nextResult, isArray: Array.isArray(nextResult), nextResult });
        addToDataList(nextResult);
    };

    return (
        <View className="flex-1 mb-5">
            <View className="items-center justify-center m-2">
                <TextInput
                    className="text-sm my-2 p-2 appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                    placeholder="Search Customer..."
                    value={searchKey}
                    onChangeText={(text) => setSearchKey(text.toUpperCase())}
                />
                <Pressable onPress={() => {
                    fetchMoreData();
                }}>
                    <Text>get next</Text>
                </Pressable>
                <FlatList
                    showsVerticalScrollIndicator={false}
                    className="w-full"
                    data={dataList}
                    keyExtractor={(item) => item._id}
                    renderItem={({ item }) => (
                        <Customer
                            data={item} enableButtons={true}
                            onSelect={() => router.push({ pathname: ROUTES.CUSTOMER_PAGE, params: item })}
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
                // onEndReached={fetchMoreData}
                // onEndReachedThreshold={0.1}
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