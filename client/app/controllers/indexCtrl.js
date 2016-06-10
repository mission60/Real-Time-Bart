'use strict';

angular.module('app.index', [])

.controller('indexCtrl', ['$scope', '$location', function($scope, $location) {
  $scope.getBartInfo = function() {
    $location.path('/bartInfo');
  };
}]);