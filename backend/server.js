require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/auth.js');
const billsRoutes = require('./routes/bills.js');

console.log('EMAIL_USER:', process.env.EMAIL_USER);
console.log('EMAIL_PASS:', process.env.EMAIL_PASS ? '***' : 'MISSING');

const app = express();
const PORT = process.env.PORT || 5000;

// CORS Configuration - IMPORTANT: This must be before other middleware
app.use(cors({
  origin: [
    'https://split-bite.vercel.app',
    'http://localhost:3000',
    'http://localhost:3001'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middleware
app.use(express.json());

// Add a test route to verify server is working
app.get('/', (req, res) => {
  res.json({ message: 'SplitBite Backend is running!' });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/bills', billsRoutes);

// Add a catch-all route for debugging
app.use('*', (req, res) => {
  console.log('Unmatched route:', req.method, req.originalUrl);
  res.status(404).json({ message: 'Route not found', path: req.originalUrl });
});

// Function to log all registered routes
function logRoutes(app) {
  console.log('\n📌 Registered Routes:');
  app._router.stack.forEach((middleware) => {
    if (middleware.route) {
      // Direct route on app
      console.log(`${Object.keys(middleware.route.methods).join(', ').toUpperCase()}  ${middleware.route.path}`);
    } else if (middleware.name === 'router' && middleware.handle.stack) {
      // Router middleware (e.g., authRoutes, billsRoutes)
      middleware.handle.stack.forEach((handler) => {
        const route = handler.route;
        if (route) {
          console.log(`${Object.keys(route.methods).join(', ').toUpperCase()}  ${middleware.regexp}${route.path}`);
        }
      });
    }
  });
}

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected successfully');
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      console.log('🔗 Available routes:');
      console.log('  - GET  /');
      console.log('  - POST /api/auth/signup');
      console.log('  - POST /api/auth/login');
      console.log('  - POST /api/auth/verify-otp');
      console.log('  - POST /api/auth/resend-otp');

      // Log all actual routes loaded
      logRoutes(app);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err.message);
  });

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection:', reason);
});
