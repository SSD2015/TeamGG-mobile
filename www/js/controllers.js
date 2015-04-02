angular.module('starter.controllers', [])
.constant('SERVER', 'https://gg.whs.in.th/api/')
.controller('BaseCtrl', function($http, SERVER, $rootScope){
	$http.get(SERVER + "auth/check").success(function(data){
		if(data && data.username){
			$rootScope.user = data;
		}
	});
	$http.get(SERVER + "categories").success(function(data){
		$rootScope.voteCategory = {};
		// index by id
		for(var i = 0; i < data.length; i++){
			$rootScope.voteCategory[data[i].id] = data[i];
		}
	});
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
		$ionicHistory.clearCache();
		$state.go("base.projectlist.view", {}, {"location": "replace"});
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

	$scope.skip = function(){
		redirect();
	};
})

.controller('ProjectListCtrl', function($http, SERVER, $scope){
	$scope.reloadProject = function(){
		return $http.get(SERVER + "project").success(function(data){
			if(data){
				$scope.projects = data;
			}
		});
	};

	$scope.reloadProject();
})

.controller('ProjectListViewCtrl', function($scope, $http, SERVER, $rootScope, $ionicHistory, $state, $ionicPopup, $sanitize, $ionicLoading, $q){
	$scope.logout = function(){
		if(!$rootScope.user){
			$ionicHistory.nextViewOptions({
				disableBack: true,
				historyRoot: true
			});
			$state.go("base.login", {}, {"location": "replace"});
			return;
		}
		$ionicPopup.confirm({
			title: "Sign out",
			template: "You're logged in as <strong>" + $sanitize($rootScope.user.username) + "</strong><br>Do you wish to sign out?"
		}).then(function(res){
			if(!res){
				return $q.reject();
			}
			$ionicLoading.show();
			return $http.post(SERVER + "auth/logout");
		}).then(function(data){
			$ionicLoading.hide();
			delete $rootScope.user;
			$ionicHistory.nextViewOptions({
				disableBack: true,
				historyRoot: true
			});
			$state.go("base.login", {}, {"location": "replace"});
		});
	}
	$scope.projectHasBest = function(project){
		if(!$rootScope.user){
			return false;
		}
		var result = false;
		angular.forEach($rootScope.voteCategory, function(v, k){
			if(v.type == "BEST_OF" && project.vote[k]){
				result = true;
			}
		});
		return result;
	};
	$scope.voteFinished = function(project){
		if(!$rootScope.user){
			return false;
		}
		var result = true;
		angular.forEach($rootScope.voteCategory, function(v, k){
			if(v.type != "BEST_OF" && project.vote[k] === undefined){
				result = false;
			}
		});
		return result;
	}
})

.controller('ProjectInfoCtrl', function( $state, $stateParams, $scope, $ionicPopup, $rootScope, $http, SERVER, $rootScope, $sanitize){
	$scope.id = $stateParams.id;
	$scope.voteLoad = {};
	$scope.star = [1,2,3,4,5];
	
	// used for saving vote status back
	var index = -1;

	// find cached data
	if($scope.projects !== undefined){
		for(var i = 0; i < $scope.projects.length; i++){
			if($scope.projects[i].id == $scope.id){
				$scope.project = $scope.projects[i];
				index  = i;
				break;
			}
		}
	}

	$http.get(SERVER + "project/" + $stateParams.id).success(function(data){
		$scope.project = data;
		// don't use the project vote status, it is unreliable
	});

	$scope.getVoted = function(catId){
		if($scope.projects === undefined){
			return false;
		}
		for(var i = 0; i < $scope.projects.length; i++){
			if($scope.projects[i].vote[catId] !== undefined){
				return $scope.projects[i];
			}
		}
		return false;
	};

	var vote = function(catId, score){
		$scope.voteLoad[catId] = true;
		$http.post(SERVER + "project/" + $scope.id + "/vote/" + catId, {
			category: catId,
			score : score || 1
		}).then(function(data){
			$scope.project.vote[catId] = data.data;
			
			// reload project list
			return $scope.reloadProject();
		}, function(){
			$ionicPopup.alert({
				title: "Network error",
				template: "Your vote are not registered"
			});
		}).finally(function(){
			delete $scope.voteLoad[catId];
		});
	};

	$scope.bestVote = function(catId){
		var category = $rootScope.voteCategory[catId];

		if(category.type == "BEST_OF"){
			var voted = $scope.getVoted(catId);
		
			if(voted && voted.id != $scope.id){
				var confirmPopup = $ionicPopup.confirm({
					title: "Changing vote",
					template: "You have voted <strong>" + $sanitize(voted.name) + "</strong> in the category <strong>" + $sanitize(category.name) + "</strong><br>Do you want to change your vote?"
				});
				confirmPopup.then(function(res) {
					if(res) {
						vote(catId);
					}	   	
				});
			}else if(voted && voted.id == $scope.id){
				$ionicPopup.alert({
					title: "Already voted",
					template: "You\'ve already voted for this project. To change, place a vote in this category for other project."
				});
			}else{
				vote(catId);
			}
		}
	};

	$scope.starVote = function(catId, scores){
		vote(catId, scores);
	}
});