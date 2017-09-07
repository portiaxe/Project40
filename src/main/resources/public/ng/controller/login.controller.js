project40.controller('LoginController',function($state,$scope,$httpParamSerializer,$rootScope,LoginDataOp,AuthService,$localStorage){
	
	var vm = this;
	$rootScope.authenticated = false;
	
	vm.user ={
			user_name: undefined,
			user_pass: undefined
	};
	
	
	vm.logUser = function(){
		var user_data = {
		        grant_type:"client_credentials", 
		        username: vm.user.user_name, 
		        password: vm.user.user_pass
		       
			   };
		
		vm.data =$httpParamSerializer(user_data);
		
		LoginDataOp.login(vm.data,btoa(user_data.username+':Ksw3+Bu8ip%K^8re;v<R')).then(function(response){
			AuthService.token = response.data;
			//$cookies.put("access_token", data.data.access_token);
			$localStorage.token = response.data.access_token;
			$state.go("home");
		}).catch(function(error) {
			console.log(error);
		});
		
		
		
	};
	
	
	
	vm.getUser = function(id){
		LoginDataOp.getUser(id).then(function(response){
			console.log(response.data);
		}).catch(function(error) {
			console.log(error);
		});
	}
	
});