const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const logger = require("../AppLog/logger")
require('dotenv').config()
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY)
function sendEmail(value, mail) {
  const options = {
    from: process.env.APP_EMAIL,
    to: mail,
    subject: "Your new password",
    text: "Your new password is: " + value
  };
  sgMail
  .send(options)
  .then(() => {
    console.log('Email sent')
  })
  .catch((error) => {
    console.error(error)
  })
}
exports.login = async (req, res, next) => {
  try {
    const tokenTime = { expiresIn: "24h" };
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      const err = { message: "Email or password is not correct", status: 400 };
      next(err);
    }
    else if (bcrypt.compareSync(req.body.password, user.password)) {
      const token = jwt.sign(
        { userId: user._id },
        process.env.APP_SECRET,
        tokenTime
      );
      res.status(200).json({
        status: "success",
        data: {
          token,
          userName: user.name,
          id: user._id,
          avatarUrl: user.avatarurl,
          role: user.role
        }
      });
      logger.info(`Log-in successfully", \"userId\": \"${user._id}`);
    } else {
      const err = { message: "Email or password is not correct", status: 400 };
      next(err);
    }
  } catch (error) {
    logger.error(`Log-in system's failed: ${error}`);
    next(error);
  }
};
exports.forgotPassword = async (req, res, next) => {
  try {
    const userEmail = await User.findOne({ email: req.body.email });
    if (!userEmail) {
      const err = { message: "Email is not correct", status: 400 };
      next(err);
    } else {
      let randomPassword = Math.random().toString(36).slice(-8);
      const hashedPassword = await bcrypt.hash(randomPassword, 10);
      const passWord = await User.findByIdAndUpdate(
        userEmail._id,
        { password: hashedPassword },
        { new: true, runValidator: true }
      );
      sendEmail(randomPassword, userEmail.email);
      res.status(200).json({
        status: "success"
      });
      logger.info(`Send random password succesfully", \"userId\": \"${userEmail._id}`);
    }
  } catch (error) {
    logger.error(`Send random password fail: ${error}`);
    next(error);
  }
};

exports.changePassword = async (req, res, next) => {
  try {
    const userId = req.body["userId"];
    const user = await User.findById(userId);
    const oldPass = req.body.oldPassword;
    const newPass = req.body.newPassword;
    if (bcrypt.compareSync(oldPass, user.password)) {
      const hashedPassword = await bcrypt.hash(newPass, 10);
      const passWord = await User.findByIdAndUpdate(
        userId,
        { password: hashedPassword },
        { new: true, runValidator: true }
      );
      res.status(200).json({
        status: "success"
      });
      logger.info(`Change password successfully", \"userId\": \"${userId}`)
    } else {
      const err = { message: "old password does not match", status: 400 };
      next(err);
    }
  } catch (error) {
    logger.error(`change password fail: ${error}`)
    next(error);
  }
};

exports.authentication = async (req, res, next) => {
  const userId = req.body.userId;
  try {
    const user = await User.findById(userId).select("name avatarurl role");
    res.status(200).json({
      status: "success",
      data: user
    });
  } catch (err) {
    logger.error(`Authentication's Failed",\"userId\": \"${userId}\",\"ERROR\": \"${err}`)
    next(err);
  }
};






