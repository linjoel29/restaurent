const express = require('express');
const router = express.Router();
const Menu = require('../models/Menu');

// GET /api/menu → fetch all dishes (used by customer menu page)
router.get('/', async (req, res) => {
  try {
    const items = await Menu.find();
    res.json(items);
  } catch (err) {
    // This will show the real error in terminal
    console.log('Menu fetch error:', err.message)
    res.status(500).json({ message: err.message });
  }
});
// POST /api/menu → add a new dish (used by admin)
router.post('/', async (req, res) => {
  try {
    const newItem = new Menu(req.body); // creates a new dish from request data
    await newItem.save();              // saves it to database
    res.status(201).json(newItem);
  } catch (err) {
    res.status(500).json({ message: 'Error adding item' });
  }
});

// PUT /api/menu/:id → update a dish by its ID (used by admin)
router.put('/:id', async (req, res) => {
  try {
    const updated = await Menu.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Error updating item' });
  }
});

// DELETE /api/menu/:id → delete a dish by its ID (used by admin)
router.delete('/:id', async (req, res) => {
  try {
    await Menu.findByIdAndDelete(req.params.id);
    res.json({ message: 'Item deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting item' });
  }
});

module.exports = router;