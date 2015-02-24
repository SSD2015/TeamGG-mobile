angular.module('starter.controllers', [])
.controller('LoginCtrl', function($state, $stateParams, $rootScope, $scope, $ionicPopup){
	$scope.username = "";
	$scope.submit = function(){
		$rootScope.username = $scope.username;
		$state.go("base.projectlist");
	};
	$scope.showAlert = function() {
	   var alertPopup = $ionicPopup.alert({
	     title: 'Login as Guest',
	     template: 'You can only watch the application'
	   });
	   alertPopup.then(function(res) {
	     $scope.username = "Guest";
	     $scope.submit();
	   });
	};
})
.controller('ProjectInfoCtrl', function($stateParams, $scope, $ionicPopup ){
	$scope.id = $stateParams.id;
	$scope.showConfirm = function() {
	   var confirmPopup = $ionicPopup.confirm({
	     	title: 'Consume Ice Cream',
	     	template: 'Are you sure you want to eat this ice cream?'
	   });
	   confirmPopup.then(function(res) {
	     if(res) {
	       console.log('You are sure');
	     } else {
	       console.log('You are not sure');
	     }
	   });
 };
});