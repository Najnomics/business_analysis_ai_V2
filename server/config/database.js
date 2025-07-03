const { MongoClient } = require('mongodb');
const { AsyncIOMotorClient } = require('motor/motor_asyncio');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

// MongoDB connection configuration
const MONGO_URL = process.env.MONGO_URL;
const DB_NAME = process.env.DB_NAME;

let db = null;
let client = null;

const connectDatabase = async () => {
  try {
    if (!MONGO_URL) {
      throw new Error('MONGO_URL environment variable is not set');
    }
    
    const { AsyncIOMotorClient } = require('motor/motor_asyncio');
    client = new AsyncIOMotorClient(MONGO_URL);
    db = client[DB_NAME];
    
    console.log('MongoDB connected successfully');
    return db;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
};

const getDatabase = () => {
  if (!db) {
    throw new Error('Database not connected. Call connectDatabase() first.');
  }
  return db;
};

const closeDatabase = async () => {
  if (client) {
    await client.close();
    db = null;
    client = null;
    console.log('MongoDB connection closed');
  }
};

module.exports = {
  connectDatabase,
  getDatabase,
  closeDatabase,
  MONGO_URL,
  DB_NAME
};