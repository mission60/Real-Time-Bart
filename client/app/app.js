'use strict';

angular.module('app', [
  'app.service',
  'app.bartInfo',
  'ngRoute'
])
.config(function($routeProvider, $locationProvider) {
  $routeProvider
  .when('/', {
    templateUrl: '../index.html',
    controllerkey: 'bartController' 
  })
  $locationProvider.html5Mode(true);
});