import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { FiShoppingCart, FiUser, FiLogOut, FiShield } from 'react-icons/fi';
import './Navbar.css';
import { useState } from 'react';

export default function Navbar() {
  const [showBanner, setShowBanner] = useState(true);
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();

  return (

    <>
      {showBanner && (
        <div style={{
          background: '#fef3c7',
          borderBottom: '1px solid #f59e0b',
          padding: '0.5rem 1rem',
          textAlign: 'center',
          fontSize: '0.85rem',
          color: '#92400e',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          First load may take 30-60 seconds — backend is waking up on free tier
          <button onClick={() => setShowBanner(false)}
            style={{ background: 'none', fontSize: '1rem', color: '#92400e', marginLeft: '0.5rem' }}>
            ✕
          </button>
        </div>
      )}

    <nav className="navbar">
      <div className="container nav-inner">
        <Link to="/" className="logo">
          🛍️ <span>ShopNow</span>
        </Link>

        <div className="nav-links">
          <Link to="/products">Products</Link>
          {user?.role === 'admin' && (
            <Link to="/admin" className="admin-link"><FiShield /> Admin</Link>
          )}
        </div>

        <div className="nav-actions">
          {user ? (
            <>
              <Link to="/cart" className="cart-btn">
                <FiShoppingCart size={20} />
                {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
              </Link>
              <div className="user-menu">
                <button className="user-btn">
                  <FiUser size={18} /> {user.name.split(' ')[0]}
                </button>
                <div className="dropdown">
                  <Link to="/profile">My Profile</Link>
                  <Link to="/orders">My Orders</Link>
                  <button onClick={() => { logout(); navigate('/'); }}>
                    <FiLogOut size={14} /> Logout
                  </button>
                </div>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-outline btn-sm">Login</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
    </>
  );
}
