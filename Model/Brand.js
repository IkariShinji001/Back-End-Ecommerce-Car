const mongoose = require('mongoose');

const brandSchema = new mongoose.Schema({
  brand: { type: String, unique: true },
  image: { type: String },
  country: String,
  colors: [
    {
      name: String,
      color: String,
    },
  ],
});

const Brand = mongoose.model('Brand', brandSchema);

module.exports = Brand;
