const express = require('express');

const { getDatalastnday, getlastDeviceData, exportTelemetry} = require('../Controllers/telemetryController');
const Router = express.Router();

Router.get("/gettopicdata/:deviceId", getlastDeviceData);
Router.get('/getdatalastnday', getDatalastnday);
Router.get('/export/:deviceId', exportTelemetry);

module.exports = Router;