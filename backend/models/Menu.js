const mongoose = require('mongoose');

// This is the blueprint for every dish in your database
// Every dish MUST have these fields
const menuSchema = new mongoose.Schema({
  name: {
    type: String,      // dish name is text
    required: true     // it's mandatory
  },
  price: {
    type: Number,      // price is a number
    required: true
  },
  category: {
    type: String,      // e.g. "Starters", "Main Course", "Drinks"
    required: true
  },
  description: {
    type: String,      // short description of the dish
    default: ''        // optional, empty by default
  },
  image: {
    type: String,      // image URL
    default: ''        // optional
  },
  available: {
    type: Boolean,     // true = available, false = not available today
    default: true
  }
});

// This creates a "Menu" collection in MongoDB based on the schema above
module.exports = mongoose.model('Menu', menuSchema);