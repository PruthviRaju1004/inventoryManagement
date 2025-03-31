import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface AuthResponse {
  message: string;
  token?: string;
  user: {
    organizationId: number;
  };
}

export interface LoginUser {
  email: string;
  password: string;
}

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  roleId: number;
  password: string;
  phoneNumber: string;
  username: string;
  organizationId: number;
}

export interface CreateUserRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  roleId: number;
  phoneNumber: string;
  username: string;
  organizationId: number;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  password: string;
}

export interface VerifyRegistrationRequest {
  token: string;
}

export interface UpdateUserRoleRequest {
  userId: number;
  roleId: number;
}

export interface DeleteUserRequest {
  userId: number;
}

export interface Organization {
  id: number;
  name: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  is_active: boolean;
  createdAt: string;
  taxId?: string;
  dunsNumber?: string;
  website?: string;
  socialMedia?: Record<string, string>;
  legalProofs?: string[];
  createdBy: number;
  updatedBy: number;
}

export interface CreateOrganizationPayload {
  name: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  taxId?: string;
  dunsNumber?: string;
  website?: string;
  socialMedia?: Record<string, string>;
  legalProofs?: File[];
}

export interface Supplier {
  id: number;
  organizationId: number;
  name: string;
  supplierCode: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  paymentTerms: string;
  currency: string;
  taxId: string;
  createdBy: number;
  updatedBy: number;
}

export interface CreateSupplierPayload {
  organizationId: number;
  name: string;
  supplierCode: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  paymentTerms: string;
  currency: string;
  taxId: string;
}

export interface Customer {
  id: number;
  organizationId: number;
  name: string;
  customerCode: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  paymentTerms: string;
  currency: string;
  taxId: string;
  createdBy: number;
  updatedBy: number;
}

export interface CreateCustomerPayload {
  organizationId: number;
  name: string;
  customerCode: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  paymentTerms: string;
  currency: string;
  taxId: string;
}

export interface Warehouse {
  id: number;
  organizationId: number;
  name: string;
  code: string;
  address: string;
  contactEmail: string;
  contactPhone: string;
  latitude: number;
  longitude: number;
  isActive: boolean;
  createdBy: number;
  updatedBy: number;
  sqFoot: number,
  noOfDocks: number,
  lotSize: number,
  shelvesRacks: number
}

export interface CreateWarehousePayload {
  organizationId: number;
  name: string;
  code: string;
  address: string;
  contactEmail: string;
  contactPhone: string;
  latitude: number;
  longitude: number;
  sqFoot: number,
  noOfDocks: number,
  lotSize: number,
  shelvesRacks: number
  isActive: boolean;
}

export interface Item {
  id: number;
  organizationId: number;
  name: string;
  itemCode: string;
  description?: string;
  searchDescription?: string;
  baseUom: string;
  secondaryUom?: string;
  qtyPerUom?: string;   // Changed to string for precision
  salesUom?: string;
  purchaseUom?: string;
  type: string;
  inventoryGroup?: string;
  itemCategoryCode?: string;
  parentCategory?: string;
  productType?: string;
  hsnSacCode?: string;
  gstCredit: boolean;
  make?: string;
  color?: string;
  size?: string;
  blocked: boolean;
  unitPrice: string;      // Changed to string for monetary precision
  costingMethod: string;
  costPrice?: string;     // Changed to string for monetary precision
  commissionEligible: boolean;
  commissionFactor?: string; // Changed to string for fractional values
  businessUnitName?: string;
  leadTimeDays?: number;
  barcode?: string;
  reorderLevel?: number;
  safetyStockLevel?: number;
  expirationDate?: string;
  isPerishable: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy: number;
  updatedBy: number;
}

