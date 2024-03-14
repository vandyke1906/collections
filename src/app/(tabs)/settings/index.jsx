import { StatusBar } from "expo-status-bar";
import { ScrollView, Text, ToastAndroid, View } from "react-native";
import { EncodingType, StorageAccessFramework } from "expo-file-system";
import { getDocumentAsync } from "expo-document-picker";
import { useState } from "react";
import { Button } from "react-native-paper";
import { convertCSVtoJSON, readFile } from "src/common/common";
import { useRealm } from "@realm/react";

const Page = () => {
    const [text, setText] = useState("");
    const realm = useRealm();

    return (
        <ScrollView className="bg-white">
            <View className="flex items-center justify-center p-2">
                <View className="flex gap-2 mt-10">
                    <Button icon="upload" mode="outlined" onPress={() => {
                        ToastAndroid.show("Import products is not yet available.", ToastAndroid.SHORT);
                        // readFile().then((text) => {
                        //     const jsonProducts = convertCSVtoJSON(text);
                        //     for (const product of jsonProducts) {

                        //     }
                        // });
                    }}>
                        Import Products
                    </Button>
                    <Button icon="upload" mode="outlined" onPress={() => {
                        ToastAndroid.show("Import customers is not yet available.", ToastAndroid.SHORT);
                    }}>
                        Import Customers
                    </Button>
                    <Button icon="upload" mode="outlined" onPress={() => {
                        readFile().then((data) => setText(data));
                    }}>
                        Read File
                    </Button>
                </View>
                <View className="bg-gray-200 flex-1 mt-5 w-full">
                    <Text>{text}</Text>
                </View>
            </View>
            <StatusBar style="auto" />
        </ScrollView>
    );
};

export default Page;
