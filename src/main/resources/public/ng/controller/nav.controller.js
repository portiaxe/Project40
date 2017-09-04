project40.controller('NavigationController',function($state,$scope,$rootScope,AuthService,TOKEN){
	
	var vm = this;
	
	$scope.isLogged = function(){
		return AuthService.authenticated;
	}
	
	$scope.user = {
			username: AuthService.username,
			roles: AuthService.roles
	}
	console.log($scope.user);
	
});
