const winston = require('winston')
const S3StreamLogger = require('s3-streamlogger').S3StreamLogger;
const timezoned = () => {
    return new Date().toLocaleString('en-US', {
        timeZone: 'Asia/Ho_Chi_Minh'
    });
}
require('dotenv').config()
let date_ob = new Date();
// adjust 0 before single digit date
let date = ("0" + date_ob.getDate()).slice(-2);
// current month
let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
// current year
let year = date_ob.getFullYear();
// current hours
let hours = date_ob.getHours();
// current minutes
let minutes = date_ob.getMinutes();
// current seconds
let seconds = date_ob.getSeconds();
// current miliseconds
let miliseconds = date_ob.getMilliseconds();
const logger = winston.createLogger({
    format: winston.format.combine(
        winston.format.timestamp({format: timezoned}),
        winston.format.prettyPrint(),
        winston.format.printf((info) => {
            return `"TimeStamp": "${info.timestamp}", "Level": "${info.level.toUpperCase()}", "Message": "${info.message}"`
        })
    ),
    transports: [
           new winston.transports.Console()
    //     new (winston.transports.Stream)({stream: new S3StreamLogger({
    //         bucket: process.env.BUCKET_NAME,
    //         folder: `${year}/${month}/${date}/`,
    //         access_key_id: process.env.AWS_ACCESS_KEY,
    //         secret_access_key: process.env.AWS_SECRET_ACCESS_KEY,
    //         region: process.env.REGION,
    //         name_format:`${year}_${month}_${date}_${hours}_${minutes}_${seconds}_${miliseconds}.log`
    //     })
    // })
    ]
})


module.exports = logger;