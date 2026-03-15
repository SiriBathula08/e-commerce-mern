import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "../../api/axios";
import { useAuth } from "../../context/AuthContext";

const statusClass = (s) => {
  if (!s) return "status-pending";
  const sl = s.toLowerCase();
  if (sl === "delivered") return "status-delivered";
  if (sl === "cancelled") return "status-cancelled";
  if (sl === "processing") return "status-processing";
  return "status-pending";
};

export default function OrdersPanel() {
  const { token } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get("/orders", { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setOrders(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [token]);

  if (loading) return <div className="loading-spinner"><span>⏳</span> Loading orders...</div>;

  return (
    <div className="fade-up">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "2rem", flexWrap: "wrap", gap: "1rem" }}>
        <div className="page-header" style={{ marginBottom: 0 }}>
          <h2>All Orders</h2>
          <p>{orders.length} total orders</p>
        </div>
        <Link to="/admin" className="btn-outline-custom" style={{ textDecoration: "none" }}>← Dashboard</Link>
      </div>

      {orders.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📋</div>
          <h4>No orders yet</h4>
        </div>
      ) : (
        orders.map(o => (
          <div className="order-card" key={o._id}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "0.5rem" }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: "0.3rem" }}>
                  Order #{o._id?.slice(-8).toUpperCase()}
                </div>
                <div style={{ fontWeight: 700, fontSize: "1.1rem", color: "var(--accent)" }}>
                  ₹ {o.totalAmount?.toLocaleString() || o.total?.toLocaleString()}
                </div>
              </div>
              <span className={`status-badge ${statusClass(o.status)}`}>{o.status || "Pending"}</span>
            </div>
            {o.user && (
              <div style={{ marginTop: "0.5rem", fontSize: "0.85rem", color: "var(--text-muted)" }}>
                👤 {o.user?.name || o.user?.email || "Customer"}
              </div>
            )}
            {o.createdAt && (
              <div style={{ marginTop: "0.25rem", fontSize: "0.82rem", color: "var(--text-muted)" }}>
                {new Date(o.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}
