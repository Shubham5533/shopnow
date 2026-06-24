const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Product = require('./models/Product');

dotenv.config();

const products = [
  { name: 'Wireless Earbuds Pro', description: 'Premium sound quality with ANC and 30hr battery life.', price: 2999, category: 'Electronics', brand: 'SoundMax', image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400', stock: 50, isFeatured: true, rating: 4.5 },
  { name: 'Mechanical Keyboard RGB', description: 'TKL mechanical keyboard with Cherry MX switches.', price: 4499, category: 'Electronics', brand: 'TypeMaster', image: 'https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=400', stock: 30, isFeatured: true, rating: 4.3 },
  { name: 'Running Shoes X500', description: 'Lightweight and breathable for daily running.', price: 3499, category: 'Sports', brand: 'FlexRun', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400', stock: 80, isFeatured: true, rating: 4.7 },
  { name: 'Premium Cotton T-Shirt', description: '100% organic cotton, pre-shrunk and comfortable.', price: 699, category: 'Clothing', brand: 'CottonLife', image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400', stock: 200, rating: 4.1 },
  { name: 'Stainless Steel Water Bottle', description: 'Double-wall insulated, keeps cold 24hr, hot 12hr.', price: 899, category: 'Home', brand: 'HydroMax', image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400', stock: 150, isFeatured: true, rating: 4.6 },
  { name: 'JavaScript: The Good Parts', description: 'Essential JS concepts explained clearly.', price: 499, category: 'Books', brand: "O'Reilly", image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400', stock: 45, rating: 4.8 },
  { name: 'Yoga Mat Premium', description: 'Non-slip 6mm thick eco-friendly yoga mat.', price: 1299, category: 'Sports', brand: 'ZenFit', image: 'https://images.unsplash.com/photo-1601925228616-1ae1f4e22b87?w=400', stock: 60, rating: 4.4 },
  { name: 'Smart LED Desk Lamp', description: 'Touch control, 3 color modes, USB charging port.', price: 1599, category: 'Home', brand: 'LumiDesk', image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400', stock: 35, isFeatured: true, rating: 4.2 },
];

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    await User.deleteMany();
    await Product.deleteMany();

    // Create admin
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@shopnow.com',
      password: 'admin123',
      role: 'admin'
    });

    // Create test user
    await User.create({
      name: 'Test User',
      email: 'user@shopnow.com',
      password: 'user123',
      role: 'user'
    });

    await Product.insertMany(products);

    console.log('✅ Seed successful!');
    console.log('Admin: admin@shopnow.com / admin123');
    console.log('User:  user@shopnow.com  / user123');
    process.exit(0);
  } catch (err) {
    console.error('Seed error:', err.message);
    process.exit(1);
  }
};

seed();
