'use strict';
angular.module('app.bartInfo', [])
.controller('bartController', ['$scope', 'Bart', function($scope, Bart) {
  $scope.Bart = Bart;
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
    return getTrainTime;
  });
}])
.directive('d3Stations', [function() {
  return {
    restrict: 'EA',
    scope: false,
    link: function(scope, element) {
      L.mapbox.accessToken = 'pk.eyJ1Ijoic3RlbmluamEiLCJhIjoiSjg5eTMtcyJ9.g_O2emQF6X9RV69ibEsaIw';
      var map = L.mapbox.map('map', 'mapbox.outdoors').setView([37.80467476, -122.2945822], 11);
      //mapbox styles = streets/ pencils/ outdoors/ dark / light //satellite /bright/ emerald /basic
      // var width = 900;
      // var height = 700;
      var canvas = d3.select(map.getPanes().overlayPane)
                    .append('svg');
                    // .attr('width', width)
                    // .attr('height', height)
                    // .style('border', '1px solid black')
                    // .call(d3.behavior.zoom().on("zoom", function () {canvas.attr("transform", "translate(" + d3.event.translate + ")" + " scale(" + d3.event.scale + ")")}))
                    // .append("g");
                    
      var g = canvas.append('g').attr('class', 'leaflet-zoom-hide');
      // var projection = d3.geo.mercator();
      // projection.scale(80000).translate([100, 300]).center([-122.413756, 37.779528]);
      
      scope.render = function(data) {
        // console.log('render data', data)
        if(data === undefined) {
          return;
        }
        // canvas.selectAll('*').remove();
        var dataArr = [];
        // console.log('data', data.station)
        data.station.forEach(function(d) {
          dataArr.push(new L.LatLng(d.gtfs_latitude, d.gtfs_longitude));
          d.lat = d.gtfs_latitude;
          d.lng = d.gtfs_longitude;
          delete d.gtfs_latitude;
          delete d.gtfs_longitude;
        });
        // console.log('dataArr', data.station);
        
        function project(latlng) {
          // var array = [+latlng.lat, +latlng.lng];
          var point = map.latLngToLayerPoint(L.latLng(latlng));
          return point;
        }
        // console.log('aa',project({lat: 37.591208, lng: -122.017867}))
        // var tip = d3.select('d3-stations').append('div').attr('class', 'tooltip');
        // project takes input of an object
        var div = d3.select("body").append("div")   
                .attr("class", "tooltip")               
                .style("opacity",0);


        var station = g.selectAll('circle')
              .data(data.station)
              .enter().append('circle')
              .attr('r', '5px')
              .attr('fill', 'red')
              .on('mouseover', function(data) {
              scope.Bart.getTrainTime(data.abbr)
              .then(function(info) {
                 div.transition()        
                // .duration(200)      
            .style("opacity", .9);     
            div .html(info.data.root.station.name + " Station" + "<br/>"  +
            "Train to " + info.data.root.station.etd[0].destination + " in " + JSON.stringify(info.data.root.station.etd[0].estimate[0].minutes) + " minutes" +"<br/>" +
            "Train to " + info.data.root.station.etd[1].destination + " in " + JSON.stringify(info.data.root.station.etd[1].estimate[0].minutes) + " minutes"
              )  
            console.log('station info', info)
               
              })
            }) .on("mouseout", function(d) {       
            div.transition()        
                .duration(500)      
                .style("opacity", 0);   
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
          canvas.style("width", map.getSize().x + "px")
            .style("height", map.getSize().y + "px")
            .style("left", topLeft.x + "px")
            .style("top", topLeft.y + "px");
          g.attr("transform", "translate(" + -topLeft.x + "," + -topLeft.y + ")");

          // We reproject our data with the updated projection from leaflet
          station.attr({
            cx: function(d) { return project({lat: d.lat, lng: d.lng}).x},
            cy: function(d) { return project({lat: d.lat, lng: d.lng}).y}
          });
          text.attr({
            x: function(d) { return project({lat: d.lat, lng: d.lng}).x + 5},
            y: function(d) { return project({lat: d.lat, lng: d.lng}).y + 5 }
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
        if(scope.stationList !== undefined){
          scope.render(scope.stationList);
        }
      });
    }
  }
}]);