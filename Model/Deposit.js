const mongoose = require('mongoose');

const depositSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  carId: { type: mongoose.Schema.Types.ObjectId, ref: 'Car' },
  amount: Number,
  createdAt: { type: Date, default: Date.now },
});

const Deposit = mongoose.model('Deposit', depositSchema);

module.exports = Deposit;
