import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../utils/api';

const statusColors = {
  Pending: 'badge-warning', Processing: 'badge-info',
  Shipped: 'badge-info', Delivered: 'badge-success', Cancelled: 'badge-danger'
};

export default function OrderDetail() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get(`/orders/${id}`)
      .then(r => setOrder(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="loading"><div className="spinner" /></div>;
  if (!order) return <div className="container" style={{ padding: '2rem' }}><p>Order not found.</p></div>;

  return (
    <div className="container" style={{ padding: '2rem 1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.4rem', fontWeight: 700 }}>Order #{order._id.slice(-8).toUpperCase()}</h1>
        <span className={`badge ${statusColors[order.status]}`} style={{ fontSize: '0.9rem', padding: '0.4rem 1rem' }}>{order.status}</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '2rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Items */}
          <div className="card">
            <h2 style={{ marginBottom: '1rem', fontSize: '1rem', fontWeight: 700 }}>Order Items</h2>
            {order.items.map((item, i) => (
              <div key={i} style={{ display: 'flex', gap: '1rem', alignItems: 'center', padding: '0.75rem 0', borderBottom: i < order.items.length - 1 ? '1px solid var(--border)' : 'none' }}>
                <img src={item.image} alt={item.name} style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: 'var(--radius)' }} />
                <div style={{ flex: 1 }}>
                  <p style={{ fontWeight: 500 }}>{item.name}</p>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Qty: {item.quantity}</p>
                </div>
                <p style={{ fontWeight: 600 }}>₹{(item.price * item.quantity).toLocaleString()}</p>
              </div>
            ))}
          </div>

          {/* Shipping Address */}
          <div className="card">
            <h2 style={{ marginBottom: '0.75rem', fontSize: '1rem', fontWeight: 700 }}>Shipping Address</h2>
            <p style={{ color: 'var(--text-muted)', lineHeight: 1.8 }}>
              {order.shippingAddress.street}<br />
              {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}<br />
              {order.shippingAddress.country}
            </p>
          </div>
        </div>

        {/* Summary */}
        <div className="card" style={{ alignSelf: 'flex-start' }}>
          <h2 style={{ marginBottom: '1rem', fontSize: '1rem', fontWeight: 700 }}>Payment Summary</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.9rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Items</span>
              <span>₹{order.itemsPrice.toLocaleString()}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Shipping</span>
              <span>{order.shippingPrice === 0 ? 'FREE' : `₹${order.shippingPrice}`}</span>
            </div>
            <hr style={{ borderColor: 'var(--border)' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700 }}>
              <span>Total</span>
              <span style={{ color: 'var(--primary)' }}>₹{order.totalPrice.toLocaleString()}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Payment</span>
              <span>{order.paymentMethod}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Date</span>
              <span>{new Date(order.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
          <Link to="/orders" className="btn btn-outline btn-sm" style={{ marginTop: '1.5rem', display: 'block', textAlign: 'center' }}>
            ← Back to Orders
          </Link>
        </div>
      </div>
    </div>
  );
}
