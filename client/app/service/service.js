'use strict';
angular.module('app.service', [])
.factory('Bart', function($http) {
  // var getRoute = function() {
  //   return $http({
  //     method: 'GET',
  //     url: '/api/routes'
  //   })
  //   .then(function(resp) {
  //     return resp.data.root.routes.route;
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
      data: {station: station},
      method:'POST'
    })
    .then(function(resp){
      return resp.data.root.station;
    });
  };

  return {
    getSS: getSS,
    getSL: getSL,
    getRTE: getRTE
    // getRoute: getRoute
  };
});