import { router } from "expo-router";
import { StatusBar } from 'expo-status-bar';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { ROUTES } from "../../../common/common";

const Page = () => {
    return (
        <View className="flex flex-col bg-white gap-y-2">

            <View className="basis-1/6">

            </View>

            <View className="basis-1/6">

            </View>
            <View className="basis-2/6 border-2" >
                <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                    <View className="block rounded-lg text-left p-2 my-2 bg-white">
                        <Text>Sales</Text>
                    </View>
                    <View className="block rounded-lg text-left p-2 my-2 bg-white">
                        <Text>Collections</Text>
                    </View>
                    <View className="block rounded-lg text-left p-2 my-2 bg-white">
                        <Text>Sales</Text>
                    </View>
                    <View className="block rounded-lg text-left p-2 my-2 bg-white">
                        <Text>Collections</Text>
                    </View>
                     <View className="block rounded-lg text-left p-2 my-2 bg-white">
                        <Text>Sales</Text>
                    </View>
                    <View className="block rounded-lg text-left p-2 my-2 bg-white">
                        <Text>Collections</Text>
                    </View>
                     <View className="block rounded-lg text-left p-2 my-2 bg-white">
                        <Text>Sales</Text>
                    </View>
                    <View className="block rounded-lg text-left p-2 my-2 bg-white">
                        <Text>Collections</Text>
                    </View>
                </ScrollView>
            </View>

            <View className="flex gap-y-2 m-5 basis-1/6">
                 <TouchableOpacity className="bg-blue-500 font-bold py-2 px-4 rounded-full" onPress={() => {
                    router.navigate({ pathname: ROUTES.SALES });
                }}>
                    <Text className="text-white">Sales</Text>
                </TouchableOpacity>

                <TouchableOpacity className="bg-blue-500 font-bold py-2 px-4 rounded-full" onPress={() => {
                    router.navigate({ pathname: ROUTES.COLLECTIONS });
                }}>
                    <Text className="text-white">Collections</Text>
                </TouchableOpacity>
            </View>

            <View className="basis-1/6">

            </View>

            <StatusBar style="auto" />
        </View>
  )
}

export default Page