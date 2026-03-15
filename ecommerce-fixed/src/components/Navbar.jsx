import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar-custom">
      <Link to="/" className="navbar-brand-custom">
        Shop<span>Elite</span>
      </Link>

      <div className="navbar-links">
        <Link to="/products" className="nav-link-custom">
          🛍 Products
        </Link>

        {user && (
          <>
            <Link to="/cart" className="nav-link-custom">🛒 Cart</Link>
            <Link to="/orders" className="nav-link-custom">📦 Orders</Link>
            <Link to="/wishlist" className="nav-link-custom">♥ Wishlist</Link>
            <Link to="/profile" className="nav-link-custom">
              👤 {user.name?.split(" ")[0] || "Profile"}
            </Link>
          </>
        )}

        {user?.isAdmin && (
          <Link to="/admin" className="nav-link-custom" style={{ color: "#f5a623" }}>
            ⚙ Admin
          </Link>
        )}

        {!user ? (
          <>
            <Link to="/login" className="nav-link-custom">Login</Link>
            <Link to="/register" className="nav-link-accent nav-link-custom">Sign Up</Link>
          </>
        ) : (
          <button className="nav-link-custom" onClick={handleLogout}
            style={{ background: "none", border: "none", cursor: "pointer" }}>
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}
