"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const path_1 = __importDefault(require("path"));
//Route imports
const organizationRoutes_1 = __importDefault(require("./routes/organizationRoutes"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const supplierRoutes_1 = __importDefault(require("./routes/supplierRoutes"));
const customerRoutes_1 = __importDefault(require("./routes/customerRoutes"));
const warehouseRoutes_1 = __importDefault(require("./routes/warehouseRoutes"));
const productRoutes_1 = __importDefault(require("./routes/productRoutes"));
const supplierSiteRoutes_1 = __importDefault(require("./routes/supplierSiteRoutes"));
const purchaseOrderRoutes_1 = __importDefault(require("./routes/purchaseOrderRoutes"));
const grnRoutes_1 = __importDefault(require("./routes/grnRoutes"));
const inventoryReportRoutes_1 = __importDefault(require("./routes/inventoryReportRoutes"));
const emailRoutes_1 = __importDefault(require("./routes/emailRoutes"));
// import dashboardRoutes from "./routes/dashboardRoutes";
//Config
dotenv_1.default.config();
const app = (0, express_1.default)();
// Middleware
app.use((0, cors_1.default)()); // Enable CORS first
app.use((0, helmet_1.default)()); // Security headers
app.use((0, morgan_1.default)("common")); // Logging
app.use(express_1.default.json({ limit: "50mb" })); // Increase limit
app.use(body_parser_1.default.json({ limit: "50mb" })); // JSON body limit
app.use(body_parser_1.default.urlencoded({ extended: true, limit: "50mb" }));
//Routes
// Serve static files (PDFs)
app.use("/auth", userRoutes_1.default);
app.use("/organizations", organizationRoutes_1.default);
app.use("/uploads", express_1.default.static(path_1.default.join(__dirname, "uploads")));
app.use("/suppliers", supplierRoutes_1.default);
app.use("/customers", customerRoutes_1.default);
app.use("/warehouses", warehouseRoutes_1.default);
app.use("/items", productRoutes_1.default);
app.use("/supplier-sites", supplierSiteRoutes_1.default);
app.use("/purchaseOrder", purchaseOrderRoutes_1.default);
app.use("/grns", grnRoutes_1.default);
app.use("/inventory-reports", inventoryReportRoutes_1.default);
app.use("/email", emailRoutes_1.default);
// app.use("/dashboard", dashboardRoutes);
const port = Number(process.env.PORT) || 3001;
app.listen(port, "0.0.0.0", () => {
    console.log(`Server running on port ${port}`);
});
