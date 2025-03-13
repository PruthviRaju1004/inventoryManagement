"use client";

import { Box, Grid, Paper, Typography, Divider } from "@mui/material";
import { TrendingUp, Truck, Package, Users, Building, Clipboard } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const stats = [
  { title: "Total Warehouses", count: 10, icon: <Building size={24} /> },
  { title: "Total Suppliers", count: 25, icon: <Truck size={24} /> },
  { title: "Total POs", count: 120, icon: <Package size={24} /> },
  { title: "Total GRNs", count: 75, icon: <Clipboard size={24} /> },
  { title: "Total Products", count: 560, icon: <TrendingUp size={24} /> },
  { title: "Total Customers", count: 80, icon: <Users size={24} /> },
];

const recentActivity = [
  { id: 1, action: "New PO Created", user: "Admin", date: "Feb 26, 2025" },
  { id: 2, action: "Supplier Added", user: "John Doe", date: "Feb 25, 2025" },
  { id: 3, action: "Product Updated", user: "Admin", date: "Feb 24, 2025" },
];

const inventoryData = [
  { name: "Jan", stock: 400 },
  { name: "Feb", stock: 500 },
  { name: "Mar", stock: 700 },
  { name: "Apr", stock: 600 },
];

// Dummy Data for Selling & Profit Margin Reports
const topSellingProducts = [
  { name: "Cricket bat", quantity: 120 },
  { name: "Yonex badminton bat", quantity: 95 },
  { name: "Pen", quantity: 80 },
];

const leastSellingProducts = [
  { name: "Tub", quantity: 10 },
  { name: "Product Y", quantity: 15 },
  { name: "Product Z", quantity: 20 },
];

const topProfitMarginProducts = [
  { name: "Product M", margin: "45%" },
  { name: "Product N", margin: "40%" },
  { name: "Product O", margin: "38%" },
];

const leastProfitMarginProducts = [
  { name: "Product W", margin: "5%" },
  { name: "Product V", margin: "7%" },
  { name: "Product U", margin: "10%" },
];

const Dashboard = () => {
  return (
    <Box sx={{ p: 3, background: "#f5f6fa", minHeight: "100vh" }}>
      <Typography variant="h4" fontWeight="bold" mb={3}>
        Dashboard
      </Typography>

      {/* Stats Cards */}
      <Grid container spacing={3}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Paper sx={{ p: 3, display: "flex", alignItems: "center", borderRadius: "10px" }}>
              <Box sx={{ p: 2, bgcolor: "#007bff", color: "white", borderRadius: "50%" }}>{stat.icon}</Box>
              <Box ml={2}>
                <Typography variant="h6">{stat.title}</Typography>
                <Typography variant="h5" fontWeight="bold">
                  {stat.count}
                </Typography>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Divider sx={{ my: 3 }} />

      {/* Inventory Trends & Recent Activity */}
      <Grid container spacing={3}>
        {/* Inventory Trends Chart */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, borderRadius: "10px" }}>
            <Typography variant="h6" fontWeight="bold" mb={2}>
              Inventory Trends
            </Typography>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={inventoryData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="stock" fill="#007bff" radius={[5, 5, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Recent Activity */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, borderRadius: "10px" }}>
            <Typography variant="h6" fontWeight="bold" mb={2}>
              Recent Activity
            </Typography>
            {recentActivity.map((activity) => (
              <Box key={activity.id} sx={{ mb: 2 }}>
                <Typography variant="body1" fontWeight="bold">
                  {activity.action}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {activity.user} • {activity.date}
                </Typography>
              </Box>
            ))}
          </Paper>
        </Grid>
      </Grid>

      <Divider sx={{ my: 3 }} />

      {/* Top & Least Selling Products */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, borderRadius: "10px" }}>
            <Typography variant="h6" fontWeight="bold" mb={2}>
              Top Selling Products
            </Typography>
            {topSellingProducts.map((product, index) => (
              <Typography key={index} variant="body1">
                {product.name}: {product.quantity} units
              </Typography>
            ))}
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, borderRadius: "10px" }}>
            <Typography variant="h6" fontWeight="bold" mb={2}>
              Least Selling Products
            </Typography>
            {leastSellingProducts.map((product, index) => (
              <Typography key={index} variant="body1">
                {product.name}: {product.quantity} units
              </Typography>
            ))}
          </Paper>
        </Grid>
      </Grid>

      <Divider sx={{ my: 3 }} />

      {/* Profit Margin Reports */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, borderRadius: "10px" }}>
            <Typography variant="h6" fontWeight="bold" mb={2}>
              Top Sale Profit Margin Products
            </Typography>
            {topProfitMarginProducts.map((product, index) => (
              <Typography key={index} variant="body1">
                {product.name}: {product.margin}
              </Typography>
            ))}
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, borderRadius: "10px" }}>
            <Typography variant="h6" fontWeight="bold" mb={2}>
              Least Sale Profit Margin Products
            </Typography>
            {leastProfitMarginProducts.map((product, index) => (
              <Typography key={index} variant="body1">
                {product.name}: {product.margin}
              </Typography>
            ))}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
