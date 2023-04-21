const Widget = require("../models/Widget");
const logger = require("../AppLog/logger");
exports.getListWidgets = async (req, res, next) => {
  try {
    const widgets = await Widget.find({});
    res.status(200).json({
      status: "success",
      data: { widgets }
    });
    logger.info(`List Widgets successfully", \"userId\": \"${req.body.userId}`);
  } catch (error) {
    logger.error(`List Widgets fail", \"userId\": \"${req.body.userId}\",\"ERROR\": \"${error}`);
    next(error);
  }
};

exports.addWidget = async (req, res, next) => {
  try {
    const widget = await Widget.create({ ...req.body});
    res.status(200).json({
      status: "success",
      data: widget
    });
    logger.info(`Add Widget successfully", \"userId\": \"${req.body.userId}`);
  } catch (error) {
    logger.error(`Add Widget fail", \"userId\": \"${req.body.userId}\",\"ERROR\": \"${error}`);
    next(error);
  }
};
exports.deleteWidget = async (req, res, next) => {
  try {
    const widgetId = req.params.widgetId;
    await Widget.findByIdAndDelete(widgetId);
    res.status(200).json({
      status: "success",
      message: "Delete successfully"
    });
    logger.info(`Delete Widget successfully", \"userId\": \"${req.body.userId}`);
  } catch (error) {
    logger.error(`Delete Widget fail", \"userId\": \"${req.body.userId}\",\"ERROR\": \"${error}`);
    next(error);
  }
};
exports.getOneWidget = async (req, res, next) => {
  try {
    const widget = await Widget.findById(req.params.widgetId);
    res.status(200).json({
      status: "success",
      data: widget
    });
    logger.info("Get One Widget successfully");
  } catch (error) {
    logger.error(`Add Widget fail", \"userId\": \"${req.body.userId}\",\"ERROR\": \"${error}`);
    next(error);
  }
};
exports.updateWidget = async (req, res, next) => {
  try {
    const widgetId = req.params.widgetId;
    const widget = await Widget.findByIdAndUpdate(widgetId, req.body, {
      new: true,
      runValidator: true
    });
    res.status(200).json({
      status: "success",
      data: widget
    });
  } catch (error) {
    next(error);
  }
};
exports.getListWidgets = async (req, res, next) => {
  try {
    const widgets = await Widget.find({ userId: req.body.userId });
    res.status(200).json({
      status: "success",
      data: { widgets }
    });
    logger.info(`List Widget successfully", \"userId\": \"${req.body.userId}`);
  }catch (error) {
    logger.error(`List Widget fail", \"userId\": \"${req.body.userId}\",\"ERROR\": \"${error}`);
    next(error);
  }
};
