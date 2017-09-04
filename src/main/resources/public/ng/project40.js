var project40 = angular.module('project40',['ui.router']);

project40.constant('TOKEN',$("meta[name='csrf-token']").attr("content"));


project40.config(function($stateProvider, $urlRouterProvider, $locationProvider) {
    $urlRouterProvider.otherwise('/');
    $stateProvider
    .
    state("landing", {
        url: '/',
        templateUrl: '/Project40/partials/landing.html',
        controller: 'LandingController',
        controllerAs: 'vmLanding'
    })
    
    .state("login", {
        url: '/login',
        templateUrl: '/Project40/partials/login.html',
        controller: 'LoginController',
        controllerAs: 'vmLogin',
        resolve: {
            canLogin : ['$q', 'AuthService', function ($q, AuthService) {
                var deferred = $q.defer();

                if (AuthService.authenticated) {
                    deferred.reject();
                }
                else {
                    deferred.resolve();
                }

                return deferred.promise;
            }]
      }
    })
    
    .state("home", {
        url: '/home',
        templateUrl: '/Project40/partials/dashboard.html',
      
    })
});
