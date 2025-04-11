"use client";
import React, { CSSProperties, useEffect } from "react";
import OrganizationSelector from "../{components}/organizationSelector/index";
import { useGetSalesSummaryQuery } from "../../state/api";
import useOrganizations from "../{hooks}/useOrganizations";

interface Product {
  itemName: string;
  quantity: number;
}

interface TopProductsProps {
  title: string;
  products: Product[];
}

const TopProductsTable: React.FC<TopProductsProps> = ({ title, products }) => {
  return (
    <div style={containerStyle}>
      <h3 style={titleStyle}>{title}</h3>
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={thTdStyle}>Product</th>
            <th style={thTdStyle}>Quantity</th>
          </tr>
        </thead>
        <tbody>
          {products.length > 0 ? (
            products.map((item, index) => (
              <tr key={index}>
                <td style={thTdStyle}>{item.itemName}</td>
                <td style={thTdStyle}>{item.quantity.toFixed(2)}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={2} style={noDataStyle}>No data available</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

interface ProfitMarginProduct {
  profitPercentage: any;
  profit: any;
  salePrice: any;
  costPrice: any;
  itemName: string;
  profitMargin: number;
}

interface ProfitMarginTableProps {
  title: string;
  products: ProfitMarginProduct[];
}

const ProfitMarginTable: React.FC<ProfitMarginTableProps> = ({ title, products }) => {
  return (
    <div style={containerStyle}>
      <h3 style={titleStyle}>{title}</h3>
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={thTdStyle}>Product</th>
            <th style={thTdStyle}>Cost Price</th>
            <th style={thTdStyle}>Sale Price</th>
            <th style={thTdStyle}>Profit</th>
            <th style={thTdStyle}>Profit(%)</th>
          </tr>
        </thead>
        <tbody>
          {products.length > 0 ? (
            products.map((item, index) => (
              <tr key={index}>
                <td style={thTdStyle}>{item.itemName}</td>
                <td style={thTdStyle}>{item.costPrice}</td>
                <td style={thTdStyle}>{item.salePrice}</td>
                <td style={thTdStyle}>{item.salePrice-item.costPrice}</td>
                <td style={thTdStyle}>{(((item.salePrice-item.costPrice)/(item.costPrice))*100).toFixed(2)}%</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5} style={noDataStyle}>No data available</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

const Dashboard = () => {
  const { selectedOrg, setSelectedOrg } = useOrganizations();
  // Fetch sales summary when an organization is selected
  const { data: salesSummary, error, isLoading } = useGetSalesSummaryQuery(selectedOrg ?? 0, {
    skip: !selectedOrg, // Skip fetching if no org is selected
  });

  useEffect(() => {
    // console.log("Sales Summary Data:", salesSummary?.salesSummary);
  }, [salesSummary]);

  // Handle loading & error states
  if (isLoading) return <p>Loading sales summary...</p>;
  if (error) return <p>Error fetching sales summary</p>;

  // Extract data from API response
  const topSelling = salesSummary?.topSellingProducts || [];
  const leastSelling = salesSummary?.leastSellingProducts || [];
  const topProfitMargin = salesSummary?.topProfitMarginProducts.map((product: any) => ({
    itemName: product.itemName,
    profitMargin: product.profitMargin,
    profitPercentage: product.profitPercentage || 0,
    profit: product.profit || 0,
    salePrice: product.unitPrice || 0,
    costPrice: product.costPerUnit || 0,
  })) || [];
  const leastProfitMargin = salesSummary?.leastProfitMarginProducts.map((product: any) => ({
    itemName: product.itemName,
    profitMargin: product.profitMargin,
    profitPercentage: product.profitPercentage || 0,
    profit: product.profit || 0,
    salePrice: product.unitPrice || 0,
    costPrice: product.costPerUnit || 0,
  })) || [];

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      {!localStorage.getItem("userOrg") && (
        <div style={{
          marginBottom: "20px", maxWidth: "300px"
        }}>
          <OrganizationSelector selectedOrg={selectedOrg} onChange={setSelectedOrg} />
        </div>
      )}
      {/* Sales Summary Cards */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "20px", justifyContent: "space-between", marginTop: "20px" }}>
        {[
          { title: "Sales - Today", value: salesSummary?.salesSummary.today || 0 },
          { title: "Sales - This Week", value: salesSummary?.salesSummary.thisWeek || 0 },
          { title: "Sales - This Month", value: salesSummary?.salesSummary.thisMonth || 0 },
          { title: "Sales - Last Quarter", value: salesSummary?.salesSummary.thisQuarter || 0 },
          { title: "Sales - Last Quarter", value: salesSummary?.salesSummary.thisYear || 0 },
        ].map((item, index) => (
          <div key={index} style={salesCardStyle}>
            <h4 style={{ margin: "0 0 5px 0", fontSize: "14px", color: "#555" }}>{item.title}</h4>
            <p style={{ margin: 0, fontSize: "20px", fontWeight: "bold" }}>{item.value}</p>
          </div>
        ))}
      </div>
      <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        <TopProductsTable title="Most Sold Product" products={topSelling} />
        <TopProductsTable title="Least Sold Product" products={leastSelling} />
      </div>
      <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        <ProfitMarginTable title="Top Profit Margin" products={topProfitMargin} />
        <ProfitMarginTable title="Lowest Profit Margin" products={leastProfitMargin} />
      </div>
    </div>
  );
};

const salesCardStyle: CSSProperties = {
  flex: 1,
  padding: "15px",
  border: "1px solid #ddd",
  borderRadius: "8px",
  textAlign: "center",
  background: "#fff",
  boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
  minWidth: "150px"
};
// Styles
const cardStyle: CSSProperties = {
  flex: 1,
  padding: "10px",
  border: "1px solid black",
  textAlign: "center",
  background: "#f5f5f5",
};


const containerStyle: React.CSSProperties = {
  flex: 1,
  padding: "20px",
  border: "1px solid #ddd",
  borderRadius: "8px",
  background: "#fff",
  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
};

const titleStyle: React.CSSProperties = {
  fontSize: "16px",
  fontWeight: "bold",
  marginBottom: "10px",
};

const tableStyle: React.CSSProperties = {
  width: "100%",
  borderCollapse: "collapse",
};

const thTdStyle: React.CSSProperties = {
  borderBottom: "1px solid #ddd",
  padding: "8px",
  textAlign: "left",
  fontSize: "14px",
};

const noDataStyle: React.CSSProperties = {
  padding: "10px",
  textAlign: "center",
  fontSize: "14px",
  color: "#888",
};

export default Dashboard;
