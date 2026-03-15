import { useAuth } from "../context/AuthContext";

export default function Profile() {
  const { user, loading, logout } = useAuth();

  if (loading) return <div className="loading-spinner"><span>⏳</span> Loading...</div>;
  if (!user) return <div className="empty-state"><h4>Please login to view your profile</h4></div>;

  const initials = user.name?.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2) || "U";

  return (
    <div className="fade-up" style={{ maxWidth: 600, margin: "0 auto" }}>
      <div className="page-header">
        <h2>My Profile</h2>
      </div>

      <div className="form-card" style={{ maxWidth: "100%", textAlign: "center" }}>
        <div className="profile-avatar">{initials}</div>
        <h3 style={{ marginBottom: "0.25rem" }}>{user.name}</h3>
        <p style={{ color: "var(--text-muted)", marginBottom: "0.5rem" }}>{user.email}</p>
        {user.isAdmin && (
          <span style={{
            background: "#fef3c7", color: "#92400e",
            padding: "0.3rem 1rem", borderRadius: 50, fontSize: "0.82rem", fontWeight: 600
          }}>⚙ Admin</span>
        )}
      </div>

      <div className="row g-3 mt-2">
        {[
          { icon: "📦", label: "My Orders", link: "/orders" },
          { icon: "♥", label: "Wishlist", link: "/wishlist" },
          { icon: "🛒", label: "Cart", link: "/cart" },
        ].map(item => (
          <div className="col-4" key={item.label}>
            <a href={item.link} style={{ textDecoration: "none" }}>
              <div className="stat-card text-center" style={{ cursor: "pointer" }}>
                <div style={{ fontSize: "1.75rem", marginBottom: "0.5rem" }}>{item.icon}</div>
                <div style={{ fontWeight: 600, fontSize: "0.9rem" }}>{item.label}</div>
              </div>
            </a>
          </div>
        ))}
      </div>

      <div className="mt-4 text-center">
        <button className="btn-outline-custom" onClick={logout} style={{ borderColor: "#ef4444", color: "#ef4444" }}>
          Logout
        </button>
      </div>
    </div>
  );
}
