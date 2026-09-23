const express = require('express');
const router = express.Router();
const History = require('../models/History');

// GET /api/history - last 100 entries, newest first
router.get('/', async (req, res) => {
  try {
    const entries = await History.find().sort({ createdAt: -1 }).limit(100);
    res.json(entries);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/history - save a calculation
router.post('/', async (req, res) => {
  try {
    const { expression, result, mode, angleUnit } = req.body;
    if (expression === undefined || result === undefined) {
      return res.status(400).json({ error: 'expression and result are required' });
    }
    const entry = await History.create({ expression, result, mode, angleUnit });
    res.status(201).json(entry);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/history/:id - remove one entry
router.delete('/:id', async (req, res) => {
  try {
    await History.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/history - clear all
router.delete('/', async (req, res) => {
  try {
    await History.deleteMany({});
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
