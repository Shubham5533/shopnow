import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../../utils/api';
import AdminLayout from '../../components/admin/AdminLayout';

const statusColors = {
  Pending: 'badge-warning', Processing: 'badge-info',
  Shipped: 'badge-info', Delivered: 'badge-success', Cancelled: 'badge-danger'
};

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/admin/dashboard')
      .then(r => setStats(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <AdminLayout title="Dashboard"><div className="loading"><div className="spinner" /></div></AdminLayout>;

  const cards = [
    { label: 'Total Revenue', value: `₹${stats.revenue.toLocaleString()}`, color: '#6366f1', icon: '💰' },
    { label: 'Total Orders', value: stats.totalOrders, color: '#10b981', icon: '📦' },
    { label: 'Total Products', value: stats.totalProducts, color: '#f59e0b', icon: '🛍️' },
    { label: 'Total Users', value: stats.totalUsers, color: '#ef4444', icon: '👥' },
  ];

  return (
    <AdminLayout title="Dashboard">
      <div className="grid-4" style={{ marginBottom: '2rem' }}>
        {cards.map(c => (
          <div key={c.label} className="card" style={{ borderTop: `4px solid ${c.color}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '0.4rem' }}>{c.label}</p>
                <p style={{ fontSize: '2rem', fontWeight: 800, color: c.color }}>{c.value}</p>
              </div>
              <span style={{ fontSize: '2rem' }}>{c.icon}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid-2">
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h2 style={{ fontSize: '1rem', fontWeight: 700 }}>Recent Orders</h2>
            <Link to="/admin/orders" style={{ fontSize: '0.85rem', color: 'var(--primary)' }}>View all</Link>
          </div>
          {stats.recentOrders.map(o => (
            <div key={o._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.65rem 0', borderBottom: '1px solid var(--border)' }}>
              <div>
                <p style={{ fontWeight: 500, fontSize: '0.9rem' }}>{o.user?.name || 'Unknown'}</p>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>₹{o.totalPrice.toLocaleString()}</p>
              </div>
              <span className={`badge ${statusColors[o.status]}`}>{o.status}</span>
            </div>
          ))}
        </div>

        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h2 style={{ fontSize: '1rem', fontWeight: 700 }}>⚠️ Low Stock Alert</h2>
            <Link to="/admin/products" style={{ fontSize: '0.85rem', color: 'var(--primary)' }}>Manage</Link>
          </div>
          {stats.lowStock.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>All products are well-stocked!</p>
          ) : stats.lowStock.map(p => (
            <div key={p._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.65rem 0', borderBottom: '1px solid var(--border)' }}>
              <p style={{ fontWeight: 500, fontSize: '0.9rem' }}>{p.name}</p>
              <span className={`badge ${p.stock === 0 ? 'badge-danger' : 'badge-warning'}`}>
                {p.stock === 0 ? 'Out of Stock' : `${p.stock} left`}
              </span>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}
