import { StatusBar } from 'expo-status-bar';
import { Text, View } from 'react-native';

const Page = () => {
    return (
        <View className="flex-1 items-center justify-center bg-white">
            <Text className="text-red-400">Index of Settings Page</Text>
            <StatusBar style="auto" />
        </View>
  )
}

export default Page