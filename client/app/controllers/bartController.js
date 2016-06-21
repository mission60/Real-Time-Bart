'use strict';
angular.module('app.bartInfo', [])
.controller('bartController', ['$scope', 'Bart', function($scope, Bart) {
  $scope.Bart = Bart;
  Bart.getRoute()
  .then(function(routes) {
    // console.log('routes', routes);
    // $scope.routes = routes;
    return routes;
  });

  Bart.getSL()
  .then(function(stationList) {
    $scope.stationList = stationList;
    return stationList;
  });

  Bart.getRTE()
  .then(function(getTrainTime){
    // $scope.getTrainTime = getTrainTime;
    return getTrainTime;
  });
}])
.directive('d3Stations', [function() {
  return {
    restrict: 'EA',
    scope: false,
    link: function(scope, element) {
      L.mapbox.accessToken = 'pk.eyJ1Ijoic3RlbmluamEiLCJhIjoiSjg5eTMtcyJ9.g_O2emQF6X9RV69ibEsaIw';
      var map = L.mapbox.map('map', 'mapbox.pencil').setView([37.80467476, -122.2005822], 11);
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

        function getEtd(info) {
          var result = [];
          if(!Array.isArray(info.etd)) {
            if(Array.isArray(info.etd.estimate)){
              result.push({
                name: info.name,
                destination: info.etd.destination,
                color: info.etd.estimate.map(function(item) {
                  return item.color;
                }),
                len: info.etd.estimate.map(function(item) {
                  return item.length;
                }),
                times: info.etd.estimate.map(function(item) {
                  return item.minutes;
                })
              });
            } else {
              result.push({
              name: info.name,
              destination: info.etd.destination,
              color: info.etd.estimate.color,
              len: info.etd.estimate.length,
              times: info.etd.estimate.minutes
              });
            }
          } else {
            info.etd.reduce(function(accum, item) {
              var len, color, minutes;
              if(Array.isArray(item.estimate)) {
                len = item.estimate.map(function(item) {
                  return item.length;
                });
                color = item.estimate.map(function(item) {
                  return item.color;
                });
                minutes = item.estimate.map(function(item) {
                  return item.minutes;
                });
              } else {
                len = item.estimate.length;
                color = item.estimate.color;
                minutes = item.estimate.minutes;
              }

              accum.push({
                name: info.name,
                destination: item.destination,
                color: color,
                len: len,
                times: minutes
              });
              return accum;
            }, result);
          }
          // console.log("RESULT:", result);
          return result;
        }

        var route1 = ['PITT', 'NCON', 'CONC', 'PHIL', 'WCRK', 'LAFY', 'ORIN', 'ROCK', 'MCAR', '19TH', '12TH',
        'WOAK', 'EMBR', 'MONT', 'POWL', 'CIVC', '16TH', '24TH', 'GLEN', 'BALB', 'DALY', 'COLM', 'SSAN', 'SBRN',
        'SFIA', 'MLBR'];
        
        var arr = [];
        route1.forEach(function(item) {
          arr.push(scope.Bart.getRTE(item));
        });

        Promise.all(arr).then(function(routeData) {
          var filteredData = [];
          routeData.forEach(function(item) {
            filteredData.push(getEtd(item));
          });
          console.log('Route 1 stations', filteredData);
          for(var i = 0; i < filteredData.length; i++) {
            if(filteredData[i].length > 1) {
              for(var j = 0; j < filteredData[i].length; j++) {
                for(var k = 0; k < filteredData[i][j].times.length; k++) {
                  if(filteredData[i][j].times[k] === 'Leaving') {
                    if(filteredData[i][j].destination === 'SFO/Millbrae') {
                      console.log('success', 'Train is leaving from ' + filteredData[i][j].name + ' to ' + filteredData[i+1][j].name)
                    } else if (filteredData[i][j].destination === 'Pittsburg/Bay Point') {
                      console.log('reverse success', 'Train is leaving from ' + filteredData[i][j].name + ' to ' + filteredData[i-1][j].name)
                    }
                  }
                }
              }
            } else {
              for(var l = 0; l < filteredData[i][0].times.length; l++) {
                if(filteredData[i][0].times[l] === 'Leaving') {
                  if(filteredData[i][0].destination === 'SFO/Millbrae'){
                    console.log('success2', 'Train is leaving from ' + filteredData[i][0].name + ' to ' + filteredData[i+1][0].name)
                  } else if (filteredData[i][0].destination === 'Pittsburg/Bay Point') {
                    console.log('reverse success2', 'Train is leaving from ' + filteredData[i][0].name + ' to ' + filteredData[i-1][0].name)
                  }
                }
              }
            } 
          }          
        });

        // function findTrains(station){
        //   var arr = [];
        //   route1.forEach(function(item) {
        //     arr.push(scope.Bart.getRTE(station.abbr));
        //   });
        //   Promise.all(arr).then(function(routeData) {
        //     console.log(routeData);
        //     var filteredData = [];
        //     routeData.forEach(function(item) {
        //       filteredData.push(getEtd(item));
        //     });
        //     for(var i = 0; i < filteredData.length; i++) {
        //       if(filteredData[i].length > 1) {
        //         for(var j = 0; j < filteredData[i].length; j++) {
        //           if(filteredData[i][j].name === station.name) {
        //             if(filteredData[i][j].destination === 'SFO/Millbrae') {

        //             }
        //           }
        //         }
        //       }
        //     }
        //   });
        // }

        function getDestAndTime(data) {
          var str = '';
          for(var i = 0; i < data.length; i++) {
            str += 'Train to ' + data[i].destination + ' in '+ data[i].times + ' min.' + '(' + data[i].len + ' cars' + ')' + '<br/>'
          }
          return str;
        }
        var tip = d3.select('body').append('div').attr('class', 'tooltip').style('opacity', 0);                        
        var station = g.selectAll('circle')
                        .data(data.station)
                        .enter().append('circle')
                        .attr('r', '5px')
                        .attr('fill', 'red')
                        .on('mouseover', function(data) {
                          console.log('data', data);
                          var page = d3.event;
                          scope.Bart.getRTE(data.abbr)
                          .then(function(info) {
                            console.log('info', info);
                            tip.transition()
                                .duration(200)
                                .style('opacity', 0.9);
                            tip .html('Station: ' + info.name + '<br/>' + getDestAndTime(getEtd(info)) + '<br/>')
                                .style('left', (page.pageX + 10) + 'px')   
                                .style('top', (page.pageY - 50) + 'px'); 
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
                    .text(function(d) { return d.abbr; })
                    // .on('click', function(data) {

                    // });
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