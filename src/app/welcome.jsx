import { View, Text, TextInput, Pressable, ScrollView, ToastAndroid } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useEmailPasswordAuth, useApp } from "@realm/react";
import { router } from "expo-router";
import { ROUTES } from "src/common/common";
import { Credentials } from "realm";

const login = () => {
    const inputClass = "text-sm my-2 p-2 appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500";

    // const { logInWithAnonymous, result, logInWithEmailPassword, } = useAuth();
    const { logIn, result } = useEmailPasswordAuth();
    const app = useApp();

    const [isRegister, setIsRegister] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    useEffect(() => {
        // logInWithAnonymous();
        console.info({ result });
    }, []);

    useEffect(() => {
        console.error({ result });
    }, [result]);

    const validateEmail = (text) => {
        let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
        if (!reg.test(text))
            throw new Error("Invalid email address.");
        return text;
    };

    const loginWithCredentials = (_email, _password) => {
        const credentials = Credentials.emailPassword({ email: _email, password: _password });
        return app.logIn(credentials).then((user) => {
            console.info({ user });
        });
    };

    const renderLogin = () => {
        return (
            <View className="flex h-full p-4 items-center justify-center">

                <View className="w-full">
                    <Text className="text-slate-500">Username</Text>
                    <TextInput
                        className={inputClass}
                        placeholder="Email Address"
                        inputMode="email"
                        autoCapitalize="none" autoCorrect={false}
                        onChangeText={(text) => { setEmail(text); }}
                        value={email}
                    />
                </View>
                <View className="w-full">
                    <Text className="text-slate-500">Username</Text>
                    <TextInput
                        className={inputClass}
                        placeholder="Password"
                        secureTextEntry={true}
                        onChangeText={(text) => { setPassword(text); }}
                        value={password}
                    />
                </View>

                <Pressable className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded" onPress={() => {
                    console.info("#login");
                    loginWithCredentials(email, password).catch((error) => {
                        ToastAndroid.show(error.message || error, ToastAndroid.SHORT);
                    });
                }}>
                    <Text>Login</Text>
                </Pressable>

                <Pressable className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded" onPress={() => {
                    setIsRegister(true);
                }}>
                    <Text>Signup</Text>
                </Pressable>

                {/* {!result.error && <Text>Please Continue</Text>}
            <View>
                {result.pending && <ActivityIndicator />}
                {!!result.error && JSON.stringify(result.error)}
            </View> */}
            </View >
        );
    };

    const renderRegister = () => {
        return (
            <View className="flex h-full p-4 items-center justify-center">
                <View className="w-full">
                    <Text className="text-slate-500">Username</Text>
                    <TextInput
                        className={inputClass}
                        placeholder="Email Address"
                        inputMode="email"
                        autoCapitalize="none" autoCorrect={false}
                        onChangeText={(text) => { setEmail(text); }}
                        value={email}
                    />
                </View>
                <View className="w-full">
                    <Text className="text-slate-500">Username</Text>
                    <TextInput
                        className={inputClass}
                        placeholder="Password"
                        secureTextEntry={true}
                        onChangeText={(text) => { setPassword(text); }}
                        value={password}
                    />
                </View>

                <Pressable className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded" onPress={() => {
                    console.info("#register");
                    try {
                        validateEmail(email);
                        app.emailPasswordAuth.registerUser({ email, password }).then(() => {
                            return loginWithCredentials();
                        });

                    } catch (error) {
                        ToastAndroid.show(error.message || error, ToastAndroid.SHORT);
                    }
                }}>
                    <Text>Register</Text>
                </Pressable>

                <Pressable className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded" onPress={() => {
                    setIsRegister(true);
                }}>
                    <Text>Login</Text>
                </Pressable>
            </View >
        );
    };

    return (
        <ScrollView>
            {isRegister ? renderRegister() : renderLogin()}
        </ScrollView>
    );
};

export default login;