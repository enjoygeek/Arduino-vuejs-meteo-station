var pubnub = new PubNub({
    subscribeKey: "sub-c-10949dfc-27ba-11e7-bc52-02ee2ddab7fe",
    publishKey: "pub-c-d8e35ee6-911e-4428-b061-388e4708dadc"
});
var channel = "weather-channel";

pubnub.addListener({ //Listener for current temperature from arduino
    message: function(m) {
        app.temperature = JSON.stringify(m.message.temperature);
    }
});

console.log("subscribing..."); //Subscribing for channel
pubnub.subscribe({
    channels: [channel],
});


var app = new Vue({
    el: "#app",
    data: {
        temperature:'Waiting for temp...'
    },

});
