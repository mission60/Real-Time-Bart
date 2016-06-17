'use strict';
angular.module('app.bartInfo', [])
.controller('bartController', ['$scope', 'Bart', function($scope, Bart) {
  $scope.Bart = Bart;
  // Bart.getRTE()
  // .then(function(realTimeEstimate) {
  //   $scope.realTimeEstimate = realTimeEstimate;
  // });

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

  Bart.getSL()
  .then(function(stationList) {
    // console.log(stationList.station)
    $scope.stationList = stationList;
    return stationList;
  });

  Bart.getRTE()
  .then(function(getTrainTime){
    $scope.getTrainTime = getTrainTime;
    return getTrainTime;
  });
}])
.directive('d3Stations', [function() {
  return {
    restrict: 'EA',
    scope: false,
    link: function(scope, element) {
      L.mapbox.accessToken = 'pk.eyJ1Ijoic3RlbmluamEiLCJhIjoiSjg5eTMtcyJ9.g_O2emQF6X9RV69ibEsaIw';
      var map = L.mapbox.map('map', 'mapbox.pencil').setView([37.80467476, -122.2945822], 11);
      // var width = 900;
      // var height = 700;
      var canvas = d3.select(map.getPanes().overlayPane).append('svg');
                    
      var g = canvas.append('g').attr('class', 'leaflet-zoom-hide');
      // var projection = d3.geo.mercator();
      // projection.scale(80000).translate([100, 300]).center([-122.413756, 37.779528]);
      
      scope.render = function(data) {
        // canvas.selectAll('*').remove();
        if(data === undefined) {
          return;
        }
        // var dataArr = [];
        // console.log('data', data.station)
        data.station.forEach(function(d) {
          // dataArr.push(new L.LatLng(d.gtfs_latitude, d.gtfs_longitude));
          d.lat = d.gtfs_latitude;
          d.lng = d.gtfs_longitude;
          delete d.gtfs_latitude;
          delete d.gtfs_longitude;
        });

        function project(latlng) {
          var point = map.latLngToLayerPoint(L.latLng(latlng));
          return point;
        }

        function getEtd(etd) {
          var result = [];
          if(!Array.isArray(etd)) {
            result.push({
              name: etd.destination,
              color: etd.estimate.map(function(item) {
                return item.color;
              }),
              direction: etd.estimate.map(function(item) {
                return item.direction;
              }),
              times: etd.estimate.map(function(item) {
                return item.minutes;
              })
            });
          } else {
            etd.reduce(function(accum, item) {
              var direction, color, minutes;
              if(Array.isArray(item.estimate)) {
                direction = item.estimate.map(function(item) {
                  return item.direction;
                });
                color = item.estimate.map(function(item) {
                  return item.color;
                });
                minutes = item.estimate.map(function(item) {
                  return item.minutes;
                });
              } else {
                direction = item.estimate.direction;
                color = item.estimate.color;
                minutes = item.estimate.minutes;
              }

              accum.push({
                name: item.destination,
                color: color,
                direction: direction,
                times: minutes
              });
              return accum;
            }, result);
          }
          console.log("RESULT:", result);
          return result;
        }

        // function formatData(data) {
        //   console.log('data', data);
        //   var str = "";
        //   for(var i = 0; i < data.length; i++) {
        //     str += " " + data[i].name
        //   }
        //   return str;
        // }

        var tip = d3.select('body').append('div').attr('class', 'tooltip').style('opacity', 0);
        var station = g.selectAll('circle')
                        .data(data.station)
                        .enter().append('circle')
                        .attr('r', '5px')
                        .attr('fill', 'red')
                        .on('mouseover', function(data) {
                          scope.Bart.getRTE(data.abbr)
                          .then(function(info) {                            
                            console.log('info', info);                          
                            tip.transition()
                                .duration(200)
                                .style('opacity', 0.9);
                            tip .html('Station: ' + info.name + '<br/>' + 'Destination: ' + getEtd(info.etd) + '<br/>' + 'Direction: ')
                                .style('left', (event.pageX) + 'px')   
                                .style('top', (event.pageY - 28) + 'px'); 
                          });
                        })
                        .on('mouseout', function(d) {
                          tip.transition()
                              .duration(500)
                              .style('opacity', 0);
                        });
        var text = g.selectAll('text')
                    .data(data.station)
                    .enter().append('text')
                    .attr('font-size', '8px')
                    .text(function(d) { return d.abbr; });
        function update() {
          // We need to reposition our SVG and our containing group when the map
          // repositions via zoom or pan
          // https://github.com/zetter/voronoi-maps/blob/master/lib/voronoi_map.js
          var bounds = map.getBounds();
          var topLeft = map.latLngToLayerPoint(bounds.getNorthWest())
          var bottomRight = map.latLngToLayerPoint(bounds.getSouthEast())
          canvas.style('width', map.getSize().x + 'px')
                .style('height', map.getSize().y + 'px')
                .style('left', topLeft.x + 'px')
                .style('top', topLeft.y + 'px');
          g.attr('transform', 'translate(' + -topLeft.x + ',' + -topLeft.y + ')');

          // We reproject our data with the updated projection from leaflet
          station.attr({
            cx: function(d) { return project({lat: d.lat, lng: d.lng}).x },
            cy: function(d) { return project({lat: d.lat, lng: d.lng}).y }
          });
          text.attr({
            x: function(d) { return project({lat: d.lat, lng: d.lng}).x + 5 },
            y: function(d) { return project({lat: d.lat, lng: d.lng}).y + 8 }
          });
        }
        map.on("viewreset", function() {
          update();
        });
        map.on("move", update);

        // render our initial visualization
        update();

      };
      
      scope.$watch('stationList', function() {
        if(scope.stationList !== undefined) {
          scope.render(scope.stationList);
        }
      });
    }
  }
}]);