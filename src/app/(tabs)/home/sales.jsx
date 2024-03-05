import { View, TouchableOpacity } from 'react-native'
import FontAwesome from "@expo/vector-icons/FontAwesome";
import React from 'react'
import { ROUTES } from "../../../common/common";
import { router } from "expo-router";
import useSaleProductStore from "../../../store/saleProductStore";

const salesPage = () => {
  return (
      <View className="flex-1">
          <TouchableOpacity
                className="bg-blue-700 w-14 h-14 rounded-full flex justify-center items-center"
                style={{
                    position: "absolute",
                    bottom: 30,
                    right: 15
                }}
                onPress={() => {
                    router.navigate(ROUTES.SALES_FORM);
                }}
            >
                <FontAwesome size={20} name="plus" color="white" />
            </TouchableOpacity>
    </View>
  )
}

export default salesPage
