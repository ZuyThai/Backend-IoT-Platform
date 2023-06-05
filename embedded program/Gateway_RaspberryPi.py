import requests
import json
import paho.mqtt.client as paho
from paho import mqtt
import csv
import pandas as pd
import sys
import socket
from datetime import datetime
hostname=socket.gethostname()
IPAddr=socket.gethostbyname(hostname)
print("Your Computer IP Address is:"+IPAddr)
# url = 'http://iot-platform-application-912380012.ap-southeast-1.elb.amazonaws.com/api/v1/gateway/verifygateway'
url = 'http://localhost:5000/api/v1/gateway/verifygateway'
myobj = {
    "serialnumber" : "123456",
    "gatewayip":IPAddr
}
x = requests.post(url, json = myobj)
data = json.loads(x.text)
if data['status'] == "connect success":
    resT = data['topic'].replace("control", "response")
    gwid = data['topic'].replace("controlGW/", "")
    
# def on_log(client, userdata, level, buf):
#     print("log: ",buf)
def on_localmessage(client, userdata, message):
    print("Received device message: ", str(message.payload.decode("utf-8"))) 
    print("From: ", message.topic)
    mess = json.loads(message.payload.decode("utf-8"))
    dis = json.dumps({"id":message.topic,"message":"dvDisconnect"})
    connect = json.dumps({"id":message.topic,"message":"dvConnect"})
    if (mess["message"] == "send data"):
        print(mess["value"])
        dt = json.dumps({"message":"send data","value":mess["value"]})
        clientcloud.publish(message.topic, dt)
        # Save data to csv file
        with open('telemetry.csv', 'a') as f:
            row = [message.topic, mess["value"], datetime.now()]
            writer = csv.writer(f)
            writer.writerow(row)
    if (mess["message"] == "Last will"):
        if (mess["value"] == "Device Disconnected"):
            clientcloud.publish(message.topic, dis)
        elif (mess["value"] == "Device Connected"):
            clientcloud.publish(message.topic, connect) 
def on_cloudmessage(client, userdata, message):
    print("Received server message: ", str(message.payload.decode("utf-8")))
    mess = json.loads(message.payload.decode("utf-8"))
    # when user add new data stream
    if (mess["message"] == "GPIO"):
        if (mess["status"] == "high"):
            gpiojson = json.dumps({"message":"GPIO control", "status":"high"})
            clientlocal.publish("controlDV/"+mess["device"], gpiojson)
            print("controlDV/"+mess["device"], gpiojson)
            print("HIGH")
        elif (mess["status"] == "low"):
            gpiojson1 = json.dumps({"message":"GPIO control", "status":"low"})
            clientlocal.publish("controlDV/"+mess["device"], gpiojson1)
            print("controlDV/"+mess["device"], gpiojson1)
            print("LOW")
    # When user add new device
    elif (mess["message"] == "Add new device"):
        print(resT,{"id":mess["topic"],"message":"Add success"})
        messjson = json.dumps({"id":mess["topic"],"message":"Add success"})
        clientlocal.subscribe(mess["topic"])
        with open('controlDVtopic.csv', 'a') as f:
            row = [mess["topic"]]
            writer = csv.writer(f)
            writer.writerow(row)
        clientcloud.publish(resT, messjson)
clientlocal = paho.Client(client_id="", userdata=None, protocol=paho.MQTTv5)
clientcloud = paho.Client(client_id="", userdata=None, protocol=paho.MQTTv5)
lwt = json.dumps({"id":gwid,"message":"GATEWAY DISCONNECTION"})
clientcloud.will_set(resT, lwt, 1, False)
clientcloud.tls_set(tls_version=mqtt.client.ssl.PROTOCOL_TLS)
clientcloud.username_pw_set("thai123456","1234567890")
clientlocal.on_message = on_localmessage
clientcloud.on_message = on_cloudmessage
# clientlocal.on_log = on_log
if clientcloud.connect("865d0b2920144dd19ad53dd45daa0c57.s1.eu.hivemq.cloud", 8883, keepalive=20) !=0 :
    print("can't connect")
    clientcloud.loop_stop()
    sys.exit(-1)
clientcloud.loop_start()
if clientlocal.connect("localhost", 1883, keepalive=20) !=0 :
    print("can't connect")
    sys.exit(-1)
if data['status'] == "connect success":
    messjson = json.dumps({"id":gwid,"message":"gwConnected"})
    clientcloud.subscribe(data['topic'])
    clientcloud.publish(resT, messjson)
    print(resT,"Connected")
header_list = ["topic"]
df = pd.read_csv("controlDVtopic.csv", names=header_list)
for i in df['topic']:
    clientlocal.subscribe(i)
try:
    clientlocal.loop_forever()
except:
    print("disconnect")