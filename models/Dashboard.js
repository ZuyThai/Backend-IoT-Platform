const mongoose = require("mongoose");

const dashboardSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, "Name must be require"] },
    userid: { type: String, required: [true, "User Id must be require"] },
  },
  { timestamps: true }
);

const Dashboard = mongoose.model("Dashboard", dashboardSchema);

module.exports = Dashboard;
