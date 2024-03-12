import { StatusBar } from "expo-status-bar";
import { ScrollView, Text, View } from "react-native";
import { EncodingType, StorageAccessFramework } from "expo-file-system";
import { getDocumentAsync } from "expo-document-picker";
import { useState } from "react";
import { Button } from "react-native-paper";

const Page = () => {
    const [text, setText] = useState("");
    const readDirectory = () => {
        StorageAccessFramework.requestDirectoryPermissionsAsync().then(async (permissions) => {
            if (!permissions.granted) return;
            const { directoryUri } = permissions;
            const filesInRoot = await StorageAccessFramework.readDirectoryAsync(directoryUri);
            const filesInNestedFolder = await StorageAccessFramework.readDirectoryAsync(filesInRoot[0]);
            console.info({ filesInRoot, filesInNestedFolder });
        });
    };

    const readFile = async () => {
        try {
            // const result = await getDocumentAsync({ type: "*/*" }); //allow all */*
            const result = await getDocumentAsync({
                type: ["application/json", "text/csv", "text/comma-separated-values"],
            }); //allow all */*
            if ((result?.assets || []).length) {
                const selectedFile = result.assets[0];
                const { uri, name, size, mimeType } = selectedFile;

                console.info({ mimeType });

                try {
                    const fileContent = await StorageAccessFramework.readAsStringAsync(uri, {
                        encoding: EncodingType.UTF8,
                    });
                    let formattedContent = "";
                    switch (mimeType) {
                        case "application/json": {
                            formattedContent = JSON.stringify(JSON.parse(fileContent), null, 2);
                            break;
                        } default: {
                            formattedContent = fileContent;
                            break;
                        }
                    }
                    console.info("File content:", formattedContent);
                    setText(formattedContent);
                } catch (error) {
                    console.error("Error reading file:", error);
                }
            } else {
                console.info("User cancelled the document picker");
            }
        } catch (error) {
            console.error("Error picking document:", error);
        }
    };

    return (
        <ScrollView className="bg-white">
            <View className="flex items-center justify-center mt-10">
                <Button icon="upload" mode="outlined" onPress={() => readFile()}>
                    Browse File
                </Button>
                <View className="flex-1">
                    <Text>{text}</Text>
                </View>
            </View>
            <StatusBar style="auto" />
        </ScrollView>
    );
};

export default Page;
