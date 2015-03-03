// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers'])

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  // setup an abstract state for the tabs directive
  .state('base', {
    abstract: true,
    template: '<ion-nav-view />',
    controller: 'BaseCtrl',
    resolve: {
      'waitReady': function($ionicPlatform, $q){
        var promise = $q.defer();
        $ionicPlatform.ready(function(){
          promise.resolve();
        });
        return promise.promise;
      }
    }
  })
  .state('base.login', {
    url: '/',
    templateUrl: 'templates/login.html',
    controller: 'LoginCtrl',
    cache: false
  })
  .state('base.projectlist', {
    abstract: true,
    controller: 'ProjectListCtrl',
    template: '<ion-nav-view />',
  })
  .state('base.projectlist.view', {
    url: '/project',
    templateUrl: 'templates/projects.html',
    controller: 'ProjectListViewCtrl',
  })
  .state('base.projectlist.project', {
    url: '/{id}',
    views: {
      '@base.projectlist': {
        templateUrl: 'templates/projectinfo.html',
        controller: 'ProjectInfoCtrl'
      }
    }
  });

  $urlRouterProvider.otherwise('/');

})

.config(function($httpProvider){
  $httpProvider.defaults.withCredentials = true;
});