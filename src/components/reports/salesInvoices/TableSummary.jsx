import { View, Text, ScrollView } from 'react-native';
import React from 'react';

const TableSummary = () => {
    return (
        <ScrollView showsVerticalScrollIndicator={false}>
            <View className="grid grid-cols-4 gap-4">
                <View><Text>1</Text></View>
                <View><Text>2</Text></View>
                <View><Text>3</Text></View>
                <View><Text>4</Text></View>
                <View><Text>1</Text></View>
                <View><Text>2</Text></View>
                <View><Text>3</Text></View>
                <View><Text>4</Text></View>
                <View><Text>1</Text></View>
            </View>
        </ScrollView>
    );
};

export default TableSummary;