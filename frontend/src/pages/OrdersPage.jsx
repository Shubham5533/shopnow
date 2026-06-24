import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../utils/api';

const statusColors = {
  Pending: 'badge-warning', Processing: 'badge-info',
  Shipped: 'badge-info', Delivered: 'badge-success', Cancelled: 'badge-danger'
};

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/orders/myorders')
      .then(r => setOrders(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading"><div className="spinner" /></div>;

  return (
    <div className="container" style={{ padding: '2rem 1rem' }}>
      <h1 style={{ marginBottom: '1.5rem', fontSize: '1.6rem', fontWeight: 700 }}>My Orders</h1>
      {orders.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📦</div>
          <h2>No orders yet</h2>
          <Link to="/products" className="btn btn-primary" style={{ marginTop: '1rem' }}>Start Shopping</Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {orders.map(order => (
            <div key={order._id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                  Order #{order._id.slice(-8).toUpperCase()}
                </div>
                <div style={{ fontWeight: 600 }}>₹{order.totalPrice.toLocaleString()}</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  {order.items.length} item{order.items.length > 1 ? 's' : ''} • {new Date(order.createdAt).toLocaleDateString()}
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <span className={`badge ${statusColors[order.status]}`}>{order.status}</span>
                <Link to={`/orders/${order._id}`} className="btn btn-outline btn-sm">View Details</Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
