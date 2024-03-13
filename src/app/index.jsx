import { useRealm } from "@realm/react";
import { Redirect } from "expo-router";
import { useEffect } from "react";
import { ROUTES } from "src/common/common";

const Page = () => {
    const realm = useRealm();

    useEffect(() => {
        realm.subscriptions.update((subs) => {
            subs.add(realm.objects("groups"));
            subs.add(realm.objects("products"));
            subs.add(realm.objects("customers"));
            subs.add(realm.objects("salesInvoices"));
            subs.add(realm.objects("salesProducts"));
            subs.add(realm.objects("collections"));
        });
    }, [realm]);

    return (
        <Redirect href={ROUTES.HOME} />
    );
};

export default Page;