import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
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
    PRODUCTS: "/(tabs)/products",
    PRODUCT_FORM: "/(tabs)/products/productForm",
    SETTINGS: "/(tabs)/settings",
    CUSTOMER_SELECTION: "/customerSelection",
    PRODUCT_SELECTION: "/productSelection",
};

export const DATE_FORMAT = "(dddd), MMMM DD, YYYY";

export const MODE_OF_PAYMENT = Object.freeze({
    CASH: "CASH",
    CHEQUE: "CHEQUE",
    BIR_2307: "BIR-2307"
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

export const showDatePicker = (onChange = () => { }) => {
    DateTimePickerAndroid.open({
        value: new Date(),
        mode: "date",
        display: "calendar",
        onChange: typeof onChange === "function" ? onChange : () => { }
    });
};
