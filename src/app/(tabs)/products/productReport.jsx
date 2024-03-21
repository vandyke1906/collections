import { View, Text, ScrollView } from 'react-native';
import React from 'react';

const productReport = () => {
    const renderSample = () => {
        return (
            <View>
                <Text>Bezier Line Chart</Text>
            </View>
        );
    };
    return (
        <ScrollView className="p-2">
            <Text>product reports in progress</Text>
            {renderSample()}
        </ScrollView>
    );
};

export default productReport;