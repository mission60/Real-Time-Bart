'use strict';

angular.module('app', [
  'app.service',
  'app.bartInfo'
])
.config(function($routeProvider, $locationProvider) {
  $routeProvider
  .when('/', {
    templateUrl: '../index.html'
    controller:
  })
  $locationProvider.html5Mode(true);
});