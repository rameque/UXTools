'use strict';

// Declare app level module which depends on views, and components
angular.module('uxMap', [
  'ngRoute',
  'uxMap.full'
]).
config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
  $locationProvider.hashPrefix('!');

  $routeProvider.otherwise({redirectTo: '/uxmap-full'});
}]);
