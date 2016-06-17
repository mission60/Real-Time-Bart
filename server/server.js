'use strict';
var express = require("express");
var path = require("path");
var request = require("request");
var bodyParser = require("body-parser");
var port = process.env.PORT || 8080;
var app = express();


var bart = require("./bartInfo.js");

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "../client")));

app.get('/api/realTimeEstimate', function(req, res) {
  bart.getRealTimeEstimate(function(data) {
    data = JSON.parse(data);
    res.send(data);
  });
});

app.get('/api/specialSched', function(req, res) {
  bart.getSpecialSched(function(data) {
    data = JSON.parse(data);
    res.send(data);
  });
});

app.get('/api/stationList', function(req, res) {
  bart.getStationList(function(data) {
    data = JSON.parse(data);
    res.send(data);
  });
});

app.post('/api/trainTime', function(req, res){
  bart.getRealTimeEstimate(req.body, function(data){
    data = JSON.parse(data);
    res.send(data);
  });
});


app.listen(port, function() {
  console.log("Listening on port " + port);
});