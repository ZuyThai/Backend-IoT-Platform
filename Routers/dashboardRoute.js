const express = require("express");
const {
  getDashboard,
  addDashboard,
  deleteDashboard,
  updateDashboard,
  getAlldboard
} = require("../Controllers/dashboardController");
const { verifyToken } = require("../Middlewares/verifyToken");
const { gpioLow, gpioHigh } = require('../Controllers/mqttController');
const Router = express.Router();

Router.get("/getall", verifyToken, getAlldboard);
Router.get("/getone/:dashboardId", verifyToken, getDashboard);
Router.get("/getone/share/:dashboardId", getDashboard);
Router.post("/add", verifyToken, addDashboard);
Router.delete("/delete/:dashboardId", verifyToken, deleteDashboard);
Router.put("/update/:dashboardId", verifyToken, updateDashboard);

module.exports = Router;
