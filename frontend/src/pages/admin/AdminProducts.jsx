import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi';
import API from '../../utils/api';
import AdminLayout from '../../components/admin/AdminLayout';
import toast from 'react-hot-toast';

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = () => {
    setLoading(true);
    API.get('/products?limit=100')
      .then(r => setProducts(r.data.products))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchProducts(); }, []);

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete "${name}"?`)) return;
    try {
      await API.delete(`/products/${id}`);
      toast.success('Product deleted');
      fetchProducts();
    } catch (err) {
      toast.error('Delete failed');
    }
  };

  return (
    <AdminLayout title="Products">
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1.5rem' }}>
        <Link to="/admin/products/new" className="btn btn-primary">
          <FiPlus /> Add Product
        </Link>
      </div>

      {loading ? (
        <div className="loading"><div className="spinner" /></div>
      ) : (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'var(--bg)', borderBottom: '2px solid var(--border)' }}>
                {['Image', 'Name', 'Category', 'Price', 'Stock', 'Actions'].map(h => (
                  <th key={h} style={{ padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {products.map((p, i) => (
                <tr key={p._id} style={{ borderBottom: '1px solid var(--border)', background: i % 2 === 0 ? 'white' : '#fafafa' }}>
                  <td style={{ padding: '0.75rem 1rem' }}>
                    <img src={p.image} alt={p.name} style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: '6px' }} />
                  </td>
                  <td style={{ padding: '0.75rem 1rem', fontWeight: 500 }}>{p.name}</td>
                  <td style={{ padding: '0.75rem 1rem' }}>
                    <span className="badge badge-info">{p.category}</span>
                  </td>
                  <td style={{ padding: '0.75rem 1rem', fontWeight: 700 }}>₹{p.price.toLocaleString()}</td>
                  <td style={{ padding: '0.75rem 1rem' }}>
                    <span className={`badge ${p.stock === 0 ? 'badge-danger' : p.stock <= 5 ? 'badge-warning' : 'badge-success'}`}>
                      {p.stock}
                    </span>
                  </td>
                  <td style={{ padding: '0.75rem 1rem' }}>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <Link to={`/admin/products/edit/${p._id}`} className="btn btn-outline btn-sm"><FiEdit2 /></Link>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(p._id, p.name)}><FiTrash2 /></button>
                    </div>
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
