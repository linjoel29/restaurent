const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

// POST /api/orders → customer places a new order
router.post('/', async (req, res) => {
  try {
    const newOrder = new Order(req.body); // create order from customer data
    await newOrder.save();                // save to database
    res.status(201).json(newOrder);
  } catch (err) {
    res.status(500).json({ message: 'Error placing order' });
  }
});

// GET /api/orders → chef fetches all orders
router.get('/', async (req, res) => {
  try {
    // sort by newest first
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching orders' });
  }
});

// GET /api/orders/:id → customer polls for their specific order status
router.get('/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching order' });
  }
});

// PUT /api/orders/:id → chef updates order status and estimated time
router.put('/:id', async (req, res) => {
  try {
    const updated = await Order.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }  // return the updated document
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Error updating order' });
  }
});

module.exports = router;