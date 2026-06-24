import { useEffect, useState } from 'react';
import { FiTrash2, FiShield, FiUser } from 'react-icons/fi';
import API from '../../utils/api';
import AdminLayout from '../../components/admin/AdminLayout';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user: currentUser } = useAuth();

  const fetchUsers = () => {
    API.get('/admin/users')
      .then(r => setUsers(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete user "${name}"?`)) return;
    try {
      await API.delete(`/admin/users/${id}`);
      toast.success('User deleted');
      fetchUsers();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Delete failed');
    }
  };

  const toggleRole = async (id) => {
    try {
      const { data } = await API.put(`/admin/users/${id}/role`);
      toast.success(`Role changed to ${data.user.role}`);
      fetchUsers();
    } catch (err) {
      toast.error('Role update failed');
    }
  };

  return (
    <AdminLayout title="Users">
      {loading ? (
        <div className="loading"><div className="spinner" /></div>
      ) : (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'var(--bg)', borderBottom: '2px solid var(--border)' }}>
                {['Name', 'Email', 'Role', 'Joined', 'Actions'].map(h => (
                  <th key={h} style={{ padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.map((u, i) => (
                <tr key={u._id} style={{ borderBottom: '1px solid var(--border)', background: i % 2 === 0 ? 'white' : '#fafafa' }}>
                  <td style={{ padding: '0.75rem 1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div style={{ width: '36px', height: '36px', background: u.role === 'admin' ? '#fef3c7' : '#dbeafe', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>
                        {u.name[0].toUpperCase()}
                      </div>
                      <span style={{ fontWeight: 500 }}>{u.name}</span>
                    </div>
                  </td>
                  <td style={{ padding: '0.75rem 1rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>{u.email}</td>
                  <td style={{ padding: '0.75rem 1rem' }}>
                    <span className={`badge ${u.role === 'admin' ? 'badge-warning' : 'badge-info'}`}>
                      {u.role === 'admin' ? '👑 Admin' : '👤 User'}
                    </span>
                  </td>
                  <td style={{ padding: '0.75rem 1rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                    {new Date(u.createdAt).toLocaleDateString()}
                  </td>
                  <td style={{ padding: '0.75rem 1rem' }}>
                    {u._id !== currentUser._id && (
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button className="btn btn-outline btn-sm" onClick={() => toggleRole(u._id)}
                          title={u.role === 'admin' ? 'Demote to User' : 'Promote to Admin'}>
                          {u.role === 'admin' ? <FiUser size={14} /> : <FiShield size={14} />}
                        </button>
                        <button className="btn btn-danger btn-sm" onClick={() => handleDelete(u._id, u.name)}>
                          <FiTrash2 size={14} />
                        </button>
                      </div>
                    )}
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
