const mqtt = require("mqtt");
const logger = require("../AppLog/logger");
const Telemetry = require("../models/Telemetry");
const Widget = require("../models/Widget");
const Gateway = require("../models/Gateway");
const Device = require("../models/Device")
require('dotenv').config()
var options = {
  host: '865d0b2920144dd19ad53dd45daa0c57.s1.eu.hivemq.cloud',
  port: 8883,
  protocol: 'mqtts',
  username: process.env.MQTT_USERNAME,
  password: process.env.MQTT_PASSWORD
};
const client = mqtt.connect(options);
client.on("connect", function () {
  logger.info(`MQTT connected`);
});
client.on("error", function (error) {
  logger.error(`MQTT connect failed: ${error}`);
});
Device.find({})
  .then((device) => {
    device.forEach((device) => {
      client.subscribe(device._id.toString())//, {qos:1});
    });
  })
.catch((err) => {});
Gateway.find({})
  .then((gateway) => {
    gateway.forEach((gateway) => {
      client.subscribe("responseGW/"+gateway._id.toString(), {qos:1});
    });
  })
.catch((err) => {});

function isJson(String) {
  try {
      JSON.parse(String);
  } catch (e) {
      return false;
  }
  return true;
}
//set up the message callbacks
// client.on("message", async function (topic, message) {
//   console.log("Received Topic: " + topic + "  Recevied mesage: " + message.toString());
//   let tranfer = message.toString();
//   if (isJson(tranfer)) {
//     let obj = JSON.parse(tranfer);
//     // If add device success
//     if (obj.message == "Add success") {
//       await Device.findOneAndUpdate({_id:obj.id},{gatewayack:true})
//       console.log(obj.id,obj.message,"add device success")
//     }
//     else if (obj.message == "gwConnected") {
//       await Gateway.findOneAndUpdate({_id:obj.id},{connectstatus:"Connected"})
//     }
//     // If gateway disconnect
//     else if (obj.message == "GATEWAY DISCONNECTION"){
//       await Gateway.findOneAndUpdate({_id:obj.id},{connectstatus: "Disconnected"})
//     }
//     else if (obj.message == "send data"){
//       await Telemetry.create({ deviceId: topic, value: obj.value });
//     }
//     else if (obj.message == "dvDisconnect"){
//       await Device.findOneAndUpdate({ _id: topic}, { connectstatus: "Disconnected" });
//     }
//     else if (obj.message == "dvConnect"){
//       await Device.findOneAndUpdate({ _id: topic}, { connectstatus: "Connected" });
//     }
//   }
// });
exports.mqttCallback = (io) => {
  client.on("message", async function (topic, message) {
    console.log("Received Topic: " + topic + "  Recevied mesage: " + message.toString());
    let tranfer = message.toString();
    if (isJson(tranfer)) {
      let obj = JSON.parse(tranfer);
      // If add device success
      if (obj.message == "Add success") {
        await Device.findOneAndUpdate({_id:obj.id},{gatewayack:true})
        console.log(obj.id,obj.message,"add device success")
      }
      else if (obj.message == "gwConnected") {
        await Gateway.findOneAndUpdate({_id:obj.id},{connectstatus:"Connected"})
        //io.emit("mqtt", "gwCn")
      }
      // If gateway disconnect
      else if (obj.message == "GATEWAY DISCONNECTION"){
        await Gateway.findOneAndUpdate({_id:obj.id},{connectstatus: "Disconnected"})
      }
      else if (obj.message == "send data"){
        await Telemetry.create({ deviceId: topic, value: obj.value });
        let data = {message: obj.value, topic: topic};
        io.emit("mqtt", data);
      }
      else if (obj.message == "dvDisconnect"){
        await Device.findOneAndUpdate({ _id: topic}, { connectstatus: "Disconnected" });
      }
      else if (obj.message == "dvConnect"){
        await Device.findOneAndUpdate({ _id: topic}, { connectstatus: "Connected" });
      }
    }
  })
}
exports.gpioHigh = async (req, res, next) => {
  try {
    const widget = await Widget.findById(req.params.widgetId);
    client.publish("controlGW/"+widget.gatewayId, 
      JSON.stringify({"message":"GPIO","status":"high","device":widget.device_id}), {qos:1});
    console.log("high");
    console.log("controlGW/"+widget.gatewayId)
    res.status(200).json({
      status: "success",
      data: { gatewayId: widget.gatewayId, Turn_message: "high", topic: widget.device_id }
    });
  } catch (error) {
    next(error);
  }
};
exports.gpioLow = async (req, res, next) => {
  try {
    const widget = await Widget.findById(req.params.widgetId);
    client.publish("controlGW/"+widget.gatewayId, 
      JSON.stringify({"message":"GPIO","status":"low","device":widget.device_id}), {qos:1});
    console.log("Low");
    console.log(widget.device_id);
    console.log("controlGW/"+widget.gatewayId)
    res.status(200).json({
      status: "success",
      data: { gatewayId: widget.gatewayId, Turn_message: "low" , topic: widget.device_id}
    });
  } catch (error) {
    next(error);
  }
};
exports.verifyGateway = async (req, res, next) => {
  try {
    const gateway = await Gateway.findOne({serialnumber: req.body.serialnumber});
    if(gateway){
      client.subscribe("responseGW/"+gateway._id.toString(), {qos:1});
      await Gateway.findByIdAndUpdate(gateway._id,{gatewayip: req.body.gatewayip});
      console.log("veri5 gateway")
      return res.status(200).json({
        status: "connect success",
        topic: "controlGW/"+gateway._id
      });
    }
    else{
      res.status(200).json({
      status: "connect fail"
      })
    }
  } catch (error) {
    next(error);
  }
};
async function delay(ms) {
  return await new Promise(resolve => setTimeout(resolve, ms));
}
exports.addDevice = async (req, res, next) => {
  try {
    const gatewayId = req.params.gatewayId;
    const gateway = await Gateway.findById(gatewayId);
    let device = await Device.create({ ...req.body, gatewayid: gatewayId });
    if (gateway.connectstatus == "Connected") {
      const tp = device._id.toString()
      while (device.gatewayack === false){
        client.publish("controlGW/"+gatewayId, JSON.stringify({ "message":"Add new device", "topic":tp }))//, {qos:1})
        await delay(3000)
        device = await Device.findById(device._id.toString())
      }
      client.subscribe(tp)//, {qos:1});
      res.status(200).json({
        status: "send device info to gateway success",
        data: { device },
      });
    }
    else{
      client.unsubscribe(device._id.toString())//, {qos:1})
      await Device.findByIdAndDelete(device._id);
      res.status(400).json({
        status: "send request message to gateway fail, please check your verify code and restart gateway"
      });
    }
    logger.info(`Add device successfully", \"userId\": \"${req.body.userId}`);
  } catch (error) {
    logger.error(`Add device device fail", \"userId\": \" ${req.body.userId}\",\"ERROR\": \"${error}`);
    next(error);
  }
};
exports.verifyDevice = async (req, res, next) => {
  try {
    const device = await Device.findOne({serialnumber: req.params.serialnumber});
    console.log(device.gatewayid)
    const gateway = await Gateway.findById(device.gatewayid);
    if(device){
      console.log("verifyDV")
      console.log("controlDV/"+device._id.toString())
      client.subscribe(device._id.toString())//, {qos:1})  
      res.status(200).json({
        status: "success",
        controlTopic: "controlDV/"+device._id.toString(),
        gatewayip: gateway.gatewayip,
        datastream: device._id.toString()
      });
    }
    else{
      return res.status(200).json({
        status: "fail"
      });
    }
  } catch (error) {
    next(error);
  }
};
exports.unsubscribeAlldevice = async (req, res, next) => {
  try {
      const gatewayId = req.params.gatewayId;
      Device.find({gatewayId})
      .then((device) => {
        device.forEach((device) => {
          client.unsubscribe(device._id.toString())//, {qos:1});
          });
      })
      .catch((err) => {});
      logger.info(`Unsubscribe successfully", "userId": "${req.body.userId}", "deviceId": "${gatewayId}`)
      next();
  } catch (error) {
      logger.error(`Unsubscribe fail", "userId": "${req.body.userId}", "ERROR": "${error}`);
      next(error);
  }
};
exports.addGateway = async (req, res, next) => {
  try {
    const userId = req.body.userId;
    const gateway = await Gateway.create({ ...req.body, userid: userId });
    client.subscribe("responseGW/"+gateway._id.toString())//, {qos:1})
    res.status(200).json({
      status: "success",
      data: { gateway },
    });
    logger.info(`Add gateway successfully", \"userId\": \"${req.body.userId}`);
  } catch (error) {
    logger.error(`Add gateway device fail", \"userId\": \" ${req.body.userId}\",\"ERROR\": \"${error}`);
    next(error);
  }
};