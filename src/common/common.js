import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import {
    writeAsStringAsync,
    StorageAccessFramework,
    EncodingType,
} from "expo-file-system";
import { getDocumentAsync } from "expo-document-picker";
import { Pressable } from "react-native";
import { Feather } from "@expo/vector-icons";
import moment from "moment";

export const APP_ID = "app-collection-vgocb";
export const GET_LOCATION_ROUTE = "https://ap-southeast-1.aws.data.mongodb-api.com/app/app-collection-vgocb/endpoint/locations";

export const QUERY_LIMIT = 5;

export const ROUTES = {
    HOME: "/(tabs)/home",
    SALES: "/(tabs)/home/sales",
    SALES_FORM: "/(tabs)/home/sales/salesForm",
    SALES_INVOICE_DETAILS: "/(tabs)/home/sales/salesInvoiceDetails",
    COLLECTIONS: "/(tabs)/home/collections",
    COLLECTIONS_FORM: "/(tabs)/home/collections/collectionForm",
    CUSTOMERS: "/(tabs)/customers",
    CUSTOMER_FORM: "/(tabs)/customers/customerForm",
    CUSTOMER_PAGE: "/(tabs)/customers/customerPage",
    PRODUCTS: "/(tabs)/products",
    PRODUCT_FORM: "/(tabs)/products/productForm",
    PRODUCT_PAGE: "/(tabs)/products/productPage",
    SETTINGS: "/(tabs)/settings",
    CUSTOMER_SELECTION: "/others/selections/customerSelection",
    PRODUCT_SELECTION: "/others/selections/productSelection",
    GROUP_SELECTION: "/others/selections/groupSelection",
    SALES_INVOICE_SELECTION: "/others/selections/salesInvoiceSelection",
    FILTER_REPORT: "/reports/filterReport",
    VIEW_REPORT: "/reports/reportView",
    WELCOME: "/welcome",
};

export const DATE_FORMAT = "(dddd), MMMM DD, YYYY";

export const MODE_OF_PAYMENT = Object.freeze({
    CASH: "CASH",
    CHEQUE: "CHEQUE",
    BIR_2307: "BIR-2307",
});

export const isMOPCheque = (value) => {
    return MODE_OF_PAYMENT[value] === MODE_OF_PAYMENT.CHEQUE;
};

export const REPORT_TYPE = Object.freeze({
    SALES: "salesInvoices",
    COLLECTIONS: "collections",
});

export const formatAmount = (number) => {
    if (!isNaN) return "0.00";
    const options = {
        style: "decimal",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    };
    return Number(number).toLocaleString("en-US", options);
};

export const formatDate = (date, options = { format: DATE_FORMAT }) => {
    if (!date) return "";
    return moment(date).format(options.format);
};

export const getDateValueOf = (date, options = { format: "" }) => {
    if (!date) return "";
    if (options.format) return moment(date, options.format).valueOf();
    return moment(date).valueOf();
};

export const showDatePicker = (options = { date: 0, onChange: () => { } }) => {
    DateTimePickerAndroid.open({
        value: options.date ? new Date(options.date) : new Date(),
        mode: "date",
        display: "calendar",
        onChange: typeof options.onChange === "function" ? options.onChange : () => { },
    });
};

export const customHeaderBackButton = (onPress = () => { }) => {
    return (
        <Pressable className="pr-8" onPress={onPress}>
            <Feather size={24} name="arrow-left" />
        </Pressable>
    );
};

export const INVOICE_STATUS = Object.freeze({
    PAID: "PAID",
    UNPAID: "UNPAID",
    PARTIAL: "PARTIAL",
});

export const saveAsFile = async (value, options = { type: "text", filename: moment().valueOf() }) => {
    try {
        const permissions = await StorageAccessFramework.requestDirectoryPermissionsAsync();
        if (!permissions.granted) throw new Error("Permission denied.");
        let extn = ".txt";
        let mimeType = "plain/text";
        switch (options.type) {
            case "json":
                extn = ".json";
                mimeType = "application/json";
                break;
        }
        // options.filename = `${options.filename}${extn}`;
        if (typeof value !== "string") throw new Error("Value must be a string.");
        const fileDir = await StorageAccessFramework.createFileAsync(
            permissions.directoryUri,
            options.filename,
            mimeType
        );
        return await writeAsStringAsync(fileDir, value, { encoding: EncodingType.UTF8 });
    } catch (error) {
        throw error;
    }
};

export const readFile = async () => {
    try {
        // const result = await getDocumentAsync({ type: "*/*" }); //allow all */*
        const result = await getDocumentAsync({
            type: ["application/json", "text/csv", "text/comma-separated-values"],
        }); //allow all */*
        if ((result?.assets || []).length) {
            const selectedFile = result.assets[0];
            const { uri, name, size, mimeType } = selectedFile;

            try {
                const fileContent = await StorageAccessFramework.readAsStringAsync(uri, {
                    encoding: EncodingType.UTF8,
                });
                let formattedContent = "";
                switch (mimeType) {
                    case "application/json": {
                        formattedContent = JSON.stringify(JSON.parse(fileContent), null, 2);
                        break;
                    } default: {
                        formattedContent = fileContent;
                        break;
                    }
                }
                console.info("File content:", formattedContent);
                return formattedContent;
            } catch (error) {
                console.error("Error reading file:", error);
            }
        } else {
            console.info("User cancelled the document picker");
        }
    } catch (error) {
        console.error("Error picking document:", error);
    }
};

export const readDirectory = () => {
    StorageAccessFramework.requestDirectoryPermissionsAsync().then(async (permissions) => {
        if (!permissions.granted) return;
        const { directoryUri } = permissions;
        const filesInRoot = await StorageAccessFramework.readDirectoryAsync(directoryUri);
        const filesInNestedFolder = await StorageAccessFramework.readDirectoryAsync(filesInRoot[0]);
        console.info({ filesInRoot, filesInNestedFolder });
    });
};

export const convertJSONtoCSV = (jsonData) => {
    const headers = Object.keys(jsonData[0]);
    let csv = headers.join(",") + "\n";
    for (let obj of jsonData) {
        const values = headers.map(header => obj[header]);
        csv += values.join(",") + "\n";
    }
    return csv;
};