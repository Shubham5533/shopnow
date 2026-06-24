import { useEffect, useState } from 'react';
import API from '../../utils/api';
import AdminLayout from '../../components/admin/AdminLayout';
import toast from 'react-hot-toast';

const STATUSES = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
const statusColors = {
  Pending: 'badge-warning', Processing: 'badge-info',
  Shipped: 'badge-info', Delivered: 'badge-success', Cancelled: 'badge-danger'
};

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/orders')
      .then(r => setOrders(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const updateStatus = async (id, status) => {
    try {
      const { data } = await API.put(`/orders/${id}/status`, { status });
      setOrders(prev => prev.map(o => o._id === id ? { ...o, status: data.status } : o));
      toast.success('Status updated');
    } catch {
      toast.error('Update failed');
    }
  };

  return (
    <AdminLayout title="Orders">
      {loading ? (
        <div className="loading"><div className="spinner" /></div>
      ) : (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'var(--bg)', borderBottom: '2px solid var(--border)' }}>
                {['Order ID', 'Customer', 'Total', 'Items', 'Date', 'Status', 'Update'].map(h => (
                  <th key={h} style={{ padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {orders.map((o, i) => (
                <tr key={o._id} style={{ borderBottom: '1px solid var(--border)', background: i % 2 === 0 ? 'white' : '#fafafa' }}>
                  <td style={{ padding: '0.75rem 1rem', fontFamily: 'monospace', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    #{o._id.slice(-8).toUpperCase()}
                  </td>
                  <td style={{ padding: '0.75rem 1rem' }}>
                    <p style={{ fontWeight: 500, fontSize: '0.9rem' }}>{o.user?.name || 'N/A'}</p>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{o.user?.email}</p>
                  </td>
                  <td style={{ padding: '0.75rem 1rem', fontWeight: 700 }}>₹{o.totalPrice.toLocaleString()}</td>
                  <td style={{ padding: '0.75rem 1rem', color: 'var(--text-muted)' }}>{o.items.length}</td>
                  <td style={{ padding: '0.75rem 1rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    {new Date(o.createdAt).toLocaleDateString()}
                  </td>
                  <td style={{ padding: '0.75rem 1rem' }}>
                    <span className={`badge ${statusColors[o.status]}`}>{o.status}</span>
                  </td>
                  <td style={{ padding: '0.75rem 1rem' }}>
                    <select
                      value={o.status}
                      onChange={e => updateStatus(o._id, e.target.value)}
                      style={{ padding: '0.35rem 0.6rem', border: '1.5px solid var(--border)', borderRadius: '6px', fontSize: '0.85rem', background: 'white' }}
                    >
                      {STATUSES.map(s => <option key={s}>{s}</option>)}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AdminLayout>
  );
}
