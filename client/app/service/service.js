angular.module('app.service', [])

.facotry('Bart', function($http) {
  var get = function() {
    return $http({
      method: 'GET',
      url: ???
    })
    .then(function(resp) {
      return resp;
      console.log(resp);
    });
  };
})