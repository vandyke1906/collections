import { router } from "expo-router";
import { StatusBar } from 'expo-status-bar';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { ROUTES } from "src/common/common";
import { useApp, useObject, useQuery, useUser } from "@realm/react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import useUserData from "src/store/userDataStore";
import NetInfo from '@react-native-community/netinfo';
import { useEffect } from "react";
import { Picker } from "@react-native-picker/picker";
import moment from "moment";

const Page = () => {
    const app = useApp();
    const user = useUser();
    const { email, location, isAdmin, totalUsers, setTotalUsers, setIsConnected, isConnected, availableYears, currentYear, setCurrentYear } = useUserData();

    const activeCustomers = useQuery("customers", (coll) => {
        return coll.filtered("deletedAt == 0");
    });
    const activeProducts = useQuery("products", (coll) => {
        return coll.filtered("deletedAt == 0");
    });

    const salesInvoiceList = useQuery("salesInvoices", (coll) => {
        const currentStartDate = moment(currentYear, "YYYY").startOf("year").valueOf();
        const currentEndDate = moment(currentYear, "YYYY").endOf("year").valueOf();
        return coll.filtered("location == $0 && dateOfSI BETWEEN { $1 , $2 }", location, currentStartDate, currentEndDate);
    }, [location, currentYear]);

    const collectionList = useQuery("collections", (coll) => {
        const currentStartDate = moment(currentYear, "YYYY").startOf("year").valueOf();
        const currentEndDate = moment(currentYear, "YYYY").endOf("year").valueOf();
        return coll.filtered("location == $0 && corDate BETWEEN { $1 , $2 }", location, currentStartDate, currentEndDate);
    }, [location, currentYear]);

    useEffect(() => {
        NetInfo.fetch().then(state => {
            const hasInternet = state.isConnected && state.isInternetReachable;
            setIsConnected(hasInternet);
            if (hasInternet) {
                const userData = user.mongoClient("mongodb-atlas").db("collectionDB").collection("userData");
                userData.find({}).then((userList) => {
                    setTotalUsers(userList.length);
                });
            }
        });
    }, []);

    return (
        <View className="flex flex-col bg-white gap-y-2">
            <View className="basis-1/12">
            </View>
            <View className="basis-1/12">
                <View className="flex flex-row items-center justify-between w-full p-2">
                    <View>
                        <Text className="text-slate-400 text-1xl mr-2">Email</Text>
                        <Text className="text-blue-500 text-lg font-semibold font-serif">{email}</Text>
                    </View>
                    <View>
                        <Text className="text-slate-400 text-1xl mr-2">Area Code</Text>
                        <Text className="text-blue-500 text-2xl font-semibold font-serif">{location}</Text>
                    </View>
                </View>
            </View>
            <View className="basis-1/12">
                <View className="px-2">
                    <Text className="text-slate-400 text-1xl">Year of Records</Text>
                    <View className="">
                        <Picker selectedValue={currentYear} onValueChange={(value) => {
                            setCurrentYear(+value);
                        }}>
                            {availableYears.map((year) => {
                                return <Picker.Item key={year} value={year} label={year} />;
                            })}
                        </Picker>
                    </View>
                </View>
            </View>

            <View className="basis-2/12">
                <View className="flex flex-row items-stretch w-full h-full rounded-lg">
                    <Pressable className="m-2 flex-1 block rounded-lg bg-gray-200 items-center justify-center" onPress={() => router.push({ pathname: ROUTES.SALES })}>
                        <Text className="text-7xl font-sans text-blue-500">{salesInvoiceList.length}</Text>
                        <Text className="text-slate-900 font-medium text-center">Sales Invoices</Text>
                    </Pressable>

                    <Pressable className="m-2 flex-1 block rounded-lg bg-gray-200 items-center justify-center" onPress={() => router.push({ pathname: ROUTES.COLLECTIONS })}>
                        <Text className="text-7xl font-sans text-blue-500">{collectionList.length}</Text>
                        <Text className="text-slate-900 font-medium text-center">Collections</Text>
                    </Pressable>
                </View>
            </View>
            <View className="basis-2/12">
                <View className="flex flex-row items-stretch w-full h-full rounded-lg">
                    <Pressable className="m-2 flex-1 block rounded-lg bg-gray-200 items-center justify-center" onPress={() => router.push({ pathname: ROUTES.CUSTOMERS })}>
                        <Text className="text-7xl font-sans text-blue-500">{activeCustomers.length}</Text>
                        <Text className="text-slate-900 font-medium text-center">Customers</Text>
                    </Pressable>

                    <Pressable className="m-2 flex-1 block rounded-lg bg-gray-200 items-center justify-center" onPress={() => router.push({ pathname: ROUTES.PRODUCTS })}>
                        <Text className="text-7xl font-sans text-blue-500">{activeProducts.length}</Text>
                        <Text className="text-slate-900 font-medium text-center">Products</Text>
                    </Pressable>
                </View>
            </View>
            <View className="basis-2/12">
                <Pressable className="m-2 flex-1 block rounded-lg bg-gray-200 items-center justify-center" onPress={() => router.push({ pathname: ROUTES.FILTER_REPORT })}>
                    <FontAwesome size={48} name="file" color="rgb(59 130 246)" />
                    <Text className="mt-2 text-slate-900 font-medium text-center uppercase">Filter Reports</Text>
                </Pressable>
            </View>


            <View className="basis-1/12">
                {isAdmin && isConnected && (
                    <Pressable className="m-2 flex-1 block rounded-lg bg-gray-200 items-center justify-center" onPress={() => { router.push({ pathname: ROUTES.USERS }); }}>
                        <Text className="text-xl font-extrabold font-sans text-blue-500">{totalUsers}</Text>
                        <Text className="text-slate-900 text-sm text-center">Users</Text>
                    </Pressable>
                )}
                {/* <Pressable className="m-2 flex-1 block rounded-lg bg-gray-200 items-center justify-center" onPress={() => router.push({ pathname: ROUTES.FILTER_REPORT })}>
                    <FontAwesome size={48} name="bar-chart" color="rgb(59 130 246)" />
                    <Text className="mt-2 text-slate-900 font-medium text-center uppercase">View Graphs</Text>
                </Pressable> */}
            </View>

            <View className="basis-1/12">
                <Pressable className="m-2 flex-1 flex-row rounded-lg bg-gray-50 items-center justify-center border border-gray-400" onPress={() => {
                    app.currentUser.logOut();
                }}>
                    <Text className="text-slate-900 font-medium text-xs text-center uppercase mr-2">Logout</Text>
                    <FontAwesome size={18} name="sign-out" color="rgb(59 130 246)" />
                </Pressable>
            </View>
            <View className="basis-1/12"></View>

            <StatusBar style="auto" />
        </View>
    );
};

export default Page;