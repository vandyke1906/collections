import { router } from "expo-router";
import { StatusBar } from 'expo-status-bar';
import { Text, TouchableOpacity, View } from 'react-native';
import { ROUTES } from "../../../common/common";

const Page = () => {
    return (
        <View className="flex-1 items-center justify-center bg-white gap-y-2">
            <Text className="text-red-400">Index of Home Page</Text>
            <TouchableOpacity className="bg-blue-500 font-bold py-2 px-4 rounded-full" onPress={() => {
                router.navigate({ pathname: ROUTES.SALES });
            }}>
                <Text className="text-white ">Sales Logs</Text>
            </TouchableOpacity>
            <TouchableOpacity className="bg-blue-500 font-bold py-2 px-4 rounded-full" onPress={() => {
                router.navigate({ pathname: ROUTES.COLLECTIONS });
            }}>
                <Text className="text-white ">Collection Logs</Text>
            </TouchableOpacity>
            <StatusBar style="auto" />
        </View>
  )
}

export default Page