'use strict';

angular.module('eg0')
  .controller('MainCtrl', function ($scope,$http) {
    $http({method: 'GET', url: '/test'}).
        success(function(data, status, headers, config) {
            $scope.elements = data;
        }).
        error(function(data, status, headers, config) {
        // called asynchronously if an error occurs
        // or server returns response with an error status.
        });
  });
