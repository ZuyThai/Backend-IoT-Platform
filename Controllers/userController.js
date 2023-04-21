const cloudinary = require("../cloudinary/cloudinary");
const User = require("../models/User");
const logger = require("../AppLog/logger");
exports.getProfile = async (req, res, next) => {
  try {
    const userId = req.body["userId"];
    const user = await User.findOne({ _id: userId }).select(
      "name email avatarurl"
    ); //cloudinary_id')
    res.status(200).json({
      status: "success",
      data: { user },
    });
    logger.info(`get profile successfully", "userID": "${userId}`)
  } catch (error) {
    logger.error(`get profile fail", "userID": "${req.body["userId"]}`)
    next(error);
  }
};

exports.updateProfile = async (req, res, next) => {
  try {
    const userId = req.body.userId;
    const result = await cloudinary.uploader.upload(req.file.path);
    const user = await User.findByIdAndUpdate(
      userId,
      { name: req.body.name, avatarurl: result.secure_url },
      { new: true, runValidator: true }
    );
    res.status(200).json({
      status: "success",
      data: { name: user.name, avatar: user.avatarurl, email: user.email },
    });
    logger.info(`update profile successfully", "userID": "${userId}`)
  } catch (error) {
    logger.error(`update profile fail", "userID": "${req.body.userId}`)
    next(error);
  }
};
