const express = require('express');
const Bill = require('../models/Bill.js');
const jwt = require('jsonwebtoken');
const User = require('../models/User.js');

const router = express.Router();

// Auth middleware
function auth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.userId;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
}

// POST /api/bills - Save a new bill
router.post('/', auth, async (req, res) => {
  try {
    const bill = new Bill({
      user: req.user,
      billData: req.body.billData,
    });
    await bill.save();
    res.status(201).json(bill);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/bills - Get all bills for user
router.get('/', auth, async (req, res) => {
  try {
    const bills = await Bill.find({ user: req.user }).sort({ createdAt: -1 });
    res.json(bills);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 