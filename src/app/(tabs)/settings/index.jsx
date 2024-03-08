import { StatusBar } from 'expo-status-bar';
import { Pressable, Text, View } from 'react-native';
import { StorageAccessFramework } from "expo-file-system"

const Page = () => {
    return (
        <View className="flex-1 items-center justify-center bg-white">
            <Pressable onPress={() => {
                StorageAccessFramework.requestDirectoryPermissionsAsync().then(async(permission) => {
                    if (!permissions.granted) return;
                     const { directoryUri } = permissions;
                    const filesInRoot = await SAF.readDirectoryAsync(directoryUri);
                    const filesInNestedFolder = await SAF.readDirectoryAsync(filesInRoot[0]);
                    // Both values will be the same
                    console.log({ filesInRoot, filesInNestedFolder })
                })
            }}>
                <Text>Browse</Text>
            </Pressable>
            <StatusBar style="auto" />
        </View>
  )
}

export default Page