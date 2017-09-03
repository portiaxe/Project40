var admin = angular.module('app', ['shared']);
admin
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
						controller: 'dashboardContentContainerController as vm',
					},
					'toolbar@main': {
						templateUrl: '/app/shared/templates/toolbar.template.html',
						controller: 'dashboardToolbarController as vm',
					},
					'content@main':{
						templateUrl: '/app/admin/templates/content/dashboard-content.template.html',
					}
				},
				resolve: {
					authentication: ['MaterialDesign', 'User', '$state', function(MaterialDesign, User, $state){
						return User.get()
							.then(function(data){
								User.set('user', data.data);
							}, function(){
								$state.go('page-not-found');
							});
					}],
				},
			})
			.state('main.manage-users', {
				url: 'users',
				views: {
					'content-container': {
						templateUrl: '/app/shared/views/content-container.view.html',
						controller: 'accountsContentContainerController as vm',
					},
					'toolbar@main.manage-users': {
						templateUrl: '/app/shared/templates/toolbar.template.html',
						controller: 'accountsToolbarController as vm',
					},
					'content@main.manage-users':{
						templateUrl: '/app/admin/templates/content/users-content.template.html',
					},
					'form@main.manage-users': {
						templateUrl: '/app/admin/templates/content/user-form.template.html',
						controller: 'userFormController as vm'
					}
				},
			});
	}]);

admin
  .controller('accountsContentContainerController', accountsContentContainerController)

accountsContentContainerController.$inject = ['MaterialDesign', 'User', 'fab', '$q'];

function accountsContentContainerController(MaterialDesign, User, fab, $q) {
  var vm = this;

  vm.user = User;
  vm.edit = edit;
  vm.view = view;
  vm.resetPassword = resetPassword;
  vm.deleteUser = deleteUser;

  vm.fab = fab;
  vm.fab.icon = 'mdi-plus';
  vm.fab.show = true;
  vm.fab.label = 'Create User';
  vm.fab.action = function() {
    vm.user.showForm = true;
    vm.fab.show = false;
  }

  function view(user) {
    vm.user.set('view', user);
    var dialog = {
      controller: 'userFormDialogController as vm',
      templateUrl: '/app/admin/templates/dialogs/user-form-dialog.template.html',
    }

    MaterialDesign.customDialog(dialog);
  }

  function edit(user){
    vm.user.set('edit', user);
    var dialog = {
      controller: 'editUserFormDialogController as vm',
      templateUrl: '/app/admin/templates/dialogs/edit-user-form-dialog.template.html',
    }

    MaterialDesign.customDialog(dialog)
      .then(seeChanges);

    function seeChanges(){
      vm.user.get()
        .then(function(response){
          vm.user.set('user', response.data);
        })
        .catch(error);
    }
  }

  function deleteUser(user) {
    var dialog = {
      title: 'Delete',
      message: 'Delete this user account?',
      ok: 'Delete',
      cancel: 'Cancel'
    }

    MaterialDesign.confirm(dialog)
      .then(deleteRequest)
      .then(spliceUser)
      .then(notifyChanges)
      .catch(error);

    function deleteRequest(){
      MaterialDesign.preloader();
      return vm.user.delete(user.id);
    }

    function spliceUser(){
      var index = vm.user.user.subordinates.indexOf(user);
      vm.user.user.subordinates.splice(index, 1);
    }

    function notifyChanges(){
      MaterialDesign.hide();
      MaterialDesign.notify('User deleted.');
    }
  }

  function resetPassword(user) {
    var dialog = {
      title: 'Reset Password',
      message: 'Password will be set as !welcome10',
      ok: 'Reset Password',
      cancel: 'Cancel'
    }

    MaterialDesign.confirm(dialog)
      .then(function(){
        return vm.user.resetPassword(user);
      })
      .then(function(){
        MaterialDesign.notify('Changes saved.');
      })
      .catch(error);
  }

  function error(){
    return MaterialDesign.error();
  }
}

