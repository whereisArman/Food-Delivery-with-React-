const mongoose = require('mongoose');
const Restaurant = require('./models/Restaurant');
const Food = require('./models/Food');
require('dotenv').config();

const restaurants = [
  { 
    name: "Chillox", 
    cuisine: "Burger inside Sauce", 
    rating: 4.5, 
    deliveryTime: "25-35 min", 
    image: "https://images.unsplash.com/photo-1610440042657-612c34d95e9f?auto=format&fit=crop&w=1200&q=80", 
    featured: true, 
    discount: "20% OFF" 
  },
  { 
    name: "Sultan Dine", 
    cuisine: "Kacchi,Chicken Dum Biryani,Plain Polao Platter", 
    rating: 4.3, 
    deliveryTime: "20-30 min", 
    image: "https://images.unsplash.com/photo-1633945274309-2c16c9682a8c?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", 
    discount: "Free Delivery" 
  },
  { 
    name: "Pizza Burg", 
    cuisine: "Pizza, Shwarma", 
    rating: 4.7, 
    deliveryTime: "30-40 min", 
    image: "https://images.unsplash.com/photo-1593504049359-74330189a345?q=80&w=2127&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", 
    featured: true, 
    discount: "15% OFF" 
  },
  { 
    name: "KFC", 
    cuisine: "Burger, Tacos,Chicken Fry", 
    rating: 4.4, 
    deliveryTime: "15-25 min", 
    image: "https://plus.unsplash.com/premium_photo-1683657860906-d49d1bb37aab?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", 
    discount: "Buy 1 Get 1" 
  }
];

const foods = [
  { 
    name: "Margherita Pizza", 
    description: "Classic pizza with tomato sauce, mozzarella, and fresh basil", 
    price: 1200, 
    category: "Pizza", 
    image: "https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?w=800&q=80", 
    popular: true, 
    vegetarian: true 
  },
  { 
    name: "Pepperoni Pizza", 
    description: "Pizza with tomato sauce, mozzarella, and premium pepperoni", 
    price: 1400, 
    category: "Pizza", 
    image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=800&q=80", 
    popular: true 
  },
  { 
    name: "Classic Cheeseburger", 
    description: "Beef patty with cheese, lettuce, tomato, and special sauce", 
    price: 300, 
    category: "Burgers", 
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&q=80", 
    popular: true 
  },
  { 
    name: "Bashmoti Kacchi", 
    description: "Best Kacchi with All Addons", 
    price: 350, 
    category: "Sushi", 
    image: "https://images.unsplash.com/photo-1633945274309-2c16c9682a8c?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", 
    popular: true 
  },
  { 
    name: "Beef Tacos", 
    description: "Three soft tacos with seasoned beef, lettuce, and cheese", 
    price: 320, 
    category: "Tacos", 
    image: "https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=800&q=80", 
    popular: true, 
    spicy: true 
  }
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');
    
    await Restaurant.deleteMany({});
    await Food.deleteMany({});
    console.log('🗑️  Cleared existing data');

    const createdRestaurants = await Restaurant.insertMany(restaurants);
    console.log(`✅ Created ${createdRestaurants.length} restaurants`);

    // Assign restaurants to foods
    foods.forEach((food, i) => {
      food.restaurant = createdRestaurants[i % 4]._id;
    });

    await Food.insertMany(foods);
    console.log(`✅ Created ${foods.length} food items`);
    
    console.log('🎉 Dummy data seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedDB();