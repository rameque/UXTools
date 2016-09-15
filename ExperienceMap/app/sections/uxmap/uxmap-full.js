'use strict';

angular.module('uxMap.full', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/uxmap-full', {
        templateUrl: 'sections/uxmap/uxmap-full.html',
        controller: 'uxMapFull'
    });
}])

.controller('uxMapFull', [function() {

}]);
