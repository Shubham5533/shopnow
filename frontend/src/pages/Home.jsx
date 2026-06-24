import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../utils/api';
import ProductCard from '../components/products/ProductCard';
import './Home.css';

const categories = ['Electronics', 'Clothing', 'Books', 'Home', 'Sports', 'Beauty'];

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/products/featured')
      .then(r => setFeatured(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="home">
      {/* Hero */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <span className="hero-badge">New Arrivals Every Week</span>
            <h1>Shop the Best<br /><span className="gradient-text">Products Online</span></h1>
            <p>Discover thousands of products at unbeatable prices. Fast delivery, easy returns.</p>
            <div className="hero-actions">
              <Link to="/products" className="btn btn-primary">Shop Now</Link>
              <Link to="/products?category=Electronics" className="btn btn-outline">Explore Electronics</Link>
            </div>
          </div>
          <div className="hero-image">🛍️</div>
        </div>
      </section>

      {/* Categories */}
      <section className="section">
        <div className="container">
          <h2 className="section-title">Shop by Category</h2>
          <div className="categories-grid">
            {categories.map(cat => (
              <Link key={cat} to={`/products?category=${cat}`} className="category-card">
                <span className="cat-icon">
                  {cat === 'Electronics' ? '💻' : cat === 'Clothing' ? '👕' : cat === 'Books' ? '📚' : cat === 'Home' ? '🏠' : cat === 'Sports' ? '⚽' : '💄'}
                </span>
                <span>{cat}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="section" style={{ background: 'white', padding: '3rem 0' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h2 className="section-title" style={{ margin: 0 }}>Featured Products</h2>
            <Link to="/products" className="btn btn-outline btn-sm">View All</Link>
          </div>
          {loading ? (
            <div className="loading"><div className="spinner" /></div>
          ) : (
            <div className="grid-4">
              {featured.map(p => <ProductCard key={p._id} product={p} />)}
            </div>
          )}
        </div>
      </section>

      {/* Features */}
      <section className="section">
        <div className="container">
          <div className="features-grid">
            {[
              { icon: '🚀', title: 'Fast Delivery', desc: 'Get your orders delivered within 2-5 business days' },
              { icon: '🔒', title: 'Secure Payment', desc: 'Your payment info is always safe and encrypted' },
              { icon: '↩️', title: 'Easy Returns', desc: '30-day hassle-free return policy on all items' },
              { icon: '🎧', title: '24/7 Support', desc: 'Our support team is always ready to help you' }
            ].map(f => (
              <div key={f.title} className="feature-card">
                <span className="feature-icon">{f.icon}</span>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
