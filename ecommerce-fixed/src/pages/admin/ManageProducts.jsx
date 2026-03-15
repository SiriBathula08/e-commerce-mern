import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "../../api/axios";
import { useAuth } from "../../context/AuthContext";

export default function ManageProducts() {
  const { token } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");

  const fetchProducts = () => {
    setLoading(true);
    axios.get("/products").then(res => setProducts(res.data)).finally(() => setLoading(false));
  };

  useEffect(() => { fetchProducts(); }, []);

  const deleteProduct = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    try {
      await axios.delete(`/products/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      fetchProducts();
      setMsg("✅ Product deleted");
      setTimeout(() => setMsg(""), 3000);
    } catch { setMsg("❌ Failed to delete"); }
  };

  if (loading) return <div className="loading-spinner"><span>⏳</span> Loading...</div>;

  return (
    <div className="fade-up">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "2rem", flexWrap: "wrap", gap: "1rem" }}>
        <div className="page-header" style={{ marginBottom: 0 }}>
          <h2>Manage Products</h2>
          <p>{products.length} products</p>
        </div>
        <Link to="/admin" className="btn-outline-custom" style={{ textDecoration: "none" }}>← Dashboard</Link>
      </div>

      {msg && <div className={`alert-custom ${msg.startsWith("✅") ? "alert-success" : "alert-error"}`}>{msg}</div>}

      <div className="row g-3">
        {products.map(p => (
          <div className="col-md-6 col-lg-4" key={p._id}>
            <div className="product-card">
              <img src={p.image || `https://placehold.co/300x180/1a1a2e/white?text=${encodeURIComponent(p.name)}`} alt={p.name} style={{ height: 180 }} />
              <div className="product-card-body">
                <h5>{p.name}</h5>
                <div className="product-price">₹ {p.price?.toLocaleString()}</div>
                {p.stock !== undefined && (
                  <div style={{ fontSize: "0.82rem", color: "var(--text-muted)", marginTop: "0.3rem" }}>
                    Stock: {p.stock}
                  </div>
                )}
              </div>
              <div className="product-card-footer">
                <button onClick={() => deleteProduct(p._id)}
                  style={{ background: "#fee2e2", border: "none", color: "#991b1b", padding: "0.65rem 1.5rem",
                    borderRadius: 50, fontWeight: 600, cursor: "pointer", width: "100%", fontSize: "0.9rem" }}>
                  🗑 Delete Product
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
