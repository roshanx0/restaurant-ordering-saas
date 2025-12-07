import React, { useEffect, useState } from "react";
import {
  useNavigate,
  Routes,
  Route,
  Link,
  useLocation,
} from "react-router-dom";
import {
  Shield,
  LogOut,
  LayoutDashboard,
  FileText,
  Store as StoreIcon,
  BarChart3,
} from "lucide-react";
import DashboardHome from "./DashboardHome";
import PendingRequests from "./PendingRequests";
import AllRestaurants from "./AllRestaurants";
import Analytics from "./Analytics";

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [admin, setAdmin] = useState<any>(null);

  useEffect(() => {
    const adminData = localStorage.getItem("admin");
    if (!adminData) {
      navigate("/admin/login");
    } else {
      setAdmin(JSON.parse(adminData));
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("admin");
    navigate("/admin/login");
  };

  if (!admin) return null;

  const navItems = [
    { path: "/admin", icon: LayoutDashboard, label: "Dashboard" },
    { path: "/admin/requests", icon: FileText, label: "Pending Requests" },
    { path: "/admin/restaurants", icon: StoreIcon, label: "All Restaurants" },
    { path: "/admin/analytics", icon: BarChart3, label: "Analytics" },
  ];

  return (
    <div className="min-h-screen bg-bg-subtle">
      {/* Top Navigation */}
      <nav className="bg-white border-b border-border sticky top-0 z-40">
        <div className="container-custom">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <Shield className="w-8 h-8 text-accent" />
              <div>
                <h1 className="text-lg font-bold text-text">Admin Panel</h1>
                <p className="text-xs text-text-secondary">{admin.email}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 text-text-secondary hover:text-error transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Secondary Navigation */}
      <div className="bg-white border-b border-border">
        <div className="container-custom">
          <div className="flex space-x-1 overflow-x-auto">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-2 px-4 py-3 border-b-2 transition-colors whitespace-nowrap ${
                    isActive
                      ? "border-accent text-accent font-medium"
                      : "border-transparent text-text-secondary hover:text-text"
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container-custom py-8">
        <Routes>
          <Route index element={<DashboardHome />} />
          <Route path="requests" element={<PendingRequests />} />
          <Route path="restaurants" element={<AllRestaurants />} />
          <Route path="analytics" element={<Analytics />} />
        </Routes>
      </div>
    </div>
  );
};

export default AdminDashboard;