admin
	.controller('dashboardContentContainerController', ['MaterialDesign','toolbarService', 'ShiftSchedule', 'Task', 'User', 'Chart', function(MaterialDesign, toolbarService, ShiftSchedule, Task, User, Chart){
		var vm = this;

		vm.toolbar = toolbarService;
		vm.task = Task;
		vm.user = User;
		vm.chart = Chart;

		vm.dashboard = dashboard;
		vm.init = init;

		vm.init();

		function dashboard(){
			return vm.task.dashboard()
				.then(function(response){
					vm.isLoading = false;
					// data per project then set data to charts
					vm.task.data = response.data;

					if(vm.task.data.length)
					{
						angular.forEach(vm.task.data, function(item){
							setToolbarItem(item);
						});
					}

					return vm.task.data;
				})
				.catch(error);
		}

		function setToolbarItem(item)
		{
			var entry = {}

			entry.display = item.name;

			toolbarService.items.push(entry);
		}


		function error(){
			return MaterialDesign.failed()
				.then(function(){
					dashboard();
				})
				.catch(error);
		}

		function init (){
			vm.dashboard();
			vm.isLoading = true;
		};
	}]);
admin
	.controller('calendarDialogController', ['MaterialDesign', 'ShiftSchedule', 'formService', 'Task', function(MaterialDesign, ShiftSchedule, formService, Task){
		var vm = this;

		vm.label = 'Go to date';

		vm.data = {}

		vm.cancel = function(){
			formService.cancel();
		}

		vm.toLocaleTimeString = function(){
			vm.data.timeStart = vm.data.timeStart.toLocaleTimeString();
			vm.data.timeEnd = vm.data.timeEnd.toLocaleTimeString();
		}

		vm.toDateString = function(){
			vm.data.dateShift = vm.data.dateShift.toDateString();
		}

		vm.toDateObject = function(){
			var today = new Date();

			vm.data.timeStart = new Date(today.toDateString() + ' ' + vm.data.timeStart);
			vm.data.timeEnd = new Date(today.toDateString() + ' ' + vm.data.timeEnd);
			vm.data.dateShift = new Date(vm.data.dateShift);
		}

		vm.data.dateShift = new Date();

		vm.data.timeStart = formService.timeFormat(new Date());
		vm.data.timeEnd = formService.timeFormat(new Date());

		vm.submit = function(){
			// check form fields for errors, returns true if there are errors
			var formHasError = formService.validate(vm.form);

			if(formHasError)
			{
				return;
			}
			else
			{
				vm.busy = true;

				vm.toLocaleTimeString();
				vm.toDateString();
			
				Task.dashboard(vm.data)
					.then(function(response){
						Task.data = response.data;

						MaterialDesign.hide();
					}, function(){
						MaterialDesign.error();
					});
			}
		}
	}]);
admin
	.controller('downloadDialogController', ['Department', 'User', 'MaterialDesign', 'formService', '$window', function(Department, User, MaterialDesign, formService, $window){
		var vm = this;

		vm.department = Department;
		vm.user = User;
		vm.label = 'Download';

		vm.data = {};

		vm.init = init;

		function init() {
			return vm.department.index()
				.then(function(response){
					vm.department.data = response.data;
				})
				.catch(function(){
					MaterialDesign.error();
				});
		}

		vm.cancel = function(){
			formService.cancel();
		}

		vm.toLocaleTimeString = function(){
			vm.data.time_start = vm.data.time_start.toLocaleTimeString();
			vm.data.time_end = vm.data.time_end.toLocaleTimeString();
		}

		vm.toDateString = function(){
			vm.data.date_start = vm.data.date_start.toDateString();
			vm.data.date_end = vm.data.date_end.toDateString();
		}

		vm.toDateObject = function(){
			var today = new Date();

			vm.data.time_start = new Date(today.toDateString() + ' ' + vm.data.time_start);
			vm.data.time_end = new Date(today.toDateString() + ' ' + vm.data.time_end);
			vm.data.date_start = new Date(vm.data.date_start);
			vm.data.date_end = new Date(vm.data.date_end);
		}

		vm.data.date_start = new Date();
		vm.data.date_end = new Date();

		vm.data.time_start = formService.timeFormat(new Date());
		vm.data.time_end = formService.timeFormat(new Date());

		
		vm.submit = function(){
			// check form fields for errors, returns true if there are errors
			var formHasError = formService.validate(vm.form);

			if(formHasError)
			{
				return;
			}
			else
			{
				vm.busy = true;

				vm.toLocaleTimeString();
				vm.toDateString();
			
				$window.open('/task/download/' + vm.data.date_start + '/to/' + vm.data.date_end + '/at/' + vm.data.time_start + '/until/' + vm.data.time_end + '/department/' + vm.data.department_id, '_blank');

				MaterialDesign.hide();
			}
		}

		vm.init();
	}]);
