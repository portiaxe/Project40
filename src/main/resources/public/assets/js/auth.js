var auth = angular.module('auth', ['ngMaterial', 'ngMessages',]);
auth
	.config(['$mdThemingProvider', function($mdThemingProvider){
		/*
		 * Set the default theme to Indigo - Amber.
		 */
		$mdThemingProvider.theme('default')
			.primaryPalette('indigo')
			.accentPalette('amber')
	}]);
auth
	.controller('formController',  function(){
		var vm = this;

		/*
		 * Reveals the form. 
		*/
		vm.show = function(){
			angular.element(document.querySelector('#main')).removeClass('no-opacity');
		};
	});