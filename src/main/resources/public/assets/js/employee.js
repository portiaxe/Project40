var employee = angular.module('app', ['shared']);
employee
	.config(['$stateProvider', function($stateProvider){
		$stateProvider
			.state('main', {
				url: '/',
				views: {
					'': {
						templateUrl: '/app/shared/views/main.view.html',
						controller: 'mainViewController as mainVm',
					},
					'content-container@main': {
						templateUrl: '/app/shared/views/content-container.view.html',
						controller: 'homeContentContainerController as vm',
					},
					'toolbar@main': {
						templateUrl: '/app/shared/templates/toolbar.template.html',
						controller: 'homeToolbarController as vm',
					},
					'form@main': {
						templateUrl: '/app/employee/templates/content/task-form.template.html',
						controller: 'taskFormController as vm',
					},
					'content@main':{
						templateUrl: '/app/employee/templates/content/home-content.template.html',
					}
				},
				resolve: {
					authentication: ['MaterialDesign', 'User', '$state', function(MaterialDesign, User, $state){
						return User.get()
							.then(function(response){
								User.set('user', response.data);
							}, function(){
								$state.go('page-not-found');
							});
					}],
				},
			})
	}]);

employee
	.factory('taskFormService', ['$http', 'MaterialDesign', 'Task', function($http, MaterialDesign, Task){
		var factory = {}

		// object for new task
		factory.new = {}

		factory.store = function(){
			return $http.post('/task', factory.new);
		}

		factory.update = function(){
			return $http.put('/task/' + factory.data.id, factory.data);
		}

		// set new stored task as current task pinned at top
		factory.setCurrent = function(data){
			Task.formatData(data);
			Task.current = data;
		}

		// object for update
		factory.set = function(data){
			factory.data = data;
		}

		factory.setNumberofPhotos = function(data){
			factory.numberOfPhotos = data;
		}

		factory.changeNumberOfPhotos = function(data){
			if(data.number_of_photos)
			{
				factory.setNumberofPhotos(data.number_of_photos);

				data.number_of_photos = null;
			}
			else{
				data.number_of_photos = factory.numberOfPhotos;
			}
		}

		factory.init = function(){
			factory.data = {};
			factory.new = {};
			factory.numberOfPhotos = null;
		}

		return factory;
	}]);
employee
	.controller('editTaskDialogController', ['MaterialDesign', 'taskFormService', 'formService', 'Account', 'User', '$filter', function(MaterialDesign, taskFormService, formService, Account, User, $filter){
		var vm = this;

		vm.task = taskFormService;
		vm.account = Account;
		vm.user = User;

		vm.department = vm.user.user.department.name;

		// determines the user if he can use batch tasks
		vm.setAccount = function(id){
			var account = $filter('filter')(vm.account.data, {id:id})[0];

			vm.batchable = account.batchable;

			if(!vm.batchable)
			{
				vm.task.data.number_of_photos = null;
			}
		}

		// determines the user if he can use batch tasks
		if(vm.task.data.number_of_photos)
		{
			vm.batch = true;
		}
		
		// fetch the accounts associated with the user
		vm.accounts = function(){
			var query = {
				where: [
					{
						column: 'department_id',
						condition: '=',
						value: vm.user.user.department_id,
					}
				],
			}

			return vm.account.enlist(query)
				.then(function(data){
					return vm.account.data = data.data;
				}, function(){
					Helper.error();
				});
		}

		vm.cancel = function(){
			vm.task.init();
			formService.cancel();
		}

		vm.submit = function(){
			// check form fields for errors, returns true if there are errors
			var formHasError = formService.validate(vm.taskForm);

			if(formHasError)
			{
				return;
			}
			else
			{
				vm.busy = true;

				vm.task.update()
					.then(function(response){
						vm.busy = false;

						MaterialDesign.notify('Changes saved.');
						
						MaterialDesign.hide();

						vm.task.init();
					}, function(){
						vm.busy = false;
						MaterialDesign.error();
					})
			}
		}

		vm.init = function(){
			vm.accounts()
				.then(function(){
					vm.setAccount(vm.task.data.account_id);
				});
		}();
	}]);
