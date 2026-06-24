const User = require('../models/User');
const Order = require('../models/Order');
const Product = require('../models/Product');

// @desc  Dashboard stats
exports.getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'user' });
    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();
    const revenue = await Order.aggregate([
      { $group: { _id: null, total: { $sum: '$totalPrice' } } }
    ]);
    const recentOrders = await Order.find().populate('user', 'name email').sort({ createdAt: -1 }).limit(5);
    const lowStock = await Product.find({ stock: { $lte: 5 } }).select('name stock');

    res.json({
      totalUsers,
      totalProducts,
      totalOrders,
      revenue: revenue[0]?.total || 0,
      recentOrders,
      lowStock
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc  Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc  Delete user
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (user.role === 'admin') return res.status(400).json({ message: 'Cannot delete admin' });
    await user.deleteOne();
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc  Toggle user role
exports.toggleUserRole = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    user.role = user.role === 'admin' ? 'user' : 'admin';
    await user.save();
    res.json({ message: `Role updated to ${user.role}`, user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
