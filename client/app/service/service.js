'use strict';
angular.module('app.service', [])
.factory('Bart', function($http) {
  // var getRTE = function() {
  //   return $http({
  //     method: 'GET',
  //     url: '/api/realTimeEstimate'
  //   })
  //   .then(function(resp) {
  //     return resp.data.root;
  //   });
  // };

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

  var getRTE = function(station){
    return $http({
      url:'/api/trainTime',
      data: {station: station},//JSON.parse(d)
      method:'POST'//not working in here...
    })
    .then(function(resp){
      return resp.data.root.station;
    });
  };

  return {
    getSS: getSS,
    getSL: getSL,
    getRTE: getRTE
  };
});