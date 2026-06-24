import { Link, useNavigate } from 'react-router-dom';
import { FiTrash2, FiShoppingBag } from 'react-icons/fi';
import { useCart } from '../context/CartContext';

export default function CartPage() {
  const { cart, updateQty, removeFromCart, cartTotal, cartLoading } = useCart();
  const navigate = useNavigate();

  if (cartLoading) return <div className="loading"><div className="spinner" /></div>;

  if (cart.length === 0) {
    return (
      <div className="container" style={{ padding: '4rem 1rem', textAlign: 'center' }}>
        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🛒</div>
        <h2 style={{ marginBottom: '0.5rem' }}>Your cart is empty</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Add some products to get started</p>
        <Link to="/products" className="btn btn-primary">Browse Products</Link>
      </div>
    );
  }

  const shipping = cartTotal > 500 ? 0 : 50;

  return (
    <div className="container" style={{ padding: '2rem 1rem' }}>
      <h1 style={{ marginBottom: '1.5rem', fontSize: '1.6rem', fontWeight: 700 }}>Shopping Cart</h1>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '2rem', alignItems: 'flex-start' }}>
        {/* Items */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {cart.map(item => (
            <div key={item.product?._id} className="card" style={{ display: 'flex', gap: '1rem', alignItems: 'center', padding: '1rem' }}>
              <img src={item.product?.image} alt={item.product?.name} style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: 'var(--radius)' }} />
              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: '0.3rem' }}>{item.product?.name}</h3>
                <p style={{ color: 'var(--primary)', fontWeight: 700 }}>₹{item.product?.price?.toLocaleString()}</p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--border)', borderRadius: 'var(--radius)', overflow: 'hidden' }}>
                <button style={{ padding: '0.3rem 0.6rem', background: 'none', borderRight: '1px solid var(--border)' }} onClick={() => updateQty(item.product?._id, item.quantity - 1)}>−</button>
                <span style={{ padding: '0.3rem 0.75rem', fontWeight: 600 }}>{item.quantity}</span>
                <button style={{ padding: '0.3rem 0.6rem', background: 'none', borderLeft: '1px solid var(--border)' }} onClick={() => updateQty(item.product?._id, item.quantity + 1)}>+</button>
              </div>
              <div style={{ fontWeight: 700, minWidth: '80px', textAlign: 'right' }}>
                ₹{((item.product?.price || 0) * item.quantity).toLocaleString()}
              </div>
              <button className="btn btn-danger btn-sm" onClick={() => removeFromCart(item.product?._id)}>
                <FiTrash2 />
              </button>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="card">
          <h2 style={{ marginBottom: '1.25rem', fontSize: '1.1rem', fontWeight: 700 }}>Order Summary</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Subtotal</span>
              <span>₹{cartTotal.toLocaleString()}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Shipping</span>
              <span style={{ color: shipping === 0 ? 'var(--success)' : 'inherit' }}>
                {shipping === 0 ? 'FREE' : `₹${shipping}`}
              </span>
            </div>
            {shipping > 0 && <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Add ₹{500 - cartTotal} more for free shipping</p>}
            <hr style={{ borderColor: 'var(--border)' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: '1.1rem' }}>
              <span>Total</span>
              <span style={{ color: 'var(--primary)' }}>₹{(cartTotal + shipping).toLocaleString()}</span>
            </div>
          </div>
          <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '0.9rem' }}
            onClick={() => navigate('/checkout')}>
            <FiShoppingBag /> Proceed to Checkout
          </button>
          <Link to="/products" style={{ display: 'block', textAlign: 'center', marginTop: '0.75rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
