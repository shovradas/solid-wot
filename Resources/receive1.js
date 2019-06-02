var W3CWebSocket = require('websocket').w3cwebsocket;

process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;

var client = new W3CWebSocket('wss://localhost:8443/');
 
client.onerror = function() {
    console.log('Connection Error');
};
 
client.onopen = function() {
    console.log('WebSocket Client Connected');
 
    function sendNumber() {
        if (client.readyState === client.OPEN) {
            client.send("sub https://user1.localhost:8443/public/control/sensor1.control.ttl");            
        }
    }
    sendNumber();
};
 
client.onclose = function() {
    console.log('Client Closed');
};
 
client.onmessage = function(e) {
    if (typeof e.data === 'string') {
        console.log("Received: '" + e.data + "'");
    }
};