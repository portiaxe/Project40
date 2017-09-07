var project40 = angular.module('project40',['ui.router','ngStorage']);

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

angular.module('project40').run(function ($state,$localStorage) {

	var token = $localStorage.token;
	if(token!== undefined){
		$state.go('home');
	}
  });


 //directive for pressing enter
angular.module('project40').directive('ngEnter', function () {
     return function (scope, element, attrs) {
         element.bind("keydown keypress", function (event) {
             if(event.which === 13) {
                 scope.$apply(function (){
                     scope.$eval(attrs.ngEnter);
                 });

                 event.preventDefault();
             }
         });
     };
 });
