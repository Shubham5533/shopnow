import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import API from '../../utils/api';
import AdminLayout from '../../components/admin/AdminLayout';
import toast from 'react-hot-toast';

const CATEGORIES = ['Electronics', 'Clothing', 'Books', 'Home', 'Sports', 'Beauty', 'Other'];

export default function ProductForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '', description: '', price: '', category: 'Electronics',
    brand: '', image: '', stock: '', isFeatured: false
  });

  useEffect(() => {
    if (isEdit) {
      API.get(`/products/${id}`)
        .then(r => {
          const p = r.data;
          setForm({
            name: p.name, description: p.description, price: p.price,
            category: p.category, brand: p.brand, image: p.image,
            stock: p.stock, isFeatured: p.isFeatured
          });
        })
        .catch(console.error);
    }
  }, [id]);

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const body = { ...form, price: Number(form.price), stock: Number(form.stock) };
      if (isEdit) {
        await API.put(`/products/${id}`, body);
        toast.success('Product updated!');
      } else {
        await API.post('/products', body);
        toast.success('Product created!');
      }
      navigate('/admin/products');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error saving product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout title={isEdit ? 'Edit Product' : 'Add New Product'}>
      <div style={{ maxWidth: '700px' }}>
        <div className="card">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Product Name *</label>
              <input name="name" value={form.name} onChange={handleChange} placeholder="e.g. Wireless Earbuds Pro" required />
            </div>
            <div className="form-group">
              <label>Description *</label>
              <textarea name="description" value={form.description} onChange={handleChange}
                placeholder="Describe the product..." rows={4}
                style={{ width: '100%', padding: '0.65rem', border: '1.5px solid var(--border)', borderRadius: '8px', resize: 'vertical' }}
                required />
            </div>
            <div className="grid-2">
              <div className="form-group">
                <label>Price (₹) *</label>
                <input name="price" type="number" value={form.price} onChange={handleChange} placeholder="999" min="0" required />
              </div>
              <div className="form-group">
                <label>Stock *</label>
                <input name="stock" type="number" value={form.stock} onChange={handleChange} placeholder="50" min="0" required />
              </div>
            </div>
            <div className="grid-2">
              <div className="form-group">
                <label>Category *</label>
                <select name="category" value={form.category} onChange={handleChange}>
                  {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Brand</label>
                <input name="brand" value={form.brand} onChange={handleChange} placeholder="e.g. Samsung" />
              </div>
            </div>
            <div className="form-group">
              <label>Image URL</label>
              <input name="image" value={form.image} onChange={handleChange} placeholder="https://..." />
              {form.image && (
                <img src={form.image} alt="preview" style={{ marginTop: '0.5rem', height: '120px', objectFit: 'cover', borderRadius: '8px' }} />
              )}
            </div>
            <div className="form-group">
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                <input type="checkbox" name="isFeatured" checked={form.isFeatured} onChange={handleChange} />
                Mark as Featured Product
              </label>
            </div>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Saving...' : isEdit ? 'Update Product' : 'Create Product'}
              </button>
              <button type="button" className="btn btn-outline" onClick={() => navigate('/admin/products')}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
}
