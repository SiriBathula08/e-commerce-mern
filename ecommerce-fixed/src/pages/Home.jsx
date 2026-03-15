import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "../api/axios";

export default function Home() {
  const [featured, setFeatured] = useState([]);

  useEffect(() => {
    axios.get("/products")
      .then(res => setFeatured(res.data.slice(0, 4)))
      .catch(() => {});
  }, []);

  return (
    <div className="fade-up">
      {/* Hero */}
      <div className="hero-section">
        <h1>Discover <span>Premium</span> Products</h1>
        <p>Shop the finest curated collection with fast delivery, easy returns and exclusive deals.</p>
        <Link to="/products" className="hero-cta">
          Shop Now →
        </Link>
      </div>

      {/* Features */}
      <div className="row g-3 mb-4">
        {[
          { icon: "🚚", title: "Free Shipping", desc: "On orders above ₹499" },
          { icon: "🔒", title: "Secure Payment", desc: "100% secure transactions" },
          { icon: "↩️", title: "Easy Returns", desc: "30-day return policy" },
          { icon: "🎁", title: "Best Deals", desc: "Exclusive member offers" },
        ].map((f) => (
          <div className="col-6 col-md-3" key={f.title}>
            <div className="stat-card text-center">
              <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>{f.icon}</div>
              <div style={{ fontWeight: 600, fontSize: "0.95rem" }}>{f.title}</div>
              <div style={{ color: "var(--text-muted)", fontSize: "0.82rem", marginTop: "0.25rem" }}>{f.desc}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Featured Products */}
      {featured.length > 0 && (
        <>
          <div className="page-header">
            <h2>Featured Products</h2>
            <p>Handpicked just for you</p>
          </div>
          <div className="row g-3 mb-4">
            {featured.map(p => (
              <div className="col-6 col-md-3" key={p._id}>
                <div className="product-card">
                  <img src={p.image || "https://placehold.co/300x220/1a1a2e/white?text=Product"} alt={p.name} />
                  <div className="product-card-body">
                    <h5>{p.name}</h5>
                    <div className="product-price">₹ {p.price}</div>
                  </div>
                  <div className="product-card-footer">
                    <Link to={`/products/${p._id}`} className="btn-primary-custom">View Details</Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center">
            <Link to="/products" className="btn-accent" style={{ textDecoration: "none" }}>
              View All Products
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
