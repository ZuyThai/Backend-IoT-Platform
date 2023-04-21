const express = require("express");
const { getAllUser, 
        deleteUser, 
        getUserGateway, 
        register
    } = require("../Controllers/adminController");
const { getAlldevice } = require("../Controllers/deviceController");
const { verifyToken } = require("../Middlewares/verifyToken");
const Router = express.Router();
Router.get("/getalluser", verifyToken, getAllUser);
Router.get("/getusergateway/:userId", verifyToken, getUserGateway);
Router.get("/getuserdevice/:gatewayId", verifyToken, getAlldevice);
Router.delete("/deleteuser/:userId", verifyToken, deleteUser);
Router.post("/register", verifyToken, register);

module.exports = Router;
