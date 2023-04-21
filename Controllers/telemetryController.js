const Telemetry = require('../models/Telemetry');
const logger = require("../AppLog/logger");
const Device = require('../models/Device');
const fs = require("fs");
const { Parser } = require("@json2csv/plainjs");
exports.getAllData = async (req, res, next) => {
    await Telemetry.find({})
        .then((telemetry) => {
            res.status(200).json({ 
                status: "success",
                data: {telemetry},
            });
            logger.info(`Get All Data telemetry successfully", "userId": "${req.body.userId}`);
        })
        .catch (err => {
            logger.error(`Get All Data telemetry fail", "userId": "${req.body.userId}", "ERROR": "${err}`);
            next(err)
    })
};
exports.getDeviceData = async (req, res, next) => {
    await Telemetry.find({deviceId:req.params.deviceId})
        .then((telemetry) => {
            res.status(200).json({ 
                status: "success",
                data: {telemetry},
            });
            logger.info(`Get data device successfully", "userId": "${req.body.userId}", "deviceId": "${req.params.deviceId}`);
        })
        .catch (err => {
            logger.error(`Get data device fail", "userId": "${req.body.userId}", "ERROR": "${err}`);
            next(err)
    })
};
exports.getDatalastnday = async (req, res, next) => {
  await Telemetry.find({
    deviceId: req.query.deviceId,
    createdAt: { $gte: new Date(new Date().getTime() - Number(req.query.date)) },
  })
    .sort({ createdAt: -1 })
    .then((telemetry) => {
      res.status(200).json({
        status: "success",
        data: { telemetry },
      });

    })
    .catch((err) => {
      next(err);
    });
};

exports.getlastDeviceData = async (req, res, next) => {
  try {
    const telemetry = await Telemetry.find({ deviceId: req.params.deviceId })
      .limit(1)
      .sort({ _id: -1 });
    res.status(200).json({
      status: "success",
      data: telemetry.length === 0 ? 0 : { telemetry },
    });
  } catch (error) {
    next(error);
  }
};
exports.exportTelemetry = async (req, res, next) => {
  try {
    const deviceId = req.params.deviceId;
    const tpname = await Device.findById(deviceId);
    const exportTelemetry = await Telemetry.find({ deviceId: tpname._id });
    const fields = ["value", "createdAt"];
    const opts = { fields };
    const parser = new Parser(opts);
    const csv = parser.parse(exportTelemetry);
    fs.writeFile(tpname.name + ".csv", csv, function (error) {
      console.log("Writed");
    });
    res.status(200).json({
      status: "success",
    });
  } catch (error) {
    next(error);
  }
};