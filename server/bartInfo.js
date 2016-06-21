'use strict';
var request = require("request");
var xml2json = require("xml2json");
// var axios = require("axios");
var publicBartAPI = "MW9S-E7SL-26DU-VV8V";


module.exports = {
  getSpecialSched: function(cb) {
    request('http://api.bart.gov/api/sched.aspx?cmd=special&key=' + publicBartAPI, function(err, res) {
      if(err) {throw err;}
      res = xml2json.toJson(res.body);
      cb(res);
    });
  },
  getRealTimeEstimate: function(cb) {
    request('http://api.bart.gov/api/etd.aspx?cmd=etd&orig=12th&key=' + publicBartAPI, function(err, res) {
      if(err) {throw err;}
      res = xml2json.toJson(res.body);
      cb(res);
    });
  },
  getStationList: function(cb) {
    request('http://api.bart.gov/api/stn.aspx?cmd=stns&key=' + publicBartAPI, function(err, res) {
      if(err) {throw err;}
      res = xml2json.toJson(res.body);
      cb(res);
    });
  },
  getTrainTimes: function(data, cb){
    console.log('paramsOBJ!!!!', data)
    request('http://api.bart.gov/api/etd.aspx?cmd=etd&orig=' + data.station + '&key=MW9S-E7SL-26DU-VV8V', function(err, res){
      if(err){throw err;}
      res = xml2json.toJson(res.body)
      console.log('bartinfojs response', res)
      cb(res);
    });
  }
};