const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema({
  name: String,
  cuisine: String,
  rating: { type: Number, default: 4.0 },
  deliveryTime: String,
  image: String,
  featured: { type: Boolean, default: false },
  discount: String
});

module.exports = mongoose.model('Restaurant', restaurantSchema);