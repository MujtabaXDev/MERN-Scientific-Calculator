const mongoose = require('mongoose');

const HistorySchema = new mongoose.Schema(
  {
    expression: { type: String, required: true },
    result: { type: String, required: true },
    mode: { type: String, default: 'COMP' },
    angleUnit: { type: String, default: 'DEG' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('History', HistorySchema);
