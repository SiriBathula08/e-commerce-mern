import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "../../api/axios";
import { useAuth } from "../../context/AuthContext";

export default function UsersPanel() {
  const { token } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get("/admin/users", { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setUsers(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [token]);

  if (loading) return <div className="loading-spinner"><span>⏳</span> Loading users...</div>;

  return (
    <div className="fade-up">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "2rem", flexWrap: "wrap", gap: "1rem" }}>
        <div className="page-header" style={{ marginBottom: 0 }}>
          <h2>Users</h2>
          <p>{users.length} registered users</p>
        </div>
        <Link to="/admin" className="btn-outline-custom" style={{ textDecoration: "none" }}>← Dashboard</Link>
      </div>

      {users.map(u => {
        const initials = u.name?.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2) || "U";
        return (
          <div className="order-card" key={u._id} style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <div style={{
              width: 44, height: 44, borderRadius: "50%",
              background: u.isAdmin ? "linear-gradient(135deg, #f5a623, #e94560)" : "linear-gradient(135deg, #1a1a2e, #0f3460)",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "white", fontWeight: 700, fontSize: "0.9rem", flexShrink: 0
            }}>{initials}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600 }}>{u.name}</div>
              <div style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>{u.email}</div>
            </div>
            {u.isAdmin && (
              <span className="status-badge" style={{ background: "#fef3c7", color: "#92400e" }}>⚙ Admin</span>
            )}
          </div>
        );
      })}
    </div>
  );
}
