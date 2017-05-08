var five = require("johnny-five");
var PubNub = require("pubnub");

var newUUID = 'myDevice';
var pubnub = new PubNub({
    subscribeKey: "sub-c-10949dfc-27ba-11e7-bc52-02ee2ddab7fe",
    publishKey: "pub-c-d8e35ee6-911e-4428-b061-388e4708dadc",
    uuid:newUUID
});


var channel = "weather-channel";
var temp_data = 0; //Initializing temperature value to send
var ledRain = false;
var hym_data = 0;

five.Board().on("ready", function() {
    var led = new five.Led(13);
    var thermometer = new five.Thermometer({
        controller: "DS18B20",
        pin: 7
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


//  analog hygrometer == IN DEVELOPMENT ==
    this.pinMode("1",five.Pin.INPUT);
    this.analogRead('1',function(hym){
        hym_data = Math.round(100-hym/10.23);
    });

// == IN DEVELOPMENT ==


    (function initialPusblish() {
        pubnub.publish({
            message: {
                temperature: temp_data,
                rainData: ledRain,
                hym: hym_data,
                eon: {
                    "Температура": temp_data,
                    "Влажность": hym_data
                },
            },
            channel: channel,
        });
    }());

    setInterval(function pushVue() {
        pubnub.publish({ //Publishing temp data to vue.js app
            message: {
                temperature: temp_data,
                rainData: ledRain,
                hym: hym_data,
                eon: {
                    "Температура": temp_data,
                    "Влажность": hym_data
                },
            },
            channel: channel,
        });
    }, 50000);


    this.repl.inject({ //Node console data check
        log: function() {
            console.log("Temperature " + temp_data);
            console.log("Rain " + ledRain);
        }
    });

    //Subscribing for channel
    console.log("Subscribing...");
    pubnub.subscribe({
        channels: [channel],
        withPresence: true
    });
});
