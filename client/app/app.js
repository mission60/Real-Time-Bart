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
  })
  .when('/about', {
    templateUrl: 'app/views/about.html',
    controller: 'indexController'
  })
  .otherwise({
    redirectTo: '/'
  });

  $locationProvider.html5Mode({
    enabled: true,
    requireBase: false
  });
});