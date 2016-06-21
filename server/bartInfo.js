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
    request('http://api.bart.gov/api/stn.aspx?cmd=stns&key=' + publicBartAPI , function(err, res) {
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
    // console.log('paramsOBJ!!!!', data)
    request('http://api.bart.gov/api/etd.aspx?cmd=etd&orig=' + data.station + '&key=MW9S-E7SL-26DU-VV8V', function(err, res){
      if(err){throw err;}
      res = xml2json.toJson(res.body)
      // console.log('bartinfojs response', res)
      cb(res);
    });
  }

};

// var stationRoute = { 
// route1:['PITT','NCON','CONC','PHIL','WCRK','LAFY','ORIN','ROCK','MCAR','19TH','12TH','WOAK','EMBR','MONT','POWL','CIVC','16TH','24TH','GLEN','BALB','DALY','COLM','SSAN','SBRN','SFIA','MLBR'],//Pittsburg/Bay Point - SFIA/Millbrae/PITT-SFIA/ origin PITT//26 stations

// route2 : ['MLBR','SFIA','SBRN','SSAN','COLM','DALY','BALB','GLEN','24TH','16TH','CIVC','POWL','MONT','EMBR','WOAK','12TH','19TH','MCAR','ROCK','ORIN','LAFY','WCRK','PHIL','CONC','NCON','PITT'],//Millbrae/SFIA - Pittsburg/Bay Point//SFIA-PITT/orgin MILB 26 stations

// route3: ['FRMT','UCTY','SHAY','HAYW','BAYF','SANL','COLS','FTVL','LAKE','12TH','19TH','MCAR','ASHB','DBRK','NBRK','PLZA','DELN','RICH'],//Fremont - Richmond//FRMT-RICH//orgn frmt//19

// route4: ['RICH','DELN','PLZA','NBRK','DBRK','ASHB','MCAR','19TH','12TH','LAKE','FTVL','COLS','SANL','BAYF','HAYW','SHAY','UCTY','FRMT'],//Richmond - Fremont//orgn fremont// 18stations

// route5: ['FRMT','UCTY','SHAY','HAYW','BAYF','SANL','COLS','FTVL','LAKE','WOAK','EMBR','MONT','POWL','CIVC','16TH','24TH','GLEN','BALB','DALY'],//Fremont-Daly City//orgn fremont//19stations

// route6: ['DALY','BALB','GLEN','24TH','16TH','CIVC','POWL','MONT','EMBR','WOAK','LAKE','FTVL','COLS','SANL','BAYF','HAYW','SHAY','UCTY','FRMT'],

// route7: ['RICH','DELN','PLZA','NBRK','DBRK','ASHB','MCAR','19TH','12TH','WOAK','EMBR','MONT','POWL','CIVC','16TH','24TH','GLEN','BALB','DALY','COLM','SSAN','SBRN','MLBR'],//23station

// route8: ['MLBR','SBRN','SSAN','COLM','DALY','BALB','GLEN','24TH','16TH','CIVC','POWL','MONT','EMBR','WOAK','12TH','19TH','MCAR','ASHB','DBRK','NBRK','PLZA','DELN','RICH'],

// route11: ['DUBL','WDUB','CAST','BAYF','SANL','COLS','FTVL','LAKE','WOAK','EMBR','MONT','POWL','CIVC','16TH','24TH','GLEN','BALB','DALY'],//17 stations

// route12: ['DALY','BALB','GLEN','24TH','16TH','CIVC','POWL','MONT','EMBR','WOAK','LAKE','FTVL','COLS','SANL','BAYF','CAST','WDUB','DUBL']
// }

