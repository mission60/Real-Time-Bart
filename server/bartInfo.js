'use strict';
var request = require("request");
var xml2json = require("xml2json");
var axios = require("axios");
var publicBartAPI = "MW9S-E7SL-26DU-VV8V";


module.exports = {
  getSpecialSched: function() {
    var text = [];
    request('http://api.bart.gov/api/sched.aspx?cmd=special&key=' + publicBartAPI, function(err, res, body) {
      if(err) {throw err;}
      res = xml2json.toJson(res.body);
      var specialSched = JSON.parse(res);
      console.log(specialSched.root.special_schedules);
    });
  },
  getRealTimeEstimate: function() {
    request('http://api.bart.gov/api/etd.aspx?cmd=etd&orig=12th&key=' + publicBartAPI, function(err, res) {
      if(err) {throw err;}
      res = xml2json.toJson(res.body);
      var realTimeEstimate = JSON.parse(res);
      var date = realTimeEstimate.root.date;
      var time = realTimeEstimate.root.time;
      var station = realTimeEstimate.root.station;
      console.log('date',date,'time',time,'station',station);
    });
  }
};
