'use strict';

angular.module('app.index', [])

.controller('indexController', ['$scope', '$location', function($scope, $location) {
  $scope.getBartInfo = function() {
    $location.path('/bartInfo');
  };
}]);