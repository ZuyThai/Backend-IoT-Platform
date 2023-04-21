const jwt = require("jsonwebtoken");
const logger = require("../AppLog/logger")
exports.verifyToken = async (req, res, next) => {
  const Authorization = req.header("authorization");
  if (!Authorization) {
    const err = new Error("Unauthorized");
    err.statusCode = 400;
    return next(err);
  }
  // get token
  const token = Authorization.replace("Bearer ", "");
  try {
    // Verify token
    const { userId } = jwt.verify(token, process.env.APP_SECRET);
    console.log("User Id : ", userId);
    req.body.userId = userId;
    next();
  } catch (error) {
    logger.error(`Authorization fail", "ERROR": "${error.message}`);
    if (error.message === "jwt expired") {
      return res.status(400).json({ message: error.message });
    } else {
      return res.status(400).json({ message: "failure" });
    }
  }
};
