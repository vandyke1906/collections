import { router } from "expo-router";
import { StatusBar } from 'expo-status-bar';
import { Pressable, Text, View } from 'react-native';
import { ROUTES } from "../../../common/common";
import { useQuery } from "@realm/react";

const Page = () => {

    const salesInvoiceList = useQuery("salesInvoices");
    const collectionList = useQuery("collections");

    return (
        <View className="flex flex-col bg-white gap-y-2">
            <View className="basis-1/6">

            </View>
            <View className="basis-1/5">
                <View className="flex flex-row items-stretch w-full h-full rounded-lg">
                    <Pressable className="m-2 flex-1 block rounded-lg bg-gray-200 items-center justify-center" onPress={() => router.navigate({ pathname: ROUTES.SALES })}>
                        <Text className="text-7xl text-slate-600 font-sans">{salesInvoiceList.length}</Text>
                        <Text className="text-slate-400 font-medium text-center">Sales Invoices</Text>
                    </Pressable>

                    <Pressable className="m-2 flex-1 block rounded-lg bg-gray-200 items-center justify-center" onPress={() => router.navigate({ pathname: ROUTES.COLLECTIONS })}>
                        <Text className="text-7xl text-slate-600 font-sans">{collectionList.length}</Text>
                        <Text className="text-slate-400 font-medium text-center">Collections</Text>
                    </Pressable>
                </View>
            </View>

            <View className="h-full">

            </View>

            <StatusBar style="auto" />
        </View>
  )
}

export default Page