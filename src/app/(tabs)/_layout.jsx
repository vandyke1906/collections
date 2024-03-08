import { Tabs } from "expo-router";
import FontAwesome from "@expo/vector-icons/FontAwesome";

const TabLayout = () => {
    return (
        <Tabs screenOptions={{ headerShown: false }}>
            <Tabs.Screen
                name="home"
                options={{
                    tabBarLabel: "Home",
                    title: "Home",
                    unmountOnBlur: true,
                    tabBarIcon: ({ color }) => <FontAwesome size={24} name="home" color={color} />,
                }}
            />
            <Tabs.Screen
                name="customers"
                options={{
                    tabBarLabel: "Customers",
                    title: "Customers",
                    unmountOnBlur: true,
                    tabBarIcon: ({ color }) => <FontAwesome size={24} name="users" color={color} />,
                }}
            />
            <Tabs.Screen
                name="products"
                options={{
                    tabBarLabel: "Products",
                    title: "Products",
                    unmountOnBlur: true,
                    tabBarIcon: ({ color }) => <FontAwesome size={24} name="cart-plus" color={color} />,
                }}
            />
            <Tabs.Screen
                name="settings"
                options={{
                    tabBarLabel: "Settings",
                    title: "Settings",
                    tabBarIcon: ({ color }) => <FontAwesome size={24} name="gear" color={color} />,
                }}
            />
             <Tabs.Screen
                name="others"
                options={{  href: null }} //hide tab menu
            />
        </Tabs>
    );
};

export default TabLayout;
