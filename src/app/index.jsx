import { useRealm, useUser } from "@realm/react";
import { Redirect } from "expo-router";
import { useEffect } from "react";
import { ROUTES } from "src/common/common";
import useUserData from "src/store/userDataStore";

const Page = () => {
    const realm = useRealm();
    const user = useUser();
    const { location, setLocation } = useUserData();

    useEffect(() => {
        const customData = user.customData || {};
        setLocation(customData.location || "");
    }, [user]);

    useEffect(() => {
        realm.subscriptions.update((subs) => {
            subs.add(realm.objects("groups"));
            subs.add(realm.objects("products"));
            subs.add(realm.objects("customers").filtered("location == $0", location));
            subs.add(realm.objects("salesInvoices").filtered("location == $0", location));
            subs.add(realm.objects("salesProducts").filtered("location == $0", location));
            subs.add(realm.objects("collections").filtered("location == $0", location));
        });
    }, [realm, location]);

    return (
        <Redirect href={ROUTES.HOME} />
    );
};

export default Page;