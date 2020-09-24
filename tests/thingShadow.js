var awsIot = require('aws-iot-device-sdk');

//
// Replace the values of '<YourUniqueClientIdentifier>' and '<YourCustomEndpoint>'
// with a unique client identifier and custom host endpoint provided in AWS IoT cloud
// NOTE: client identifiers must be unique within your AWS account; if a client attempts
// to connect with a client identifier which is already in use, the existing
// connection will be terminated.
//
var thingShadows = awsIot.thingShadow({
   keyPath: 'iotKeys/MoeTownCoup.private.key',
  certPath: 'iotKeys/MoeTownCoup.cert.pem',
    caPath: 'iotKeys/root-CA.crt',
  clientId: 'arn:aws:iot:us-east-1:413036241627:thing/MoeTownCoup',
      host: 'a5ypcgm97wfum-ats.iot.us-east-1.amazonaws.com'
});

var clientTokenUpdate;

thingShadows.on('connect', function() {
    thingShadows.register( 'MoeTownCoup', {}, function() {

        // Once registration is complete, update the Thing Shadow named
        // 'RGBLedLamp' with the latest device state and save the clientToken
        // so that we can correlate it with status or timeout events.
        var coupState = { "state" : {
            "door" : "open",
            "temperature" : 26,
            "humidity": 76,
            "light" : 45,
            "relay" : false
        }};

        clientTokenUpdate = thingShadows.update('MoeTownCoup', coupState  );
        // If the update method
        // returns null, it's because another operation is currently in progress and
        // you'll need to wait until it completes (or times out) before updating the
        // shadow.
        if (clientTokenUpdate === null) {
            console.log('update shadow failed, operation still in progress');
        }
    });
});
thingShadows.on('status',
    function(thingName, stat, clientToken, stateObject) {
        console.log('received '+stat+' on '+thingName+': '+JSON.stringify(stateObject));
        // These events report the status of update(), get(), and delete()
        // calls.  The clientToken value associated with the event will have
        // the same value which was returned in an earlier call to get(),
        // update(), or delete().  Use status events to keep track of the
        // status of shadow operations.
    }
);

thingShadows.on('delta',
    function(thingName, stateObject) {
       console.log('received delta on '+thingName+': '+
                   JSON.stringify(stateObject));
    }
);

thingShadows.on('timeout',
    function(thingName, clientToken) {
       console.log('received timeout on '+thingName+' with token: '+ clientToken);
    // In the event that a shadow operation times out, you'll receive
    // one of these events.  The clientToken value associated with the
    // event will have the same value which was returned in an earlier
    // call to get(), update(), or delete().
    }
);

console.log('running')
