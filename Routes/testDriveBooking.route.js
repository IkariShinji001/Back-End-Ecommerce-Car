const express = require('express');
const route = express.Router();
const testDriveBookingController = require('../Controllers/testdrivebooking.controller');

route.get('/test-drive-booking', testDriveBookingController.getTestDriveBooking);

route.post('/test-drive-booking', testDriveBookingController.createTestDriveBooking);

module.exports = route;
