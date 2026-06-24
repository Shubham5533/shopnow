const Order = require('../models/Order');
const Product = require('../models/Product');
const Cart = require('../models/Cart');

// @desc  Place order
exports.placeOrder = async (req, res) => {
  try {
    const { items, shippingAddress, paymentMethod } = req.body;
    if (!items || items.length === 0)
      return res.status(400).json({ message: 'No order items' });

    // Verify stock and calculate prices
    for (let item of items) {
      const product = await Product.findById(item.product);
      if (!product) return res.status(404).json({ message: `Product not found: ${item.product}` });
      if (product.stock < item.quantity)
        return res.status(400).json({ message: `Insufficient stock for ${product.name}` });
    }

    const itemsPrice = items.reduce((acc, i) => acc + i.price * i.quantity, 0);
    const shippingPrice = itemsPrice > 500 ? 0 : 50;
    const totalPrice = itemsPrice + shippingPrice;

    const order = await Order.create({
      user: req.user._id,
      items,
      shippingAddress,
      paymentMethod: paymentMethod || 'COD',
      itemsPrice,
      shippingPrice,
      totalPrice
    });

    // Deduct stock
    for (let item of items) {
      await Product.findByIdAndUpdate(item.product, { $inc: { stock: -item.quantity } });
    }

    // Clear cart
    await Cart.findOneAndUpdate({ user: req.user._id }, { items: [] });

    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc  Get my orders
exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc  Get single order
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email');
    if (!order) return res.status(404).json({ message: 'Order not found' });
    if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin')
      return res.status(403).json({ message: 'Not authorized' });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc  Get all orders (Admin)
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate('user', 'name email').sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc  Update order status (Admin)
exports.updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    order.status = req.body.status;
    if (req.body.status === 'Delivered') { order.deliveredAt = Date.now(); }
    const updated = await order.save();
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
