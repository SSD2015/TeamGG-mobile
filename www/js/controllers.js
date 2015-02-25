angular.module('starter.controllers', [])
.constant('SERVER', 'http://gg.whs.in.th/api/')
.controller('BaseCtrl', function($http, SERVER, $rootScope){
	$http.get(SERVER + "auth/check").success(function(data){
		if(data && data.username){
			$rootScope.user = data;
		}
	});
	$rootScope.bestVoteNum = 0;
})

.controller('LoginCtrl', function($state, $stateParams, $rootScope, $scope, $http, SERVER, $ionicPopup, $ionicLoading){
	$scope.username = "";
	$scope.password = "";

	// check for login cookie
	$ionicLoading.show();
	$http.get(SERVER + "auth/check").then(function(data){
		data = data.data;
		if(data && data.username){
			$rootScope.user = data;
			$state.go("base.projectlist", {"location": "replace"});
		}
	}, function(data){
		$ionicPopup.alert({
			title: "Cannot connect to server",
			template: "Check your internet connection"
		});
	}).finally(function(){
		$ionicLoading.hide();
	});

	$scope.submit = function(){
		$ionicLoading.show();
		$http.post(SERVER + "auth/login", {
			username: $scope.username,
			password: $scope.password
		}).then(function(data){
			$rootScope.user = data.data;
			$state.go("base.projectlist", {"location": "replace"});
		}, function(data){
			var message = "Server error";
			if(data.status === 403){
				message = "Invalid username or password";
			}
			$ionicPopup.alert({
				title: "Cannot log you in",
				template: message
			});
		}).finally(function(){
			$ionicLoading.hide();
		});
	};

	$scope.showAlert2 = function(){
		var alertPopup = $ionicPopup.alert({
			title: "Please Enter Username",
		});
	} 
})

.controller('ProjectListCtrl', function( $state, $stateParams, $scope, $rootScope ){
		
})

.controller('ProjectInfoCtrl', function($stateParams, $scope, $ionicPopup, $rootScope){
	$scope.id = $stateParams.id;
	if( $scope.id == $rootScope.bestVoteNum ){
		$scope.isBestVoted = true;
	}
	else{
		$scope.isBestVoted = false;
	}

	$scope.changeClass = function(){
   		$scope.isBestVoted = !$scope.isBestVoted;
    };

    $scope.confirmVote = function(){
    	if( $scope.isBestVoted == false && $rootScope.bestVoteNum == 0 ){
    		$scope.showConfirm1();
    	}
    	else if( $scope.isBestVoted == false && $rootScope.bestVoteNum != 0 ){
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
	   		$rootScope.bestVoteNum = $scope.id;
	   		console.log($rootScope.bestVoteNum)
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
	   		$rootScope.bestVoteNum = $scope.id;
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
	   		$rootScope.bestVoteNum = 0;
	     }
	   });
 	};
});