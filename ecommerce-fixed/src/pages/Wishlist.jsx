import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "../api/axios";
import { useAuth } from "../context/AuthContext";

export default function Wishlist() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");

  const fetchWishlist = () => {
    axios.get("/wishlist", { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setWishlist(res.data.items || res.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchWishlist(); }, [token]);

  const removeItem = async (productId) => {
    await axios.delete(`/wishlist/remove/${productId}`, { headers: { Authorization: `Bearer ${token}` } });
    fetchWishlist();
  };

  const moveToCart = async (productId) => {
    try {
      await axios.post("/cart/add", { productId, quantity: 1 }, { headers: { Authorization: `Bearer ${token}` } });
      await removeItem(productId);
      setMsg("✅ Moved to cart!");
      setTimeout(() => setMsg(""), 3000);
    } catch { setMsg("❌ Failed to move to cart"); }
  };

  if (loading) return <div className="loading-spinner"><span>⏳</span> Loading wishlist...</div>;

  return (
    <div className="fade-up">
      <div className="page-header">
        <h2>My Wishlist</h2>
        <p>{wishlist.length} saved item{wishlist.length !== 1 ? "s" : ""}</p>
      </div>

      {msg && <div className={`alert-custom ${msg.startsWith("✅") ? "alert-success" : "alert-error"}`}>{msg}</div>}

      {wishlist.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">♥</div>
          <h4>Your wishlist is empty</h4>
          <p style={{ marginBottom: "1.5rem" }}>Save items you love for later</p>
          <Link to="/products" className="btn-accent" style={{ textDecoration: "none" }}>Browse Products</Link>
        </div>
      ) : (
        <div className="row g-3">
          {wishlist.map(item => {
            const product = item.product || item;
            const productId = product._id || item.productId;
            return (
              <div className="col-md-4" key={productId}>
                <div className="product-card">
                  <img
                    src={product.image || `https://placehold.co/300x200/1a1a2e/white?text=${encodeURIComponent(product.name || "")}`}
                    alt={product.name}
                  />
                  <div className="product-card-body">
                    <h5>{product.name}</h5>
                    <div className="product-price">₹ {product.price?.toLocaleString()}</div>
                  </div>
                  <div className="product-card-footer" style={{ display: "flex", gap: "0.5rem" }}>
                    <button className="btn-primary-custom" style={{ flex: 1 }} onClick={() => moveToCart(productId)}>
                      🛒 Add to Cart
                    </button>
                    <button onClick={() => removeItem(productId)}
                      style={{ background: "#fee2e2", border: "none", borderRadius: 50, padding: "0.65rem 0.9rem", cursor: "pointer", color: "#991b1b" }}>
                      🗑
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
