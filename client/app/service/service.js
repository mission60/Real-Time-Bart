'use strict';
angular.module('app.service', [])
.factory('Bart', function($http) {

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

  var getRTE = function(station) {
    return $http({
      url:'/api/trainTime',
      data: {station: station},
      method:'POST'
    })
    .then(function(resp) {
      return resp.data.root.station;
    });
  };

  var getAdvisories = function() {
    return $http({
      method: 'GET',
      url:'/api/advisories'
    })
    .then(function(resp) {
      return resp.data.root.bsa.description;
    })
  }
  return {
    getSS: getSS,
    getSL: getSL,
    getAdvisories: getAdvisories,
    getRTE: getRTE
  };
});