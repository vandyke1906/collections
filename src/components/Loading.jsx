import { ActivityIndicator } from "react-native";
import React from "react";

const Loading = () => {
    return (
        <ActivityIndicator size="large" color="black" style={{ position: "absolute", left: 0, right: 0, bottom: 0, top: 0 }} />
    );
};

export default Loading;