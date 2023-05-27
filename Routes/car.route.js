const express = require("express");
const route = express.Router();
const upload = require("../Middleware/Multer")
const carController = require("../Controllers/car.controller");

route.get("/car", carController.getAllCar);

route.get("/car/:id", carController.getOneCar);

route.post("/car/create", upload.array("imgs", 5), carController.createCar);

route.delete("/car/delete/:id", carController.deleteCar);


module.exports = route;