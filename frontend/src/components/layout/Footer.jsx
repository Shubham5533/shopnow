import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer style={{
      background: '#1e293b',
      color: '#94a3b8',
      padding: '2rem 0',
      marginTop: '3rem'
    }}>
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ color: 'white', fontWeight: 700, fontSize: '1.1rem', marginBottom: '0.25rem' }}>🛍️ ShopNow</div>
          <div style={{ fontSize: '0.85rem' }}>Your one-stop online store</div>
        </div>
        <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.9rem' }}>
          <Link to="/products" style={{ color: '#94a3b8' }}>Products</Link>
          <Link to="/orders" style={{ color: '#94a3b8' }}>Orders</Link>
          <Link to="/profile" style={{ color: '#94a3b8' }}>Profile</Link>
        </div>
        <div style={{ fontSize: '0.8rem' }}>© 2026 ShopNow. All rights reserved.</div>
      </div>
    </footer>
  );
}
