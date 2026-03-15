import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "../api/axios";

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    axios.get("/products")
      .then(res => setProducts(res.data))
      .catch(err => console.log(err))
      .finally(() => setLoading(false));
  }, []);

  const filtered = products.filter(p =>
    p.name?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div className="loading-spinner"><span>⏳</span> Loading products...</div>;

  return (
    <div className="fade-up">
      <div className="page-header">
        <h2>All Products</h2>
        <p>{products.length} items available</p>
      </div>

      <div style={{ marginBottom: "1.5rem" }}>
        <input
          className="form-input-custom"
          placeholder="🔍  Search products..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ maxWidth: 400 }}
        />
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🔍</div>
          <h4>No products found</h4>
          <p>Try a different search term</p>
        </div>
      ) : (
        <div className="row g-3">
          {filtered.map(prod => (
            <div className="col-6 col-md-3" key={prod._id}>
              <div className="product-card">
                <img
                  src={prod.image || `https://placehold.co/300x220/1a1a2e/white?text=${encodeURIComponent(prod.name || "Product")}`}
                  alt={prod.name}
                />
                <div className="product-card-body">
                  <h5>{prod.name}</h5>
                  <div className="product-price">₹ {prod.price?.toLocaleString()}</div>
                  {prod.category && (
                    <span style={{
                      fontSize: "0.75rem", background: "#f3f4f6", color: "var(--text-muted)",
                      padding: "0.2rem 0.6rem", borderRadius: 50, display: "inline-block", marginTop: "0.5rem"
                    }}>{prod.category}</span>
                  )}
                </div>
                <div className="product-card-footer">
                  <Link to={`/products/${prod._id}`} className="btn-primary-custom">
                    View Details →
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
