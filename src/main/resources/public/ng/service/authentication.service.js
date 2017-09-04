project40.factory("AuthService", ['$http', function($http,$rootScope) {
	var AuthService ={
		username:undefined,
		authenticated: false,
		roles:[],
		getToken: function(){
			return $http({
				method: 'POST',
				dataType:'json',
				data:{grant_type:"client_credentials"},
				url: 'oauth/token',
				headers: { 
					'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
					'Authorization':'Basic cHJvamVjdDQwX2NsaWVudHM6S3N3MytCdThpcCVLXjhyZTt2PFI='
				}
			
			})
		}
		
	}
	return AuthService;
}]);
