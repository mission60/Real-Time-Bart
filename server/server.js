'use strict';
var express = require("express");
var path = require("path");
var request = require("request");

var port = process.env.PORT || 8080;
var app = express();
var bart = require("./bartInfo.js");

app.use(express.static(path.join(__dirname, "../client")));

app.use(function(req, res) {
  res.sendfile(path.resolve(__dirname + "../client/index.html"));
});

app.get('/bartInfo', function(req, res) {
  request('www.google.com', function(req, response) {
    res.send(response);
  });
});
// res.send(bart.getRealTimeEstimate());

// app.use()
// bart.getSpecialSched();
// how are we going to pass data from real time estimate? callback? promise?

app.listen(port, function() {
  console.log("Listening on port " + port);
});