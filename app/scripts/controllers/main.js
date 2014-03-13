'use strict';

angular.module('smtpRelayApp')
  .controller('MainCtrl', function ($scope, $http) {
    $http.get('/api/getMails').success(function(getMails) {
      $scope.getMails = getMails;
    });
  });
