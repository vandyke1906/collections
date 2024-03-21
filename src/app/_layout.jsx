import React from 'react';
import { Stack } from "expo-router";
import { AppProvider, RealmProvider, UserProvider } from "@realm/react";
import { Product } from "src/model/Product";
import { Group } from "src/model/Group";
import { Customer } from "src/model/Customer";
import { SalesInvoice } from "src/model/SalesInvoice";
import { SalesProduct } from "src/model/SalesProduct";
import { Collection } from "src/model/Collection";
import { CollectionDetails } from "src/model/CollectionDetails";
import { Configuration } from "src/model/Configuration";
import { OpenRealmBehaviorType, OpenRealmTimeOutBehavior } from "realm";
import Loading from "src/components/Loading";
import { APP_ID } from "src/common/common";
import login from "./welcome";

const AppLayout = () => {
    const realmAccessBehavior = {
        type: OpenRealmBehaviorType.DownloadBeforeOpen,
        timeOutBehavior: OpenRealmTimeOutBehavior.OpenLocalRealm,
        timeOut: 3000,
    };
    return (
        <AppProvider id={APP_ID}>
            <UserProvider fallback={login}>
                <RealmProvider
                    schema={[Product, Group, Customer, SalesInvoice, SalesProduct, Collection, CollectionDetails, Configuration]}
                    sync={{
                        flexible: true,
                        newRealmFileBehavior: realmAccessBehavior,
                        existingRealmFileBehavior: realmAccessBehavior,
                        onError: (_, error) => {
                            console.error({ error });
                        }
                    }}
                    fallback={Loading}
                >
                    <Stack screenOptions={{ headerShown: false }} />
                </RealmProvider>
            </UserProvider>
        </AppProvider>
    );
};
export default AppLayout;