employee
	.controller('homeContentContainerController', ['MaterialDesign', 'toolbarService', 'Task', 'taskFormService', 'User', function(MaterialDesign, toolbarService, Task, taskFormService, User){
		var vm = this;

		vm.toolbar = toolbarService;
		vm.task = Task;
		vm.user = User;

		vm.setCurrent = function(data){
			if(data)
			{
				vm.task.formatData(data);

				if(data.pauses.length)
				{
					vm.paused = true;

					angular.forEach(data.pauses, function(item){
						vm.task.formatData(item);
					});
				}

				vm.task.current = data;
			}
		}

		vm.pause = function(){
			vm.task.pause()
				.then(function(response){
					vm.paused = true;

					vm.setCurrent(response.data);

					MaterialDesign.notify('Paused');
				}, function(){
					MaterialDesign.error();
				})
		}

		vm.resume = function(){
			vm.task.resume()
				.then(function(response){
					vm.paused = false;

					vm.setCurrent(response.data);
					
					MaterialDesign.notify('Resumed');
				}, function(){
					MaterialDesign.error();
				})
		}		

		// submit current task as finished
		vm.finish = function(){
			var dialog = {
				title: 'Finish Task',
				message: 'Are you sure you want to finsih this task? This action cannot be undone.',
				ok: 'Finish',
				cancel: 'Cancel',
			}

			MaterialDesign.confirm(dialog)
				.then(function(){			
					MaterialDesign.preloader();

					vm.task.finish()
						.then(function(){
							MaterialDesign.hide();

							MaterialDesign.notify('Task completed.');
							// remove the task pinned at top
							vm.task.current = null;

							vm.task.init();

							vm.paused = false;
						}, function(){
							MaterialDesign.error();
						});
				})
		}

		// edit a completed task record
		vm.edit = function(data){
			var dialog = {
				templateUrl: '/app/employee/templates/dialogs/edit-task-dialog.template.html',
				controller: 'editTaskDialogController as vm', 
			}

			taskFormService.set(data);

			MaterialDesign.customDialog(dialog)
				.then(function(){
					vm.task.init();
				});
		}

		// delete a completed task record;
		// vm.delete = function(id){
		// 	var dialog = {
		// 		'title': 'Delete Task',
		// 		'message': 'This task will be deleted permanently.',
		// 		'ok': 'Delete',
		// 		'cancel': 'Cancel',
		// 	}

		// 	MaterialDesign.confirm(dialog)
		// 		.then(function(){
		// 			MaterialDesign.preloader();

		// 			vm.task.delete(id)
		// 				.then(function(){
		// 					MaterialDesign.hide();

		// 					MaterialDesign.notify('Task deleted.');

		// 					vm.task.init();
		// 				})
		// 		})
		// }

		// fetch the current task to be pinned at top
		vm.currentTask = function(){
			var query = {
				relationships: ['account'],
				relationshipsWithConstraints: [
					{
						relationship: 'pauses',
						whereNull: ['ended_at'],
						orderBy: [
							{
								column: 'created_at',
								order: 'desc',
							},
						],
					}
				],
				whereNull: ['ended_at'],
				where: [
					{
						column: 'user_id',
						condition: '=',
						value: vm.user.user.id,
					}
				],
				first: true,
			}

			vm.task.enlist(query)
				.then(function(response){
					vm.setCurrent(response.data);
				}, function(){
					MaterialDesign.failed()
						.then(function(){
							vm.currentTask();
						})
				})
		}

		vm.task.query = {
			relationships: ['account'],
			whereNotNull: ['ended_at'],
			where: [
				{
					column: 'user_id',
					condition: '=',
					value: vm.user.user.id,
				}
			],
			orderBy: [
				{
					'column': 'created_at',
					'order': 'desc',
				},
			],
			paginate: 20,
		}

		// fetch completed tasks
		vm.completedTasks = function(){
			vm.task.enlist(vm.task.query)
				.then(function(response){
					vm.nextPage = 2;
					
					vm.pagination = response.data

					vm.task.data = response.data.data;

					// show the data and stops preloader
					vm.show = true;
					vm.isLoading = false;

					// iterate every item to format and push to autocomplete
					if(vm.task.data.length){
						angular.forEach(vm.task.data, function(item){
							vm.task.formatData(item);
							vm.task.setToolbarItems(item);
						});
					}

					// pagination call
					vm.loadNextPage = function(){
						// kills the function if request is busy or pagination reaches last page
						if(vm.busy || (vm.nextPage > vm.pagination.last_page)){
							vm.isLoading = false;
							return;
						}
						// disable pagination call if previous request is still busy.
						vm.busy = true;
						vm.isLoading = true;

						// Calls the next page of pagination.
						vm.task.paginate(vm.task.query, vm.nextPage)
							.then(function(response){
								// sets the next page
								vm.nextPage++;

								// iterate every item to format and push to autocomplete
								angular.forEach(response.data.data, function(item){
									vm.task.formatData(item);
									vm.task.pushItem(item);
									vm.task.setToolbarItems(item);
								});
								
								// Enables again the pagination call for next call.
								vm.busy = false;
								vm.isLoading = false;	
							}, function(){
								vm.loadNextPage();
							});
					}
				}, function(){
					MaterialDesign.failed()
						.then(function(){
							vm.completedTasks();
						})
				});
		}

		vm.task.init = function(){
			// shows preloader
			vm.show = false;
			vm.isLoading = true;

			vm.toolbar.clearItems();
			vm.currentTask();
			vm.completedTasks();
		}

		vm.task.init();
	}]);
