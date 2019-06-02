//================ Just to serve device.html
const express=require("express");
const app = express();
app.use(express.static('assets'));
app.get('/', function (req, res) {
    res.sendFile(__dirname + "/" + "device.html" );
});
let appServer = app.listen(12000, function () {
    console.log("Listening at port 12000");
});


/**
 * Web Socket Server
 */
let connections = [];
let WebSocketServer = require('websocket').server;
let http = require('http');

let server = http.createServer(function(request, response) {
    console.log((new Date()) + ' Received request for ' + request.url);
    //response.writeHead(404);
    //response.end();
}).listen(11000, () => {
    console.log((new Date()) + ' Server is listening on port 11000');
});
 
wsServer = new WebSocketServer({
    httpServer: server,
    autoAcceptConnections: false
});
wsServer.on('request', function(request) {    
    let conn = request.accept('echo-protocol', request.origin);
    console.log((new Date()) + ' Connection accepted.');
    
    connections[connections.length] = conn;

    conn.on('message', function(message) {
        console.log(message.utf8Data);
        updateDevice();
    });

    conn.on('close', function(reasonCode, description) {
        console.log((new Date()) + ' Peer ' + conn.remoteAddress + ' disconnected.');
    });
});
/* ------ End: Web Socket Server ------ */

/**
 * Web Socket Client: Subscribes the POD
 */
const W3CWebSocket = require('websocket').w3cwebsocket;

process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;

let client = new W3CWebSocket('wss://localhost:8443/');
client.onerror = () => { console.log('Connection Error') };
client.onclose = () => { console.log('Client Closed') };
client.onopen  = () => {
    console.log('WebSocket Client Connected');    
    if (client.readyState === client.OPEN)
        client.send("sub https://device1.localhost:8443/public/device1.control.ttl");
};
client.onmessage = (e) => {
    if (typeof e.data === 'string' && e.data.startsWith("ack")) {
        console.log("Subscribed to POD [Acknowledgement: '" + e.data + "']");       
    }else if (typeof e.data === 'string' && e.data.startsWith("pub")) {
        console.log("Received Update [Message: '" + e.data + "']");
        updateDevice();
    }else{
        console.log("Could not Subscribe to POD");
    }
};
/* ------ End: Web Socket Client ------ */


function updateDevice(){
    /** Fetching Updates from POD *********************************************/
    const $rdf = require('rdflib');
    const store = $rdf.graph();
    const timeout = 5000;
    const fetcher = new $rdf.Fetcher(store, timeout);
    let url = "https://device1.localhost:8443/public/device1.control.ttl";

    fetcher.nowOrWhenFetched(url, function (ok, body, xhr) {
        if (!ok) { console.log("Couldn't fetch data"); }
        else {
            let WOTTD = $rdf.Namespace("https://www.w3.org/2019/wot/td#");
            let things = store.each($rdf.sym(url), WOTTD('thing'));
            for (i in things) {
                //let thing = JSON.parse(things[i].value);       
                console.log(things[i].value);
                 
                for(j in connections){
                    connections[j].sendUTF(things[i].value);
                }
            }
        }
    });
}