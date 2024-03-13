import { StatusBar } from "expo-status-bar";
import { ScrollView, Text, View } from "react-native";
import { EncodingType, StorageAccessFramework } from "expo-file-system";
import { getDocumentAsync } from "expo-document-picker";
import { useState } from "react";
import { Button } from "react-native-paper";
import { readFile } from "src/common/common";

const Page = () => {
    const [text, setText] = useState("");

    return (
        <ScrollView className="bg-white">
            <View className="flex items-center justify-center mt-10">
                <Button icon="upload" mode="outlined" onPress={() => {
                    readFile().then((data) => setText(data));

                }}>
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
