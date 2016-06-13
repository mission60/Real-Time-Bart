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
  }

  return {
    getRTE: getRTE,
    getSS: getSS,
    getSL: getSL
  };
});