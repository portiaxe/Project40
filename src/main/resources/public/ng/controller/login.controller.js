project40.controller('LoginController',function($scope,$rootScope,LoginDataOp){
	
	var vm = this;
	$rootScope.authenticated = false;
	
	vm.user ={};	
	vm.logUser = function(){
		LoginDataOp.login(vm.user).then(function(response){
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
	vm.getUser(1);
	alert($rootScope.token);
	
});