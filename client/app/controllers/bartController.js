'use strict';
angular.module('app.bartInfo', [])
.controller('bartController', ['$scope', 'Bart', function($scope, Bart) {
  Bart.get();
}])