admin
  .controller('editUserFormDialogController', editUserFormDialogController)

  userFormController.$inject = ['MaterialDesign', 'User', 'Position', 'Experience', 'formService', '$filter'];

  function editUserFormDialogController(MaterialDesign, User, Position, Experience, formService, $filter) {
    var vm = this;

    vm.label = 'Edit user';

    vm.user = User;
    vm.edit = vm.user.clone('edit');
    vm.edit.experiences = [];

    vm.checkEmployeeNumber = checkEmployeeNumber;
    vm.checkEmail = checkEmail;
    vm.checkExperiences = checkExperiences;
    vm.cancel = cancel;
    vm.submit = submit;
    init();

    function init() {
      return getPositions()
        .then(setPositions)
        .then(getExperiences)
        .then(matchExperiences)
        .catch(error);
    }

    function getPositions(){
      var query = {
        whereHas : [
          {
            relationship: 'departments',
            where: [
              {
                column: 'department_id',
                condition: '=',
                value: vm.user.user.department_id
              },
            ],
          },
        ]
      }

      return Position.enlist(query)
    }

    function setPositions(response) {
      vm.positions = response.data;
    }

    function getExperiences() {
      var query = {
        where: [
          {
            column: 'user_id',
            condition: '=',
            value: vm.edit.id,
          },
        ],
        relationships: ['position'],
      }

      return Experience.enlist(query);
    }

    function matchExperiences(response) {
      angular.copy(vm.positions, vm.edit.experiences);

      angular.forEach(response.data, function(experience){
          experience.date_started = new Date(experience.date_started);
          experience.selected = true;

          var position = $filter('filter')(vm.positions, {id: experience.position_id});

          if(position)
          {
            var index = vm.positions.indexOf(position[0]);
            vm.edit.experiences[index] = experience;
          }
      });
    }

    function checkEmployeeNumber() {
      var query = {
          where: [
            {
              column: 'employee_number',
              condition: '=',
              value: vm.edit.employee_number,
            },
          ],
          whereNotIn: [
            {
              column: 'id',
              values: [vm.edit.id],
            }
          ],
          withTrashed: true,
          first: true,
      }

      vm.user.enlist(query)
        .then(function(response){
          vm.duplicateEmployeeNumber = response.data ? true : false;
        });
    }

    function checkEmail() {
      var query = {
          where: [
            {
              column: 'email',
              condition: '=',
              value: vm.edit.email,
            },
          ],
          whereNotIn: [
            {
              column: 'id',
              values: [vm.edit.id],
            }
          ],
          withTrashed: true,
          first: true,
      }

      vm.user.enlist(query)
        .then(function(response){
          vm.duplicateEmail = response.data ? true : false;
        });
    }

    function checkExperiences() {
      vm.hasExperience = false;
      angular.forEach(vm.edit.experiences, function(experience){
        if(experience.selected)
        {
          vm.hasExperience = true;
        }
      });
    }

    function cancel() {
      MaterialDesign.cancel();
    }

    function submit()
    {
      vm.showErrors = true;
      // check every fields in the form for errors
			var formHasError = formService.validate(vm.form);

			if(formHasError || vm.duplicateEmail || vm.duplicateEmployeeNumber || !vm.hasExperience)
			{
				return;
			}
			else{
				vm.busy = true;

        convertDatesToString();

				vm.user.update(vm.edit)
					.then(function(){
						vm.busy = false;
						MaterialDesign.notify('Changes saved.');
            MaterialDesign.hide();
					})
          .catch(error);
			}
    }

    function convertDatesToString(){
      angular.forEach(vm.edit.experiences, function(experience){
        if(experience.selected)
        {
          experience.date_started = experience.date_started.toDateString();
        }
      });
    }

    function revertDatesToObject(){
      angular.forEach(vm.edit.experiences, function(experience){
        if(experience.selected)
        {
          experience.date_started = new Date(experience.date_started);
        }
      });
    }

    function error() {
      MaterialDesign.reject();
      vm.busy = false;
      vm.error = true;
    }

  }

