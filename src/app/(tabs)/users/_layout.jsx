import { Stack } from "expo-router";

const _layout = () => {
    return (
        <Stack screenOptions={{ headerShown: true, title: "Users" }}></Stack>
    );
};

export default _layout;