employee
	.controller('taskFormController', ['MaterialDesign', 'taskFormService', 'formService', 'User', 'Account',  function(MaterialDesign, taskFormService, formService, User, Account){
		var vm = this;

		vm.task = taskFormService;
		vm.account = Account;
		vm.user = User;

		vm.task.new.revision = false;

		// determines the user if he can use batch tasks
		vm.setAccount = function(){
			vm.task.new.account_id = vm.task.new.account.id;

			vm.batchable = vm.task.new.account.batchable;
		}

		// fetch the accounts associated with the user
		vm.accounts = function(){
			var query = {
				where: [
					{
						column: 'department_id',
						condition: '=',
						value: vm.user.user.department_id,
					}
				],
			}

			vm.account.enlist(query)
				.then(function(data){
					vm.account.data = data.data;
				}, function(){
					Helper.failed()
						.then(function(){
							vm.accounts();
						});
				});
		}

		// submit the form
		vm.submit = function(){
			// check every fields in the form for errors
			var formHasError = formService.validate(vm.form);

			if(formHasError)
			{
				return;
			}
			else{
				vm.busy = true;

				vm.task.store()
					.then(function(response){
						vm.busy = false;

						MaterialDesign.notify('Task created.');
						// set the new task as current task pinned at top
						vm.task.setCurrent(response.data);
						// reset the task object
						vm.task.init();
					}, function(){
						vm.busy = false;
						MaterialDesign.error();
					})
			}
		}

		/**
		 *
		*/
		vm.init = function(){
			vm.accounts();
		}();
	}]);

employee
	.controller('homeToolbarController', ['MaterialDesign', 'toolbarService', 'Task', function(MaterialDesign, toolbarService, Task){
		var vm = this;

		vm.toolbar = toolbarService;
		vm.toolbar.content = Task;

		vm.toolbar.parentState = null; //string
		vm.toolbar.childState = 'Home'; //string

		vm.toolbar.hideSearchIcon = false; //bool - true if deeper search icon should be hidden
		vm.toolbar.searchAll = true; // bool - true if a deeper search can be executed

		vm.toolbar.options = true; //bool - true if a menu button is needed in the view
		vm.toolbar.showInactive = false; //bool - true if user wants to view deleted records

		// Sort options
		vm.sort = [
			{
				'label': 'Recently added',
				'type': 'created_at',
				'sortReverse': false,
			},
		];
	}]);