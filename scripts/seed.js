require('dotenv').config();
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const Coin = require('../models/Coin');
const User = require('../models/User');

const datasetPath = path.join(__dirname, '..', 'crypto_historical_365days.json');

const cleanObj = (item) => {
  const numFields = [
    'price',
    'market_cap',
    'volume',
    'daily_return',
    'price_ma7',
    'price_ma30',
    'volatility_7d',
    'cumulative_return',
    'market_cap_rank'
  ];

  const result = { ...item };
  numFields.forEach((field) => {
    if (result[field] === '' || result[field] === undefined || result[field] === null) {
      result[field] = null;
    } else {
      result[field] = Number(result[field]);
    }
  });

  if (result.coin_id) result.coin_id = result.coin_id.toLowerCase();
  if (result.symbol) result.symbol = result.symbol.toUpperCase();
  if (result.timestamp) {
    result.timestamp = new Date(result.timestamp);
  }

  return result;
};

const seedDatabase = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/crypto_analytics';
    console.log('Connecting to database for seeding...');
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB.');

    // 1. Clean old coin records
    console.log('Clearing existing coins collection...');
    await Coin.deleteMany({});
    console.log('Existing coins collection cleared.');

    // 2. Read and parse json file
    console.log(`Reading dataset file from ${datasetPath}...`);
    if (!fs.existsSync(datasetPath)) {
      throw new Error(`Dataset file not found at ${datasetPath}`);
    }
    const rawData = fs.readFileSync(datasetPath, 'utf-8');
    console.log('Parsing JSON...');
    const records = JSON.parse(rawData);
    console.log(`Loaded ${records.length} records from JSON file.`);

    // 3. Clean records
    console.log('Cleaning data (replacing empty strings with null and parsing numbers)...');
    const cleanedRecords = records.map(cleanObj);

    // 4. Batch insert coin records
    const batchSize = 5000;
    console.log(`Seeding coins in batches of ${batchSize}...`);
    for (let i = 0; i < cleanedRecords.length; i += batchSize) {
      const batch = cleanedRecords.slice(i, i + batchSize);
      await Coin.insertMany(batch, { ordered: false });
      console.log(`Seeded ${Math.min(i + batchSize, cleanedRecords.length)} / ${cleanedRecords.length} records.`);
    }
    console.log('Coin records seeding completed.');

    // 5. Seed default test users if they don't exist
    console.log('Checking and seeding default test users...');
    
    // Seed Admin
    const adminEmail = 'admin@example.com';
    const adminExists = await User.findOne({ email: adminEmail });
    if (!adminExists) {
      await User.create({
        name: 'Default Admin',
        email: adminEmail,
        password: 'admin123',
        role: 'admin',
        isEmailVerified: true
      });
      console.log('Seeded default admin account (admin@example.com / admin123).');
    }

    // Seed Normal User
    const userEmail = 'user@example.com';
    const userExists = await User.findOne({ email: userEmail });
    if (!userExists) {
      await User.create({
        name: 'Default User',
        email: userEmail,
        password: 'user123',
        role: 'user',
        isEmailVerified: true
      });
      console.log('Seeded default user account (user@example.com / user123).');
    }

    console.log('Database seeding process completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding process failed with error:', error.message);
    if (error.stack) console.error(error.stack);
    process.exit(1);
  }
};

seedDatabase();
