var project40 = angular.module('project40',['ui.router']);

project40.constant('CSRF_TOKEN', $("meta[name='csrf-token']").attr("content"));

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
        controllerAs: 'vmLogin'
    })
    
    .state("home", {
        url: '/home',
        templateUrl: '/Project40/partials/dashboard.html',
      
    })
});
