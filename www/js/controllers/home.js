angular.module('restaurant.controllers')
  .controller('HomeCtrl', function ($scope, HomeService) {
    HomeService.performaticForExample(function (chars) {
      $scope.chars = chars;
    });

    HomeService.ipsumExample(function (bacon) {
      $scope.bacon = bacon[0];
    });
  });
