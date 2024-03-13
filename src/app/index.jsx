import { useApp, useRealm, useUser } from "@realm/react";
import { Redirect, router } from "expo-router";
import { useEffect } from "react";
import { ROUTES } from "src/common/common";
import Loading from "src/components/Loading";
import useUserData from "src/store/userDataStore";

const Page = () => {
    const realm = useRealm();
    const user = useUser();
    const app = useApp();
    const { location, setLocation } = useUserData();

    useEffect(() => {
        const customData = user.customData || {};
        const currentLocation = customData.location;
        if (currentLocation) {
            setLocation(currentLocation);

            realm.subscriptions.update((subs) => {
                subs.add(realm.objects("groups"));
                subs.add(realm.objects("products"));
                subs.add(realm.objects("customers").filtered("location == $0", currentLocation));
                subs.add(realm.objects("salesInvoices").filtered("location == $0", currentLocation));
                subs.add(realm.objects("salesProducts").filtered("location == $0", currentLocation));
                subs.add(realm.objects("collections").filtered("location == $0", currentLocation));
            });
            setTimeout(() => {
                router.replace({ pathname: ROUTES.HOME });
            }, 0);
        }
        else app.currentUser.logOut();
    }, [realm]);
    return <Loading />;
};

export default Page;