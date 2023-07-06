const express = require("express");
const route = express.Router();
const upload = require("../Middleware/Multer")
const carController = require("../Controllers/car.controller");
const authentication = require("../Middleware/Authentication");
const authorization = require("../Middleware/Authorization");

route.get("/cars", carController.getCars);

route.get("/cars/brands/:brand", carController.getCarsByBrand)

route.get("/cars/total", carController.getTotalCar);

route.get("/cars/:id", carController.getCarById);

route.get("/cars/names/:name", carController.getCarsByName);

route.post("/cars", authentication, authorization, carController.createCar);

route.post("/cars/:id/images", authentication, authorization, upload.array("images", 10), carController.uploadCarImages);

route.put("/cars/:id", authentication, authorization, carController.updateCar);

route.delete("/cars/:id/images/:imageId", authentication, authorization, carController.deleteCarImage);

route.delete("/cars/:id", authentication, authorization, carController.deleteCarById);

module.exports = route; 