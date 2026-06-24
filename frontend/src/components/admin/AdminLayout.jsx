import { Link, useLocation } from 'react-router-dom';
import { FiGrid, FiPackage, FiShoppingBag, FiUsers } from 'react-icons/fi';

const links = [
  { to: '/admin', label: 'Dashboard', icon: <FiGrid /> },
  { to: '/admin/products', label: 'Products', icon: <FiPackage /> },
  { to: '/admin/orders', label: 'Orders', icon: <FiShoppingBag /> },
  { to: '/admin/users', label: 'Users', icon: <FiUsers /> },
];

export default function AdminLayout({ children, title }) {
  const { pathname } = useLocation();

  return (
    <div style={{ display: 'flex', minHeight: 'calc(100vh - 140px)' }}>
      {/* Sidebar */}
      <aside style={{ width: '220px', background: '#1e293b', flexShrink: 0, padding: '1.5rem 0' }}>
        <div style={{ padding: '0 1.25rem', marginBottom: '1.5rem', color: '#f59e0b', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
          Admin Panel
        </div>
        {links.map(l => (
          <Link key={l.to} to={l.to}
            style={{
              display: 'flex', alignItems: 'center', gap: '0.75rem',
              padding: '0.75rem 1.25rem', fontSize: '0.9rem', fontWeight: 500,
              color: pathname === l.to ? 'white' : '#94a3b8',
              background: pathname === l.to ? 'rgba(255,255,255,0.1)' : 'transparent',
              borderLeft: pathname === l.to ? '3px solid #6366f1' : '3px solid transparent',
              transition: 'all 0.15s'
            }}>
            {l.icon} {l.label}
          </Link>
        ))}
      </aside>

      {/* Content */}
      <main style={{ flex: 1, padding: '2rem', background: 'var(--bg)', overflow: 'auto' }}>
        {title && <h1 style={{ marginBottom: '1.5rem', fontSize: '1.5rem', fontWeight: 700 }}>{title}</h1>}
        {children}
      </main>
    </div>
  );
}
