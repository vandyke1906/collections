import React, { useEffect } from 'react';
import { Stack } from "expo-router";
import { AppProvider, RealmProvider, UserProvider, useAuth } from "@realm/react";
import { Product } from "../model/Product";
import { Group } from "../model/Group";
import { Customer } from "../model/Customer";
import { SalesInvoice } from "../model/SalesInvoice";
import { SalesProduct } from "../model/SalesProduct";
import { Collection } from "../model/Collection";
import { CollectionDetails } from "../model/CollectionDetails";
import { OpenRealmBehaviorType, OpenRealmTimeOutBehavior } from "realm";
import { ActivityIndicator, Text, View } from "react-native";

const AppLayout = () => {
  const realmAccessBehavior = {
    type: OpenRealmBehaviorType.DownloadBeforeOpen,
    timeOutBehavior: OpenRealmTimeOutBehavior.OpenLocalRealm,
    timeOut: 1000,
  };
    return (
        <AppProvider id="app-collection-vgocb">
            <UserProvider fallback={LoginComponent}>
                <RealmProvider
                    schema={[Product, Group, Customer, SalesInvoice, SalesProduct, Collection, CollectionDetails]}
                    sync={{
                        flexible: true,
                        newRealmFileBehavior: realmAccessBehavior,
                        existingRealmFileBehavior: realmAccessBehavior,
                        onError: console.error
                    }}
                >
                <Stack screenOptions={{ headerShown: false }} />
                </RealmProvider>
            </UserProvider>
        </AppProvider>
  )
}

const LoginComponent = () => {
    const { logInWithAnonymous, result } = useAuth();
    useEffect(() => {
        logInWithAnonymous();
    }, [])
    return (
    <View className="flex h-full w-full items-center justify-center">
        {!result.error && <Text>Please Continue</Text>}
        <View>
            {result.pending && <ActivityIndicator />}
            {result.error && JSON.stringify(result.error)}
        </View>
    </View>
  );
};

export default AppLayout