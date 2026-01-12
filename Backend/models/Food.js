const mongoose = require('mongoose');

const foodSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  category: String,
  image: String,
  restaurant: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant' },
  popular: { type: Boolean, default: false },
  spicy: { type: Boolean, default: false },
  vegetarian: { type: Boolean, default: false }
});

module.exports = mongoose.model('Food', foodSchema);