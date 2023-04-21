const mongoose = require('mongoose');

const gatewaySchema = new mongoose.Schema({
    name: {type: String, required: [true, 'Name must be require']},
    description: {type: String, default:""},
    userid: {type: String, required: [true, 'user Id must be require']},
    serialnumber: {type: String, unique: true, required: [true, 'serial number must be require']},
    connectstatus: {type: String, default:"Not connected"},
    gatewayip: {type: String, default:""}
}, {timestamps: true})

const Gateway = mongoose.model('Gateway', gatewaySchema);

module.exports = Gateway;