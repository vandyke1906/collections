import { View, Text, Pressable } from 'react-native';
import FontAwesome from "@expo/vector-icons/FontAwesome";
import React from 'react';
import { useApp } from "@realm/react";

const activate = () => {
    const app = useApp();
    return (
        // <View className="flex items-center justify-center">
        <View className="flex-1 border-2 p-5 items-center justify-center">
            <Text className="text-slate-700 text-center mb-5">Account required activation. Please contact administrator to activate account.</Text>
            <Pressable className="flex flex-row m-2 rounded-lg bg-gray-200 items-center justify-center p-2" onPress={() => {
                app.currentUser.logOut();
            }}>
                <Text className="text-slate-500 font-medium text-center uppercase mr-2">Logout</Text>
                <FontAwesome size={24} name="sign-out" color="gray" />
            </Pressable>
        </View>
        // </View>
    );
};

export default activate;