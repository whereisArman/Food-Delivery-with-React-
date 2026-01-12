const express = require('express');
const router = express.Router();
const Rider = require('../models/Rider');
const Order = require('../models/Order');

// Get all active riders
router.get('/active', async (req, res) => {
  try {
    const riders = await Rider.find({ isActive: true });
    res.json(riders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get pending orders for a specific rider
router.get('/:riderId/orders', async (req, res) => {
  try {
    const { riderId } = req.params;
    
    console.log(`📋 Fetching orders for rider: ${riderId}`);
    
    // Find orders assigned to this rider that are not delivered/cancelled
    const orders = await Order.find({
      'rider._id': riderId,
      status: { $in: ['assigned', 'picked-up', 'out-for-delivery'] }
    }).sort({ createdAt: -1 });
    
    console.log(`📦 Found ${orders.length} active orders for rider ${riderId}`);
    
    res.json(orders);
  } catch (err) {
    console.error('Error fetching rider orders:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update rider location (NO AUTH for testing)
router.put('/location', async (req, res) => {
  try {
    const { latitude, longitude, riderId } = req.body;
    
    console.log(`📍 Rider ${riderId} location update: Lat ${latitude.toFixed(6)}, Lng ${longitude.toFixed(6)}`);
    
    res.json({ 
      success: true,
      location: { latitude, longitude },
      message: 'Location updated successfully'
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Assign rider to order (simulate auto-assignment)
router.post('/assign/:orderId', async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Create mock rider data for testing
    const mockRider = {
      _id: 'mock-rider-123',
      name: 'John Rider',
      phone: '+880 1700-000001',
      vehicleType: 'bike'
    };

    // Update order with mock rider
    order.rider = mockRider;
    order.status = 'assigned';
    order.riderLocation = {
      latitude: 23.8103,
      longitude: 90.4125,
      lastUpdated: new Date()
    };
    await order.save();

    // Emit socket event
    const io = req.app.get('io');
    if (io) {
      // Notify customer
      io.to(`order:${order._id}`).emit('order:rider-assigned', {
        rider: mockRider,
        order: order
      });
      
      // Notify rider
      io.to('rider:mock-rider-id').emit('order:assigned-to-rider', {
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

      console.log(`🏍️ Rider assigned to order ${order._id}`);
      console.log(`📡 Emitted to room: rider:mock-rider-id`);
    }

    res.json({ order, rider: mockRider });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update order status by rider (NO AUTH for testing)
router.put('/order/:orderId/status', async (req, res) => {
  try {
    const { status } = req.body;
    
    const order = await Order.findByIdAndUpdate(
      req.params.orderId,
      { status, updatedAt: new Date() },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Emit socket event to customer
    const io = req.app.get('io');
    if (io) {
      io.to(`order:${order._id}`).emit('order:status-changed', {
        status,
        timestamp: new Date()
      });
    }

    console.log(`📦 Order ${order._id} status updated to: ${status}`);

    res.json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;