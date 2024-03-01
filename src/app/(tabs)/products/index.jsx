import { Link } from "expo-router";
import { Text, View } from 'react-native';
import { PRODUCT_LIST } from "../../../.data/data";
import Product from "../../../components/Product";

const addProduct = () => {
    return (
        <View className="flex-1 items-center bg-white">
            <Text className="text-red-400">Index of Product Page</Text>
            <Link href="/products/addProduct" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full">
                Add Product
            </Link>
            {PRODUCT_LIST.map((product) => <Product />)}
        </View>
  )
}

export default addProduct