angular.module('app.service', [])

.factory('Bart', function($http) {
  var get = function() {
    return $http({
      method: 'GET',
      url: '/bartInfo'
    })
    .then(function(resp) {
      return resp;
      console.log(resp);
    });
  };

  return {
    get: get
  };
})