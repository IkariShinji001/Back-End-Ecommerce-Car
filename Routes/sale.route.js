const express = require("express");
const route = express.Router();

const salesController = require("../Controllers/sales.controller");

route.get("/sales/user/:id", salesController.getUserPurchasedCars);

route.get("/sales/profit-by-month", salesController.getProfitByMonth);

route.get("/sales/car-sold-by-month", salesController.getCarsSoldByMonth);

route.post("/sales", salesController.createSale);

route.put("/sales/:id", salesController.updateSale);

route.delete("/sales/:id", salesController.deleteSale);


module.exports = route;
