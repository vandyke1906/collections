import React, { useEffect } from 'react';
import { Stack } from "expo-router";
import { AppProvider, RealmProvider, UserProvider, useAuth } from "@realm/react";
import { Product } from "../model/Product";
import { Group } from "../model/Group";
import { Customer } from "../model/Customer";
import { OpenRealmBehaviorType } from "realm";
import { SalesInvoice } from "../model/SalesInvoice";
import { SalesProduct } from "../model/SalesProduct";
import { Collection } from "../model/Collection";
import { CollectionDetails } from "../model/CollectionDetails";

const AppLayout = () => {
    return (
        <AppProvider id="app-collection-vgocb">
            <UserProvider fallback={LoginComponent}>
                <RealmProvider
                    schema={[Product, Group, Customer, SalesInvoice, SalesProduct, Collection, CollectionDetails]}
                    sync={{
                        flexible: true,
                        // newRealmFileBehavior: {
                        //     type: OpenRealmBehaviorType.DownloadBeforeOpen
                        // },
                        // existingRealmFileBehavior: {
                        //     type: OpenRealmBehaviorType.OpenImmediately
                        // }
                    }}
                >
                <Stack screenOptions={{ headerShown: false }} />
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