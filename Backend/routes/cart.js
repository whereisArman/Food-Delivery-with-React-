// backend/routes/cart.js - UPDATED
const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');
const auth = require('../middleware/auth');

// Get user cart
router.get('/', auth, async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user.id }).populate('items.food');
    if (!cart) {
      cart = await Cart.create({ user: req.user.id, items: [], total: 0 });
    }
    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add to cart or update quantity
router.post('/add', auth, async (req, res) => {
  const { foodId, name, price, image, quantity = 1 } = req.body;

  try {
    let cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      cart = new Cart({ user: req.user.id, items: [] });
    }

    const itemIndex = cart.items.findIndex(item => item.food && item.food.toString() === foodId);
    
    if (itemIndex > -1) {
      // Item exists, update quantity
      cart.items[itemIndex].quantity += quantity;
      
      // Remove item if quantity becomes 0 or negative
      if (cart.items[itemIndex].quantity <= 0) {
        cart.items.splice(itemIndex, 1);
      }
    } else {
      // New item, only add if quantity is positive
      if (quantity > 0) {
        cart.items.push({ food: foodId, name, price, image, quantity });
      }
    }

    // Recalculate total
    cart.total = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    await cart.save();
    await cart.populate('items.food');

    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// NEW: Update specific item quantity
router.put('/update/:foodId', auth, async (req, res) => {
  const { quantity } = req.body;

  try {
    let cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    const itemIndex = cart.items.findIndex(item => item.food && item.food.toString() === req.params.foodId);
    
    if (itemIndex > -1) {
      if (quantity <= 0) {
        // Remove item if quantity is 0 or negative
        cart.items.splice(itemIndex, 1);
      } else {
        // Update quantity
        cart.items[itemIndex].quantity = quantity;
      }
      
      // Recalculate total
      cart.total = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      await cart.save();
      await cart.populate('items.food');
      
      res.json(cart);
    } else {
      res.status(404).json({ message: 'Item not found in cart' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// NEW: Remove item from cart
router.delete('/remove/:foodId', auth, async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    const foodId = req.params.foodId;
    console.log('🗑️ Removing item with foodId:', foodId);
    console.log('📦 Current cart items:', cart.items.map(i => ({ food: i.food, _id: i._id })));

    // Filter out the item - check both food field and _id
    const initialLength = cart.items.length;
    cart.items = cart.items.filter(item => {
      const itemFoodId = item.food ? item.food.toString() : item._id.toString();
      return itemFoodId !== foodId.toString();
    });

    if (cart.items.length === initialLength) {
      console.log('⚠️ Item not found in cart');
      return res.status(404).json({ message: 'Item not found in cart' });
    }

    console.log('✅ Item removed, new cart length:', cart.items.length);

    // Recalculate total
    cart.total = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    await cart.save();
    await cart.populate('items.food');

    res.json(cart);
  } catch (err) {
    console.error('❌ Error removing item:', err);
    res.status(500).json({ message: err.message });
  }
});

// NEW: Clear cart
router.delete('/clear', auth, async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    cart.items = [];
    cart.total = 0;
    await cart.save();

    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;