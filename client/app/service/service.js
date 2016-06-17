'use strict';
angular.module('app.service', [])
.factory('Bart', function($http) {
  var getRTE = function() {
    return $http({
      method: 'GET',
      url: '/api/realTimeEstimate'
    })
    .then(function(resp) {
      return resp.data.root;
    });
  };

  var getSS = function() {
    return $http({
      method: 'GET',
      url: '/api/specialSched'
    })
    .then(function(resp) {
      return resp.data.root.special_schedules.special_schedule;
    });
  };

  var getSL = function() {
    return $http({
      method: 'GET',
      url: '/api/stationList'
    })
    .then(function(resp) {
      return resp.data.root.stations;
    });
  };

  var getTrainTime = function(station){
    return $http({
      url:'/api/trainTime',
      data: {station: station},//JSON.parse(d)
      method:'POST'//not working in here...
    })
    .then(function(resp){
      return resp.data.root.station;
    });
  };

  var getTrainTime = function(station){
    // console.log('CLICKED station', station)
    return $http({
      url:'/api/trainTime',
      data: {station: station},//JSON.parse(d)
      method:'POST'//not working in here...
    })
    .then(function(resp){
      // console.log('inside servicejs', resp)
      return resp.data.root.station
    })
  }

  return {
    getRTE: getRTE,
    getSS: getSS,
    getSL: getSL,
    getTrainTime: getTrainTime
  };
});