admin
	.controller('settingsDialogController', ['MaterialDesign', 'ShiftSchedule', 'formService', function(MaterialDesign, ShiftSchedule, formService){
		var vm = this;

		vm.label = 'Settings';

		vm.shiftSchedule = ShiftSchedule;

		vm.cancel = function(){
			formService.cancel();
		}

		vm.submit = function(){
			// check form fields for errors, returns true if there are errors
			var formHasError = formService.validate(vm.form);

			if(formHasError)
			{
				return;
			}
			else
			{
				vm.busy = true;

				vm.shiftSchedule.toLocaleTimeString();

				var error = function(){
					vm.shiftSchedule.toDateObject();

					vm.busy = false;
					MaterialDesign.error();
				}

				if(vm.new)
				{
					vm.shiftSchedule.store()
						.then(function(response){
							vm.busy = false;

							MaterialDesign.notify('Shift schedule saved.');
							
							MaterialDesign.hide();
						}, function(){
							error();
						});
				}
				else{				
					vm.shiftSchedule.update()
						.then(function(response){
							vm.busy = false;

							MaterialDesign.notify('Changes saved.');
							
							MaterialDesign.hide();
						}, function(){
							error();
						});
				}
			}
		}

		vm.init = function(){
			vm.shiftSchedule.index()
				.then(function(response){
					if(response.data)
					{
						vm.shiftSchedule.data = response.data;

						vm.shiftSchedule.toDateObject();
					}
					else{
						vm.new = true;

						vm.shiftSchedule.init();
					}
				}, function(){
					MaterialDesign.error();
				});
		}();
	}]);
admin
  .controller('userFormDialogController', userFormDialogController)

  userFormController.$inject = ['MaterialDesign', 'User', 'formService'];

  function userFormDialogController(MaterialDesign, User, formService) {
    var vm = this;

    vm.label = User.view.name;
    vm.cancel = cancel;
    init();

    function cancel() {
      MaterialDesign.hide();
    }

    function init(){
      var query = {
        where: [
          {
            column: 'id',
            condition: '=',
            value: User.view.id,
          }
        ],
        relationships: ['experiences.position'],
        first: true,
      }

      User.enlist(query)
        .then(function(response){
          vm.user = response.data;

          angular.forEach(vm.user.experiences, function(experience){
            experience.date_started = new Date(experience.date_started);
          });
        })
        .catch(function(){
          MaterialDesign.error();
        });
    }
  }

admin
	.controller('accountsToolbarController', ['MaterialDesign', 'toolbarService', 'User', '$state', function(MaterialDesign, toolbarService, User, $state){
		var vm = this;

		vm.toolbar = toolbarService;
		vm.toolbar.content = User;

		vm.toolbar.parentState = null; //string
		vm.toolbar.childState = 'Accounts'; //string

		vm.toolbar.hideSearchIcon = false; //bool - true if deeper search icon should be hidden
		vm.toolbar.searchAll = false; // bool - true if a deeper search can be executed

		vm.toolbar.options = false; //bool - true if a menu button is needed in the view
		vm.toolbar.showInactive = false; //bool - true if user wants to view deleted records

		vm.toolbar.state = $state.current.name;

		// Sort options
		vm.sort = [
			{
				'label': 'Recently added',
				'type': 'created_at',
				'sortReverse': false,
			},
		];
	}]);

