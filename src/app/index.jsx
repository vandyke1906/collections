import { useRealm } from "@realm/react";
import { Redirect } from "expo-router";
import { useEffect } from "react";

const Page = () => {
    const realm = useRealm();
    useEffect(() => {
        realm.subscriptions.update((subs) => {
            subs.add(realm.objects("products"));
            subs.add(realm.objects("groups"));
            subs.add(realm.objects("customers"));
        });
    }, [realm])
    return (
        <Redirect href="/(tabs)/home" />
    );
};

export default Page;