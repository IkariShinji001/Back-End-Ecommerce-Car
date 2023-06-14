const express = require("express");
const route = express.Router();
const upload = require("../Middleware/Multer")
const carController = require("../Controllers/car.controller");

route.get("/cars", carController.getAllCars);

route.get("/cars/brands/:brand", carController.getCarsByBrand)

route.get("/cars/:id", carController.getCarById);

route.get("/cars/names/:name", carController.getCarsByName);

route.post("/cars", upload.array("imgs", 10), carController.createCar);

route.post("/cars/:id/images", upload.array("imgs", 10), carController.uploadCarImages);

route.put("/cars/:id", carController.updateCar);

route.delete("/cars/:id/images/:imageId", carController.deleteCarImage);

route.delete("/cars/:id", carController.deleteCarById);


module.exports = route;