import { View, Text, ScrollView } from 'react-native';
import React, { useState } from 'react';
import { BarChart, LineChart, ProgressChart } from "react-native-chart-kit";
import { useNavigation } from "expo-router";
import { useRoute } from "@react-navigation/native";

const productReport = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const product = route.params || {};
    const [parentWidth, setParentWidth] = useState(0);

    const onParentLayout = (event) => {
        const { width } = event.nativeEvent.layout;
        setParentWidth(width);
    };

    const chartConfig = {
        // backgroundColor: "#e26a00",
        // backgroundGradientFrom: "#fb8c00", //orange
        // backgroundGradientTo: "#ffa726", //orange
        backgroundGradientFrom: "#0047AB",
        backgroundGradientTo: "#4682b4",
        // backgroundGradientFromOpacity: 0,
        // backgroundGradientToOpacity: 0.5,
        color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
        labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
        strokeWidth: 2, // optional, default 3
        barPercentage: 0.5,
        useShadowColorFromDataset: false, // optional
        propsForDots: {
            r: "6",
            strokeWidth: "2",
            stroke: "#00008B"
        }
    };

    useEffect(() => {
        navigation.setOptions({
            title: `Code: ${product.code || "Customer"}`,
        });
    }, [navigation]);

    const renderLineChart = () => {
        return (
            <View className="flex-1 my-2">
                <Text className="text-slate-700">Line Chart</Text>
                <LineChart
                    data={{
                        labels: ["January", "February", "March", "April", "May", "June"],
                        datasets: [
                            {
                                data: [
                                    Math.random() * 100,
                                    Math.random() * 100,
                                    Math.random() * 100,
                                    Math.random() * 100,
                                    Math.random() * 100,
                                    Math.random() * 100
                                ]
                            }
                        ]
                    }}
                    // width={Dimensions.get("window").width} // from react-native
                    width={parentWidth} // from react-native
                    height={220}
                    yAxisLabel="$"
                    yAxisSuffix="k"
                    yAxisInterval={1} // optional, defaults to 1
                    chartConfig={chartConfig}
                    // chartConfig={{
                    //     backgroundColor: "#e26a00",
                    //     backgroundGradientFrom: "#fb8c00",
                    //     backgroundGradientTo: "#ffa726",
                    //     decimalPlaces: 2, // optional, defaults to 2dp
                    //     color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                    //     labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                    //     style: {
                    //         borderRadius: 16
                    //     },
                    //     propsForDots: {
                    //         r: "6",
                    //         strokeWidth: "2",
                    //         stroke: "#ffa726"
                    //     }
                    // }}
                    bezier
                    style={{
                        marginVertical: 8,
                        borderRadius: 16
                    }}
                />
            </View>
        );
    };

    const renderProgressChart = () => {
        const data = {
            labels: ["Swim", "Bike", "Run"], // optional
            data: [0.4, 0.6, 0.8]
        };
        return (
            <View className="flex-1 my-2">
                <Text className="text-slate-700">Progress Chart</Text>
                <ProgressChart
                    data={data}
                    width={parentWidth}
                    height={220}
                    strokeWidth={16}
                    radius={32}
                    chartConfig={chartConfig}
                    hideLegend={false}
                />
            </View>
        );
    };

    const renderBarChart = () => {
        const data = {
            labels: ["January", "February", "March", "April", "May", "June"],
            datasets: [
                {
                    data: [20, 45, 28, 80, 99, 43]
                }
            ]
        };
        return (
            <View className="flex-1 my-2">
                <Text className="text-slate-700">Bar Chart</Text>
                <BarChart
                    data={data}
                    width={parentWidth}
                    height={220}
                    yAxisLabel="$"
                    chartConfig={chartConfig}
                // verticalLabelRotation={30}
                />
            </View>
        );
    };



    return (
        <ScrollView className="p-2">
            <Text>product reports in progress</Text>
            <View className="flex w-full mb-5" onLayout={onParentLayout}>
                {renderLineChart()}
                {renderProgressChart()}
                {renderBarChart()}
            </View>
        </ScrollView>
    );
};

export default productReport;