const mongoose = require('mongoose');

const saleSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  carId: { type: mongoose.Schema.Types.ObjectId, ref: 'Car', required: true },
  salePrice: { type: Number, required: true },
  day: { type: Number, required: true },
  month: { type: Number, required: true },
  year: { type: Number, required: true },
  date: {type: Date, require: true},
  createdAt: { type: Date, default: Date.now }
});

const Sale = mongoose.model('Sale', saleSchema);

module.exports = Sale;