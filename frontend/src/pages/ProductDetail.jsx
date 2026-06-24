import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { FiShoppingCart, FiStar } from 'react-icons/fi';
import API from '../utils/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [review, setReview] = useState({ rating: 5, comment: '' });
  const { addToCart } = useCart();
  const { user } = useAuth();

  useEffect(() => {
    API.get(`/products/${id}`)
      .then(r => setProduct(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  const submitReview = async (e) => {
    e.preventDefault();
    try {
      await API.post(`/products/${id}/reviews`, review);
      toast.success('Review submitted!');
      const r = await API.get(`/products/${id}`);
      setProduct(r.data);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error');
    }
  };

  if (loading) return <div className="loading"><div className="spinner" /></div>;
  if (!product) return <div className="container" style={{ padding: '2rem' }}><p>Product not found.</p></div>;

  return (
    <div className="container" style={{ padding: '2rem 1rem' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2.5rem', marginBottom: '3rem' }}>
        {/* Image */}
        <div style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden', height: '420px', background: '#f1f5f9' }}>
          <img src={product.image} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>

        {/* Info */}
        <div>
          <span style={{ color: 'var(--primary)', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{product.category}</span>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 700, margin: '0.5rem 0 1rem' }}>{product.name}</h1>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            {[1,2,3,4,5].map(i => (
              <span key={i} style={{ color: i <= product.rating ? '#f59e0b' : '#e2e8f0', fontSize: '1.2rem' }}>★</span>
            ))}
            <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>({product.numReviews} reviews)</span>
          </div>

          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary)', marginBottom: '1rem' }}>
            ₹{product.price.toLocaleString()}
          </div>

          <p style={{ color: 'var(--text-muted)', lineHeight: 1.7, marginBottom: '1.5rem' }}>{product.description}</p>

          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
            <span style={{ fontWeight: 500 }}>Brand:</span>
            <span style={{ color: 'var(--text-muted)' }}>{product.brand}</span>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
            <span style={{ fontWeight: 500 }}>Stock:</span>
            <span className={`badge ${product.stock > 0 ? 'badge-success' : 'badge-danger'}`}>
              {product.stock > 0 ? `${product.stock} available` : 'Out of stock'}
            </span>
          </div>

          {product.stock > 0 && (
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', border: '1.5px solid var(--border)', borderRadius: 'var(--radius)', overflow: 'hidden' }}>
                <button style={{ padding: '0.5rem 0.85rem', background: 'none', fontSize: '1.1rem', borderRight: '1px solid var(--border)' }} onClick={() => setQty(q => Math.max(1, q - 1))}>−</button>
                <span style={{ padding: '0.5rem 1rem', fontWeight: 600 }}>{qty}</span>
                <button style={{ padding: '0.5rem 0.85rem', background: 'none', fontSize: '1.1rem', borderLeft: '1px solid var(--border)' }} onClick={() => setQty(q => Math.min(product.stock, q + 1))}>+</button>
              </div>
              <button className="btn btn-primary" onClick={() => addToCart(product._id, qty)}>
                <FiShoppingCart /> Add to Cart
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Reviews */}
      <div className="card">
        <h2 style={{ marginBottom: '1.5rem' }}>Customer Reviews</h2>
        {product.reviews.length === 0 ? (
          <p style={{ color: 'var(--text-muted)' }}>No reviews yet. Be the first to review!</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
            {product.reviews.map(r => (
              <div key={r._id} style={{ padding: '1rem', background: 'var(--bg)', borderRadius: 'var(--radius)', borderLeft: '3px solid var(--primary)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <strong>{r.name}</strong>
                  <span style={{ color: '#f59e0b' }}>{'★'.repeat(r.rating)}</span>
                </div>
                <p style={{ marginTop: '0.4rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>{r.comment}</p>
              </div>
            ))}
          </div>
        )}

        {user && (
          <form onSubmit={submitReview}>
            <h3 style={{ marginBottom: '1rem' }}>Write a Review</h3>
            <div className="form-group">
              <label>Rating</label>
              <select value={review.rating} onChange={e => setReview(r => ({ ...r, rating: Number(e.target.value) }))}>
                {[5,4,3,2,1].map(n => <option key={n} value={n}>{n} Star{n > 1 ? 's' : ''}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Comment</label>
              <textarea rows={3} value={review.comment} onChange={e => setReview(r => ({ ...r, comment: e.target.value }))} style={{ width: '100%', padding: '0.65rem', border: '1.5px solid var(--border)', borderRadius: 'var(--radius)' }} required />
            </div>
            <button type="submit" className="btn btn-primary">Submit Review</button>
          </form>
        )}
      </div>
    </div>
  );
}
