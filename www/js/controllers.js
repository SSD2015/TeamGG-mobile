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

.controller('LoginCtrl', function($state, $stateParams, $rootScope, $scope, $http, SERVER, $ionicPopup, $ionicLoading, $ionicHistory){
	$scope.username = "";
	$scope.password = "";

	var redirect = function(noAnimation){
		$ionicHistory.nextViewOptions({
			disableAnimate: noAnimation,
			disableBack: true,
			historyRoot: true
		});
		$state.go("base.projectlist", {}, {"location": "replace"});
	};

	// check for login cookie
	$ionicLoading.show();
	$http.get(SERVER + "auth/check").then(function(data){
		data = data.data;
		if(data && data.username){
			$rootScope.user = data;
			redirect(true);
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
			redirect();
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

.controller('ProjectListCtrl', function( $state, $stateParams, $scope, $rootScope, $http, SERVER, $ionicHistory){
	$http.get(SERVER + "project").success(function(data){
		if(data){
			$scope.projects = data;
		}
	});

	$scope.logout = function(){
		$http.post(SERVER + "auth/logout", {
			success: true
		}).success(function(data){
			$rootScope.user = data.data;
			$ionicHistory.nextViewOptions({
				disableBack: true,
				historyRoot: true
			});
			$state.go("base.login", {}, {"location": "replace"});
		});
	}
})

.controller('ProjectInfoCtrl', function( $state, $stateParams, $scope, $ionicPopup, $rootScope, $http, SERVER){
	$scope.id = $stateParams.id;

	$http.get(SERVER + "project").success(function(data1){
		if(data1){
			$scope.projects = data1;
			$scope.project = $scope.projects[$scope.id-1];
		}
		$http.get(SERVER + "categories").success(function(data2){
			if(data2){
				$scope.categories = data2;
				$scope.voteFor = [0,0];
				for( var i = 0; i < $scope.categories.length; i++ ){
					if( $scope.project.vote[i+1] ){
						$scope.voteFor[i] = $scope.project.vote[i+1].score;
					}
				}
				$scope.bestVote = function( categoryId ){
					var canVote = true;
					var votedProject = 0;
					for( var i = 0; i < $scope.projects.length; i++ ){
						console.log("check");
						if( i != ($scope.id-1) ){
							if( $scope.projects[i].vote[categoryId] ){
								canVote = false;
								votedProject = i+1;
								break;
							}
						}
					}
					if( canVote == false ){
						var confirmPopup = $ionicPopup.confirm({
							title: "You have already vote" + $scope.categories[categoryId-1].name + " in " + votedProject,
							template: "You want to change ?"
						});
						confirmPopup.then(function(res) {
					    	if(res) {
					       		$scope.voteFor[categoryId-1] = 1;
								$http.post(SERVER + "project/" + $scope.id + "/vote/" + categoryId, {
									category : categoryId,
									score : 1
								}).success(function(data3){
									$state.go($state.current, {}, {reload: true});
								});
					    	}	   	
					    });

					}
					else{
						$scope.voteFor[categoryId-1] = 1;
						$http.post(SERVER + "project/" + $scope.id + "/vote/" + categoryId, {
							category : categoryId,
							score : 1
						}).success(function(data3){
							$state.go($state.current, {}, {reload: true});
						});
					}
				}
			}
		});
	});


});