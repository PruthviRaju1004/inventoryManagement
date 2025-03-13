import express from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';

//Route imports
import organizationRoutes from './routes/organizationRoutes';
import userRoutes from "./routes/userRoutes";
import supplierRoutes from './routes/supplierRoutes';
import customerRoutes from './routes/customerRoutes';
import warehouseRoutes from './routes/warehouseRoutes';
import itemRoutes from './routes/productRoutes';
import supplierSiteRoutes from './routes/supplierSiteRoutes';
import purchaseOrderRoutes from './routes/purchaseOrderRoutes';
import grnRoutes from './routes/grnRoutes';
import inventoryReportRoutes from './routes/inventoryReportRoutes';
import emailRoutes from "./routes/emailRoutes"; 
// import dashboardRoutes from "./routes/dashboardRoutes";

//Config
dotenv.config();
const app = express();
// Middleware
app.use(cors()); // Enable CORS first
app.use(helmet()); // Security headers
app.use(morgan("common")); // Logging
app.use(express.json({ limit: "50mb" })); // Increase limit
app.use(bodyParser.json({ limit: "50mb" })); // JSON body limit
app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));

//Routes
// Serve static files (PDFs)
app.use("/auth", userRoutes);
app.use("/organizations", organizationRoutes);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/suppliers", supplierRoutes);
app.use("/customers", customerRoutes);
app.use("/warehouses", warehouseRoutes);
app.use("/items", itemRoutes);
app.use("/supplier-sites", supplierSiteRoutes);
app.use("/purchaseOrder", purchaseOrderRoutes);
app.use("/grns", grnRoutes);
app.use("/inventory-reports", inventoryReportRoutes);
app.use("/email", emailRoutes);
// app.use("/dashboard", dashboardRoutes);

const port = Number(process.env.PORT) || 3001;
app.listen(port, "0.0.0.0", () => {
  console.log(`Server running on port ${port}`);
});