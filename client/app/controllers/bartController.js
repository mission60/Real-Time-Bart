'use strict';
angular.module('app.bartInfo', [])
.controller('bartController', ['$scope', 'Bart', function($scope, Bart) {
  console.log('controller loaded')
  Bart.getRTE()
  .then(function(data) {
    $scope.data = data;
  });

  // Bart.getSS()
  // .then(function(???) {
  //   $scope.??? = ???;
  // });
}]);