import { View, Text, TextInput, Pressable, ScrollView, ToastAndroid, ActivityIndicator } from 'react-native';
import React, { useRef, useState } from 'react';
import { useApp } from "@realm/react";
import { Credentials } from "realm";

const login = () => {
    const inputClass = "text-sm my-2 p-2 appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500";

    const app = useApp();

    const refEmail = useRef();
    const refPassword = useRef();
    const [isRegister, setIsRegister] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");


    const validateEmail = (text) => {
        let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
        if (!reg.test(text))
            throw new Error("Invalid email address.");
        return text;
    };

    const loginWithCredentials = async (_email, _password) => {
        try {
            const credentials = Credentials.emailPassword({ email: _email, password: _password });
            await app.logIn(credentials);
        } catch (error) {
            throw new Error(error.message || error);
        }
    };

    handleLogin = async () => {
        setIsProcessing(true);
        try {
            await loginWithCredentials(email, password);
        } catch (error) {
            ToastAndroid.show(error.message || error, ToastAndroid.SHORT);
        }
        setIsProcessing(false);
    };

    const handleRegister = async () => {
        setIsProcessing(true);
        try {
            validateEmail(email);
            await app.emailPasswordAuth.registerUser({ email, password });
            await loginWithCredentials();

        } catch (error) {
            ToastAndroid.show(error.message || error, ToastAndroid.SHORT);
        }
        setIsProcessing(false);
    };

    const renderLogin = () => {
        return (
            <View className="flex p-4 items-center justify-center h-full">
                <View className="w-full">
                    <Text className="text-slate-500">Username</Text>
                    <TextInput
                        ref={refEmail}
                        className={inputClass}
                        placeholder="Email Address"
                        inputMode="email"
                        autoCapitalize="none"
                        autoCorrect={false}
                        returnKeyType="next"
                        onSubmitEditing={() => refPassword.current && refPassword.current.focus()}
                        onChangeText={(text) => { setEmail(text); }}
                        value={email}
                    />
                </View>
                <View className="w-full">
                    <Text className="text-slate-500">Username</Text>
                    <TextInput
                        ref={refPassword}
                        className={inputClass}
                        placeholder="Password"
                        secureTextEntry={true}
                        returnKeyType="next"
                        onSubmitEditing={() => handleLogin()}
                        onChangeText={(text) => { setPassword(text); }}
                        value={password}
                    />
                </View>

                <View className="mt-2 flex w-full flex-row items-center justify-between">
                    <Pressable className="bg-blue-500 hover:bg-blue-700 py-2 px-10 rounded focus:outline-none focus:shadow-outline" onPress={() => {
                        handleLogin();
                    }}>
                        <Text className="text-white font-bold">Login</Text>
                    </Pressable>

                    <Pressable className="inline-block align-baseline" onPress={() => {
                        setIsRegister(true);
                    }}>
                        <Text className="font-bold text-sm text-blue-500 hover:text-blue-800">Register New Account</Text>
                    </Pressable>
                </View>
            </View >
        );
    };

    const renderRegister = () => {
        return (
            <View className="flex h-full p-4 items-center justify-center">
                <View className="w-full">
                    <Text className="text-slate-500">Username</Text>
                    <TextInput
                        ref={refEmail}
                        className={inputClass}
                        placeholder="Email Address"
                        inputMode="email"
                        autoCapitalize="none"
                        autoCorrect={false}
                        returnKeyType="next"
                        onSubmitEditing={() => refPassword.current && refPassword.current.focus()}
                        onChangeText={(text) => { setEmail(text); }}
                        value={email}
                    />
                </View>
                <View className="w-full">
                    <Text className="text-slate-500">Username</Text>
                    <TextInput
                        ref={refPassword}
                        className={inputClass}
                        placeholder="Password"
                        secureTextEntry={true}
                        returnKeyType="next"
                        onChangeText={(text) => { setPassword(text); }}
                        value={password}
                    />
                </View>

                <View className="mt-2 flex w-full flex-row items-center justify-between">
                    <Pressable className="bg-blue-500 hover:bg-blue-700 py-2 px-10 rounded focus:outline-none focus:shadow-outline" onPress={() => {
                        handleRegister();
                    }}>
                        <Text className="text-white font-bold">Register</Text>
                    </Pressable>

                    <Pressable className="inline-block align-baseline" onPress={() => {
                        setIsRegister(false);
                    }}>
                        <Text className="font-bold text-sm text-blue-500 hover:text-blue-800">Back to Login</Text>
                    </Pressable>
                </View>
            </View >
        );
    };

    const renderLoading = () => {
        if (isProcessing) {
            return (
                <ActivityIndicator size="large" color="black" style={{
                    position: 'absolute', left: 0, right: 0, bottom: 0, top: 0
                }} />
            );
        } else {
            return null;
        }
    };

    return (
        <View pointerEvents={isProcessing ? "none" : "auto"}>
            {isRegister ? renderRegister() : renderLogin()}
            {renderLoading()}
        </View>
    );
};

export default login;