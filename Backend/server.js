const express = require('express');
const cors = require('cors');
const http = require('http');
const socketio = require('socket.io');
const connectDB = require('./config/db');
require('colors');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketio(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

// Connect DB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Make io accessible to routes
app.set('io', io);

// Socket.io connection
io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  // Rider joins their room
  socket.on('rider:join', (riderId) => {
    socket.join(`rider:${riderId}`);
    console.log(`Rider ${riderId} joined`);
  });

  // Customer joins order room to track delivery
  socket.on('customer:track-order', (orderId) => {
    socket.join(`order:${orderId}`);
    console.log(`Customer tracking order ${orderId}`);
  });

  // Rider updates location
  socket.on('rider:location-update', async (data) => {
    const { riderId, orderId, latitude, longitude } = data;
    
    // Broadcast to customers tracking this order
    io.to(`order:${orderId}`).emit('rider:location-changed', {
      latitude,
      longitude,
      timestamp: new Date()
    });

    console.log(`Rider ${riderId} location updated for order ${orderId}`);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/restaurants', require('./routes/restaurants'));
app.use('/api/foods', require('./routes/foods'));
app.use('/api/cart', require('./routes/cart'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/riders', require('./routes/riders'));
app.use('/api/contact', require('./routes/contact'));
app.use('/api/chatbot', require('./routes/chatbot'));

app.get('/', (req, res) => {
  res.send('FoodExpress API Running');
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`.yellow.bold);
});