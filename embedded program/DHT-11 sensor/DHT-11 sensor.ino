#include <ESP8266WiFi.h> //https://github.com/esp8266/Arduino
#include <DNSServer.h>
#include <ESP8266WebServer.h>
#include <ESP8266HTTPClient.h>
#include "WiFiManager.h"
#include <ArduinoJson.h>
#include <PubSubClient.h>
#include <iostream>
#include <string.h>
#include <DHT.h>
#define DHTPIN 14    // Chân dữ liệu của DHT 11 , với NodeMCU chân D5 GPIO là 14
#define DHTTYPE DHT11 
DHT dht(DHTPIN, DHTTYPE);
boolean sendreq = false;
WiFiClient client;
HTTPClient http;
PubSubClient mqtt_client(client);
String requestUrl = "http://iot-platform-application-912380012.ap-southeast-1.elb.amazonaws.com/api/v1/device/verifydevice/123456";
//String requestUrl = "http://192.168.30.100:5000/api/v1/device/verifydevice/a4ad9sj12bd";
//String gatewayip;
String payload;
String controltp;
unsigned long lastMsg = 0;
#define MSG_BUFFER_SIZE	(500)
char msg[MSG_BUFFER_SIZE];
char senddata[500];
int value = 0;
char sendlwd[500];
char sendlwc[500];
const char* stream;
void configModeCallback (WiFiManager *myWiFiManager)
{
  Serial.println("Entered config mode");
  Serial.println(WiFi.softAPIP());
  Serial.println(myWiFiManager->getConfigPortalSSID());
}
void setup()
{
  Serial.begin(115200);
  pinMode(LED_BUILTIN, OUTPUT);
  pinMode(16, OUTPUT);
  digitalWrite(16, HIGH);
  dht.begin();
  //Khai báo wifiManager thuộc class WiFiManager, được quy định trong file WiFiManager.h
  WiFiManager wifiManager;
  //có thểreset các cài đặt cũ bằng cách gọi hàm:
  //wifiManager.resetSettings();
  //Cài đặt callback, khi kết nối với wifi cũ thất bại, thiết bị sẽ gọi hàm callback
  //và khởi động chế độ AP với SSID được cài tự động là "ESP+chipID"
  wifiManager.setAPCallback(configModeCallback);
  if (!wifiManager.autoConnect())
  {
  Serial.println("failed to connect and hit timeout");
  //Nếu kết nối thất bại, thử kết nối lại bằng cách reset thiết bị
  ESP.reset();
  delay(1000);
  }
  //Nếu kết nối wifi thành công, in thông báo ra màn hình
  mqtt_client.setCallback(callback);
}
void callback(char* topic, byte* payload, unsigned int length) {
  char str[length+1];
  Serial.print("Message arrived [");
  Serial.print(topic);
  Serial.println("] ");
  int i;
  for (i=0; i<length; i++) {
    Serial.print((char)payload[i]);
    str[i]=(char)payload[i];
  }
  str[i] = 0; // Null termination
  Serial.println();
}
void loop()
{
  if (WiFi.status() == WL_CONNECTED) {
    if ( sendreq == false){
      http.begin(client, requestUrl);
      int httpResponseCode = http.GET();
      if (httpResponseCode == HTTP_CODE_OK) {
        payload = http.getString();
        Serial.println("Response payload: " + payload);
        sendreq = true;
      }
      else {
        Serial.print("Error code: ");
        Serial.println(httpResponseCode);
      }
      http.end();
    }
    DynamicJsonDocument doc(1024);
    deserializeJson(doc, payload);
    JsonObject obj = doc.as<JsonObject>();
    String gatewayip = obj["gatewayip"];
    String controltopic = obj["controlTopic"];
    String datastream = doc["datastream"];
    const char* gwip = gatewayip.c_str();
    mqtt_client.setServer(gwip, 1883);
    const char* controltp = controltopic.c_str();
    stream = datastream.c_str();
    mqtt_client.subscribe(controltp);
    float t = dht.readTemperature();
    dtostrf(t, 2, 2, msg);
    //create json to publish
    sprintf(senddata, "%s", ""); // Cleans the payload content  
    sprintf(senddata, "%s {\"message\": %s", senddata, "\"send data\""); // Adds the contect
    sprintf(senddata, "%s, \"value\": \"%s\"}", senddata, msg); // Adds value
    mqtt_client.publish(stream, senddata);
    Serial.println(senddata);
    delay(5000);
    if (!mqtt_client.connected()) {
      reconnect();
    }
    mqtt_client.loop();
  } else {
    Serial.println("WiFi Disconnected");
  }
}
void reconnect() {
  // Loop until we're reconnected
  while (!mqtt_client.connected()) {
    Serial.print("Attempting MQTT connection...");
    // Create a random client ID
    String clientId = "ESP8266Client-";
    clientId += String(random(0xffff), HEX);
    sprintf(sendlwd, "%s", ""); // Cleans the payload content  
    sprintf(sendlwd, "%s {\"message\": %s", sendlwd, "\"Last will\""); // Adds the contect
    sprintf(sendlwd, "%s, \"value\": \"%s\"}", sendlwd, "Device Disconnected"); // Adds value
    sprintf(sendlwc, "%s", ""); // Cleans the payload content  
    sprintf(sendlwc, "%s {\"message\": %s", sendlwc, "\"Last will\""); // Adds the contect
    sprintf(sendlwc, "%s, \"value\": \"%s\"}", sendlwc, "Device Connected"); // Adds value
    // Attempt to connect
    if (mqtt_client.connect(clientId.c_str(), stream, 0, false, sendlwd)) {
      Serial.println("connected");
      // Once connected, publish an announcement...
      mqtt_client.publish(stream, sendlwc);
    } else {
      Serial.print("failed, rc=");
      Serial.print(mqtt_client.state());
      Serial.println(" try again in 5 seconds");
      // Wait 5 seconds before retrying
      delay(5000);
    }
  }
}
