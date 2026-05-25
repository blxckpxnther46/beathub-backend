/**
 * Create Admin User Script
 * 
 * This script creates an admin user for testing RBAC features.
 * 
 * Usage: node scripts/create-admin.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

const createAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/beathub_test');
    console.log('✓ MongoDB Connected');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'admin@example.com' });
    if (existingAdmin) {
      console.log('✓ Admin user already exists');
      process.exit(0);
    }

    // Create admin user
    const adminUser = new User({
      username: 'admin_user',
      email: 'admin@example.com',
      password: 'admin123456', // Password will be hashed by pre('save') middleware
      role: 'admin'
    });

    await adminUser.save();
    console.log('✓ Admin user created successfully');
    console.log(`  Email: admin@example.com`);
    console.log(`  Password: admin123456`);
    console.log(`  Role: admin`);

    process.exit(0);
  } catch (error) {
    console.error('✗ Error creating admin user:', error.message);
    process.exit(1);
  }
};

createAdmin();
