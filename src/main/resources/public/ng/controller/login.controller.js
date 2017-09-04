project40.controller('LoginController',function($state,$scope,$httpParamSerializer,$rootScope,LoginDataOp,AuthService,TOKEN){
	
	var vm = this;
	$rootScope.authenticated = false;
	console.log(AuthService.authenticated+" aasadff");
	
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
		
		vm.user =$httpParamSerializer(user_data);
		
		LoginDataOp.login(vm.user,TOKEN).then(function(response){
//			AuthService.authenticated = true;
//			AuthService.username ='Jerico Grijaldo';
//			AuthService.roles=['Admin','Department Head'];
//			$state.go("home");
			console.log(response.data);
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