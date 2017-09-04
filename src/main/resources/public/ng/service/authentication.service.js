project40.factory("AuthService", ['$http', function($http,$rootScope) {
	var AuthService ={
		username:undefined,
		authenticated: false,
		roles:[],
	}
	return AuthService;
}]);
