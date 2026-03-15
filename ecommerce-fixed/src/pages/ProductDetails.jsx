import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "../api/axios";
import { useAuth } from "../context/AuthContext";

export default function ProductDetails() {
  const { id } = useParams();
  const { token } = useAuth();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`/products/${id}`)
      .then(res => setProduct(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  const addToCart = async () => {
    if (!token) { navigate("/login"); return; }
    try {
      await axios.post("/cart/add", { productId: id, quantity: qty },
        { headers: { Authorization: `Bearer ${token}` } });
      setMsg("✅ Added to cart!");
      setTimeout(() => setMsg(""), 3000);
    } catch { setMsg("❌ Failed to add to cart"); }
  };

  const addToWishlist = async () => {
    if (!token) { navigate("/login"); return; }
    try {
      await axios.post("/wishlist/add", { productId: id },
        { headers: { Authorization: `Bearer ${token}` } });
      setMsg("❤️ Added to wishlist!");
      setTimeout(() => setMsg(""), 3000);
    } catch { setMsg("❌ Already in wishlist"); }
  };

  if (loading) return <div className="loading-spinner"><span>⏳</span> Loading...</div>;
  if (!product) return <div className="empty-state"><div className="empty-icon">😕</div><h4>Product not found</h4></div>;

  return (
    <div className="fade-up">
      <div style={{ marginBottom: "1rem" }}>
        <Link to="/products" style={{ color: "var(--text-muted)", textDecoration: "none", fontSize: "0.9rem" }}>
          ← Back to Products
        </Link>
      </div>

      <div className="row g-4">
        <div className="col-md-5">
          <div style={{ borderRadius: "var(--radius)", overflow: "hidden", boxShadow: "var(--shadow)" }}>
            <img
              src={product.image || `https://placehold.co/500x400/1a1a2e/white?text=${encodeURIComponent(product.name)}`}
              alt={product.name}
              style={{ width: "100%", display: "block" }}
            />
          </div>
        </div>

        <div className="col-md-7">
          {product.category && (
            <span style={{
              fontSize: "0.8rem", background: "#f3f4f6", color: "var(--text-muted)",
              padding: "0.3rem 0.8rem", borderRadius: 50, display: "inline-block", marginBottom: "0.75rem"
            }}>{product.category}</span>
          )}
          <h2 style={{ fontSize: "2rem", marginBottom: "0.75rem" }}>{product.name}</h2>
          <p style={{ color: "var(--text-muted)", lineHeight: 1.7, marginBottom: "1.25rem" }}>
            {product.description || "Premium quality product, carefully selected for your satisfaction."}
          </p>

          <div style={{ fontSize: "2.2rem", fontWeight: 700, color: "var(--accent)", marginBottom: "1.5rem" }}>
            ₹ {product.price?.toLocaleString()}
          </div>

          {product.stock !== undefined && (
            <p style={{ marginBottom: "1rem", fontSize: "0.9rem" }}>
              {product.stock > 0
                ? <span style={{ color: "#065f46" }}>✅ In Stock ({product.stock} available)</span>
                : <span style={{ color: "#991b1b" }}>❌ Out of Stock</span>}
            </p>
          )}

          {msg && <div className={`alert-custom ${msg.startsWith("✅") || msg.startsWith("❤") ? "alert-success" : "alert-error"}`}>{msg}</div>}

          <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.25rem" }}>
            <span style={{ fontWeight: 500 }}>Quantity:</span>
            <div className="qty-input">
              <button className="qty-btn" onClick={() => setQty(q => Math.max(1, q - 1))}>−</button>
              <span className="qty-val">{qty}</span>
              <button className="qty-btn" onClick={() => setQty(q => q + 1)}>+</button>
            </div>
          </div>

          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
            <button className="btn-accent" onClick={addToCart}>🛒 Add to Cart</button>
            <button className="btn-outline-custom" onClick={addToWishlist}>♥ Wishlist</button>
          </div>
        </div>
      </div>
    </div>
  );
}
