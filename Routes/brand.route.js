const express = require("express");
const route = express.Router();
const upload = require("../Middleware/Multer");

const brandController = require("../Controllers/brand.controller");

route.get("/brands", brandController.getAllBrand);

route.get("/brands/:brand", brandController.getBrandByName);

route.post("/brands", upload.single("brandImg"),brandController.createBrand);

route.put("/brands/:id", upload.single("brandImg"), brandController.updateBrand);


module.exports = route;
