import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import API from '../utils/api';
import toast from 'react-hot-toast';

export default function CheckoutPage() {
  const { cart, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    street: '', city: '', state: '', pincode: '', country: 'India',
    paymentMethod: 'COD'
  });

  const shipping = cartTotal > 500 ? 0 : 50;

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.street || !form.city || !form.state || !form.pincode) {
      toast.error('Please fill all address fields');
      return;
    }
    try {
      setLoading(true);
      const items = cart.map(i => ({
        product: i.product._id,
        name: i.product.name,
        image: i.product.image,
        price: i.product.price,
        quantity: i.quantity
      }));
      const { data } = await API.post('/orders', {
        items,
        shippingAddress: { street: form.street, city: form.city, state: form.state, pincode: form.pincode, country: form.country },
        paymentMethod: form.paymentMethod
      });
      toast.success('Order placed successfully! 🎉');
      navigate(`/orders/${data._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Order failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ padding: '2rem 1rem' }}>
      <h1 style={{ marginBottom: '1.5rem', fontSize: '1.6rem', fontWeight: 700 }}>Checkout</h1>
      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '2rem', alignItems: 'flex-start' }}>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Shipping */}
            <div className="card">
              <h2 style={{ marginBottom: '1rem', fontSize: '1.1rem', fontWeight: 700 }}>Shipping Address</h2>
              <div className="form-group">
                <label>Street Address</label>
                <input name="street" value={form.street} onChange={handleChange} placeholder="123 Main St, Apt 4" required />
              </div>
              <div className="grid-2">
                <div className="form-group">
                  <label>City</label>
                  <input name="city" value={form.city} onChange={handleChange} placeholder="Mumbai" required />
                </div>
                <div className="form-group">
                  <label>State</label>
                  <input name="state" value={form.state} onChange={handleChange} placeholder="Maharashtra" required />
                </div>
              </div>
              <div className="grid-2">
                <div className="form-group">
                  <label>Pincode</label>
                  <input name="pincode" value={form.pincode} onChange={handleChange} placeholder="400001" required />
                </div>
                <div className="form-group">
                  <label>Country</label>
                  <input name="country" value={form.country} onChange={handleChange} />
                </div>
              </div>
            </div>

            {/* Payment */}
            <div className="card">
              <h2 style={{ marginBottom: '1rem', fontSize: '1.1rem', fontWeight: 700 }}>Payment Method</h2>
              {['COD', 'UPI', 'Card'].map(method => (
                <label key={method} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', marginBottom: '0.5rem', border: `2px solid ${form.paymentMethod === method ? 'var(--primary)' : 'var(--border)'}`, borderRadius: 'var(--radius)', cursor: 'pointer', background: form.paymentMethod === method ? 'rgba(99,102,241,0.05)' : 'white' }}>
                  <input type="radio" name="paymentMethod" value={method} checked={form.paymentMethod === method} onChange={handleChange} />
                  <span style={{ fontWeight: 500 }}>
                    {method === 'COD' ? '💵 Cash on Delivery' : method === 'UPI' ? '📱 UPI Payment' : '💳 Credit/Debit Card'}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Summary */}
          <div className="card" style={{ position: 'sticky', top: '80px' }}>
            <h2 style={{ marginBottom: '1rem', fontSize: '1.1rem', fontWeight: 700 }}>Order Summary</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem' }}>
              {cart.map(item => (
                <div key={item.product?._id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>{item.product?.name} × {item.quantity}</span>
                  <span>₹{((item.product?.price || 0) * item.quantity).toLocaleString()}</span>
                </div>
              ))}
              <hr style={{ borderColor: 'var(--border)', margin: '0.5rem 0' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Shipping</span>
                <span>{shipping === 0 ? 'FREE' : `₹${shipping}`}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: '1.1rem' }}>
                <span>Total</span>
                <span style={{ color: 'var(--primary)' }}>₹{(cartTotal + shipping).toLocaleString()}</span>
              </div>
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '0.9rem' }} disabled={loading}>
              {loading ? 'Placing Order...' : '✅ Place Order'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
