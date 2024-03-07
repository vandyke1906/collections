import { View, Text, TouchableOpacity, TouchableWithoutFeedback, TextInput, Keyboard } from 'react-native'
import React, { useState } from 'react'
import { useNavigation } from "expo-router";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { DATE_FORMAT, REPORT_TYPE, showDatePicker } from "../common/common";
import { Picker } from "@react-native-picker/picker";
import moment from "moment";
import { useQuery } from "@realm/react";

const report = () => {
    const inputClass = "my-2 p-2 appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500";

    const navigation = useNavigation();
    const [reportType, setReportType] = useState(Object.values(REPORT_TYPE)[0]);
    const [selectedGroup, setSelectedGroup] = useState("");
    const [dateRange, setDateRange] = useState({ from: moment().format(DATE_FORMAT), to: moment().format(DATE_FORMAT) });

    const groupList = useQuery("groups");


 React.useEffect(() => {
        navigation.setOptions({
            headerShown: true,
            title: "Reports",
            headerRight: ({color}) => (
                <TouchableOpacity onPress={() => { }}>
                    <FontAwesome size={18} name="bars" color={color} />
                </TouchableOpacity>
            ),
        });
    }, [navigation]);

  return (
      <View className="mt-5 p-2">
          <View className="">

                <Text className="text-slate-500">Type</Text>
                    <Picker selectedValue={reportType} onValueChange={setReportType}>
                        {Object.keys(REPORT_TYPE).map((objKey) => (
                            <Picker.Item key={objKey} value={REPORT_TYPE[objKey]} label={objKey} />
                        ))}
                    </Picker>
                </View>

            <View className="bg-gray-100 rounded-lg p-2">
                  <Text className="text-slate-500 my-2">Date Range</Text>

                  <TouchableWithoutFeedback onPress={() => {
                            Keyboard.dismiss();
                            showDatePicker((event, date) => {
                                if (event.type === "set")
                                    setDateRange((prevState) => ({ ...prevState, from: moment(date).format(DATE_FORMAT) }))
                            });
                        }}>
                            <View>
                                <Text className="text-slate-500 mx-2">From: </Text>
                                <TextInput className={inputClass} placeholder="Sales Invoice Date" value={dateRange.from} editable={false} />
                            </View>
                  </TouchableWithoutFeedback>

                  <TouchableWithoutFeedback onPress={() => {
                            Keyboard.dismiss();
                            showDatePicker((event, date) => {
                                if (event.type === "set")
                                    setDateRange((prevState) => ({ ...prevState, to: moment(date).format(DATE_FORMAT) }))
                            });
                        }}>
                            <View>
                                <Text className="text-slate-500 mx-2">To: </Text>
                                <TextInput className={inputClass} placeholder="Sales Invoice Date" value={dateRange.to} editable={false} />
                            </View>
                  </TouchableWithoutFeedback>
          </View>

          {reportType === REPORT_TYPE.SALES && (
               <View>
                <Text className="text-slate-500">Type</Text>
                    <Picker selectedValue={selectedGroup} onValueChange={setSelectedGroup}>
                        {groupList.map((item) => (
                            <Picker.Item key={item._id} value={item._id} label={item._id} />
                        ))}
                    </Picker>
                </View>
          )}

    </View>
  )
}

export default report