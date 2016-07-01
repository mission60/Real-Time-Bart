'use strict';
var request = require('request');
var xml2json = require('xml2json');
var publicBartAPI = 'MW9S-E7SL-26DU-VV8V';


module.exports = {
  getSpecialSched: function(cb) {
    request('http://api.bart.gov/api/sched.aspx?cmd=special&key=' + publicBartAPI, function(err, res) {
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
  getRealTimeEstimate: function(data, cb) {
    request('http://api.bart.gov/api/etd.aspx?cmd=etd&orig=' + data.station + '&key=' + publicBartAPI, function(err, res) {
      if(err) {throw err;}
      res = xml2json.toJson(res.body);
      cb(res);
    });
  },
  getAdvisories: function(cb) {
    request('http://api.bart.gov/api/bsa.aspx?cmd=bsa&key=' + publicBartAPI, function(err, res) {
      if(err) {throw err;}
      res = xml2json.toJson(res.body);
      cb(res);
    });
  }
};