const mongoose = require('mongoose');

const testDriveBookingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  carId: { type: mongoose.Schema.Types.ObjectId, ref: 'Car' },
  date: Date,
  status: String,
  createdAt: { type: Date, default: Date.now }
});

const TestDriveBooking = mongoose.model('TestDriveBooking', testDriveBookingSchema);

module.exports = TestDriveBooking;s