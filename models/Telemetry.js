const mongoose = require('mongoose');

const telemetrySchema = new mongoose.Schema({
    value: {type: String, required: [true, "value must be require"]},
    deviceId: {type: String, required: [true, "deviceId must be require"]}

}, {timestamps: true});

const Telemetry = mongoose.model("Telemetry", telemetrySchema);

module.exports = Telemetry;