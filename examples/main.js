
var testBingMap =  angular.module('testBingMap', ['ngBMap']);
testBingMap.controller('MainCtrl', function ($scope) {

    $scope.title = "test test";
    $scope.center = [43.000, 13.0000]
    $scope.markers = [[43.000, 13.0000], [43.0001, 13.0001], [43.0002, 13.0002]]
    $scope.markers2 = [[43.0002, 13.0000]]


});