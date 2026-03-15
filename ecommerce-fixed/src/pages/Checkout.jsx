import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios";
import { useAuth } from "../context/AuthContext";

export default function Checkout() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [placing, setPlacing] = useState(false);
  const [form, setForm] = useState({ address: "", city: "", pincode: "", phone: "" });
  const [msg, setMsg] = useState("");

  useEffect(() => {
    axios.get("/cart", { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setCart(res.data.items || res.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [token]);

  const total = cart.reduce((sum, item) => {
    const price = item.product?.price || item.price || 0;
    return sum + price * (item.quantity || 1);
  }, 0);

  const placeOrder = async (e) => {
    e.preventDefault();
    setPlacing(true);
    try {
      await axios.post("/orders", { shippingAddress: form, items: cart },
        { headers: { Authorization: `Bearer ${token}` } });
      setMsg("✅ Order placed successfully!");
      setTimeout(() => navigate("/orders"), 2000);
    } catch {
      setMsg("❌ Failed to place order. Please try again.");
    } finally {
      setPlacing(false);
    }
  };

  if (loading) return <div className="loading-spinner"><span>⏳</span> Loading...</div>;

  return (
    <div className="fade-up">
      <div className="page-header"><h2>Checkout</h2></div>

      {msg && <div className={`alert-custom ${msg.startsWith("✅") ? "alert-success" : "alert-error"}`}>{msg}</div>}

      <div className="row g-4">
        <div className="col-md-7">
          <div className="form-card" style={{ maxWidth: "100%" }}>
            <h4 style={{ marginBottom: "1.5rem", fontFamily: "'DM Sans', sans-serif" }}>Shipping Details</h4>
            <form onSubmit={placeOrder}>
              <div className="form-group">
                <label className="form-label-custom">Street Address</label>
                <input className="form-input-custom" placeholder="123, MG Road..."
                  value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} required />
              </div>
              <div className="row g-2">
                <div className="col-6">
                  <label className="form-label-custom">City</label>
                  <input className="form-input-custom" placeholder="Hyderabad"
                    value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} required />
                </div>
                <div className="col-6">
                  <label className="form-label-custom">Pincode</label>
                  <input className="form-input-custom" placeholder="500001"
                    value={form.pincode} onChange={e => setForm({ ...form, pincode: e.target.value })} required />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label-custom">Phone Number</label>
                <input className="form-input-custom" placeholder="+91 9876543210"
                  value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} required />
              </div>
              <button type="submit" className="btn-accent" style={{ width: "100%", marginTop: "0.5rem" }} disabled={placing}>
                {placing ? "Placing order..." : `Place Order · ₹ ${(total + (total > 499 ? 0 : 49)).toLocaleString()}`}
              </button>
            </form>
          </div>
        </div>

        <div className="col-md-5">
          <div className="cart-summary">
            <h4>Order Summary</h4>
            {cart.map((item, i) => {
              const product = item.product || item;
              return (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.75rem", fontSize: "0.9rem" }}>
                  <span style={{ color: "var(--text-muted)" }}>{product.name} × {item.quantity || 1}</span>
                  <span style={{ fontWeight: 600 }}>₹ {((product.price || 0) * (item.quantity || 1)).toLocaleString()}</span>
                </div>
              );
            })}
            <div className="divider" />
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.75rem" }}>
              <span style={{ color: "var(--text-muted)" }}>Delivery</span>
              <span style={{ color: "#065f46", fontWeight: 600 }}>{total > 499 ? "FREE" : "₹ 49"}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontWeight: 700, fontSize: "1.1rem" }}>Total</span>
              <span style={{ fontWeight: 700, fontSize: "1.3rem", color: "var(--accent)" }}>
                ₹ {(total + (total > 499 ? 0 : 49)).toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
