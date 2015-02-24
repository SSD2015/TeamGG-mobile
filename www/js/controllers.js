angular.module('starter.controllers', [])
.controller('ControllerLogin', function($state, $stateParams, $rootScope, $scope){
	$scope.username = "";
	$scope.submit = function(){
		$rootScope.username = $scope.username;
		$state.go("base.projectlist");
	};
})
.controller('ProjectInfoController', function($stateParams, $scope){
	$scope.id = $stateParams.id;
});