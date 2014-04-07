'use strict';

angular
  .module('eg0', [
    'ngCookies',
    'ngResource',
    'ngSanitize',
    'ngRoute'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: '/js/views/main.html',
        controller: 'MainCtrl'
      })
      .when('/elementView', {
        templateUrl: '/js/views/elementview.html',
        controller: 'ElementviewCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
