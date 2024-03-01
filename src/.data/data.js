export const GROUP_LIST = [
    { id: 1, name: "Group 1" },
    { id: 2, name: "Group 2" },
    { id: 3, name: "Group 3" },
    { id: 4, name: "Group 4" },
    { id: 5, name: "Group 5" },
];

export const PRODUCT_LIST = [
    { id: 1, code: "P-001", name: "Product 1", unit: "VLS", groupId: 1 },
    { id: 2, code: "P-002", name: "Product 2", unit: "VLS", groupId: 1 },
    { id: 3, code: "P-003", name: "Product 3", unit: "AMP", groupId: 2 },
    { id: 4, code: "P-004", name: "Product 4", unit: "BOTTLE", groupId: 2 },
    { id: 5, code: "P-005", name: "Product 5", unit: "VLS", groupId: 3 },
];

export const CUSTOMER_LIST = [
    { id: 1, code: "C-001", name: "Customer 1", address: "Address 1" },
    { id: 2, code: "C-002", name: "Customer 2", address: "Address 2" },
    { id: 3, code: "C-003", name: "Customer 3", address: "Address 3" },
];

export const SALES_LIST = [
    { id: 1, customerId: 1, poNo: "PO-0001", invoiceNo: "INV-001", siDate: "01-01-2024", prodId: 1, quantity: 5, dateDelivered: "02-02-2024", soNo: "SO-0001" },
    { id: 2, customerId: 1, poNo: "PO-0002", invoiceNo: "INV-002", siDate: "01-02-2024", prodId: 2, quantity: 10, dateDelivered: "02-05-2024", soNo: "SO-0002" },
];