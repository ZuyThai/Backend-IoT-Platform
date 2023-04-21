const User = require("../models/User");
const logger = require("../AppLog/logger");
require('dotenv').config();
const Gateway = require("../models/Gateway");
const Device = require("../models/Device");
const Telemetry = require("../models/Telemetry");
exports.register = async (req, res, next) => {
  try {
    const user = await User.create({ ...req.body, avatarurl: "" });
    res.status(200).json({
      status: "success",
      data: { userName: user.name, avatarUrl: user.avatarurl }
    });
    logger.info(`registered successfully",\"userId\": \"${user._id}`)
  } catch (error) {
    logger.error(`register fail: ${error}`);
    const err = { message: "Email exits", status: 400 };
    next(err);
  }
};
exports.getAllUser = async (req, res, next) => {
  try {
    const user = await User.find({ role: { $ne: 1 } }).select(
      "name email role avatarurl createdAt"
    );
    res.status(200).json({
      status: "success",
      data: user
    });
  } catch (err) {
    next(err);
  }
};
exports.deleteUser = async (req, res, next) => {
  const userId = req.params.userId;
  try {
    const gatewayid = await Gateway.find({userid: userId});
    const deviceId = await Device.find({userid: userId});
    
    for (let i = 0; i < deviceId.length; i++) {
      await Telemetry.deleteMany({deviceId: deviceId[i]._id.toString()});
    }
    for (let i = 0; i < gatewayid.length; i++) {
      await Device.deleteMany({gatewayid: gatewayid[i]._id.toString()});
      await Gateway.deleteMany({_id: gatewayid[i]._id.toString()});
    }
    await Device.deleteMany({gatewayid: userId});
    await User.findByIdAndDelete(userId);
    res.status(200).json({
      status: " Delete success"
    });
    logger.info(`Delete success",\"userId\": \"${userId}\"`)
  } catch (err) {
    logger.error(`Authentication's Failed",\"userId\": \"${userId}\",\"ERROR\": \"${err}`)
    next(err);
  }
};
exports.getUserGateway = async (req, res, next) => {
  const userId = req.params.userId;
  try {
    const gateway = await Gateway.find({userid:userId})
    res.status(200).json({
      status: "success",
      data: gateway
    });
    logger.info(`Get all user gateway success",\"userId\": \"${userId}\"`)
  } catch (err) {
    logger.error(`Authentication's Failed",\"userId\": \"${userId}\",\"ERROR\": \"${err}`)
    next(err);
  }
};


