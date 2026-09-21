const mongoose = require('mongoose');

// Blueprint for every order placed by a customer
const orderSchema = new mongoose.Schema({
  items: [
    {
      _id: String,           // dish id
      name: String,          // dish name
      price: Number,         // dish price
      qty: Number            // quantity ordered
    }
  ],
  total: {
    type: Number,
    required: true
  },
  tableNo: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'preparing', 'ready', 'served' , 'cancelled'],  // only these 3 values allowed
    default: 'pending'
  },
  estimatedMinutes: {
    type: Number,
    default: null            // chef will set this later
  }
}, { timestamps: true });    // automatically adds createdAt and updatedAt

module.exports = mongoose.model('Order', orderSchema);