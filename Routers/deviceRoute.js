const express = require('express');

const { 
        deleteDevice, 
        updateDevice, 
        getAlldevice, 
        getOnedevice, 
        searchDevice} = require('../Controllers/deviceController');
const { verifyToken } = require('../Middlewares/verifyToken');
const { addDevice } = require("../Controllers/mqttController");
const { verifyDevice} = require("../Controllers/mqttController")
const Router = express.Router();

Router.get('/getall/:gatewayId', verifyToken, getAlldevice);
Router.get('/getone/:deviceId', verifyToken, getOnedevice);
Router.get('/search', verifyToken, searchDevice);
Router.post('/add/:gatewayId', verifyToken, addDevice);
Router.delete('/delete/:deviceId', verifyToken, deleteDevice);
Router.put('/update/:deviceId', verifyToken, updateDevice);
Router.get('/verifydevice/:serialnumber', verifyDevice);
Router.put('/updatedevice/:deviceId', updateDevice);
module.exports = Router;