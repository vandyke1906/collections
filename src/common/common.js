import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import { Pressable } from "react-native";
import { Feather } from "@expo/vector-icons";
import moment from "moment";

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
};

export const DATE_FORMAT = "(dddd), MMMM DD, YYYY";

export const MODE_OF_PAYMENT = Object.freeze({
    CASH: "CASH",
    CHEQUE: "CHEQUE",
    BIR_2307: "BIR-2307"
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
        style: 'decimal',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    };
    return (Number(number)).toLocaleString("en-US", options);
};

export const formatDate = (date, options = { format: DATE_FORMAT }) => {
    if (!date) return "";
    return moment(date).format(options.format);
};

export const getDateValueOf = (date, options = { format: "" }) => {
    if (!date) return "";
    if (options.format)
        return moment(date, options.format).valueOf();
    return moment(date).valueOf();
};

export const showDatePicker = (options = { date: 0, onChange: () => { } }) => {
    DateTimePickerAndroid.open({
        value: options.date ? new Date(options.date) : new Date(),
        mode: "date",
        display: "calendar",
        onChange: typeof options.onChange === "function" ? options.onChange : () => { }
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
    PARTIAL: "PARTIAL"
});