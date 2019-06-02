const express=require("express");
const app = express();

app.use(express.static('assets'));

app.get('/', function (req, res) {
    res.sendFile(__dirname + "/" + "app.html" );
});

var server = app.listen(10000, function () {
    console.log("Listening at port 10000");
})