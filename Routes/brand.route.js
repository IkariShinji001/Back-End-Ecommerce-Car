const express = require('express');
const route = express.Router();
const upload = require('../Middleware/Multer');
const { uploadSingleImageCoudinary } = require('../Middleware/UploadImage');
const brandController = require('../Controllers/brand.controller');

route.get('/brands', brandController.getBrands);

route.get('/brands/total', brandController.getTotalBrands);

route.post('/brands', upload.single('image'), uploadSingleImageCoudinary, brandController.createBrand);

route.post('/brands/:id/colors', upload.single('image'), uploadSingleImageCoudinary, brandController.createColorsBrand);

route.patch('/brands/:id/colors', brandController.deleteColorBrand);

route.delete('/brands/:id', brandController.deleteBrandById);

module.exports = route;
