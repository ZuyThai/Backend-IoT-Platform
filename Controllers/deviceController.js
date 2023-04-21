const Device = require("../models/Device");
const logger = require("../AppLog/logger");
const Gateway = require("../models/Gateway");
exports.getAlldevice = async (req, res, next) => {
  let gatewayId = req.params.gatewayId;
  if(gatewayId === "other"){
    gatewayId = req.body.userId;
  }
  const gw = await Gateway.find({_id: gatewayId});
  await Device.find({ gatewayid: gatewayId }) 
    .then(device => {
      res.status(200).json({
        status: "success",
        data: { deviceinfo : device, gatewayinfo: gw }
      });
      logger.info(`Get all device of gateway successfully", \"userId\": \"${req.body.userId}`);
    })
    .catch(err => {
      logger.error(`Get all device of gateway fail", \"userId\": \"${req.body.userId}\",\"ERROR\": \"${err}`);
      next(err);
    })
};

exports.getOnedevice = async (req, res) => {
  try {
    const device = await Device.findById(req.params.deviceId);
    res.status(200).json({
      status: "success",
      data: { device }
    });
    logger.info(`Get one device successfully", \"userId\": \"${req.body.userId}",\"deviceId\": \"${req.params.deviceId}"`);
  }catch (error) {
    logger.error(`Get one device fail", \"userId\": \"${req.body.userId}\",\"ERROR\": \"${error}`);
  }
};
exports.deleteDevice = async (req, res, next) => {
  try {
    const { deviceId } = req.params;
    await Device.findByIdAndDelete(deviceId);
    res.status(200).json({
      status: "success",
      message: "Delete successfully"
    });
    logger.info(`Delete device successfully", \"userId\": \"${req.body.userId}","deviceId": "${deviceId}`);
  } catch (error) {
    logger.error(`Delete device device fail", \"userId\": \"${req.body.userId}\",\"ERROR\": \"${error}`);
    next(error);
  }
};
exports.updateDevice = async (req, res, next) => {
  try {
    const { deviceId } = req.params;
    const device = await Device.findByIdAndUpdate(deviceId, req.body, {
      new: true,
      runValidator: true,
    });
    res.status(200).json({
      status: "success",
      data: { device }
    });
    logger.info(`Update device successfully", "userId": "${req.body.userId}","deviceId": "${deviceId}`);
  } catch (error) {
    logger.error(`Update device device fail", \"userId\": \"${req.body.userId}\",\"ERROR\": \"${error}`);
    next(error);
  }
};

exports.searchDevice = async (req, res, next) => {
  try {
    let query = {};
    if (req.query.keyword) {
      query.$or = [
        { name: { $regex: req.query.keyword, $options: "i" } },
        { type: { $regex: req.query.keyword, $options: "i" } }
      ];
    }
    console.log(req.query.keyword);
    let device = await Device.find(query);
    logger.info(`search device successfully", "userId": "${req.body.userId}`);
    return res.status(200).send({
      message: "success",
      data: device
    });
  } catch (error) {
    logger.error(`Search device device fail", \"userId\": \"${req.body.userId}`);
    next(err);
  }
};
