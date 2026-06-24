import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import API from '../utils/api';
import ProductCard from '../components/products/ProductCard';

const CATEGORIES = ['', 'Electronics', 'Clothing', 'Books', 'Home', 'Sports', 'Beauty', 'Other'];

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();

  const keyword = searchParams.get('keyword') || '';
  const category = searchParams.get('category') || '';
  const page = Number(searchParams.get('page') || 1);

  const [search, setSearch] = useState(keyword);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (keyword) params.set('keyword', keyword);
    if (category) params.set('category', category);
    params.set('page', page);
    params.set('limit', 12);

    API.get(`/products?${params}`)
      .then(r => {
        setProducts(r.data.products);
        setTotal(r.data.total);
        setPages(r.data.pages);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [keyword, category, page]);

  const setFilter = (key, val) => {
    const p = new URLSearchParams(searchParams);
    if (val) p.set(key, val); else p.delete(key);
    p.delete('page');
    setSearchParams(p);
  };

  return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
      <div style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start' }}>

        {/* Sidebar */}
        <aside style={{ width: '220px', flexShrink: 0 }}>
          <div className="card" style={{ padding: '1.25rem' }}>
            <h3 style={{ marginBottom: '1rem', fontSize: '1rem' }}>Filters</h3>
            <div className="form-group">
              <label>Category</label>
              <select value={category} onChange={e => setFilter('category', e.target.value)}>
                {CATEGORIES.map(c => <option key={c} value={c}>{c || 'All Categories'}</option>)}
              </select>
            </div>
            <button className="btn btn-outline btn-sm" style={{ width: '100%' }}
              onClick={() => setSearchParams({})}>
              Clear Filters
            </button>
          </div>
        </aside>

        {/* Main */}
        <div style={{ flex: 1 }}>
          {/* Search bar */}
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
            <input
              style={{ flex: 1, padding: '0.65rem 1rem', border: '1.5px solid var(--border)', borderRadius: 'var(--radius)', fontSize: '0.95rem' }}
              placeholder="Search products..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && setFilter('keyword', search)}
            />
            <button className="btn btn-primary" onClick={() => setFilter('keyword', search)}>Search</button>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{total} products found</span>
          </div>

          {loading ? (
            <div className="loading"><div className="spinner" /></div>
          ) : products.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
              <p style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🔍</p>
              <p>No products found. Try different filters.</p>
            </div>
          ) : (
            <div className="grid-3">
              {products.map(p => <ProductCard key={p._id} product={p} />)}
            </div>
          )}

          {/* Pagination */}
          {pages > 1 && (
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '2rem', justifyContent: 'center' }}>
              {Array.from({ length: pages }, (_, i) => i + 1).map(p => (
                <button
                  key={p}
                  className={`btn btn-sm ${p === page ? 'btn-primary' : 'btn-outline'}`}
                  onClick={() => setFilter('page', p)}
                >{p}</button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
