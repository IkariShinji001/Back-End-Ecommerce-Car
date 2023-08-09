const TestDriveBooking = require('../Model/TestDriveBooking');
const splitDate = require('../Helpers/splitDate');

const testDriveBookingController = {
  async getTestDriveBooking(req, res) {
    const { page, limit, sortedDate } = req.query;
    try {
      const listTestDriveBooking = await TestDriveBooking.find({})
        .populate('carId', 'name model')
        .sort({ date: sortedDate })
        .limit(limit)
        .skip((page - 1) * limit);
      return res.status(200).json(listTestDriveBooking);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: 'Lỗi server' });
    }
  },

  async createTestDriveBooking(req, res) {
    const { day, month, year } = splitDate(req.body.date);
    try {
      const newTestDriveBooking = new TestDriveBooking({
        username: req.body.username,
        email: req.body.email,
        phoneNumber: req.body.phoneNumber,
        carId: req.body.carId,
        day: day,
        month: month,
        year: year,
        date: req.body.date,
      });

      await newTestDriveBooking.save();
      return res.status(201).json({ success: true });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: 'Lỗi server' });
    }
  },
};

module.exports = testDriveBookingController;
