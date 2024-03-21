import { useApp, useRealm, useUser } from "@realm/react";
import { router } from "expo-router";
import moment from "moment";
import { useEffect } from "react";
import { ROUTES } from "src/common/common";
import Loading from "src/components/Loading";
import useUserData from "src/store/userDataStore";

const Page = () => {
    const realm = useRealm();
    const user = useUser();
    const app = useApp();
    const { setLocation, setEmail, setUserId, setAvailableYears } = useUserData();

    useEffect(() => {
        const currentYear = moment().year();
        const years = [];
        years.push(currentYear);
        for (let i = 1; i <= 10; i++) {
            const prevYear = currentYear - i;
            years.push(prevYear);
        }
        setAvailableYears(years);
    }, []);

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
                subs.add(realm.objects("configurations").filtered("userId == $0", id));
                subs.add(realm.objects("customers").filtered("location == $0", currentLocation));
                subs.add(realm.objects("salesInvoices").filtered("location == $0", currentLocation));
                subs.add(realm.objects("salesProducts").filtered("location == $0 ", currentLocation));
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