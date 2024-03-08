import { View, Text, TouchableOpacity } from 'react-native';
import React, { useEffect } from 'react';
import { useRealm } from "@realm/react";
import { useNavigation } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";
import TableSummary from "src/components/reports/salesInvoices/TableSummary";

const customerPage = () => {

    const navigation = useNavigation();
    const realm = useRealm();

    useEffect(() => {
        navigation.setOptions({
            title: "Customer Page",
            headerRight: () => (
                <TouchableOpacity className="py-3 pl-10 pr-3" onPress={() => { }}>
                    <FontAwesome size={18} name="check" color="green" />
                </TouchableOpacity>
            ),
        });
    }, [navigation]);

    return (
        <View className="border-2 w-full">
            <Text>customerPage</Text>
            <TableSummary />
        </View>
    );
};

export default customerPage;