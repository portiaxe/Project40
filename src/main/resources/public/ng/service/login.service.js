project40.factory("LoginDataOp", ['$http', function($http, $httpParamSerializer,$rootScope) {

	var LoginDataOp = {};
	
	encoded = btoa("project40_clients:Ksw3+Bu8ip%K^8re;v<R");
	
	
//	LoginDataOp.login = function(user,token){
//			
//		
//		return $http({
//			method: 'POST',
//			url: 'oauth/token',
//			data:user,
//			headers: { 
//				'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
//				'Authorization':'Basic cHJvamVjdDQwX2NsaWVudHM6S3N3MytCdThpcCVLXjhyZTt2PFI='
//			}
//		
//		
//		})
//	}
	
	
	
	LoginDataOp.getUser = function(id){
		return $http({
			method: 'GET',
			url: 'User/'+id,
			headers: { 'Content-Type': 'application/json; charset=UTF-8'}
		})
	}
	return LoginDataOp;
}]);