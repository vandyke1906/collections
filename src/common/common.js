import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import moment from "moment";

export const ROUTES = {
    HOME: "/(tabs)/home",
    SALES: "/(tabs)/home/sales",
    SALES_INVOICE_DETAILS: "/(tabs)/home/sales/salesInvoiceDetails",
    COLLECTIONS: "/(tabs)/home/collections",
    CUSTOMERS: "/(tabs)/customers",
    PRODUCTS: "/(tabs)/products",
    SETTINGS: "/(tabs)/settings",
    SALES_FORM: "/(tabs)/others/forms/salesForm",
    COLLECTIONS_FORM: "/(tabs)/others/forms/collectionForm",
    CUSTOMER_FORM: "/(tabs)/others/forms/customerForm",
    PRODUCT_FORM: "/(tabs)/others/forms/productForm",
    CUSTOMER_SELECTION: "/(tabs)/others/selections/customerSelection",
    PRODUCT_SELECTION: "/(tabs)/others/selections/productSelection",
    GROUP_SELECTION: "/(tabs)/others/selections/groupSelection",
    SALES_INVOICE_SELECTION: "/(tabs)/others/selections/salesInvoiceSelection",
    FILTER_REPORT: "/reports/filterReport",
    VIEW_REPORT: "/reports/reportView",
};

export const DATE_FORMAT = "(dddd), MMMM DD, YYYY";

export const MODE_OF_PAYMENT = Object.freeze({
    CASH: "CASH",
    CHEQUE: "CHEQUE",
    BIR_2307: "BIR-2307"
});

export const REPORT_TYPE = Object.freeze({
    SALES: "salesInvoices",
    COLLECTIONS: "collections",
});

export const amountFormat = (number) => {
    if (!isNaN) return "0.00";
    const options = {
        style: 'decimal',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    };
    return (Number(number)).toLocaleString("en-US", options);
};

export const formatDate = (date) => {
    if (!date) return "";
    return moment(date).format(DATE_FORMAT);
};

export const getDateValueOf = (date) => {
    if (!date) return "";
    return moment(date).valueOf();
};

export const showDatePicker = (onChange = () => { }) => {
    DateTimePickerAndroid.open({
        value: new Date(),
        mode: "date",
        display: "calendar",
        onChange: typeof onChange === "function" ? onChange : () => { }
    });
};
