angular.module('restaurant.services')
  .factory('HomeService', function ($http, $log) {
    return {
      performaticForExample: function (callback) {
        var chars = 'abcdefghijklmnopqrstuvwxyz';
        var upChars = '';
        for (var i = 0, len = chars.length; i < len; i++) {
          upChars += chars[i].toUpperCase();
        }
        return callback(upChars);
      },
      ipsumExample: function (callback) {
        $http.get('https://baconipsum.com/api/?type=meat-and-filler')
          .success(callback)
          .error($log.error);
      }
    };
  });
