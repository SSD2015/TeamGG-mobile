angular.module('starter.controllers', [])
.constant('SERVER', 'http://gg.whs.in.th/api/')
.controller('BaseCtrl', function($http, SERVER, $rootScope){
	$http.get(SERVER + "auth/check").success(function(data){
		if(data && data.username){
			$rootScope.user = data;
		}
	});
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