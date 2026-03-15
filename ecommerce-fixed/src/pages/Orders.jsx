import { useEffect, useState } from "react";
import axios from "../api/axios";
import { useAuth } from "../context/AuthContext";

const statusClass = (s) => {
  if (!s) return "status-pending";
  const sl = s.toLowerCase();
  if (sl === "delivered") return "status-delivered";
  if (sl === "cancelled") return "status-cancelled";
  if (sl === "processing") return "status-processing";
  return "status-pending";
};

export default function Orders() {
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
      <div className="page-header">
        <h2>My Orders</h2>
        <p>{orders.length} order{orders.length !== 1 ? "s" : ""} placed</p>
      </div>

      {orders.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📦</div>
          <h4>No orders yet</h4>
          <p>Your order history will appear here</p>
        </div>
      ) : (
        orders.map(order => (
          <div className="order-card" key={order._id}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "0.5rem" }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: "0.3rem" }}>
                  Order #{order._id?.slice(-8).toUpperCase()}
                </div>
                <div style={{ fontWeight: 700, fontSize: "1.2rem", color: "var(--accent)" }}>
                  ₹ {order.totalAmount?.toLocaleString() || order.total?.toLocaleString()}
                </div>
              </div>
              <span className={`status-badge ${statusClass(order.status)}`}>
                {order.status || "Pending"}
              </span>
            </div>
            {order.items?.length > 0 && (
              <>
                <div className="divider" style={{ margin: "0.75rem 0" }} />
                <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                  {order.items.map((item, i) => (
                    <span key={i} style={{
                      background: "#f3f4f6", padding: "0.25rem 0.75rem",
                      borderRadius: 50, fontSize: "0.82rem", color: "var(--text-muted)"
                    }}>
                      {item.product?.name || item.name} × {item.quantity}
                    </span>
                  ))}
                </div>
              </>
            )}
            {order.createdAt && (
              <div style={{ marginTop: "0.75rem", fontSize: "0.82rem", color: "var(--text-muted)" }}>
                Placed on {new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}
