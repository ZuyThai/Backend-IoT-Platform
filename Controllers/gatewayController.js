const Device = require("../models/Device");
const Gateway = require("../models/Gateway");
const logger = require("../AppLog/logger");
exports.getAllgateway = async (req, res, next) => {
  const userId = req.body.userId;
  await Gateway.find({ userid: userId }) 
    .then(gateway => {
      res.status(200).json({
        status: "success",
        data: { gateway },
      });
      logger.info(`Get all gateway successfully", \"userId\": \"${req.body.userId}`);
    })
    .catch(err => {
      logger.error(`Get all gateway fail", \"userId\": \"${req.body.userId}\",\"ERROR\": \"${err}`);
      next(err);
    })
};

exports.deleteGateway = async (req, res, next) => {
  try {
    const gatewayId = req.params.gatewayId;
    console.log(gatewayId)
    const userId = req.body.userId
    await Device.updateMany({gatewayid: gatewayId}, {gatewayid: userId});
    await Gateway.findByIdAndDelete(gatewayId);
    res.status(200).json({
      status: "success",
      message: "Delete successfully",
    });
    logger.info(`Delete gateway successfully", \"userId\": \"${req.body.userId}","gatewayId": "${gatewayId}`);
  } catch (error) {
    logger.error(`Delete gateway fail", \"userId\": \"${req.body.userId}\",\"ERROR\": \"${error}`);
    next(error);
  }
};
exports.updateGateway = async (req, res, next) => {
  try {
    const gatewayId = req.params.gatewayId;
    const gateway = await Gateway.findByIdAndUpdate(gatewayId, req.body, {
      new: true,
      runValidator: true,
    });
    res.status(200).json({
      status: "success",
      data: { gateway },
    });
    logger.info(`Update gateway successfully", "userId": "${req.body.userId}","gatewayId": "${gatewayId}`);
  } catch (error) {
    logger.error(`Update device device fail", \"userId\": \"${req.body.userId}\",\"ERROR\": \"${error}`);
    next(error);
  }
};

