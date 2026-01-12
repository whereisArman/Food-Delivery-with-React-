const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Rider = require('./models/Rider');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI);

const seedRiders = async () => {
  try {
    await Rider.deleteMany({});

    const riders = [
      {
        name: 'Arman Sakib',
        email: 'rider1@test.com',
        password: await bcrypt.hash('123456', 10),
        phone: '+8801314764700',
        vehicleType: 'bike',
        vehicleNumber: 'DM-1234',
        isActive: true,
        currentLocation: {
          latitude: 23.8103,
          longitude: 90.4125,
          lastUpdated: new Date()
        }
      },
      {
        name: 'Ayesha Rohoman',
        email: 'rider2@test.com',
        password: await bcrypt.hash('123456', 10),
        phone: '+8801700000002',
        vehicleType: 'scooter',
        vehicleNumber: 'DM-5678',
        isActive: true,
        currentLocation: {
          latitude: 23.8203,
          longitude: 90.4225,
          lastUpdated: new Date()
        }
      },
      {
        name: 'Ashraful Amin',
        email: 'rider3@test.com',
        password: await bcrypt.hash('123456', 10),
        phone: '+8801700000003',
        vehicleType: 'bike',
        vehicleNumber: 'DM-9101',
        isActive: true,
        currentLocation: {
          latitude: 23.8003,
          longitude: 90.4025,
          lastUpdated: new Date()
        }
      }
    ];

    await Rider.insertMany(riders);
    console.log('3 riders seeded successfully!');
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedRiders();