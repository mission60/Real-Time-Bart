'use strict';
angular.module('app.index', [])
.controller('indexController', ['$scope', '$location', 'Bart', function($scope, $location, Bart) {

  $scope.specialSchedules = function() {
    $location.path('/specialSchedules');
  };

  Bart.getSS()
  .then(function(specialSched) {
    specialSched.forEach(function(item) {
      if(typeof item.start_time !== 'string') {
        delete item.start_time;
        delete item.end_time;
      }
    });    
    $scope.specialSched = specialSched;
  });

  $scope.about = function() {
    $location.path('/about');
  };

  Bart.getAdvisories()
  .then(function(delay) {
    if(delay === 'No delays reported.') {
      $scope.delay = '';
    } else {
      $scope.delay = delay;
    }
  });
}]);