project40.factory("LoginDataOp", ['$http', function($http, $httpParamSerializer,$rootScope) {

	var LoginDataOp = {};
	
	
	
	LoginDataOp.login = function(user,encoded){
		return $http({
			method: 'POST',
			url: 'oauth/token',
			data:user,
			headers: { 
				'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
				'Authorization':'Basic '+encoded
			}
		
		
		})
	}
	
	
	
	LoginDataOp.getUser = function(id){
		return $http({
			method: 'GET',
			url: 'User/'+id,
			headers: { 'Content-Type': 'application/json; charset=UTF-8'}
		})
	}
	return LoginDataOp;
}]);