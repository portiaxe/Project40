project40.factory("AuthService", ['$http', function($http,$rootScope) {
	var AuthService ={
		username:undefined,
		authenticated: false,
		roles:[],
		authenticate: function(){
			return $http({
				method: 'POST',
				dataType:'json',
				data:
					{
						grant_type:"client_credentials",
						user: "Jerico",
						password: "1233"
					},
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
