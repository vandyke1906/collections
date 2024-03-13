import { router } from "expo-router";
import { StatusBar } from 'expo-status-bar';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { ROUTES } from "src/common/common";
import { useApp, useQuery } from "@realm/react";
import FontAwesome from "@expo/vector-icons/FontAwesome";

const Page = () => {

    const app = useApp();

    const salesInvoiceList = useQuery("salesInvoices");
    const collectionList = useQuery("collections");
    const activeCustomers = useQuery("customers", (coll) => {
        return coll.filtered("deletedAt == 0");
    });
    const activeProducts = useQuery("products", (coll) => {
        return coll.filtered("deletedAt == 0");
    });

    return (
        // <ScrollView>
        <View className="flex flex-col bg-white gap-y-2">
            <View className="basis-1/6">
            </View>
            <View className="basis-1/5">
                <View className="flex flex-row items-stretch w-full h-full rounded-lg">
                    <Pressable className="m-2 flex-1 block rounded-lg bg-gray-200 items-center justify-center" onPress={() => router.push({ pathname: ROUTES.SALES })}>
                        <Text className="text-7xl font-sans text-blue-400">{salesInvoiceList.length}</Text>
                        <Text className="text-slate-900 font-medium text-center">Sales Invoices</Text>
                    </Pressable>

                    <Pressable className="m-2 flex-1 block rounded-lg bg-gray-200 items-center justify-center" onPress={() => router.push({ pathname: ROUTES.COLLECTIONS })}>
                        <Text className="text-7xl font-sans text-blue-400">{collectionList.length}</Text>
                        <Text className="text-slate-900 font-medium text-center">Collections</Text>
                    </Pressable>
                </View>
            </View>
            <View className="basis-1/5">
                <View className="flex flex-row items-stretch w-full h-full rounded-lg">
                    <Pressable className="m-2 flex-1 block rounded-lg bg-gray-200 items-center justify-center" onPress={() => router.push({ pathname: ROUTES.CUSTOMERS })}>
                        <Text className="text-7xl font-sans text-blue-400">{activeCustomers.length}</Text>
                        <Text className="text-slate-900 font-medium text-center">Customers</Text>
                    </Pressable>

                    <Pressable className="m-2 flex-1 block rounded-lg bg-gray-200 items-center justify-center" onPress={() => router.push({ pathname: ROUTES.PRODUCTS })}>
                        <Text className="text-7xl font-sans text-blue-400">{activeProducts.length}</Text>
                        <Text className="text-slate-900 font-medium text-center">Products</Text>
                    </Pressable>
                </View>
            </View>
            <View className="basis-1/5">
                <Pressable className="m-2 flex-1 block rounded-lg bg-gray-200 items-center justify-center" onPress={() => router.push({ pathname: ROUTES.FILTER_REPORT })}>
                    <FontAwesome size={64} name="bar-chart" color="#189AB4" />
                    <Text className="text-slate-900 font-medium text-center uppercase">View Reports</Text>
                </Pressable>
            </View>

            <View className="basis-1/5">
                <Pressable className="m-2 flex-1 block rounded-lg bg-gray-200 items-center justify-center" onPress={() => {
                    app.currentUser.logOut();
                }}>
                    <FontAwesome size={24} name="user" color="#189AB4" />
                    <Text className="text-slate-900 font-medium text-center uppercase">Logout</Text>
                </Pressable>
            </View>

            <StatusBar style="auto" />
        </View>
        // </ScrollView>
    );
};

export default Page;