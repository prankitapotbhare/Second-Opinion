/**
 * Script to create an admin user directly in the database
 * Usage: node src/scripts/create-admin.js [name] [email] [password]
 */
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/user.model');
const readline = require('readline');

// Connect to MongoDB
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/second-opinion';

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Function to prompt for input
const prompt = (question) => new Promise((resolve) => {
  rl.question(question, (answer) => resolve(answer));
});

async function createAdmin() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Get admin details from command line args or prompt
    let name = process.argv[2];
    let email = process.argv[3];
    let password = process.argv[4];

    // If not provided via command line, prompt for them
    if (!name) {
      name = await prompt('Enter admin name: ');
    }
    
    if (!email) {
      email = await prompt('Enter admin email: ');
    }
    
    if (!password) {
      password = await prompt('Enter admin password (min 6 characters): ');
      
      if (password.length < 6) {
        console.error('Password must be at least 6 characters');
        rl.close();
        process.exit(1);
      }
    }

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email });
    
    if (existingAdmin) {
      console.log('Admin user already exists with this email');
      rl.close();
      process.exit(0);
    }

    // Create admin user
    const adminUser = {
      name,
      email,
      password,
      role: 'admin',
      emailVerified: true,
      termsAccepted: true,
      termsAcceptedAt: new Date()
    };

    const admin = await User.create(adminUser);
    console.log(`Admin user created successfully with ID: ${admin._id}`);
    
    rl.close();
    process.exit(0);
  } catch (error) {
    console.error('Error creating admin user:', error);
    rl.close();
    process.exit(1);
  }
}

createAdmin();