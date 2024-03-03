import React, { useEffect } from 'react'
import { Stack } from "expo-router";
import { AppProvider, RealmProvider, UserProvider, useAuth } from "@realm/react";
import { Product } from "../model/Product";
import { Group } from "../model/Group";
import { Customer } from "../model/Customer";
import { OpenRealmBehaviorType } from "realm";

const AppLayout = () => {
    return (
        <AppProvider id="devicesync-zmsyi">
            <UserProvider fallback={LoginComponent}>
                <RealmProvider
                    schema={[Product, Group, Customer]}
                    deleteRealmIfMigrationNeeded={true}
                    // sync={{
                    //     flexible: true,
                    //     newRealmFileBehavior: {
                    //         type: OpenRealmBehaviorType.DownloadBeforeOpen
                    //     },
                    //     existingRealmFileBehavior: {
                    //         type: OpenRealmBehaviorType.OpenImmediately
                    //     }
                    // }}
                >
                <Stack />
                </RealmProvider>
            </UserProvider>
        </AppProvider>
  )
}

const LoginComponent = () => {
    const { logInWithAnonymous, result } = useAuth();         // Calling `useAuth()` requires AppProvider to be a parent
    useEffect(() => {
        logInWithAnonymous();
    }, [])
    return null;
};

export default AppLayout