admin
	.controller('dashboardToolbarController', ['MaterialDesign', 'toolbarService', 'Task', '$state', function(MaterialDesign, toolbarService, Task, $state){
		var vm = this;

		vm.toolbar = toolbarService;
		vm.toolbar.content = Task;

		vm.toolbar.parentState = null; //string
		vm.toolbar.childState = 'Dashboard'; //string

		vm.toolbar.hideSearchIcon = false; //bool - true if deeper search icon should be hidden
		vm.toolbar.searchAll = false; // bool - true if a deeper search can be executed

		vm.toolbar.options = false; //bool - true if a menu button is needed in the view
		vm.toolbar.showInactive = false; //bool - true if user wants to view deleted records

		vm.toolbar.state = $state.current.name;

		// Sort options
		vm.sort = [
			{
				'label': 'Recently added',
				'type': 'created_at',
				'sortReverse': false,
			},
		];
	}]);

admin
  .controller('userFormController', userFormController)

  userFormController.$inject = ['MaterialDesign', 'User', 'Position', 'formService', 'fab', '$filter'];

  function userFormController(MaterialDesign, User, Position, formService, fab, $filter) {
    var vm = this;

    vm.user = User;
    vm.user.new = {}
    vm.user.new.experiences = [];

    vm.fab = fab;

    vm.checkEmployeeNumber = checkEmployeeNumber;
    vm.checkEmail = checkEmail;
    vm.checkExperiences = checkExperiences;
    vm.focusOnForm = focusOnForm;
    vm.cancel = hideForm;
    vm.submit = submit;

    init();

    function init() {
      return getPositions().then(function(positions){
          angular.forEach(positions, function(item){
              item.position_id = item.id;
          });
          angular.copy(positions, vm.user.new.experiences);
      })
    }

    function getPositions(){
      var query = {
        whereHas : [
          {
            relationship: 'departments',
            where: [
              {
                column: 'department_id',
                condition: '=',
                value: vm.user.user.department_id
              }
            ]
          }
        ]
      }

      return Position.enlist(query)
        .then(function(response){
          return vm.positions = response.data;
        })
        .catch(error);
    }

    function checkEmployeeNumber() {
      var query = {
          where: [
            {
              column: 'employee_number',
              condition: '=',
              value: vm.user.new.employee_number,
            },
          ],
          first: true,
      }

      vm.user.enlist(query)
        .then(function(response){
          vm.duplicateEmployeeNumber = response.data ? true : false;
        });
    }

    function checkEmail() {
      var query = {
          where: [
            {
              column: 'email',
              condition: '=',
              value: vm.user.new.email,
            },
          ],
          first: true,
      }

      vm.user.enlist(query)
        .then(function(response){
          vm.duplicateEmail = response.data ? true : false;
        });
    }

    function checkExperiences() {
      vm.hasExperience = false;
      angular.forEach(vm.user.new.experiences, function(experience){
        if(experience.selected)
        {
          vm.hasExperience = true;
        }
      });
    }

    function focusOnForm()
    {
      angular.element(document).find('#newUser').addClass('md-input-focused');
      angular.element(document).find('#newUser > input').focus();
    }

    function submit()
    {
      vm.showErrors = true;
      // check every fields in the form for errors
			var formHasError = formService.validate(vm.form);

			if(formHasError || vm.duplicateEmail || vm.duplicateEmployeeNumber || !vm.hasExperience)
			{
				return;
			}
			else{
				vm.busy = true;

        convertDatesToString();

				vm.user.store()
          .then(notify)
          .then(getUser)
          .then(hideForm)
          .catch(error);
			}

      function notify() {
        vm.busy = false;
        MaterialDesign.notify('User created.');
      }

      function getUser() {
        return vm.user.get()
          .then(function(response){
            return vm.user.set('user', response.data);
          });
      }
    }

    function convertDatesToString(){
      angular.forEach(vm.user.new.experiences, function(experience){
        if(experience.selected)
        {
          experience.date_started = experience.date_started.toDateString();
        }
      });
    }

    function revertDatesToObject(){
      angular.forEach(vm.user.new.experiences, function(experience){
        if(experience.selected)
        {
          experience.date_started = new Date(experience.date_started);
        }
      });
    }

    function hideForm() {
      vm.user.showForm = false;
      vm.user.new = {};
      vm.fab.show = true;
    }

    function error() {
      vm.busy = false;
      revertDatesToObject();
      MaterialDesign.error();
    }
  }
