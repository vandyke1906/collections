import { View, TouchableOpacity } from 'react-native'
import FontAwesome from "@expo/vector-icons/FontAwesome";
import React from 'react'
import { ROUTES } from "../../../../common/common";
import { router, useNavigation } from "expo-router";
import { useRealm } from "@realm/react";

const collections = () => {

    const navigation = useNavigation();
    const realm = useRealm();

    useEffect(() => {
        navigation.setOptions({ headerShown: true, title: "Collections" });
    }, [navigation]);

  return (
    <View className="flex-1">
        <TouchableOpacity
                className="bg-blue-700 w-14 h-14 rounded-full flex justify-center items-center"
                style={{
                    position: "absolute",
                    bottom: 30,
                    right: 15
                }}
                onPress={() => {
                    router.navigate(ROUTES.COLLECTIONS_FORM);
                }}
            >
                <FontAwesome size={20} name="plus" color="white" />
            </TouchableOpacity>
    </View>
  )
}

export default collections