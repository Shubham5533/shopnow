import { Link } from 'react-router-dom';
import { FiStar, FiShoppingCart } from 'react-icons/fi';
import { useCart } from '../../context/CartContext';
import './ProductCard.css';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();

  const stars = (rating) =>
    Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={i < Math.floor(rating) ? 'star' : 'star-empty'}>★</span>
    ));

  return (
    <div className="product-card">
      <Link to={`/products/${product._id}`}>
        <div className="product-img-wrapper">
          <img src={product.image} alt={product.name} className="product-img" />
          {product.stock === 0 && <div className="out-of-stock-overlay">Out of Stock</div>}
          {product.isFeatured && <span className="featured-tag">Featured</span>}
        </div>
      </Link>
      <div className="product-info">
        <span className="product-category">{product.category}</span>
        <Link to={`/products/${product._id}`}>
          <h3 className="product-name">{product.name}</h3>
        </Link>
        <div className="product-rating">
          {stars(product.rating)}
          <span>({product.numReviews})</span>
        </div>
        <div className="product-footer">
          <span className="product-price">₹{product.price.toLocaleString()}</span>
          <button
            className="btn btn-primary btn-sm"
            onClick={() => addToCart(product._id)}
            disabled={product.stock === 0}
          >
            <FiShoppingCart size={14} /> Add
          </button>
        </div>
      </div>
    </div>
  );
}
