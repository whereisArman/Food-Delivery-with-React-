const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Order = require('../models/Order');
const Cart = require('../models/Cart');

// Get all orders for logged-in user
router.get('/', auth, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new order
router.post('/', auth, async (req, res) => {
  try {
    const { items, total, address, phone, deliveryLocation } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }
    if (!address || !phone) {
      return res.status(400).json({ message: 'Address and phone are required' });
    }

    // Create order
    const order = new Order({
      user: req.user.id,
      items,
      total,
      address,
      phone,
      deliveryLocation: deliveryLocation || {
        latitude: 23.8103,
        longitude: 90.4125
      },
      status: 'pending'
    });

    await order.save();
    await Cart.findOneAndUpdate(
      { user: req.user.id },
      { items: [], total: 0 }
    );

    console.log(`📦 New order created: ${order._id}`);
    console.log(`⏰ Setting 2-second timer for rider assignment...`);

    // Send response immediately
    res.json(order);

    // AUTO-ASSIGN after response is sent
    setTimeout(async () => {
      try {
        console.log(`🏍️ Timer triggered! Assigning rider to order ${order._id}`);
        
        const mockRider = {
          _id: 'mock-rider-123',
          name: 'John Rider',
          phone: '+880 1700-000001',
          vehicleType: 'bike'
        };

        order.rider = mockRider;
        order.status = 'assigned';
        order.riderLocation = {
          latitude: 23.8103,
          longitude: 90.4125,
          lastUpdated: new Date()
        };
        await order.save();

        console.log(`✅ Order ${order._id} saved with rider info`);

        const io = req.app.get('io');
        console.log(`🔌 Socket.io available:`, !!io);
        
        if (io) {
          console.log(`📡 Emitting to room: order:${order._id}`);
          io.to(`order:${order._id}`).emit('order:rider-assigned', {
            rider: mockRider,
            order: order
          });
          
          console.log(`📡 Emitting to room: rider:mock-rider-id`);
          const emitted = io.to('rider:mock-rider-id').emit('order:assigned-to-rider', {
            order: {
              _id: order._id,
              items: order.items,
              total: order.total,
              address: order.address,
              phone: order.phone,
              status: order.status,
              deliveryLocation: order.deliveryLocation
            }
          });

          console.log(`✅ Socket events emitted successfully`);
          
          // Check connected sockets
          const sockets = await io.in('rider:mock-rider-id').fetchSockets();
          console.log(`👥 Sockets in rider:mock-rider-id room:`, sockets.length);
        } else {
          console.error('❌ Socket.io NOT available!');
        }
      } catch (err) {
        console.error('❌ Error in setTimeout:', err);
      }
    }, 2000);

  } catch (err) {
    console.error('❌ Error creating order:', err);
    res.status(500).json({ message: 'Failed to create order' });
  }
});

// Get single order by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update order status
router.put('/:id/status', auth, async (req, res) => {
  try {
    const { status } = req.body;
    
    const order = await Order.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { status },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;