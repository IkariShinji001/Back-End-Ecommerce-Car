const mongoose = require('mongoose');

const carSchema = new mongoose.Schema({
  brand: String,
  name: String,
  model: {type: String, unique: true},  // Phiên bản xe
  classification: String, // Loại xe
  year: Number,  // Năm sản xuất
  price: Number,  // Giá xe
  description: {
    type: mongoose.Schema.Types.Mixed,
    transmission: String,  // Trường thông tin về hộp số
    fuelType: String,  // Trường thông tin về loại nhiên liệu
    color: [String],  // Trường thông tin về màu sắc (mảng các chuỗi)
    seats: Number,  // Trường thông tin về số ghế
    features: [String],  // Trường thông tin về các tính năng xe (mảng các chuỗi)
    dimensions: {
      length: Number,  // Chiều dài (mm)
      width: Number,  // Chiều rộng (mm)
      height: Number  // Chiều cao (mm)
    },
    wheelbase: Number,  // Chiều dài cơ sở (mm)
    engineSpecs: {
      engineType: String,  // Loại động cơ
      displacement: Number,  // Dung tích công tác (cc)
      maxPower: String,  // Công suất cực đại (kW)
      maxTorque: String  // Mô-men xoắn cực đại (Nm)
    },
    driveType: String,  // Dẫn động
    acceleration: Number,  // Thời gian tăng tốc 0-100km/h (giây)
    topSpeed: Number,  // Vận tốc tối đa (km/h)
  },
  images: [String],  // Mảng chứa các URL hình ảnh
  createdAt: { type: Date, default: Date.now }, // Ngày tạo bản ghi
  quantity: Number,
  isInBussiness: {type: Boolean, default: true} // Trạng thái kinh doanh
});

const Car = mongoose.model('Car', carSchema);

module.exports = Car;