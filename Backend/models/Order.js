const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [{
    food: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Food'
    },
    name: String,
    price: Number,
    quantity: Number,
    image: String
  }],
  total: {
    type: Number,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  deliveryLocation: {
    latitude: Number,
    longitude: Number
  },
  restaurantLocation: {
    latitude: Number,
    longitude: Number
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'preparing', 'assigned', 'picked-up', 'out-for-delivery', 'delivered', 'cancelled'],
    default: 'pending'
  },
  rider: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Rider',
    default: null
  },
  riderLocation: {
    latitude: Number,
    longitude: Number,
    lastUpdated: Date
  },
  estimatedDeliveryTime: Date,
  actualDeliveryTime: Date,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Order', OrderSchema);