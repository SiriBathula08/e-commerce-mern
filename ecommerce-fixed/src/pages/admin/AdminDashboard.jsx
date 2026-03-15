import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "../../api/axios";
import { useAuth } from "../../context/AuthContext";

export default function AdminDashboard() {
  const { token } = useAuth();
  const [stats, setStats] = useState({ users: 0, products: 0, orders: 0 });

  useEffect(() => {
    if (!token) return;
    axios.get("/admin/stats", { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setStats(res.data))
      .catch(() => {});
  }, [token]);

  const cards = [
    { icon: "👥", label: "Total Users", value: stats.users, color: "#dbeafe", iconColor: "#1e40af" },
    { icon: "📦", label: "Products", value: stats.products, color: "#d1fae5", iconColor: "#065f46" },
    { icon: "🛍", label: "Orders", value: stats.orders, color: "#fce7f3", iconColor: "#9d174d" },
  ];

  const links = [
    { icon: "📦", label: "Manage Products", to: "/admin/products" },
    { icon: "👥", label: "Manage Users", to: "/admin/users" },
    { icon: "🛍", label: "View Orders", to: "/admin/orders" },
  ];

  return (
    <div className="fade-up">
      <div className="page-header">
        <h2>Admin Dashboard</h2>
        <p>Overview of your store</p>
      </div>

      <div className="row g-3 mb-4">
        {cards.map(c => (
          <div className="col-md-4" key={c.label}>
            <div className="stat-card">
              <div className="stat-icon" style={{ background: c.color, color: c.iconColor }}>{c.icon}</div>
              <div className="stat-value">{c.value}</div>
              <div className="stat-label">{c.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="page-header"><h2 style={{ fontSize: "1.4rem" }}>Quick Access</h2></div>
      <div className="row g-3">
        {links.map(l => (
          <div className="col-md-4" key={l.label}>
            <Link to={l.to} style={{ textDecoration: "none" }}>
              <div className="stat-card" style={{ cursor: "pointer", textAlign: "center" }}>
                <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>{l.icon}</div>
                <div style={{ fontWeight: 600, color: "var(--primary)" }}>{l.label}</div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
