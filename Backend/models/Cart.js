const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [{
    food: { type: mongoose.Schema.Types.ObjectId, ref: 'Food' },
    name: String,
    price: Number,
    image: String,
    quantity: { type: Number, default: 1 }
  }],
  total: { type: Number, default: 0 }
});

module.exports = mongoose.model('Cart', cartSchema);