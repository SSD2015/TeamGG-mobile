angular.module('starter.controllers', [])
.controller('LoginCtrl', function($state, $stateParams, $rootScope, $scope, $ionicPopup){
	$scope.username = "";
	$scope.submit = function(){
		$rootScope.username = $scope.username;
		$rootScope.bestVoteStatus = false;
		$state.go("base.projectlist");
	};
	$scope.showAlert1 = function() {
	   var alertPopup = $ionicPopup.alert({
	     title: 'Login as Guest',
	     template: 'You can only watch the application'
	   });
	   alertPopup.then(function(res) {
	     $rootScope.username = "Guest";
	     $rootScope.bestVoteStatus = false;
	     $state.go("base.projectlist");
	   });
	};

	$scope.showAlert2 = function(){
		var alertPopup = $ionicPopup.alert({
			title: "Please Enter Username",
		});
	} 
})

.controller('ProjectListCtrl', function( $state, $stateParams, $scope, $rootScope ){
	if( $rootScope.username == "" || $rootScope.username == "Guest"){
		$rootScope.username = "Guest"
		$scope.tagName = "Sign In";
	}
	else{
		$scope.tagName  = "Log Out";
	}
	$scope.logout = function(){
		$state.go("base.login");
	}
	$scope.in_out = function(){
		if( $rootScope.username == "Guest" ){
			$state.go("base.login");
		}	
		else{
			$scope.logout();
		}
	}
})

.controller('ProjectInfoCtrl', function($stateParams, $scope, $ionicPopup, $rootScope){
	$scope.id = $stateParams.id;
	$scope.isBestVoted = false; //Should be read from database

	$scope.changeClass = function(){
   		$scope.isBestVoted = !$scope.isBestVoted;
    };

    $scope.confirmVote = function(){
    	if( $scope.isBestVoted == false && $rootScope.bestVoteStatus == false ){
    		$scope.showConfirm1();
    	}
    	else if( $scope.isBestVoted == false && $rootScope.bestVoteStatus == true ){
    		$scope.showConfirm2();

    	}
    	else{
    		$scope.showConfirm3();
    	}
    };

    //false false
	$scope.showConfirm1 = function() {
	   var confirmPopup = $ionicPopup.confirm({
	     		title: 'Vote this Application',
	     		template: 'Are you sure you want to vote?'
	   });
	   confirmPopup.then(function(res) {
	     if(res) {
	   		$scope.changeClass();
	   		$rootScope.bestVoteStatus = true;
	     }
	   });
 	};

 	$scope.showConfirm2 = function() {
	   var confirmPopup = $ionicPopup.confirm({
	     		title: 'Vote this Application',
	     		template: 'Are you sure you want to change vote from ... to ... '
	   });
	   confirmPopup.then(function(res) {
	     if(res) {
	   		$scope.changeClass();
	     }
	   });
 	};

 	$scope.showConfirm3 = function() {
	   var confirmPopup = $ionicPopup.confirm({
	     		title: 'Cancel vote  this Application',
	     		template: 'Are you sure you want to cancel '
	   });
	   confirmPopup.then(function(res) {
	     if(res) {
	   		$scope.changeClass();
	   		$rootScope.bestVoteStatus = false;
	     }
	   });
 	};
});