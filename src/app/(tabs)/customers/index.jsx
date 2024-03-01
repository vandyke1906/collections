import { Link } from "expo-router";
import { Text, View } from 'react-native';

const Page = () => {
    return (
        <View className="flex-1 items-center justify-center bg-white">
            <Text className="text-red-400">Index of Customer Page</Text>
            <Link href="/customers/addCustomer" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full">
                Add Customer
            </Link>
        </View>
  )
}

export default Page