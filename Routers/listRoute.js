const authRoute = require('./authRoute');
const userRoute = require('./userRoute');
const deviceRoute = require('./deviceRoute');
const telemetryRoute = require('./telemetryRoute');
const dashboardRoute = require('./dashboardRoute');
const gatewayRoute = require("./gatewayRoute");
const adminRoute = require("./adminRoute");
const widgetRoute = require('./widgetRoute');
exports.route = (app) =>{
    app.use('/api/v1/auth', authRoute);
    app.use('/api/v1/user', userRoute);
    app.use('/api/v1/device', deviceRoute);
    app.use('/api/v1/device/telemetry', telemetryRoute);
    app.use('/api/v1/dashboard', dashboardRoute);
    app.use("/api/v1/gateway", gatewayRoute);
    app.use("/api/v1/admin", adminRoute);
    app.use("/api/v1/widget", widgetRoute);
}
