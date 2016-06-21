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
    templateUrl: 'app/views/indexView.html',
    controller: 'indexController' 
  })
  .when('/bartInfo', {
    templateUrl: 'app/views/bartInfo.html',
    controller: 'bartController'
  })
  $locationProvider.html5Mode({
    enabled: true,
    requireBase: false
  });
});