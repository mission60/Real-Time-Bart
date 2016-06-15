'use strict';
angular.module('app.bartInfo', [])
.controller('bartController', ['$scope', 'Bart', function($scope, Bart) {
  // $scope.stationList;
  $scope.Bart = Bart; // putting bart on scope
  console.log('$scope.Bart ', $scope.Bart);
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
    // console.log(stationList.station)
    $scope.stationList = stationList;
    return stationList;
  });

  Bart.getTrainTime()
  .then(function(getTrainTime){
    $scope.getTrainTime = getTrainTime;
    console.log('inside controller')
    return getTrainTime;
  })
}])//custom directives
.directive('d3Stations', function() 
{
  return {
    restrict: 'EA',
    scope: false, //
    link: function(scope, element) {
      var width = 900;
      var height = 700;
      var canvas = d3.select(element[0])
                    .append('svg')
                    .attr('width', width)
                    .attr('height', height)
                    .style('border', '1px solid black')
                    .call(d3.behavior.zoom().on("zoom", function () {canvas.attr("transform", "translate(" + d3.event.translate + ")" + " scale(" + d3.event.scale + ")")}))
                    .append("g");
                    
      // var g = canvas.append('g');
      var projection = d3.geo.mercator();
      projection.scale(80000).translate([100, 300]).center([-122.413756, 37.779528]);
      
      scope.render = function(data) {
        // console.log('render data', data)
        if(data === undefined) {
          return;
        }
        canvas.selectAll('*').remove();

        canvas.selectAll('circle')
              .data(data.station)
              .enter().append('circle')
              .attr("cx", function(d) { return projection([d.gtfs_longitude, d.gtfs_latitude])[0] })
              .attr("cy", function(d) { return projection([d.gtfs_longitude, d.gtfs_latitude])[1] })
              .attr("r", "2px")
              .attr("fill", "red");
        var city = 'http://api.bart.gov/api/etd.aspx?cmd=etd&orig=daly&key=MW9S-E7SL-26DU-VV8V'

        canvas.selectAll('text')
              .data(data.station)
              .enter().append('text')
              .attr("x", function(d) { return projection([d.gtfs_longitude, d.gtfs_latitude])[0] + 5 })
              .attr("y", function(d) { return projection([d.gtfs_longitude, d.gtfs_latitude])[1] + 5 })
              .attr('font-size', '8px')
              .text(function(d) { return d.name; })
              .on({"click": function(d){ scope.Bart.getTrainTime(d.abbr)}});


              // .on({"click": function(d){ console.log(d.abbr)}});


                // function(d){console.log(d.abbr)}
                //d3.json('http://api.bart.gov/api/etd.aspx?cmd=etd&orig=' + d.abbr + '&key=MW9S-E7SL-26DU-VV8V', function(err,res){
                 //conosle.log('jey', d.abbr);
                //if(err){console.log(err)}

              //})
            // });
              // .on({ //var station = d.abbr
              //   "click": function(){// how to access bart service functions inside custom directive// 
              //   }//scope.getTrainTime(d.abbr)//function(d){console.log(d.abbr)}//Bart.getTrainTime()
              
      };
      
      scope.$watch('stationList', function() {
        if(scope.stationList !== undefined){
          scope.render(scope.stationList);
        }
      });
    }
  }
});

