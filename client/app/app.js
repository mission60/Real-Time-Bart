'use strict';

angular.module('app', [
  'app.service',
  'app.bartInfo',
  'app.index',
  'ngRoute'
])
.config(function($routeProvider, $locationProvider) {
  $routeProvider
  .when('/', {
    templateUrl: 'app/views/bartInfo.html',
    controller: 'bartController'
  })
  .when('/specialSchedules', {
    templateUrl: 'app/views/indexView.html',
    controller: 'indexController' 
  });

  $locationProvider.html5Mode({
    enabled: true,
    requireBase: false
  });
});