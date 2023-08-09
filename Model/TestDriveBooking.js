const mongoose = require('mongoose');

const testDriveBookingSchema = new mongoose.Schema({
  username: String,
  phoneNumber: String,
  email: String,
  carId: { type: mongoose.Schema.Types.ObjectId, ref: 'Car' },
  day: String,
  month: String,
  year: String,
  date: Date,
  status: { type: String, default: 'Chưa xác nhận' },
  createdAt: { type: Date, default: Date.now },
});

const TestDriveBooking = mongoose.model('TestDriveBooking', testDriveBookingSchema);

module.exports = TestDriveBooking;
