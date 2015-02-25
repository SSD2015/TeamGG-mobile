angular.module('starter.controllers', [])
.controller('LoginCtrl', function($state, $stateParams, $rootScope, $scope, $ionicPopup){
	$scope.username = "";
	$scope.submit = function(){
		$rootScope.username = $scope.username;
		$rootScope.bestVoteStatus = false;
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

.controller('ProjectListCtrl', function( $state, $stateParams ){
	
})

.controller('ProjectInfoCtrl', function($stateParams, $scope, $ionicPopup, $rootScope){
	$scope.id = $stateParams.id;

	$scope.changeClass = function(){
   		$rootScope.bestVoteStatus = !$rootScope.bestVoteStatus;
    };

    $scope.confirmVote = function(){
    	if($rootScope.bestVoteStatus == false ){
    		$scope.showConfirm1();
    	}
    	else{
    		$scope.showConfirm2();
    	}
    };

	$scope.showConfirm1 = function() {
	   var confirmPopup = $ionicPopup.confirm({
	     		title: 'Vote this Application',
	     		template: 'Are you sure you want to vote?'
	   });
	   confirmPopup.then(function(res) {
	     if(res) {
	   		$scope.changeClass();
	     }
	   });
 	};

 	$scope.showConfirm2 = function() {
	   var confirmPopup = $ionicPopup.confirm({
	     		title: 'Vote this Application',
	     		template: 'Are you sure '
	   });
	   confirmPopup.then(function(res) {
	     if(res) {
	   		$scope.changeClass();
	     }
	   });
 	};
});