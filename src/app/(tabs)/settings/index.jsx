import { StatusBar } from "expo-status-bar";
import { Alert, ScrollView, Text, ToastAndroid, View } from "react-native";
import { EncodingType, StorageAccessFramework } from "expo-file-system";
import { getDocumentAsync } from "expo-document-picker";
import { useState } from "react";
import { Button } from "react-native-paper";
import { convertCSVtoJSON, readFile, saveAsFile } from "src/common/common";
import { useRealm } from "@realm/react";

const Page = () => {
    const [text, setText] = useState("");
    const realm = useRealm();

    const insertProduct = (item, callback = () => { }) => {
        realm.write(() => {
            try {
                const isCodeExist = (_code, _id) => {
                    const regexPattern = new RegExp(_code, "i");
                    const product = realm.objects("products").find((c) => regexPattern.test(c.code));
                    if (product && _id) if (product._id === _id) return false;
                    return product;
                };

                const hasRequiredKeys = (_obj) => {
                    if (!_obj.hasOwnProperty('CODE') || !_obj.hasOwnProperty('NAME') || !_obj.hasOwnProperty('UNIT') || !_obj.hasOwnProperty('GROUP'))
                        return false;
                    if (!_obj.CODE.trim() || !_obj.NAME.trim() || !_obj.UNIT.trim() || !_obj.GROUP.trim())
                        return false;
                    return true;
                };

                const code = item.CODE.trim().toUpperCase();
                const name = item.NAME.trim().toUpperCase();
                const unit = item.UNIT.trim().toUpperCase();
                const groupName = item.GROUP && (item.GROUP || "").trim().toUpperCase();

                if (!hasRequiredKeys(item))
                    throw new Error(`Product ${item.NAME} to add must have CODE, NAME, UNIT AND GROUP.`);
                const productExist = isCodeExist(code);
                if (productExist)
                    throw new Error(`Code [${item.CODE}] already exist with product ${productExist.name}.`);
                if (groupName) {
                    const group = realm.objectForPrimaryKey("groups", groupName);
                    if (!group) realm.create("groups", { _id: groupName });
                }
                const data = {
                    code, name, unit, group: groupName,
                    indexedName: item.NAME.toLowerCase().replace(/\s/g, ""),
                };
                const productObj = realm.create("products", data);
                productObj;
                callback(null, item);
            } catch (error) {
                callback(error);
            }
        });
    };

    return (
        <ScrollView className="bg-white">
            <View className="flex items-center justify-center p-2">
                <View className="flex gap-2 mt-10">
                    <Button icon="upload" mode="outlined" onPress={() => {
                        // ToastAndroid.show("Import products is not yet available.", ToastAndroid.SHORT);
                        Alert.alert("Import Products", "Import/Download format?", [
                            { text: "Cancel" },
                            {
                                text: "Download Format", onPress: () => {
                                    const formattedText = "CODE,NAME,UNIT,GROUP";
                                    saveAsFile(formattedText, { type: "csv", filename: "product-import-format", })
                                        .then(() => {
                                            ToastAndroid.show("Format downloaded.", ToastAndroid.SHORT);
                                        }).catch(() => {
                                            ToastAndroid.show(`Failed to download format. ${error.message || error}.`, ToastAndroid.SHORT);
                                        });
                                }
                            },
                            {
                                text: "Import", onPress: () => {
                                    readFile({ type: ["text/comma-separated-values"] }).then((text) => {
                                        const jsonProducts = convertCSVtoJSON(text);
                                        for (const product of jsonProducts) {
                                            insertProduct(product, (error) => {
                                                if (error)
                                                    setText((prevText) => `${prevText}[FAILED]: Product ${product.NAME}. error: ${error?.message || error} \n`);
                                                else
                                                    setText((prevText) => `${prevText}[ADDED]: Product ${product.NAME}. \n`);
                                            });
                                        }
                                    });
                                }
                            },
                        ]);
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
        </ScrollView >
    );
};

export default Page;
