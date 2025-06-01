const admin = require('firebase-admin');
const logger = require('../utils/logger.util');

// Initialize Firebase Admin SDK if not already initialized
if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
      })
    });
    logger.info('Firebase Admin SDK initialized successfully');
  } catch (error) {
    logger.error('Firebase Admin SDK initialization error:', error);
  }
}

module.exports = admin;