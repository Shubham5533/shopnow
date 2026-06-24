import { createContext, useContext, useState, useEffect } from 'react';
import API from '../utils/api';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [cartLoading, setCartLoading] = useState(false);
  const { user } = useAuth();

  const fetchCart = async () => {
    if (!user) { setCart([]); return; }
    try {
      setCartLoading(true);
      const { data } = await API.get('/cart');
      setCart(data.items || []);
    } catch (err) {
      console.error(err);
    } finally {
      setCartLoading(false);
    }
  };

  useEffect(() => { fetchCart(); }, [user]);

  const addToCart = async (productId, quantity = 1) => {
    if (!user) { toast.error('Please login to add to cart'); return; }
    try {
      await API.post('/cart/add', { productId, quantity });
      await fetchCart();
      toast.success('Added to cart!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add to cart');
    }
  };

  const updateQty = async (productId, quantity) => {
    try {
      await API.put(`/cart/${productId}`, { quantity });
      await fetchCart();
    } catch (err) {
      toast.error('Update failed');
    }
  };

  const removeFromCart = async (productId) => {
    try {
      await API.delete(`/cart/${productId}`);
      await fetchCart();
      toast.success('Removed from cart');
    } catch (err) {
      toast.error('Remove failed');
    }
  };

  const clearCart = async () => {
    try {
      await API.delete('/cart');
      setCart([]);
    } catch (err) {
      console.error(err);
    }
  };

  const cartTotal = cart.reduce((acc, item) => acc + (item.product?.price || 0) * item.quantity, 0);
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <CartContext.Provider value={{ cart, cartLoading, addToCart, updateQty, removeFromCart, clearCart, cartTotal, cartCount, fetchCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
