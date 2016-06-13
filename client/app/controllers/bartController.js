'use strict';
angular.module('app.bartInfo', [])
.controller('bartController', ['$scope', 'Bart', function($scope, Bart) {
  Bart.getRTE()
  .then(function(realTimeEstimate) {
    $scope.realTimeEstimate = realTimeEstimate;
  });

  Bart.getSS()
  .then(function(specialSched) {
    specialSched.forEach(function(item) {
      if(typeof item.start_time !== 'string') {
        delete item.start_time;
        delete item.end_time;
      }
    })    
    $scope.specialSched = specialSched;
  });

  Bart.getSL()
  .then(function(stationList) {
    console.log(stationList);
  });
}])
.directive('d3-station', [function() {
  return {
    restrict: 'E',
    scope: {
      data: '='
    },
    link: function(scope, element) {
      var width = 600;
      var height = 600;

      var canvas = d3.select(element[0])
                    .append('svg')
                    .attr('width', width)
                    .attr('height', height)
                    .style('border', '1px solid black');
      
      var projection = d3.geo.mercator();

      scope.render = function(data) {
        if(data === undefined) {
          return;
        }

        svg.selectAll('*').remove();
      }
    }
  }
}]);