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
        var div = d3.select("body").append("div").attr("class", "tooltip").style("opacity",0);

data.station.forEach(function(el){
  // console.log(el.abbr, 'latitude '+ el.lat, 'longitude ' + el.lng)
})

var stationData = data.station.forEach(function(el){
  var result = []
  result.push(el.lat, el.lng)
  // console.log(result)
  return result;
  // console.log(el.abbr, 'latitude '+ el.lat, 'longitude ' + el.lng)
})

       function getEtd(etd) {
        // console.log('etd!!',etd)
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
              time: etd.estimate.map(function(item) {
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
                time: minutes
              });
              return accum;
            }, result);
          }
          // console.log("RESULT:", result);
          return result;
        }
        function timing(data){
          var str ='';
         for(var i = 0; i < data.length; i++){
            // console.log(data[i].direction)
            // console.log(data[i])
          str +=  data[i].name + " in " + data[i].time + '\n' +'<br/>'        
          // console.log(str, str2, 'str3!',str3)
          }
          return str;
        }
      var route1 = ['PITT','NCON','CONC','PHIL','WCRK','LAFY','ORIN','ROCK','MCAR','19TH','12TH','WOAK','EMBR','MONT','POWL','CIVC','16TH','24TH','GLEN','BALB','DALY','COLM','SSAN','SBRN','SFIA','MLBR']
 
      var route2 = ['MLBR','SFIA','SBRN','SSAN','COLM','DALY','BALB','GLEN','24TH','16TH','CIVC','POWL','MONT','EMBR','WOAK','12TH','19TH','MCAR','ROCK','ORIN','LAFY','WCRK','PHIL','CONC','NCON','PITT']

      // setTimeout(function(){route2.forEach(function(el){
      //   scope.Bart.getTrainTime(el)
      //   .then(function(element){
      //     console.log('Current Station '+ el + " \n" + timing(getEtd(element.etd)))
      //   })
      // })},2000);
    var route1 =[{x:38.018914, y:-121.945154},{x:38.003275, y:-122.024597},{x:37.973737, y:-122.029095},{x:37.928403, y:-122.056013},{x:37.905628, y:-122.067423},{x:37.893394, y:-122.123801},{x:37.878360, y:-122.183791},{x:37.844601, y:-122.251793},{x:37.828415, y:-122.267227},{x:37.807871, y:-122.269029},{x:37.803664, y:-122.271604},{x:37.804674, y:-122.294582},{x:37.792976, y:-122.39674},{x:37.789256, y:-122.401407},{x:37.784991, y:-122.406857},{x:37.779528, y:-122.413756},{x:37.765062, y:-122.419694},{x:37.752254, y:-122.418466},{x:37.732921, y:-122.434092},{x:37.721980, y:-122.447442},{x:37.706120, y:-122.469007},{x:37.684638, y:-122.466233},{x:37.664174, y:-122.444116},{x:37.637753, y:-122.416038},{x:37.616035, y:-122.392612},{x:37.599787, y:-122.38666}]
 
      var arr=[];
      route1.forEach(function(el){
       arr.push(scope.Bart.getTrainTime(el))
        })
        Promise.all(arr).then(function(element){
          // console.log(element)
          // console.log(getTime(element));
        })

        var station = g.selectAll('circle')
              .data(data.station)
              .enter().append('circle')
              .attr('r', '5px')
              .attr('fill', 'red')
              .on('mouseover', function(data) {
              scope.Bart.getTrainTime(data.abbr)
              .then(function(info) {
                    console.log('info!!', info)
                 div.transition()        
                // .duration(200)      
            .style("opacity", .9)     
            div .html(timing(getEtd(info.etd)))       
              })//loop through the data and append it inside the div
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

        update();


      };
      var myStyle = {
    
    "color": "red",
    "weight": 1,
    "opacity": 1.0336,
    "width": 5
};
// var route = {"type":"FeatureCollection","features":[{"type":"Feature","properties":{},"geometry":{"type":"LineString","coordinates":[[-122.386794090271,37.60012220289819],[-122.40074157714844,37.61416342563735],[-122.40829467773436,37.62480307085124],[-122.41767168045044,37.640215957670726],[-122.42168426513672,37.64611177340781],[-122.42683410644533,37.6518202441499],[-122.43548154830931,37.656610943427125],[-122.44019150733948,37.66179202556475],[-122.44824886322021,37.66721054100796],[-122.44992256164551,37.669435584815766],[-122.452712059021,37.67363071495582],[-122.45807647705078,37.67736706842431],[-122.46163845062254,37.68140891166475],[-122.46814012527466,37.68623166333117],[-122.46987819671631,37.68967871970675],[-122.46994256973268,37.694755619331595],[-122.47101545333861,37.697879692484264],[-122.4709939956665,37.702786259018616],[-122.47097253799438,37.70377092874501],[-122.46620893478394,37.7094240379944],[-122.46481418609618,37.710052134627205],[-122.46367692947388,37.710120036647],[-122.45676755905153,37.71025584049998],[-122.45445013046265,37.71105368311011],[-122.44960069656372,37.71512763910703],[-122.44837760925292,37.71711361144011],[-122.44803428649902,37.71909953053827],[-122.44672536849974,37.724904219581596],[-122.44451522827147,37.72739907772295],[-122.44013786315918,37.72969019994345],[-122.42346525192261,37.740177543351415],[-122.41812229156493,37.748559561800654],[-122.42035388946533,37.77220734485087],[-122.41986036300658,37.774615805204256],[-122.39481925964355,37.79448684840749],[-122.37595796585083,37.80274827178258],[-122.3573112487793,37.80624076600696],[-122.33799934387206,37.80946185212675],[-122.3299741744995,37.8099026214036],[-122.30667114257812,37.807868279712665],[-122.29967594146727,37.8063933469406],[-122.29759454727174,37.8058677890642],[-122.28974103927614,37.80278218028747],[-122.28351831436157,37.801256282156544],[-122.2779607772827,37.798662182986924],[-122.2762441635132,37.79850958608104],[-122.27429151535034,37.79906910652822],[-122.26761817932127,37.81005519477107],[-122.26877689361571,37.81168262440736],[-122.27053642272949,37.81334392182851],[-122.270987033844,37.81566628515953],[-122.26613759994507,37.83432729676272],[-122.26912021636963,37.83819111265065],[-122.27150201797485,37.84856140722196],[-122.26706027984619,37.86043800837439],[-122.26846575736998,37.87224494293345],[-122.26901292800903,37.873049507350586],[-122.26966738700865,37.87358305575012],[-122.27127671241759,37.87377784229819],[-122.27961301803587,37.87272768263811],[-122.2812008857727,37.8731087906969],[-122.28537440299986,37.874768705025524],[-122.28711247444151,37.875903522887256],[-122.29626417160036,37.899019513198624],[-122.29917168617249,37.90291380078861],[-122.30101704597472,37.90522487837832],[-122.3044502735138,37.90945743301735],[-122.31707811355591,37.92540351171852],[-122.32012510299683,37.92910176319838],[-122.32216358184813,37.93046423001139],[-122.32452392578125,37.93112429802159],[-122.32995271682739,37.931352781721266],[-122.33520984649657,37.93136970641152],[-122.34608888626097,37.931522028448406],[-122.34842777252196,37.93245287848293],[-122.35379219055174,37.936971564791975]]}}]}
// L.geoJson(route).addTo(map);
      
      scope.$watch('stationList', function() {
        if(scope.stationList !== undefined){
          scope.render(scope.stationList);
        }
      });
    }
  }
}]);



