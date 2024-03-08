import { StatusBar } from 'expo-status-bar';
import { Pressable, Text, View } from 'react-native';
import { EncodingType, StorageAccessFramework } from "expo-file-system";
import {getDocumentAsync } from "expo-document-picker";

const Page = () => {
    const readDirectory = () => {
        StorageAccessFramework.requestDirectoryPermissionsAsync().then(async (permissions) => {
            if (!permissions.granted) return;
            const { directoryUri } = permissions;
            const filesInRoot = await StorageAccessFramework.readDirectoryAsync(directoryUri);
            const filesInNestedFolder = await StorageAccessFramework.readDirectoryAsync(filesInRoot[0]);
            console.log({ filesInRoot, filesInNestedFolder });
        });
    };

    const readFile = async () => {
        try {
            const result = await getDocumentAsync({ type: "application/json" }); //allow all */*
            if ((result?.assets || []).length) {
                const { uri, name, size, mimeType } = result.assets[0];

                try {
                    const fileContent = await StorageAccessFramework.readAsStringAsync(uri, { encoding: EncodingType.UTF8 });
                    console.log("File content:", fileContent);

                } catch (error) {
                    console.error("Error reading file:", error);
                }
            } else {
                console.log("User cancelled the document picker");
            }
        } catch (error) {
            console.error("Error picking document:", error);
        }
    };

    return (
        <View className="flex-1 items-center justify-center bg-white">
            <Pressable onPress={() => {
                readFile();
            }}>
                <Text>Browse</Text>
            </Pressable>
            <StatusBar style="auto" />
        </View>
    );
};

export default Page;