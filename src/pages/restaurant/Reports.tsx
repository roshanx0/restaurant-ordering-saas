import React, { useState, useEffect } from "react";
import {
  TrendingUp,
  DollarSign,
  ShoppingBag,
  Package,
  Calendar,
  Download,
} from "lucide-react";
import { Card, Button, Loading } from "../../components/ui";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { supabase } from "../../config/supabase";
import { formatCurrency } from "../../utils/helpers";

interface ReportData {
  totalRevenue: number;
  totalOrders: number;
  avgOrderValue: number;
  topItems: { name: string; count: number; revenue: number }[];
  dailyRevenue: { date: string; revenue: number; orders: number }[];
  orderTypeDistribution: { type: string; count: number }[];
}

const Reports: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [dateRange, setDateRange] = useState<"7" | "30" | "90">("30");

  useEffect(() => {
    fetchReportData();
  }, [dateRange]);

  const fetchReportData = async () => {
    setLoading(true);
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      if (!user.restaurant_id) return;

      const daysAgo = parseInt(dateRange);
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - daysAgo);

      // Fetch orders
      const { data: orders, error } = await supabase
        .from("orders")
        .select("*")
        .eq("restaurant_id", user.restaurant_id)
        .gte("created_at", startDate.toISOString())
        .in("status", ["completed", "ready", "preparing", "accepted"]);

      if (error) throw error;

      // Calculate metrics
      const totalRevenue =
        orders?.reduce((sum, order) => sum + order.total_amount, 0) || 0;
      const totalOrders = orders?.length || 0;
      const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

      // Top items
      const itemCounts: Record<string, { count: number; revenue: number }> = {};
      orders?.forEach((order) => {
        order.items?.forEach((item: any) => {
          if (!itemCounts[item.name]) {
            itemCounts[item.name] = { count: 0, revenue: 0 };
          }
          itemCounts[item.name].count += item.quantity;
          itemCounts[item.name].revenue += item.item_total;
        });
      });

      const topItems = Object.entries(itemCounts)
        .map(([name, data]) => ({ name, ...data }))
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 5);

      // Daily revenue
      const dailyData: Record<string, { revenue: number; orders: number }> = {};
      orders?.forEach((order) => {
        const date = new Date(order.created_at).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        });
        if (!dailyData[date]) {
          dailyData[date] = { revenue: 0, orders: 0 };
        }
        dailyData[date].revenue += order.total_amount;
        dailyData[date].orders += 1;
      });

      const dailyRevenue = Object.entries(dailyData)
        .map(([date, data]) => ({ date, ...data }))
        .slice(-14); // Last 14 days

      // Order type distribution
      const typeCounts: Record<string, number> = {};
      orders?.forEach((order) => {
        const type = order.order_type || "unknown";
        typeCounts[type] = (typeCounts[type] || 0) + 1;
      });

      const orderTypeDistribution = Object.entries(typeCounts).map(
        ([type, count]) => ({ type, count })
      );

      setReportData({
        totalRevenue,
        totalOrders,
        avgOrderValue,
        topItems,
        dailyRevenue,
        orderTypeDistribution,
      });
    } catch (error) {
      console.error("Error fetching report data:", error);
    } finally {
      setLoading(false);
    }
  };

  const exportReport = () => {
    if (!reportData) return;

    const csvContent = [
      ["Metric", "Value"],
      ["Total Revenue", formatCurrency(reportData.totalRevenue)],
      ["Total Orders", reportData.totalOrders.toString()],
      ["Average Order Value", formatCurrency(reportData.avgOrderValue)],
      [""],
      ["Top Items", "Quantity", "Revenue"],
      ...reportData.topItems.map((item) => [
        item.name,
        item.count.toString(),
        formatCurrency(item.revenue),
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `report-${dateRange}-days.csv`;
    a.click();
  };

  if (loading) {
    return <Loading text="Loading reports..." />;
  }

  if (!reportData) {
    return (
      <div className="text-center text-text-secondary">No data available</div>
    );
  }

  const COLORS = ["#FF6B6B", "#4ECDC4", "#45B7D1", "#FFA07A", "#98D8C8"];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-text mb-2">
            Reports & Analytics
          </h2>
          <p className="text-text-secondary">
            Track your sales performance and trends
          </p>
        </div>
        <div className="flex gap-3">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value as "7" | "30" | "90")}
            className="input"
          >
            <option value="7">Last 7 Days</option>
            <option value="30">Last 30 Days</option>
            <option value="90">Last 90 Days</option>
          </select>
          <Button
            icon={<Download className="w-5 h-5" />}
            onClick={exportReport}
            variant="outline"
          >
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <div className="flex items-center justify-between mb-3">
            <div className="p-3 bg-success/10 rounded-lg">
              <DollarSign className="w-6 h-6 text-success" />
            </div>
            <TrendingUp className="w-5 h-5 text-success" />
          </div>
          <div className="text-2xl font-bold text-text mb-1">
            {formatCurrency(reportData.totalRevenue)}
          </div>
          <p className="text-text-secondary text-sm">Total Revenue</p>
        </Card>

        <Card>
          <div className="flex items-center justify-between mb-3">
            <div className="p-3 bg-accent/10 rounded-lg">
              <ShoppingBag className="w-6 h-6 text-accent" />
            </div>
          </div>
          <div className="text-2xl font-bold text-text mb-1">
            {reportData.totalOrders}
          </div>
          <p className="text-text-secondary text-sm">Total Orders</p>
        </Card>

        <Card>
          <div className="flex items-center justify-between mb-3">
            <div className="p-3 bg-accent-secondary/10 rounded-lg">
              <DollarSign className="w-6 h-6 text-accent-secondary" />
            </div>
          </div>
          <div className="text-2xl font-bold text-text mb-1">
            {formatCurrency(reportData.avgOrderValue)}
          </div>
          <p className="text-text-secondary text-sm">Avg Order Value</p>
        </Card>

        <Card>
          <div className="flex items-center justify-between mb-3">
            <div className="p-3 bg-warning/10 rounded-lg">
              <Calendar className="w-6 h-6 text-warning" />
            </div>
          </div>
          <div className="text-2xl font-bold text-text mb-1">
            {dateRange} Days
          </div>
          <p className="text-text-secondary text-sm">Report Period</p>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Revenue Trend */}
        <Card>
          <h3 className="text-lg font-bold text-text mb-4">Revenue Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={reportData.dailyRevenue}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="date" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                }}
                formatter={(value: number) => formatCurrency(value)}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#FF6B6B"
                strokeWidth={2}
                name="Revenue"
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Order Type Distribution */}
        <Card>
          <h3 className="text-lg font-bold text-text mb-4">
            Order Type Distribution
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={reportData.orderTypeDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={(entry: any) =>
                  `${entry.type}: ${((entry.percent || 0) * 100).toFixed(0)}%`
                }
                outerRadius={100}
                fill="#8884d8"
                dataKey="count"
              >
                {reportData.orderTypeDistribution.map((_entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Top Items */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-text">Top Selling Items</h3>
          <Package className="w-5 h-5 text-accent" />
        </div>

        {reportData.topItems.length === 0 ? (
          <p className="text-text-secondary text-center py-8">
            No items sold yet
          </p>
        ) : (
          <div className="space-y-3">
            {reportData.topItems.map((item, index) => (
              <div
                key={item.name}
                className="flex items-center justify-between p-4 bg-bg-subtle rounded-lg hover:shadow-md transition-shadow"
              >
                <div className="flex items-center space-x-4">
                  <div className="flex items-center justify-center w-10 h-10 bg-accent rounded-full text-white font-bold">
                    {index + 1}
                  </div>
                  <div>
                    <div className="font-semibold text-text">{item.name}</div>
                    <div className="text-sm text-text-secondary">
                      {item.count} orders
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-success">
                    {formatCurrency(item.revenue)}
                  </div>
                  <div className="text-xs text-text-secondary">Revenue</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Daily Orders Chart */}
      <Card>
        <h3 className="text-lg font-bold text-text mb-4">Daily Orders</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={reportData.dailyRevenue}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="date" stroke="#6b7280" />
            <YAxis stroke="#6b7280" />
            <Tooltip
              contentStyle={{
                backgroundColor: "#fff",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
              }}
            />
            <Legend />
            <Bar dataKey="orders" fill="#4ECDC4" name="Orders" />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
};

export default Reports;