export interface CreateItemPayload {
  organizationId: number;
  name: string;
  itemCode: string;
  description?: string;
  searchDescription?: string;
  baseUom: string;
  secondaryUom?: string;
  qtyPerUom?: string;
  salesUom?: string;
  purchaseUom?: string;
  type: string;
  inventoryGroup?: string;
  itemCategoryCode?: string;
  parentCategory?: string;
  productType?: string;
  hsnSacCode?: string;
  gstCredit: boolean;
  make?: string;
  color?: string;
  size?: string;
  blocked: boolean;
  unitPrice: string;
  costingMethod: string;
  costPrice?: string;
  commissionEligible: boolean;
  commissionFactor?: string;
  businessUnitName?: string;
  leadTimeDays?: number;
  barcode?: string;
  reorderLevel?: number;
  safetyStockLevel?: number;
  expirationDate?: string;
  isPerishable: boolean;
  isActive: boolean;
}

export interface SupplierSite {
  id: number;
  supplierId: number;
  siteName: string;
  siteCode: string;
  address: string;
  contactEmail: string;
  contactName: string;
  contactPhone: string;
  latitude: number;
  longitude: number;
  isActive: boolean;
  createdBy: number;
  updatedBy: number;
}

export interface CreateSupplierSitePayload {
  supplierId: number;
  siteCode: string;
  siteName: string;
  address: string;
  contactEmail: string;
  contactName: string;
  contactPhone: string;
  latitude: number;
  longitude: number;
  // isActive: boolean;
}

export interface PurchaseOrder {
  id: number;
  organizationId: number;
  supplierId: number;
  orderNumber: string;
  status: string;
  totalAmount: number;
  // paymentTerms: string;
  orderDate: string;
  expectedDate?: string;
  receivedDate?: string;
  remarks?: string;
  isActive: boolean;
  createdBy: number;
  updatedBy: number;
  supplier: {
    id: number;
    name: string;
    contactEmail: string;
    contactName: string;
  };
  purchaseOrderItems: {
    itemName: string;
    supply_quantity: number;
    id: number;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    itemId: number;
    // supplierUnitPrice: number;
  }[];
}

export interface CreatePurchaseOrderPayload {
  organizationId: number;
  supplierId: number;
  orderDate: string;
  status: string;
  totalAmount: number;
  expectedDate?: string;
  remarks?: string;
  purchaseOrderItems: {
    itemId: number;
    quantity: number;
    unitPrice: number;
    uom?: string;
    itemName?: string;
    totalPrice?: number;
  }[];
}

export interface GRN {
  id: number;
  grnId: number;
  organizationId: number;
  grnNumber: string;
  poId: number;
  supplierId: number;
  supplierName: string;
  warehouseId: number;
  warehouseName: string;
  status: string;
  totalAmount: number;
  grnDate: string;
  remarks?: string;
  createdBy: number;
  updatedBy: number;
  supplier: {
    id: number;
    name: string;
    contactEmail: string;
    contactName: string;
  };
  warehouse: {
    id: number;
    name: string;
    address: string;
    contactEmail: string;
    contactPhone: string;
  };
  grnLineItems: {
    id: number;
    grnId: number;
    itemId: number;
    itemName: string;
    orderedQty: number;
    receivedQty: number;
    unitPrice: number;
    uom: string;
    lineTotal: number;
    batchNumber?: string | null;
    manufacturingDate?: string | null;
    expiryDate?: string | null;
    storageLocation?: string | null;
    remarks?: string | null;
  }[];
}

export interface CreateGRNPayload {
  organizationId: number;
  poId: number;
  poNumber: string;
  supplierId: number;
  supplierName: string;
  warehouseId: number;
  warehouseName: string;
  grnDate: string;
  status: string;
  totalAmount: number;
  // grnNumber: string;
  remarks?: string;
  grnLineItems: {
    itemId: number;
    itemName: string;
    orderedQty: number;
    receivedQty: number;
    unitPrice: number;
    uom?: string;
    lineTotal: number;
    batchNumber?: string | null;
    manufacturingDate?: string | null;
    expiryDate?: string | null;
    storageLocation?: string | null;
    remarks?: string | null;
  }[];
}

export interface SupplierItem {
  supplierId: number;
  itemId: number;
  itemName: string;
  itemCode: string;
  supply_quantity: string;
  supply_price: string;
  effective_date: string;
  is_preferred: boolean;
  created_date: string;
  updated_by: number;
  updated_date: string;
  item?: Item; // Optional, in case it's not populated
  supplier?: Supplier; // Optional, in case it's not populated
}

