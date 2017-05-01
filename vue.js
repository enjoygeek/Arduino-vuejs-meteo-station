var pubnub = new PubNub({
    subscribeKey: "sub-c-10949dfc-27ba-11e7-bc52-02ee2ddab7fe",
    publishKey: "pub-c-d8e35ee6-911e-4428-b061-388e4708dadc"
});
var channel = "weather-channel";
pubnub.addListener({ //Listener for current temperature from arduino
    message: function(m) {
        app.temperature = JSON.stringify(m.message.temperature);
        app.rain = m.message.rainData;
    }
});

console.log("subscribing..."); //Subscribing for channel
pubnub.subscribe({
    channels: [channel,"chart"]
});

var rainComp = Vue.extend({ //Component for rain notification
    props: ['raindata'], //Component prop for getting rain data from app.data
    template: '#rain_component'
});

Vue.component('comp-temp', rainComp); //Declaring component


var app = new Vue({
    el: "#app",
    data: {
        temperature: 'Waiting for temp...',
        rain: false
    }
});

eon.chart({     //Chart
    pubnub: pubnub,
    channels: ['chart'],
    history: true,
    flow: true,
    limit: 20,
    generate: {
        bindto: '#chart',
        data: {
            type: 'spline',
            labels: true,
        },
        zoom:{
            enabled:true
        }
    }
});
