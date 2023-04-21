const express = require("express");

const {
  login,
  forgotPassword,
  changePassword,
  authentication,
} = require("../Controllers/authController");
const { verifyToken } = require("../Middlewares/verifyToken");
const Router = express.Router();

Router.post("/login", login);
Router.post("/resetpassword", forgotPassword);
Router.put("/changepassword", verifyToken, changePassword);
Router.get("/authentication", verifyToken, authentication);

module.exports = Router;
