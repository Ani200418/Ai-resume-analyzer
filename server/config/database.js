/**
 * MongoDB Connection Configuration
 */

const mongoose = require("mongoose");

// Disable SSL certificate verification for MongoDB Atlas (development only)
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const connectDB = async (retryCount = 0) => {
  try {
    console.log("🔄 Attempting MongoDB connection...");
    
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      maxPoolSize: 5,
      minPoolSize: 1,
      maxIdleTimeMS: 60000,
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 60000,
      connectTimeoutMS: 30000,
      heartbeatFrequencyMS: 10000,
      retryWrites: true,
      retryReads: true,
      // SSL/TLS Configuration for MongoDB Atlas
      ssl: true,
      tls: true,
      tlsAllowInvalidCertificates: true,
      tlsAllowInvalidHostnames: true,
      // Connection pooling
      w: 1,
      j: true,
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);

    // Handle connection events
    mongoose.connection.on("error", (err) => {
      console.error("❌ MongoDB connection error:", err.message);
    });

    mongoose.connection.on("disconnected", () => {
      console.warn("⚠️  MongoDB disconnected. Attempting reconnection...");
    });

    // Graceful shutdown
    process.on("SIGINT", async () => {
      await mongoose.connection.close();
      console.log("MongoDB connection closed due to app termination.");
      process.exit(0);
    });

  } catch (error) {
    console.error(`❌ MongoDB connection failed (attempt ${retryCount + 1}):`, error.message);
    
    if (retryCount < 5) {
      const delayMs = Math.pow(2, retryCount) * 2000;
      console.log(`🔄 Retrying in ${delayMs}ms...`);
      await new Promise(resolve => setTimeout(resolve, delayMs));
      return connectDB(retryCount + 1);
    }
    
    console.error("❌ MongoDB connection failed after 5 attempts. Check your credentials and network.");
    throw error;
  }
};

module.exports = connectDB;
