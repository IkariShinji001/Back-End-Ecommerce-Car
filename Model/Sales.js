const mongoose = require('mongoose');

const saleSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  carId: { type: mongoose.Schema.Types.ObjectId, ref: 'Car' },
  amount: Number,
  date: Date,
  createdAt: { type: Date, default: Date.now }
});

const Sale = mongoose.model('Sale', saleSchema);

module.exports = Sale;