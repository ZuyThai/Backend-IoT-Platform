## IoT-Platform
This is a Web application used to manage and control IoT devices for non-technical users.
## IoT system architecture
![iot_arch](https://github.com/ZuyThai/Backend-IoT-Platform/assets/114822142/a215d0b7-ef2b-4ffa-96c0-1bc2cd51e314)
## Device and Technologies used 
- Node: ESP8266 + Sensor or relay
- Gateway: Raspberry Pi 3B+ or higher
- Local Broker: Mosquitto Broker install on Pi
- Data center: NodeJS + MongoDB
- Cloud Broker: HiveMQ (or AWS EC2 t2.micro)
- Client: ReactJS
## Demo image
![Dashboard1](https://github.com/ZuyThai/Backend-IoT-Platform/assets/114822142/ef32d98c-b78a-43fd-9468-27e35797a911)
![Chart1](https://github.com/ZuyThai/Backend-IoT-Platform/assets/114822142/ff6510b0-150d-4077-ae53-e02c0176fe69)
## Demo online
Updating...
## Environment file
```Node
APP_PORT = 
APP_SECRET = "Your JWT secret key"
SENDGRID_API_KEY = 
APP_EMAIL = 
DB_URI = 
MQTT_USERNAME = 
MQTT_PASSWORD = 
MQTT_HOST = 
MQTT_PORT =  
CLOUDINARY_CLOUD_NAME = 
CLOUDINARY_API_KEY = 
CLOUDINARY_API_SECRET =
```
## Install
At first startup, you must to setup .env file and install node module.
```bash
npm install
```
Then, you just have to run
```bash
npm start
```
Make sure your application runs successfully, you will see three lines of message:
```
"TimeStamp": "6/5/2023, 10:57:16 AM", "Level": "INFO", "Message": "server running at http://localhost:5000/"
"TimeStamp": "6/5/2023, 10:57:17 AM", "Level": "INFO", "Message": "DB Connected"
"TimeStamp": "6/5/2023, 10:57:17 AM", "Level": "INFO", "Message": "MQTT connected"
```
Note: at this repo there is only backend, to run frontend see at https://github.com/ZuyThai/p-aws-iot-platform-frontend