export interface CreateSupplierItem {
  supplierId: number;
  itemId: number;
  supply_quantity: string;
  supply_price: string;
  effective_date: string;
  is_preferred: boolean;
}

export interface InventoryReport {
  inventoryId: number;
  organizationId: number;
  itemId: number;
  itemName: string;
  sku: string;
  batchNumber?: string;
  lotNumber?: string;
  serialNumber?: string;
  manufacturingDate?: string;
  expiryDate?: string;
  stockInwardDate?: string;
  stockOutwardDate?: string;
  supplierPrice: number;
  fobAmount: number;
  allocation: number;
  cAndHCharges: number;
  freight: number;
  costBeforeDuty: number;
  dutyCharges: number;
  costBeforeProfitMargin: number;
  costPerUnit: number;
  // openingQuantity: number;
  // currentQuantity: number;
  // inwardQuantity: number;
  // outwardQuantity: number;
  // committedQuantity: number;
  // availableQuantity: number;
  // damagedQuantity: number;
  sellingPrice: number;
  // totalValue: number;
  reorderLevel?: number;
  warehouseId: number;
  warehouseName: string;
  subWarehouseName?: string;
  binLocation?: string;
  category?: string;
  subCategory?: string;
  unitOfMeasure?: string;
  barcode?: string;
  createdAt: string;
  createdBy: number;
  updatedAt: string;
  updatedBy: number;
  grnId?: number;
  grnNumber?: string;
}

export interface CreateInventoryReportPayload {
  organizationId: number;
  itemId: number;
  itemName: string;
  sku: string;
  batchNumber?: string;
  lotNumber?: string;
  serialNumber?: string;
  manufacturingDate?: string;
  expiryDate?: string;
  stockInwardDate?: string;
  stockOutwardDate?: string;
  supplierPrice: number;
  fobAmount: number;
  allocation: number;
  cAndHCharges: number;
  freight: number;
  costBeforeDuty: number;
  dutyCharges: number;
  costBeforeProfitMargin: number;
  costPerUnit: number;
  // openingQuantity: number;
  // currentQuantity: number;
  // inwardQuantity: number;
  // outwardQuantity: number;
  // committedQuantity: number;
  // availableQuantity: number;
  // damagedQuantity: number;
  sellingPrice: number;
  // totalValue: number;
  reorderLevel?: number;
  warehouseId: number;
  warehouseName: string;
  subWarehouseName?: string;
  binLocation?: string;
  category?: string;
  subCategory?: string;
  unitOfMeasure?: string;
  barcode?: string;
}

export interface SalesOrder {
  id: number;
  organizationId: number;
  warehouseId: number;
  customerId: number;
  orderNumber: string;
  status: SalesOrderStatus;
  totalAmount: number;
  discount?: number;
  tax?: number;
  amountPaid: number;
  paymentStatus: PaymentStatus;
  orderDate: string; // Date in ISO format
  expectedDate?: string;
  deliveredDate?: string;
  remarks?: string;
  isActive: boolean;
  salesOrderItems: SalesOrderItem[];
}

