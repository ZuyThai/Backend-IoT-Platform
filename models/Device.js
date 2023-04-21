const mongoose = require('mongoose');

const deviceSchema = new mongoose.Schema({
    name: {type: String, required: [true, 'name must be require']},
    type: {type: String, default:""},
    description: {type: String, default:""},
    gatewayid: {type: String},
    serialnumber: {type: String, unique: true, required: [true, 'serial number must be require']},
    gatewayack: {type: Boolean, default:false},
    connectstatus: {type: String, default: "Not Connected"}
}, {timestamps: true})

const Device = mongoose.model('Device', deviceSchema);

module.exports = Device;