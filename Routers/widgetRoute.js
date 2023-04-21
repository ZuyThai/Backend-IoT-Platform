const express = require("express");
const {
  getListWidgets,
  addWidget,
  deleteWidget,
  updateWidget,
  getOneWidget
} = require("../Controllers/widgetController");
const { verifyToken } = require("../Middlewares/verifyToken");
const { gpioLow, gpioHigh } = require('../Controllers/mqttController');
const Router = express.Router();

Router.get("/listWidgets", verifyToken, getListWidgets);
Router.post("/addwidget", verifyToken, addWidget);
Router.delete("/deletewidget/:widgetId", verifyToken, deleteWidget);
Router.put("/updatewidget/:widgetId", verifyToken, updateWidget);
Router.get('/gpiohigh/:widgetId', verifyToken, gpioHigh);
Router.get('/gpiolow/:widgetId', verifyToken, gpioLow);
Router.get("/getonewidget/:widgetId", getOneWidget);

module.exports = Router;
