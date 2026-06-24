import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../utils/api';
import toast from 'react-hot-toast';

export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState({ name: user?.name || '', password: '', confirm: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password && form.password !== form.confirm) { toast.error('Passwords do not match'); return; }
    setLoading(true);
    try {
      const body = { name: form.name };
      if (form.password) body.password = form.password;
      const { data } = await API.put('/auth/profile', body);
      updateUser(data);
      toast.success('Profile updated!');
      setForm(f => ({ ...f, password: '', confirm: '' }));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ padding: '2rem 1rem', maxWidth: '600px' }}>
      <h1 style={{ marginBottom: '1.5rem', fontSize: '1.6rem', fontWeight: 700 }}>My Profile</h1>
      <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem', padding: '1rem', background: 'var(--bg)', borderRadius: 'var(--radius)' }}>
          <div style={{ width: '60px', height: '60px', background: 'var(--primary)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '1.5rem', fontWeight: 700 }}>
            {user?.name[0].toUpperCase()}
          </div>
          <div>
            <h2 style={{ fontWeight: 700 }}>{user?.name}</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{user?.email}</p>
            <span className={`badge ${user?.role === 'admin' ? 'badge-warning' : 'badge-info'}`} style={{ marginTop: '0.3rem' }}>
              {user?.role === 'admin' ? '👑 Admin' : '👤 User'}
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name</label>
            <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
          </div>
          <div className="form-group">
            <label>Email (cannot change)</label>
            <input value={user?.email} disabled style={{ background: '#f1f5f9', cursor: 'not-allowed' }} />
          </div>
          <div className="form-group">
            <label>New Password (leave blank to keep current)</label>
            <input type="password" placeholder="New password" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} />
          </div>
          {form.password && (
            <div className="form-group">
              <label>Confirm New Password</label>
              <input type="password" placeholder="Confirm password" value={form.confirm} onChange={e => setForm(f => ({ ...f, confirm: e.target.value }))} />
            </div>
          )}
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  );
}
