const mongoose = require("mongoose");

const widgetSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, "Name must be require"] },
    type: { type: String, required: [true, "Type must be require"] },
    device_id: { type: String },
    dashboard_id: {
      type: String,
      required: [true, "Dashboard must be require"],
    },
    gatewayId: { type: String, required: [true, "Gateway must be require"] },
    userId: { type: String, required: [true, "User must be require"] },
    unit: { type: String }
  },
  { timestamps: true }
);

const Widget = mongoose.model("Widget", widgetSchema);

module.exports = Widget;
