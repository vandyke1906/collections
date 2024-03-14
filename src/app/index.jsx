import { useApp, useRealm, useUser } from "@realm/react";
import { router } from "expo-router";
import { useEffect } from "react";
import { ADMIN_EMAILS, ROUTES } from "src/common/common";
import Loading from "src/components/Loading";
import useUserData from "src/store/userDataStore";

const Page = () => {
    const realm = useRealm();
    const user = useUser();
    const app = useApp();
    const { setLocation, setEmail, setUserId } = useUserData();

    useEffect(() => {
        const { customData, profile, id } = user;
        const currentLocation = customData.location;
        setUserId(id);
        setEmail(profile?.email || "");
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
                if (customData.isActive)
                    router.replace({ pathname: ROUTES.HOME });
                else
                    router.replace({ pathname: ROUTES.REQUIRED_ACTIVATION });
            }, 0);
        }
        else app.currentUser.logOut();
    }, [realm]);
    return <Loading />;
};

export default Page;