export interface SalesOrderItem {
  id: number;
  salesOrderId: number;
  itemId: number;
  itemName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface CreateSalesOrderPayload {
  organizationId: number;
  customerId: number;
  totalAmount: number;
  amountPaid: number;
  paymentStatus: PaymentStatus;
  orderDate: string;
  expectedDate?: string;
  remarks?: string;
  salesOrderItems: CreateSalesOrderItemPayload[];
}

export interface CreateSalesOrderItemPayload {
  itemId: number;
  itemName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export enum SalesOrderStatus {
  PENDING = "PENDING",
  CONFIRMED = "CONFIRMED",
  SHIPPED = "SHIPPED",
  DELIVERED = "DELIVERED",
  CANCELLED = "CANCELLED",
}

export enum PaymentStatus {
  PENDING = "PENDING",
  PAID = "PAID",
  FAILED = "FAILED",
  REFUNDED = "REFUNDED",
}

export interface SalesSummaryResponse {
  salesSummary: {
    today: number;
    thisWeek: number;
    thisMonth: number;
    thisQuarter: number;
    thisYear: number;
  };
  topSellingProducts: { itemId: number; itemName: string; quantity: number }[];
  leastSellingProducts: { itemId: number; itemName: string; quantity: number }[];
  topProfitMarginProducts: { itemId: number; itemName: string; profitMargin: number }[];
  leastProfitMarginProducts: { itemId: number; itemName: string; profitMargin: number }[];
}


export const api = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000",
    // baseUrl: 'http://localhost:8000',
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  reducerPath: "api",
  tagTypes: ["Organizations", "Suppliers", "Customers", "Warehouses", "Items", "SupplierItems", "SupplierSites", "PurchaseOrders", "GRNs", "Users", "InventoryReports", "SalesOrders"],
  endpoints: (builder) => ({
    loginUser: builder.mutation<AuthResponse, LoginUser>({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
    }),
    getCurrentUser: builder.query<{ id: number; email: string; roleId: number, firstName: string, lastName: string }, void>({
      query: () => "/auth/me",
      providesTags: ["Users"],
    }),
    createUser: builder.mutation<{ message: string }, CreateUserRequest>({
      query: (newUser) => ({
        url: "/auth/create",
        method: "POST",
        body: newUser,
      }),
      invalidatesTags: ["Users"],
    }),
    forgotPassword: builder.mutation<{ message: string }, { email: string }>({
      query: (credentials) => ({
        url: "/auth/forgot-password",
        method: "POST",
        body: credentials,
      }),
    }),
    resetPassword: builder.mutation<{ message: string }, { token: string; password: string }>({
      query: (data) => ({
        url: "/auth/reset-password",
        method: "POST",
        body: data,
      }),
    }),
    verifyRegistration: builder.mutation<{ message: string }, { token: string; password: string }>({
      query: (data) => ({
        url: "/auth/verify-registration",
        method: "POST",
        body: data,
      }),
    }),
    getUsersByOrganization: builder.query<User[], number>({
      query: (organizationId) => `/auth?organizationId=${organizationId}`,
      providesTags: ["Users"],
    }),
    updateUserRole: builder.mutation<{ message: string }, UpdateUserRoleRequest>({
      query: ({ userId, roleId }) => ({
        url: `/auth/${userId}/role`,
        method: "PUT",
        body: { roleId },
      }),
      invalidatesTags: ["Users"],
    }),
    deleteUser: builder.mutation<{ message: string }, DeleteUserRequest>({
      query: ({ userId }) => ({
        url: `/auth/${userId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Users"],
    }),
    sendEmail: builder.mutation<
      { message: string },
      { email: string; subject: string; text: string; pdfBase64: string; fileName: string }>({
        query: (emailData) => ({
          url: "/email/send",
          method: "POST",
          body: emailData,
          headers: {
            "Content-Type": "application/json",
          },
        }),
      }),
    sendWhatsAppText: builder.mutation<
      { message: string },
      { phoneNumber: string; message: string }>({
      query: (whatsappData) => ({
        url: "/email/send-whatsapp-text",  // Your backend route for sending text messages
        method: "POST",
        body: whatsappData,
        headers: {
          "Content-Type": "application/json",
        },
      }),
    }),

    getOrganizations: builder.query<Organization[], void>({
      query: () => "/organizations",
      providesTags: ["Organizations"],
    }),
    getOrganizationById: builder.query<Organization, number>({
      query: (id) => `/organizations/${id}`,
      providesTags: ["Organizations"],
    }),
    createOrganization: builder.mutation<Organization, CreateOrganizationPayload>({
      query: (newOrg) => {
        const formData = new FormData();
        Object.entries(newOrg).forEach(([key, value]) => {
          if (key === "legalProofs" && Array.isArray(value)) {
            value.forEach((file) => formData.append("legalProofs", file));
          } else if (typeof value === "object" && value !== null) {
            formData.append(key, JSON.stringify(value));
          } else if (typeof value === "string") {
            formData.append(key, value);
          }
        });

        return {
          url: "/organizations/create",
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: ["Organizations"],
    }),
    updateOrganization: builder.mutation<Organization, { id: number; data: Partial<Organization> }>({
      query: ({ id, data }) => {
        const formData = new FormData();
        Object.entries(data).forEach(([key, value]) => {
          if (key === "socialMedia") {
            formData.append(key, JSON.stringify(value));
          } else {
            formData.append(key, value as string);
          }
        });
        return {
          url: `/organizations/${id}`,
          method: "PUT",
          body: formData,
        };
      },
      invalidatesTags: ["Organizations"],
    }),
    deleteOrganization: builder.mutation<void, number>({
      query: (id) => ({
        url: `/organizations/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Organizations"],
    }),

    // Suppliers Endpoints
    getSuppliers: builder.query<Supplier[], { organizationId: number; search?: string }>({
      query: ({ organizationId, search }) => {
        let queryParams = `organizationId=${organizationId}`;
        if (search) queryParams += `&search=${encodeURIComponent(search)}`;
        return `/suppliers?${queryParams}`;
      },
      providesTags: ["Suppliers"],
    }),
    createSupplier: builder.mutation<Supplier, CreateSupplierPayload>({
      query: (newSupplier) => ({
        url: "/suppliers/create",
        method: "POST",
        body: newSupplier,
      }),
      invalidatesTags: ["Suppliers"],
    }),
    updateSupplier: builder.mutation<Supplier, { id: number; data: Partial<Supplier> }>({
      query: ({ id, data }) => ({
        url: `/suppliers/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Suppliers"],
    }),
    deleteSupplier: builder.mutation<void, number>({
      query: (id) => ({
        url: `/suppliers/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Suppliers"],
    }),
    linkProductsToSupplier: builder.mutation({
      query: ({ supplierId, itemId, supply_quantity, supply_price, effective_date, is_preferred }: CreateSupplierItem) => ({
        url: `/suppliers/${supplierId}/items`,
        method: 'POST',
        body: {
          supplierId,
          itemId,
          supply_quantity,
          supply_price,
          effective_date,
          is_preferred,
        },
      }),
      invalidatesTags: ["SupplierItems"],
    }),
    getSupplierItems: builder.query<SupplierItem[], number>({
      query: (supplierId) => `suppliers/${supplierId}/items`,
      providesTags: ["SupplierItems"],
    }),
    updateSupplierItem: builder.mutation({
      query: ({ supplierId, itemId, data }) => ({
        url: `suppliers/${supplierId}/items/${itemId}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["SupplierItems"],
    }),
    getSupplierPurchaseOrders: builder.query<PurchaseOrder[], number>({
      query: (supplierId) => `/suppliers/${supplierId}/purchase-orders`, // Endpoint to fetch purchase orders by supplier ID
      providesTags: (result, error, supplierId) =>
        result ? [{ type: 'PurchaseOrders', id: supplierId }] : [],
    }),


    // Customers Endpoints
    getCustomers: builder.query<Customer[], { organizationId: number; search?: string }>({
      query: ({ organizationId, search }) => {
        let queryParams = `organizationId=${organizationId}`;
        if (search) queryParams += `&search=${encodeURIComponent(search)}`;
        return `/customers?${queryParams}`;
      },
      providesTags: ["Customers"],
    }),
    getCustomerById: builder.query<Customer, number>({
      query: (id) => `/customers/${id}`,
      providesTags: ["Customers"],
    }),
    createCustomer: builder.mutation<Customer, CreateCustomerPayload>({
      query: (newCustomer) => ({
        url: "/customers/create",
        method: "POST",
        body: newCustomer,
      }),
      invalidatesTags: ["Customers"],
    }),
    updateCustomer: builder.mutation<Customer, { id: number; data: Partial<Customer> }>({
      query: ({ id, data }) => ({
        url: `/customers/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Customers"],
    }),
    deleteCustomer: builder.mutation<void, number>({
      query: (id) => ({
        url: `/customers/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Customers"],
    }),

    //Warehouse endpoints
    getWarehouses: builder.query<Warehouse[], { organizationId: number; search?: string }>({
      query: ({ organizationId, search }) => {
        let queryParams = `organizationId=${organizationId}`;
        if (search) queryParams += `&search=${encodeURIComponent(search)}`;
        return `/warehouses?${queryParams}`;
      },
      providesTags: ["Warehouses"],
    }),
    getWarehouseById: builder.query<Warehouse, number>({
      query: (id) => `/warehouses/${id}`,
      providesTags: ["Warehouses"],
    }),
    createWarehouse: builder.mutation<Warehouse, CreateWarehousePayload>({
      query: (newWarehouse) => ({
        url: "/warehouses/create",
        method: "POST",
        body: newWarehouse,
      }),
      invalidatesTags: ["Warehouses"],
    }),
    updateWarehouse: builder.mutation<Warehouse, { id: number; data: Partial<Warehouse> }>({
      query: ({ id, data }) => ({
        url: `/warehouses/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Warehouses"],
    }),
    deleteWarehouse: builder.mutation<void, number>({
      query: (id) => ({
        url: `/warehouses/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Warehouses"],
    }),
    addItemToWarehouse: builder.mutation({
      query: ({ warehouseId, itemId, quantity }) => ({
        url: `/warehouses/${warehouseId}/items`,
        method: 'POST',
        body: { itemId, quantity },
      }),
    }),
    getWarehouseProducts: builder.query({
      query: (warehouseId) => `warehouses/${warehouseId}/stock`,
      providesTags: ["Warehouses"],
    }),
    updateWarehouseStock: builder.mutation({
      query: ({ warehouseId, itemId, quantity }) => ({
        url: `warehouses/${warehouseId}/stock`,
        method: "POST",
        body: { itemId, quantity },
      }),
    }),

    //PRODUCT endpoints
    getItems: builder.query<Item[], { organizationId: number; search?: string; category?: string }>({
      query: ({ organizationId, search, category }) => {
        let queryParams = `organizationId=${organizationId}`;
        if (search) queryParams += `&search=${encodeURIComponent(search)}`;
        if (category) queryParams += `&category=${encodeURIComponent(category)}`;
        return `/items?${queryParams}`;
      },
      providesTags: ["Items"],
    }),
    createItem: builder.mutation<Item, CreateItemPayload>({
      query: (newItem) => ({
        url: "/items/create",
        method: "POST",
        body: newItem,
      }),
      invalidatesTags: ["Items"],
    }),
    getItemById: builder.query<Item, number>({
      query: (id) => `/items/${id}`,
      providesTags: ["Items"],
    }),
    updateItem: builder.mutation<Item, { id: number; data: Partial<Item> }>({
      query: ({ id, data }) => ({
        url: `/items/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Items"],
    }),
    deleteItem: builder.mutation<void, number>({
      query: (id) => ({
        url: `/items/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Items"],
    }),

    // Supplier Sites
    getSupplierSites: builder.query<SupplierSite[], number>({
      query: (supplierId) => `/supplier-sites/${supplierId}/sites`,
      providesTags: ["SupplierSites"],
    }),
    createSupplierSite: builder.mutation<SupplierSite, { supplierId: number; siteData: CreateSupplierSitePayload }>({
      query: ({ supplierId, siteData }) => ({
        url: `/supplier-sites/${supplierId}/sites`,
        method: "POST",
        body: siteData,
      }),
      invalidatesTags: ["SupplierSites"],
    }),
    updateSupplierSite: builder.mutation<SupplierSite, { supplierId: number; siteId: number; data: Partial<SupplierSite> }>({
      query: ({ supplierId, siteId, data }) => ({
        url: `/supplier-sites/${supplierId}/sites/${siteId}`, // Updated URL to match backend
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["SupplierSites"],
    }),

    deleteSupplierSite: builder.mutation<void, { supplierId: number; siteId: number }>({
      query: ({ supplierId, siteId }) => ({
        url: `/supplier-sites/${supplierId}/sites/${siteId}`, // Updated URL to match backend
        method: "DELETE",
      }),
      invalidatesTags: ["SupplierSites"],
    }),

    // Purchase Orders
    getPurchaseOrders: builder.query<PurchaseOrder[], { organizationId: number; status?: string }>({
      query: ({ organizationId, status }) => {
        const statusQuery = status ? `&status=${status}` : "";
        return `/purchaseOrder?organizationId=${organizationId}${statusQuery}`;
      },
      providesTags: ["PurchaseOrders"],
    }),
    getPurchaseOrderById: builder.query<PurchaseOrder, number>({
      query: (id) => `/purchaseOrder/${id}`,
      providesTags: ["PurchaseOrders"],
    }),
    createPurchaseOrder: builder.mutation<PurchaseOrder, CreatePurchaseOrderPayload>({
      query: (newOrder) => ({
        url: "/purchaseOrder/create",
        method: "POST",
        body: newOrder,
      }),
      invalidatesTags: ["PurchaseOrders"],
    }),
    updatePurchaseOrder: builder.mutation<PurchaseOrder, { id: number; data: Partial<PurchaseOrder> }>({
      query: ({ id, data }) => ({
        url: `/purchaseOrder/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["PurchaseOrders"],
    }),
    deletePurchaseOrder: builder.mutation<void, number>({
      query: (id) => ({
        url: `/purchaseOrder/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["PurchaseOrders"],
    }),
    receivePurchaseOrder: builder.mutation<PurchaseOrder, { orderId: number, receivedDate: string, receivedItems: { itemId: number, receivedQuantity: number }[] }>({
      query: ({ orderId, receivedDate, receivedItems }) => ({
        url: `/purchase-orders/${orderId}/receive`,
        method: "PATCH",
        body: { receivedDate, receivedItems },
      }),
      invalidatesTags: ["PurchaseOrders"],
    }),

    // GRNs Endpoints
    getGRNs: builder.query<GRN[], { organizationId: number; status?: string }>({
      query: ({ organizationId, status }) => {
        let url = `/grns?organizationId=${organizationId}`;
        if (status) {
          url += `&status=${status}`;
        }
        return url;
      },
      providesTags: ["GRNs"],
    }),
    createGRN: builder.mutation<GRN, CreateGRNPayload>({
      query: (newGRN) => ({
        url: "/grns/create",
        method: "POST",
        body: newGRN,
      }),
      invalidatesTags: ["GRNs"],
    }),
    getGRNById: builder.query<GRN, number>({
      query: (grnId) => `/grns/${grnId}`,
      providesTags: ["GRNs"],
    }),
    updateGRN: builder.mutation<GRN, { id: number; data: Partial<GRN> }>({
      query: ({ id, data }) => ({
        url: `/grns/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["GRNs"],
    }),
    deleteGRN: builder.mutation<void, number>({
      query: (grnId) => ({
        url: `/grns/${grnId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["GRNs"],
    }),

    // Inventory Reports
    getInventoryReports: builder.query<InventoryReport[], number>({
      query: (organizationId) => `/inventory-reports?organizationId=${organizationId}`,
      providesTags: ["InventoryReports"],
    }),
    createInventoryReport: builder.mutation<InventoryReport, CreateInventoryReportPayload>({
      query: (newReport) => ({
        url: "/inventory-reports",
        method: "POST",
        body: newReport,
      }),
      invalidatesTags: ["InventoryReports"],
    }),
    getInventoryReportById: builder.query<InventoryReport, number>({
      query: (inventoryId) => `/inventory-reports/${inventoryId}`,
      providesTags: ["InventoryReports"],
    }),
    updateInventoryReport: builder.mutation<InventoryReport, { id: number; data: Partial<InventoryReport> }>({
      query: ({ id, data }) => ({
        url: `/inventory-reports/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["InventoryReports"],
    }),
    deleteInventoryReport: builder.mutation<void, number>({
      query: (id) => ({
        url: `/inventory-reports/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["InventoryReports"],
    }),

    //salesOrder Endpoints
    getSalesOrders: builder.query<SalesOrder[], { organizationId: number, status?: string, paymentStatus?: string }>({
      query: ({ organizationId, status, paymentStatus }) => {
        let queryString = `/salesOrder?organizationId=${organizationId}`;
        if (status) {
          queryString += `&status=${status}`;
        }
        if (paymentStatus) {
          queryString += `&paymentStatus=${paymentStatus}`;
        }
        return queryString;
      },
      providesTags: ["SalesOrders"],
    }),

    getSalesOrderById: builder.query<SalesOrder, number>({
      query: (id) => `/salesOrder/${id}`,
      providesTags: ["SalesOrders"],
    }),
    createSalesOrder: builder.mutation<SalesOrder, CreateSalesOrderPayload>({
      query: (newOrder) => ({
        url: "/salesOrder/create",
        method: "POST",
        body: newOrder,
      }),
      invalidatesTags: ["SalesOrders"],
    }),
    updateSalesOrder: builder.mutation<SalesOrder, { id: number; data: Partial<SalesOrder> }>({
      query: ({ id, data }) => ({
        url: `/salesOrder/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["SalesOrders"],
    }),
    deleteSalesOrder: builder.mutation<void, number>({
      query: (id) => ({
        url: `/salesOrder/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["SalesOrders"],
    }),
    getSalesSummary: builder.query<SalesSummaryResponse, number>({
      query: (organizationId) => `/salesOrder/summary?organizationId=${organizationId}`,
      providesTags: ["SalesOrders"],
    }),
  }),
});

export const {
  useLoginUserMutation,
  useGetCurrentUserQuery,
  useCreateUserMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useVerifyRegistrationMutation,
  useGetUsersByOrganizationQuery,
  useUpdateUserRoleMutation,
  useDeleteUserMutation,
  useSendEmailMutation,
  useSendWhatsAppTextMutation,
  useGetOrganizationsQuery,
  useGetOrganizationByIdQuery,
  useCreateOrganizationMutation,
  useUpdateOrganizationMutation,
  useDeleteOrganizationMutation,
  useGetSuppliersQuery,
  useCreateSupplierMutation,
  useUpdateSupplierMutation,
  useDeleteSupplierMutation,
  useCreateCustomerMutation,
  useGetCustomersQuery,
  useGetCustomerByIdQuery,
  useDeleteCustomerMutation,
  useUpdateCustomerMutation,
  useCreateWarehouseMutation,
  useDeleteWarehouseMutation,
  useGetWarehousesQuery,
  useGetWarehouseByIdQuery,
  useUpdateWarehouseMutation,
  useGetItemsQuery,
  useCreateItemMutation,
  useUpdateItemMutation,
  useDeleteItemMutation,
  useGetWarehouseProductsQuery,
  useUpdateWarehouseStockMutation,
  useAddItemToWarehouseMutation,
  useGetSupplierSitesQuery,
  useCreateSupplierSiteMutation,
  useUpdateSupplierSiteMutation,
  useDeleteSupplierSiteMutation,
  useGetPurchaseOrdersQuery,
  useCreatePurchaseOrderMutation,
  useUpdatePurchaseOrderMutation,
  useDeletePurchaseOrderMutation,
  useGetPurchaseOrderByIdQuery,
  useGetSupplierItemsQuery,
  useLinkProductsToSupplierMutation,
  useUpdateSupplierItemMutation,
  useReceivePurchaseOrderMutation,
  useCreateGRNMutation,
  useUpdateGRNMutation,
  useGetGRNsQuery,
  useGetGRNByIdQuery,
  useDeleteGRNMutation,
  useGetSupplierPurchaseOrdersQuery,
  useGetInventoryReportsQuery,
  useCreateInventoryReportMutation,
  useGetInventoryReportByIdQuery,
  useUpdateInventoryReportMutation,
  useDeleteInventoryReportMutation,
  useGetSalesOrdersQuery,
  useCreateSalesOrderMutation,
  useGetSalesOrderByIdQuery,
  useUpdateSalesOrderMutation,
  useDeleteSalesOrderMutation,
  useGetSalesSummaryQuery
} = api;
