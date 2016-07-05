'use strict';
angular.module('app.bartInfo', [])
.controller('bartController', ['$scope', 'Bart', function($scope, Bart, $rootScope) {
  $scope.Bart = Bart;

  Bart.getSL()
  .then(function(stationList) {
    $scope.stationList = stationList;
    return stationList;
  });

  Bart.getRTE()
  .then(function(getTrainTime) {
    return getTrainTime;
  });

  Bart.getAdvisories()
  .then(function(delay) {
    if(delay.description === 'No delays reported.') {
      $scope.delay = '';
    }
      $scope.delay = delay;
  });
}])
.directive('d3Stations', [function() {
  return {
    restrict: 'EA',
    scope: false,
    link: function(scope, element) {
      L.mapbox.accessToken = 'pk.eyJ1Ijoic3RlbmluamEiLCJhIjoiSjg5eTMtcyJ9.g_O2emQF6X9RV69ibEsaIw';
      var map = L.mapbox.map('map', 'mapbox.streets').setView([37.80467476, -122.2005822], 11);
      var canvas = d3.select(map.getPanes().overlayPane).append('svg');
      var g = canvas.append('g').attr('class', 'leaflet-zoom-hide');
      var tip = d3.select('body').append('div').attr('class', 'tooltip').style('opacity', 0);      

      var route = {route1 : ['PITT', 'NCON', 'CONC', 'PHIL', 'WCRK', 'LAFY', 'ORIN', 'ROCK', 'MCAR', '19TH', '12TH','WOAK', 'EMBR', 
                    'MONT', 'POWL', 'CIVC', '16TH', '24TH', 'GLEN', 'BALB', 'DALY', 'COLM', 'SSAN', 'SBRN', 'SFIA', 'MLBR'], route1Color : '#ffff33',
                route2 : ['MLBR', 'SFIA', 'SBRN', 'SSAN', 'COLM', 'DALY', 'BALB', 'GLEN', '24TH', '16TH', 'CIVC', 
                'POWL', 'MONT', 'EMBR', 'WOAK', '12TH', '19TH', 'MCAR', 'ROCK', 'ORIN', 'LAFY', 'WCRK', 'PHIL', 'CONC', 'NCON', 'PITT'], route2Color : '#ffff33',
                route3 : ['FRMT', 'UCTY', 'SHAY', 'HAYW', 'BAYF', 'SANL', 'COLS', 'FTVL', 'LAKE', '12TH', '19TH', 'MCAR', 'ASHB', 'DBRK',
                'NBRK', 'PLZA', 'DELN', 'RICH'], route3Color : '#ff9933',
                route4 : ['RICH', 'DELN', 'PLZA', 'NBRK', 'DBRK', 'ASHB', 'MCAR', '19TH', '12TH', 'LAKE', 'FTVL', 'COLS', 'SANL', 'BAYF',
                'HAYW', 'SHAY', 'UCTY', 'FRMT'], route4Color : '#ff9933',
                route5 : ['FRMT', 'UCTY', 'SHAY', 'HAYW', 'BAYF', 'SANL', 'COLS', 'FTVL', 'LAKE', 'WOAK', 'EMBR', 'MONT', 'POWL', 'CIVC',
                '16TH', '24TH', 'GLEN', 'BALB', 'DALY'], route5Color : '#339933',
                route6 : ['DALY', 'BALB', 'GLEN', '24TH', '16TH', 'CIVC', 'POWL', 'MONT', 'EMBR', 'WOAK', 'LAKE', 'FTVL', 'COLS', 'SANL',
                'BAYF', 'HAYW', 'SHAY', 'UCTY', 'FRMT'], route6Color : '#339933',
                route7 : ['RICH', 'DELN', 'PLZA', 'NBRK', 'DBRK', 'ASHB', 'MCAR', '19TH', '12TH', 'WOAK', 'EMBR', 'MONT', 'POWL', 'CIVC',
                '16TH', '24TH', 'GLEN', 'BALB', 'DALY', 'COLM', 'SSAN', 'SBRN', 'MLBR'], route7Color : '#ff0000',
                route8 : ['MLBR', 'SBRN', 'SSAN', 'COLM', 'DALY', 'BALB', 'GLEN', '24TH', '16TH', 'CIVC', 'POWL', 'MONT', 'EMBR', 'WOAK',
                '12TH', '19TH', 'MCAR', 'ASHB', 'DBRK', 'NBRK', 'PLZA', 'DELN', 'RICH'], route8Color : '#ff0000',
                route11 : ['DUBL', 'WDUB', 'CAST', 'BAYF', 'SANL', 'COLS', 'FTVL', 'LAKE', 'WOAK', 'EMBR', 'MONT', 'POWL', 'CIVC', '16TH',
                '24TH', 'GLEN', 'BALB', 'DALY'], route11Color : '#0099cc',
                route12 : ['DALY', 'BALB', 'GLEN', '24TH', '16TH', 'CIVC', 'POWL', 'MONT', 'EMBR', 'WOAK', 'LAKE', 'FTVL', 'COLS', 'SANL',
                'BAYF', 'CAST', 'WDUB', 'DUBL'], route12Color : '#0099cc'};

      function getEtd(info) {
        var result = [];
        if(!Array.isArray(info.etd)) {
          if(Array.isArray(info.etd.estimate)){
            result.push({
              abbr: info.abbr,
              name: info.name,
              destination: info.etd.destination,
              dest_abbr: info.etd.abbreviation,
              color: info.etd.estimate.map(function(item) {
                return item.hexcolor;
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
            abbr: info.abbr,
            name: info.name,
            destination: info.etd.destination,
            dest_abbr: info.etd.abbreviation,
            color: info.etd.estimate.hexcolor,
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
                return item.hexcolor;
              });
              minutes = item.estimate.map(function(item) {
                return item.minutes;
              });
            } else {
              len = item.estimate.length;
              color = item.estimate.hexcolor;
              minutes = item.estimate.minutes;
            }
            accum.push({
              abbr: info.abbr,
              name: info.name,
              destination: item.destination,
              dest_abbr: item.abbreviation,
              color: color,
              len: len,
              times: minutes
            });
            return accum;
          }, result);
        }
        return result;
      }
      function stationTimeSheet(mappedData) {
        var routeInfo = {};
        mappedData.reduce(function(accum, item) {
          for(var i = 0; i < item.length; i++) {
            if(!accum[item[i].abbr]) {
              accum[item[i].abbr] = {};
              accum[item[i].abbr][item[i].dest_abbr] = item[i].times;
            } else {
              accum[item[i].abbr][item[i].dest_abbr] = item[i].times;
            }
          }
          return accum;
        }, routeInfo);
        return routeInfo;
      }
      function getDestAndTime(data) {
        var str = '';
        var time = 0;
        for(var i = 0; i < data.length; i++) {
          if(data[i].times[0] === 'Leaving') {
            data[i].times[0] = time;
          }
          str += 'Train to ' + data[i].destination + ' in '+ data[i].times + ' min.' + '(' + data[i].len + ' cars' + ')' + '<br/>'
        }
        return str;
      }
      function project(latlng) {
        var point = map.latLngToLayerPoint(L.latLng(latlng));
        return point;
      } 

      scope.getEtd = getEtd;
      var station;
      scope.render = function(data) {
        if(data === undefined) {
          return;
        }     
        // canvas.selectAll('*').remove();
        data.station.forEach(function(d) {
          d.lat = d.gtfs_latitude;
          d.lng = d.gtfs_longitude;
          delete d.gtfs_latitude;
          delete d.gtfs_longitude;
        });     

        station = g.selectAll('circle')
                  .data(data.station)
                  .enter().append('circle')
                  .attr('r', '5px')
                  .attr('stroke', 'grey')
                  .attr('fill', 'black')
                  .on('mouseover', function(data) {
                    var page = d3.event;
                    scope.Bart.getRTE(data.abbr)
                    .then(function(info) {
                      tip.transition()
                          .duration(200)
                          .style('opacity', 0.9);
                      tip .html("<p style='font-size:20px'> Station: " + info.name + "</p>" + "<p style='font-size:16px'>" + getDestAndTime(getEtd(info)) + "</p>")
                          .style('left', (page.pageX + 10) + 'px')   
                          .style('top', (page.pageY - 50) + 'px'); 
                    });
                  })
                  .on('mouseout', function(d) {
                    tip.transition()
                        .duration(200)
                        .style('opacity', 0);
                  });

        var text = g.selectAll('text')
                    .data(data.station)
                    .enter().append('text')
                    .attr('font-size', '8px')
                    .text(function(d) { return d.abbr; })
        
        function update() {
          var bounds = map.getBounds();
          var topLeft = map.latLngToLayerPoint(bounds.getNorthWest())
          var bottomRight = map.latLngToLayerPoint(bounds.getSouthEast())
          canvas.style('width', map.getSize().x + 'px')
                .style('height', map.getSize().y + 'px')
                .style('left', topLeft.x + 'px')
                .style('top', topLeft.y + 'px');
          g.attr('transform', 'translate(' + -topLeft.x + ',' + -topLeft.y + ')');
          station.attr({
            cx: function(d) { return project({lat: d.lat, lng: d.lng}).x; },
            cy: function(d) { return project({lat: d.lat, lng: d.lng}).y; }
          });
          text.attr({
            x: function(d) { return project({lat: d.lat, lng: d.lng}).x + 5; },
            y: function(d) { return project({lat: d.lat, lng: d.lng}).y + 8; }
          });
        }
        map.on('viewreset', function() {
          update();
        });
        map.on('move', update);
        update();
      };
      
      scope.$watch('stationList', function() {
        if(scope.stationList !== undefined) {
          scope.render(scope.stationList);
        }
      });

      var station1, station2, time;
      scope.getRTEfunction = function() {
        scope.Bart.getRTE('ALL')
        .then(function(rteForAllStation) {
          var etdForAllStation = [];
          var timeSheetForAllStation;
          rteForAllStation.forEach(function(item) {
            etdForAllStation.push(getEtd(item));
          });
          timeSheetForAllStation = stationTimeSheet(etdForAllStation);
  
          function findClosestTrainBtwTwo(station, dest) {
            var possibleRoute = [];
            for(var rte in route) {
              var stationIdx = route[rte].indexOf(station);
              var destIdx = route[rte].indexOf(dest);
              if(stationIdx > -1 && destIdx > -1) {
                if(stationIdx < destIdx) {
                  possibleRoute.push([rte, route[rte+'Color']]);
                }
              }
            }
            console.log('possibleRoute', possibleRoute); 
            var nextTrainMins = Number.POSITIVE_INFINITY;
            var nextTrainDest;
            var routeNum;
            for(var i = 0; i < possibleRoute.length; i++) {
              var routeName = possibleRoute[i][0]; 
              var routeColor = possibleRoute[i][1];
              var singleRoute = route[routeName]; 
              for(var j = 0; j < etdForAllStation.length; j++) {
                var eachStation = etdForAllStation[j];
                for(var k = 0; k < eachStation.length; k++) {
                  var destIdxInRoute = singleRoute.indexOf(eachStation[k].dest_abbr);
                  var endIdxInRoute = singleRoute.indexOf(dest);
                  if(eachStation[k].times[0] === 'Leaving') {
                    eachStation[k].times[0] = 0;
                  }
                  if(destIdxInRoute >= endIdxInRoute && eachStation[k].abbr === station && eachStation[k].color[0] === routeColor) {
                    if(+eachStation[k].times[0] < nextTrainMins){
                      nextTrainMins = eachStation[k].times[0];
                      nextTrainDest = eachStation[k].dest_abbr;
                      routeNum = routeName;
                    } 
                  }
                }
              }
            }
            console.log('nextTrainMin', nextTrainMins, 'nextTrainRouteName', nextTrainDest, 'route', routeNum);
            var routeTimeSheet = {};
            route[routeNum].reduce(function(accum, item) {
              for(var station in timeSheetForAllStation) {
                if(item === station) {
                  accum[station] = timeSheetForAllStation[station];
                }
              }
              return accum;
            }, routeTimeSheet);

            function findClosestTrain(routeInfo, station, dest) {
              console.log('routInfo', station, dest, routeInfo);
              var rte = route[routeNum];
              var stationIdx = rte.indexOf(station);
              console.log('stationIdx', stationIdx);
              if(stationIdx === -1) {
                console.error('error');
              }
              var bestStationIdx = stationIdx;
              var arrivalInfo = routeInfo[station][dest];
              var nextTrainArrival = (arrivalInfo[0] === 'Leaving') ? 0 : arrivalInfo[0];
              console.log('arrival info', arrivalInfo, nextTrainArrival);
              if(nextTrainArrival < 1) {
                nextTrainArrival = arrivalInfo[1];
              }
              console.log('nextTrainArrival1', nextTrainArrival);
              for(var i = stationIdx-1; i >= 0; i--) {
                // console.log('bug', routeInfo[rte[i]])
                // console.log('inside for loop time', routeInfo[rte[i]][dest][0] || routeInfo[rte[i]][dest]);
                if(routeInfo[rte[i]][dest]){
                  if(+routeInfo[rte[i]][dest][0] > +nextTrainArrival || +routeInfo[rte[i]][dest][0] === 0) {
                    bestStationIdx = i;
                    nextTrainArrival = routeInfo[rte[i]][dest][0];
                    console.log('nextTrainArrival2', routeInfo[rte[i]]);
                    break;
                  } 
                }
              }
              var ans = {trainLocation: 'between ' + rte[bestStationIdx] + ' and ' + rte[bestStationIdx+1],
                        time: (routeInfo[rte[bestStationIdx+1]][dest][0]) + ' min away to ' + rte[bestStationIdx+1]};
              console.log('ans', ans);
              var timeForNextTrain = (arrivalInfo[0] === 0) ? arrivalInfo[1] : arrivalInfo[0];
              station1 = rte[bestStationIdx];
              station2 = (bestStationIdx === 0) ? rte[0] : rte[bestStationIdx+1];
              time = routeInfo[rte[bestStationIdx+1]][dest][0];
              function plotTrain(point1, point2, percentage) {
                var point = [point1, point2];
                var distance = Math.sqrt(Math.pow((point1.x-point2.x), 2) + Math.pow((point1.y-point2.y), 2));        
                var middle = [{lat: (point1.lat*percentage)+(point2.lat*(1-percentage)), lng: (point1.lng*percentage)+(point2.lng*(1-percentage))}];
                console.log('middle', middle);
                var dot = g.selectAll('image')
                          .data(middle)
                          .enter().append('image')
                          .attr('xlink:href', '../pics/Bart.gif')
                          .attr('x', function(d) { return project({lat: d.lat, lng: d.lng}).x; })
                          .attr('y', function(d) { return project({lat: d.lat, lng: d.lng}).y - 10; })
                          .attr('width', '30px')
                          .attr('height', '30px')
                          .on('mouseover', function(d) {
                            var page = d3.event;
                            tip.transition()
                                .duration(200)
                                .style('opacity', 0.9)
                            tip.html('Next train is coming in ' + timeForNextTrain + ' min.\nTrain is in between ' + station1 + ' and ' + station2 + ' and is ' + (routeInfo[rte[bestStationIdx+1]][dest][0]) + ' min away to ' + rte[bestStationIdx+1])
                                .style('left', (page.pageX + 5) + 'px')   
                                .style('top', (page.pageY - 20) + 'px'); 
                          })
                          .on('mouseout', function(d) {
                            tip.transition()
                              .duration(200)
                              .style('opacity', 0);
                          });
              }
              var station1Point = scope.stationList.station.reduce(function(accum, item) {
                if(item.abbr === station1) {
                  accum.lat = +item.lat;
                  accum.lng = +item.lng;
                }
                return accum;
              }, {});
              var station2Point = scope.stationList.station.reduce(function(accum, item) {
                  if(item.abbr === station2) {
                    accum.lat = +item.lat;
                    accum.lng = +item.lng;
                }
                return accum;
              }, {});
              plotTrain(station1Point, station2Point, 0.5);
            }
            findClosestTrain(routeTimeSheet, station, nextTrainDest);
          }          
          findClosestTrainBtwTwo(scope.departure, scope.destination);
          scope.$watch('stationList', function(newValues) {
            var depStation = scope.stationList.station.filter(function(item) {
              return item.abbr === scope.departure;
            });
            var destStation = scope.stationList.station.filter(function(item) {
              return item.abbr === scope.destination;
            });
            var departing = station
                            .filter(function(d) {
                              return d.abbr === depStation[0].abbr;
                            })
                            .transition()
                            .duration(500)
                            .attr('r', '10px')
                            .attr('fill', 'red'); 
            var destination = station
                              .filter(function(d) {
                                return d.abbr === destStation[0].abbr;
                              })     
                              .transition()
                              .duration(500)
                              .attr('r', '10px')
                              .attr('fill', 'green');
          });
        });
      } 
    }
  }
}]);