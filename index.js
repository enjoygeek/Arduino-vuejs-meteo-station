var five = require("johnny-five");
var PubNub = require("pubnub");
var newUUID = PubNub.generateUUID();
var pubnub = new PubNub({
    subscribeKey: "sub-c-10949dfc-27ba-11e7-bc52-02ee2ddab7fe",
    publishKey: "pub-c-d8e35ee6-911e-4428-b061-388e4708dadc",
    uuid: newUUID
});

var channel = "weather-channel";

var temp_data; //Initializing temperature value to send
var ledRain;

five.Board().on("ready", function() {
    var led = new five.Led(13);
    var thermometer = new five.Thermometer({
        controller: "DS18B20",
        pin: 7,
        freq: 10
    });
    thermometer.on("change", function() {
        temp_data = this.celsius; //Getting temp value from sensor
    });

    this.pinMode("0", five.Pin.INPUT); //Initializing analog pin for rain sensor
    this.analogRead("0", function(voltage) {
        if (voltage < 500) {
            ledRain = true;
            led.on();
        } else {
            ledRain = false;
            led.off();
        }
    });

    setInterval(function pushVue() {
        pubnub.publish({ //Publishing LED data to vue.js app
            message:{
            rainData: ledRain,
            temperature: temp_data
            },
            channel: channel,
            });
    },1000);

    this.repl.inject({
        log: function(){
        console.log("Temperature " + temp_data);
        console.log("Rain " + ledRain);

        }
    });

    //Subscribing for channel
    console.log("Subscribing...");
    pubnub.subscribe({
        channels: [channel]
    });
});
