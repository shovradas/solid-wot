var http = require("https");

process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;

var options = {
  "method": "PATCH",
  "hostname": "user1.localhost",
  "port": 8443,
  "path": "/public/data/sensor1.data.ttl",
  "headers": {
    "content-type": "application/sparql-update"
  },
  body: "<> isError true ."
};

var req = http.request(options, function (res) {
  var chunks = [];

  res.on("data", function (chunk) {
    chunks.push(chunk);
  });

  res.on("end", function () {
    var body = Buffer.concat(chunks);
    console.log(body.toString());
  });
});

// req.write(qs.stringify(
// {
//   "description": "updated gist",
//   "public": "true",
//   "files": {
//     "file1.txt": {
//       "content": "String file contents are now updated"
//     }
//   }
// }));

req.end();