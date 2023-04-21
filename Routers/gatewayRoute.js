const express = require('express');

const { getAllgateway, deleteGateway, updateGateway} = require('../Controllers/gatewayController');
const { verifyToken } = require('../Middlewares/verifyToken');
const {verifyGateway, addGateway} = require("../Controllers/mqttController")
const { unsubscribeAlldevice } = require("../Controllers/mqttController");
const Router = express.Router();

Router.get('/getall', verifyToken, getAllgateway);
Router.post('/add', verifyToken, addGateway);
Router.delete('/delete/:gatewayId', verifyToken, unsubscribeAlldevice, deleteGateway);
Router.post('/verifygateway', verifyGateway);
Router.put("/update/:gatewayId", verifyToken ,updateGateway)

module.exports = Router;