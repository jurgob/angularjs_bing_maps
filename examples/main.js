
var testBingMap =  angular.module('testBingMap', ['ngBMap']);
testBingMap.controller('MainCtrl', function ($scope) {

    $scope.title = "test test";
    $scope.center = [43.000, 13.0000];
    $scope.markers = [[43.000, 13.0000]];

    var step = 0.0001;
    var curStep = step;
    var increase = true;

    setInterval(
    	function(){
            if ($scope.markers.length === 10){
                console.log("--increase false "+$scope.markers.length)
                increase = false
            }
            else if ($scope.markers.length === 0){
                console.log("--increase true "+$scope.markers.length)
                increase = true
            }

            if(increase ){
        		$scope.markers.push([ $scope.center[0] +curStep , $scope.center[1]+ curStep  ]);
                curStep+= step;
    			console.log('curStep increase: '+$scope.markers.length);
            }else{
                curStep = step;
                $scope.markers.pop();
                console.log('curStep decrease: '+$scope.markers.length);
            }
            $scope.$apply();
    	},
    	1000
    );

});
