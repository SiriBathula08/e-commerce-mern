import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "../api/axios";
import { useAuth } from "../context/AuthContext";

export default function Cart() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCart = () => {
    axios.get("/cart", { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setCart(res.data.items || res.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchCart(); }, [token]);

  const updateQty = async (productId, quantity) => {
    if (quantity < 1) return removeItem(productId);
    await axios.put("/cart/update", { productId, quantity }, { headers: { Authorization: `Bearer ${token}` } });
    fetchCart();
  };

  const removeItem = async (productId) => {
    await axios.delete(`/cart/remove/${productId}`, { headers: { Authorization: `Bearer ${token}` } });
    fetchCart();
  };

  const total = cart.reduce((sum, item) => {
    const price = item.product?.price || item.price || 0;
    return sum + price * (item.quantity || 1);
  }, 0);

  if (loading) return <div className="loading-spinner"><span>⏳</span> Loading cart...</div>;

  return (
    <div className="fade-up">
      <div className="page-header">
        <h2>Shopping Cart</h2>
        <p>{cart.length} item{cart.length !== 1 ? "s" : ""} in your cart</p>
      </div>

      {cart.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🛒</div>
          <h4>Your cart is empty</h4>
          <p style={{ marginBottom: "1.5rem" }}>Looks like you haven't added anything yet</p>
          <Link to="/products" className="btn-accent" style={{ textDecoration: "none" }}>Browse Products</Link>
        </div>
      ) : (
        <div className="row g-3">
          <div className="col-md-8">
            {cart.map(item => {
              const product = item.product || item;
              const productId = product._id || item.productId;
              return (
                <div className="cart-item" key={productId}>
                  <img
                    src={product.image || `https://placehold.co/90x90/1a1a2e/white?text=${encodeURIComponent(product.name || "")}`}
                    alt={product.name}
                  />
                  <div className="cart-item-info">
                    <h5>{product.name}</h5>
                    <div style={{ color: "var(--accent)", fontWeight: 700, fontSize: "1.1rem" }}>
                      ₹ {product.price?.toLocaleString()}
                    </div>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "0.75rem" }}>
                    <div className="qty-input">
                      <button className="qty-btn" onClick={() => updateQty(productId, (item.quantity || 1) - 1)}>−</button>
                      <span className="qty-val">{item.quantity || 1}</span>
                      <button className="qty-btn" onClick={() => updateQty(productId, (item.quantity || 1) + 1)}>+</button>
                    </div>
                    <button onClick={() => removeItem(productId)}
                      style={{ background: "none", border: "none", color: "#ef4444", cursor: "pointer", fontSize: "0.85rem" }}>
                      🗑 Remove
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="col-md-4">
            <div className="cart-summary">
              <h4>Order Summary</h4>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.75rem" }}>
                <span style={{ color: "var(--text-muted)" }}>Subtotal</span>
                <span style={{ fontWeight: 600 }}>₹ {total.toLocaleString()}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.75rem" }}>
                <span style={{ color: "var(--text-muted)" }}>Delivery</span>
                <span style={{ color: "#065f46", fontWeight: 600 }}>{total > 499 ? "FREE" : "₹ 49"}</span>
              </div>
              <div className="divider" />
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1.5rem" }}>
                <span style={{ fontWeight: 700, fontSize: "1.1rem" }}>Total</span>
                <span style={{ fontWeight: 700, fontSize: "1.3rem", color: "var(--accent)" }}>
                  ₹ {(total + (total > 499 ? 0 : 49)).toLocaleString()}
                </span>
              </div>
              <button className="btn-accent" style={{ width: "100%" }} onClick={() => navigate("/checkout")}>
                Proceed to Checkout →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
