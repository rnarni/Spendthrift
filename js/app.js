(function(){
var app = angular.module('syncBudget',['ui.router',
    'angular-google-gapi','ui.bootstrap','ngTouch','ngAnimate']);


	app.config(['$stateProvider','$urlRouterProvider',
        function($stateProvider) {


            $stateProvider

                .state('addCategories', {
                    url :'/addCategories',
                    templateUrl: 'templates/addCategories.html'
                })

                .state('addExpense', {
                    url :'/addExpense',
                    templateUrl: 'templates/addExpense.html',
                    controller: 'addExpenseController'
                })

                .state('showCategories', {
                    url :'/showCategories',
                    templateUrl: 'templates/showCategories.html',
                    controller: 'showCategoriesController'
                })

                .state('showGraphs', {
                    url :'/showGraphs',
                    templateUrl: 'templates/showGraphs.html',
                    controller: 'showGraphsController'
                           
                })

                .state('showExpensesByCategory', {
                    url :'/showGraphsByCategories',
                    templateUrl: 'templates/showGraphsByCategories.html',
                    controller: 'showGraphsByCategoriesCtrl'
                           
                        
                })

                 .state('showGraphsByTags', {
                    url :'/showGraphsByTags',
                    templateUrl: 'templates/showGraphsByTags.html',
                    controller: 'showGraphsByTagsCtrl'
                            
                })

                .state('showExpenses', {
                    url :'/showExpenses',
                    templateUrl: 'templates/showExpenses.html',
                    controller: 'showExpensesController'
                                  
                })

                 .state('showExpensesByTags', {
                    url :'/showExpensesByTags',
                    templateUrl: 'templates/showExpensesByTags.html',
                    controller: 'showExpensesByTagsController'
                           
                })

                .state('contact', {
                    url: '/contact',
                    templateUrl: "templates/contact.html",
                 })

                .state('blog', {
                    url: '/blog',
                    templateUrl: "templates/blog.html"
                 })

                .state('reset', {
                    url: '/reset',
                    templateUrl: "templates/reset.html"
                 })

                 .state('home', {
                    url :'/',
                    templateUrl: 'index.html'        
                })

    }])
	

	//Custom directive
	app.directive('tree', function(){

		return {
			restrict: "E",
			replace: true,
			scope: {
				tree: '='
			},
			template: "<ul class='list-group'><leaf ng-repeat='leaf in tree' leaf='leaf'></leaf></ul>"
		}


	});

	app.directive('leaf', function($compile){
		return {
			restrict: "E",
			replace: true,
			scope: {
				leaf: '='
			},
			template: "<li class='list-group-item'><i class='fa fa-{{leaf.iconName}}'></i>&nbsp{{leaf.get('name')}}</li>",
			link: function (scope, element, attrs){
				if(angular.isObject(scope.leaf.nodes)){
					element.append("<tree tree='leaf.nodes'></tree>");
					$compile(element.contents())(scope)
				}
			}

		}


	});



app.run(['GAuth', 'GApi', '$state', '$rootScope', '$window',
    function(GAuth, GApi, $state, $rootScope, $window) {

        var CLIENT = '61174966610-kji5jrqnaudt5pokuv45r1vd358nkr1p.apps.googleusercontent.com';
        var BASE;
        if($window.location.hostname == 'localhost') {
            BASE = '//localhost:8080/_ah/api';
        } else {
            BASE = 'https://cloud-endpoints-gae.appspot.com/_ah/api';
        }

       // GApi.load('myContactApi', 'v2', BASE);
        GApi.load('drive', 'v2');
        GAuth.setClient(CLIENT);
        GAuth.setScope('https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/drive');
        GAuth.checkAuth().then(
            function () {
                   $rootScope.isGoogleAuthenticated=true;
            },
            function() {
                 $rootScope.isGoogleAuthenticated=false;
            }
        );
        $rootScope.doLogin=function() {
            GAuth.login().then(function(){
            	$rootScope.isGoogleAuthenticated=true;
            	GApi.createNewFolder();
            });
        };

        $rootScope.logout = function() {
            GAuth.logout().then(
            function () {
            	$rootScope.isGoogleAuthenticated=false;
                $state.go('login');
            });
        };
        $('.side-nav>li>a').click(function(event){
			 $('ul .in').collapse("hide");	
		});

    }
]);







	//Google Intialization is done here
	// app.run(function($rootScope) {

	// 	var CLIENT_ID = '61174966610-kji5jrqnaudt5pokuv45r1vd358nkr1p.apps.googleusercontent.com';
	// 	var SCOPES = 'https://www.googleapis.com/auth/drive';
	// 	var MAIN_APP_FOLDER_ID = 0;
	// 	var isAuthenticated
	// 	$rootScope.isGoogleAuthenticated=true;
	// 	/**
	// 	 * Called when the client library is loaded to start the auth flow.
	// 	 */
	// 	$rootScope.handleClientLoad = function() {
	// 		window.setTimeout($rootScope.checkAuth, 1);
	// 	};

	// 	/**
	// 	 * Check if the current user has authorized the application.
	// 	 */
	// 	$rootScope.checkAuth  = function() {
	// 		gapi.auth.authorize(
	// 			{'client_id': CLIENT_ID, 'scope': SCOPES, 'immediate': false},
	// 			$rootScope.handleAuthResult);
	// 	};

	// 	/**
	// 	 * Called when authorization server replies.
	// 	 *
	// 	 * @param {Object} authResult Authorization result.
	// 	 */
	// 	$rootScope.handleAuthResult = function(authResult){
	// 		var authButton = document.getElementById('connectGoogle');
	// 		authButton.style.display = 'none';
	// 		if (authResult && !authResult.error) {
	// 			// Access token has been successfully retrieved, requests can be sent to the API.
	// 			$rootScope.isGoogleAuthenticated = true;
	// 			console.log("Google authenticated:"+$rootScope.isGoogleAuthenticated);
	// 			$rootScope.handleInitialFlow();
	// 		} else {
	// 			// No access token could be retrieved, show the button to start the authorization flow.
	// 			authButton.style.display = 'block';
	// 			$rootScope.isGoogleAuthenticated = false;
	// 			console.log("Google authenticated:"+$rootScope.isGoogleAuthenticated);
	// 			authButton.onclick = function () {
	// 				gapi.auth.authorize(
	// 					{'client_id': CLIENT_ID, 'scope': SCOPES, 'immediate': false},
	// 					$rootScope.handleAuthResult);
	// 			};
	// 		}
	// 	};

	// 	$rootScope.handleInitialFlow = function() {
	// 		var isSpendThriftFolderCreated = $rootScope.hasSpendThriftFolder();
	// 		console.log(isSpendThriftFolderCreated);
	// 		if (!isSpendThriftFolderCreated) {
	// 			var isFolderCreated = $rootScope.createNewFolder();
	// 		}
	// 		//selectSpendThriftFolder();


	// 	};


	// 	//Get folder id of spendthrift folder
	// 	$rootScope.getFolderId = function () {
	// 		gapi.client.load('drive', 'v2', function () {
	// 			var request = gapi.client.drive.files.list({
	// 				'q': "title='SpendThriftData' and mimeType = 'application/vnd.google-apps.folder'"
	// 			});
	// 			request.execute(function (resp) {
	// 				console.log(resp.items.length);
	// 				if (resp.items.length > 0) {
	// 					MAIN_APP_FOLDER_ID = resp.items[0].id;
	// 				}
	// 				console.log(MAIN_APP_FOLDER_ID);
	// 			});
	// 		});
	// 	};

	// 	$rootScope.createNewFile = function () {
	// 		console.log("In Create new file")
	// 		console.log(MAIN_APP_FOLDER_ID);
	// 		gapi.client.load('drive', 'v2', function () {
	// 			var request = gapi.client.request({
	// 				'path': '/drive/v2/files',
	// 				'method': 'POST',
	// 				'body': {
	// 					"title": "MyBudget",
	// 					"parents": [{"id": MAIN_APP_FOLDER_ID}],
	// 					"mimeType": "application/vnd.google-apps.spreadsheet"
	// 				}
	// 			});
	// 			request.execute(function (resp) {
	// 				console.log(resp);
	// 			});
	// 		});
	// 	};

	// 	$rootScope.createNewFolder = function () {
	// 		console.log("In Create new folder")
	// 		gapi.client.load('drive', 'v2', function () {
	// 			var request = gapi.client.request({
	// 				'path': '/drive/v2/files',
	// 				'method': 'POST',
	// 				'body': {
	// 					"title": "SpendThriftData",
	// 					"mimeType": "application/vnd.google-apps.folder"
	// 				}
	// 			});
	// 			request.execute(function (resp) {
	// 				console.log(resp);
	// 			});
	// 		});
	// 		return true;
	// 	};
	// 	$rootScope.hasSpendThriftFolder = false;
	// 	$rootScope.hasSpendThriftFolder = function ($rootScope) {
	// 		console.log("In hasSpendThriftFolder");
	// 		gapi.client.load('drive', 'v2', function() {
	// 			var request = gapi.client.drive.files.list({
	// 				'q': "title='SpendThriftData' and mimeType = 'application/vnd.google-apps.folder'"
	// 			});

	// 			request.execute(function(resp) {
	// 				console.log("In hasSpendThriftFolder");
	// 				if(resp.items.length > 0){
	// 					console.log("In hasSpendThriftFolder"+resp.items.length > 0);
	// 					$rootScope.hasSpendThriftFolder = true;
	// 				}
	// 			});
	// 		});
	// 		return $rootScope.hasSpendThriftFolder;
	// 	};

	// 	// Authenticate when the user clicks the login button.
	// 	$('#connectGoogle').click(function (e) {
	// 		e.preventDefault();
	// 		$rootScope.handleClientLoad();
	// 		console.log("connect google clicked");
	// 	});
	// 	window.onload=function(){
	// 		window.setTimeout($rootScope.handleClientLoad, 1);
	// 	}
		

	// 	$('.side-nav>li>a').click(function(event){
	// 		 $('ul .in').collapse("hide");	
	// 	});

	// });











		/*----------------------------------------------------------*/
		app.controller('showCategoriesController', function($scope,$log){



			$scope.getCategories = function(){
				console.log("Get Categories called");
				var store = $scope.datastore;
				var categoriesTable = store.getTable('categories');
				$scope.primarycategories = categoriesTable.query({type:'Primary'});
				for(var i = 0; i < $scope.primarycategories.length; i++){
					var primaryCategoryName  = $scope.primarycategories[i].get('name');
					$scope.primarycategories[i].iconName = $scope.primarycategories[i].get('icon');
					$scope.primarycategories[i].nodes = categoriesTable.query({type:'Secondary', primary:primaryCategoryName});
					for(var j = 0; j < $scope.primarycategories[i].nodes.length; j++){
						var secondaryCategoryName  = $scope.primarycategories[i].nodes[j].get('name');
						$scope.primarycategories[i].nodes[j].iconName = $scope.primarycategories[i].nodes[j].get('icon');
						$scope.primarycategories[i].nodes[j].nodes = categoriesTable.query({type:'Tertiary', secondary:secondaryCategoryName});
					}
				}

			};

			$scope.getCategories();



		});
		/*----------------------------------------------------------*/
		app.controller('showExpensesController', function($scope, $modal, $log){
			$scope.buttonsState = {};
			$scope.total = 0;
			$scope.showExpensesBy = "Daily";
			$scope.buttonsState.showDateField = true;
			$scope.buttonsState.showMonthField = true;
			$scope.today = new Date();
			$scope.currentDate = $scope.today.getDate();
			$scope.currentMonth = $scope.today.getMonth();
			$scope.currentYear = $scope.today.getFullYear();
			var store = $scope.datastore;
			var expensesTable = store.getTable('expenses');
			$scope.getDailyExpenses = function(queryDate,queryMonth,queryYear) {

				$scope.expenses = expensesTable.query({date:queryDate,
					month: queryMonth,
					year:queryYear });

			};
			$scope.getMonthlyExpenses = function(queryMonth,queryYear) {

				$scope.expenses = expensesTable.query({month: queryMonth,
					year:queryYear });

			};
			$scope.getYearlyExpenses = function(queryYear) {

				$scope.expenses = expensesTable.query({year:queryYear });

			};
			$scope.getTotal = function(){
				for(var i = 0; i < $scope.expenses.length; i++){
					$scope.total += Number($scope.expenses[i].get('amount'));

				}
			};

			$scope.getExpenses = function(){
				$scope.total = 0;
				if($scope.showExpensesBy === "Daily"){
					$scope.buttonsState.showDateField = true;
					$scope.buttonsState.showMonthField = true;
					$scope.getDailyExpenses(Number($scope.currentDate),Number($scope.currentMonth),Number($scope.currentYear));
					$scope.getTotal();

				}
				else if($scope.showExpensesBy === "Monthly"){
					$scope.buttonsState.showDateField = false;
					$scope.buttonsState.showMonthField = true;

					$scope.getMonthlyExpenses(Number($scope.currentMonth),Number($scope.currentYear));
					$scope.getTotal();

				}
				else if($scope.showExpensesBy === "Yearly"){
					$scope.buttonsState.showDateField = false;
					$scope.buttonsState.showMonthField = false;
					$scope.getYearlyExpenses(Number($scope.currentYear));
					$scope.getTotal();

				}

			};

			$scope.getDailyExpenses($scope.currentDate,$scope.currentMonth,$scope.currentYear);
			$scope.getTotal();





			$scope.delete = function(expense){
				expense.deleteRecord();
			};

			$scope.open = function (editExpense) {
				$log.info(editExpense);
				var modalInstance = $modal.open({
					templateUrl: 'editExpenseModal.html',
					controller: 'EditExpenseModalController',
					size: 'lg'
			});
				modalInstance.expenseToEdit = editExpense;
			};

		});

		/*----------------------------------------------------------*/
		app.controller('showExpensesByCategoryController', function($scope, $modal, $log){
			$scope.showCategoryName = "";
			$scope.total = 0;
			$scope.categories = [];
			var allCategories = $scope.datastore.getTable('categories').query();
			for (var i=0; i < allCategories.length; i++) {
				$scope.categories.push(allCategories[i].get('name'));
			}

			$scope.buttonsState = {};

			$scope.showExpensesBy = "Daily";
			$scope.buttonsState.showDateField = true;
			$scope.buttonsState.showMonthField = true;
			$scope.today = new Date();
			$scope.currentDate = $scope.today.getDate();
			$scope.currentMonth = $scope.today.getMonth();
			$scope.currentYear = $scope.today.getFullYear();
			var store = $scope.datastore;
			var expensesTable = store.getTable('expenses');
			$scope.getDailyExpenses = function(queryDate,queryMonth,queryYear) {

				$scope.expenses = expensesTable.query({date:queryDate,
					month: queryMonth,
					year:queryYear,
					category: $scope.showCategoryName});

			};
			$scope.getMonthlyExpenses = function(queryMonth,queryYear) {

				$scope.expenses = expensesTable.query({month: queryMonth,
					year:queryYear,
					category: $scope.showCategoryName});

			};
			$scope.getYearlyExpenses = function(queryYear) {

				$scope.expenses = expensesTable.query({year:queryYear, category: $scope.showCategoryName });

			};
			$scope.getTotal = function(){
				for(var i = 0; i < $scope.expenses.length; i++){
					$scope.total += Number($scope.expenses[i].get('amount'));

				}
			};

			$scope.getExpenses = function(){
				$scope.total = 0;
				if($scope.showExpensesBy === "Daily"){
					$scope.buttonsState.showDateField = true;
					$scope.buttonsState.showMonthField = true;
					$scope.getDailyExpenses(Number($scope.currentDate),Number($scope.currentMonth),Number($scope.currentYear));
					$scope.getTotal();

				}
				else if($scope.showExpensesBy === "Monthly"){
					$scope.buttonsState.showDateField = false;
					$scope.buttonsState.showMonthField = true;

					$scope.getMonthlyExpenses(Number($scope.currentMonth),Number($scope.currentYear));
					$scope.getTotal();

				}
				else if($scope.showExpensesBy === "Yearly"){
					$scope.buttonsState.showDateField = false;
					$scope.buttonsState.showMonthField = false;
					$scope.getYearlyExpenses(Number($scope.currentYear));
					$scope.getTotal();

				}

			};



			$scope.delete = function(expense){
				expense.deleteRecord();
			}

			$scope.open = function (editExpense) {
				$log.info(editExpense);
				var modalInstance = $modal.open({
					templateUrl: 'editExpenseModal.html',
					controller: 'EditExpenseModalController',
					size: 'lg'
				});
				modalInstance.expenseToEdit = editExpense;
			};

		});

	/*----------------------------------------------------------*/
	app.controller('showExpensesByTagsController', function($scope, $modal, $log){
		$scope.showTagName = "";
		$scope.total = 0;
		$scope.tags = [];
		$scope.tagCloud = [];


		// var allTags = $scope.datastore.getTable('tags').query();
		// for (var i=0; i < allTags.length; i++) {
		// 	$scope.tags.push(allTags[i].get('name'));
		// 	var tagCloudObject = {};
		// 	tagCloudObject.text = allTags[i].get('name');
		// 	tagCloudObject.weight = 10;
		// 	$scope.tagCloud.push(tagCloudObject);

		// }
		$('#tagCloud').jQCloud($scope.tagCloud, {
			width: 500,
			height: 350
		});
		$scope.getExpenses = function(){
			$scope.total = 0;
			var store = $scope.datastore;
			var expensesTable = store.getTable('expenses');
			$scope.expenses = [];
			$scope.AllExpenses = expensesTable.query();
			for (var i=0; i < $scope.AllExpenses.length; i++) {
				if(_.contains($scope.AllExpenses[i].get('tags').toArray(),$scope.showTagName)){
					$scope.total += Number($scope.AllExpenses[i].get('amount'));
					$scope.expenses.push($scope.AllExpenses[i]);
				}

			}

		};

		$scope.getExpenses();

		$scope.delete = function(expense){
			expense.deleteRecord();
		}

		$scope.open = function (editExpense) {
			$log.info(editExpense);
			var modalInstance = $modal.open({
				templateUrl: 'editExpenseModal.html',
				controller: 'EditExpenseModalController',
				size: 'lg'
			});
			modalInstance.expenseToEdit = editExpense;
		};

	});

		/*----------------------------------------------------------*/
		app.controller('EditExpenseModalController', function($scope, $modalInstance){

			$scope.currentExpense = $modalInstance.expenseToEdit;
			$scope.editExpenseAmount = $scope.currentExpense.get('amount');
			$scope.editExpenseCategory = $scope.currentExpense.get('category');
			//Tag Handler
			$scope.thisExpenseTags = $scope.currentExpense.get('tags').toArray();
			$scope.allTags = [];
			var tagsRecords = $scope.datastore.getTable('tags').query();
			for (var i=0; i < tagsRecords.length; i++) {
				$scope.allTags.push(tagsRecords[i].get('name'));
			}
			$("#edit_expense_tag_handler").tagHandler({
				assignedTags: $scope.thisExpenseTags,
				availableTags: $scope.allTags,
				onAdd: function(tag) {$scope.thisExpenseTags.push(tag);$scope.$apply();},
				onDelete: function(tag) {$scope.thisExpenseTags.pop(tag);$scope.$apply();},
				autocomplete: true
			});

			$scope.saveEditExpense = function () {
				if($scope.currentExpense.get('amount') != $scope.editExpenseAmount){
					$scope.currentExpense.set('amount',$scope.editExpenseAmount);
				}
				if($scope.currentExpense.get('category') != $scope.editExpenseCategory){
					$scope.currentExpense.set('category',$scope.editExpenseCategory);
				}
				//Edit Date
				if($scope.currentExpense.get('date') != $scope.dt.getDate()){
					$scope.currentExpense.set('date',$scope.dt.getDate());
				}
				if($scope.currentExpense.get('month') != $scope.dt.getMonth()){
					$scope.currentExpense.set('month',$scope.dt.getMonth());
				}
				if($scope.currentExpense.get('year') != $scope.dt.getFullYear()){
					$scope.currentExpense.set('year',$scope.dt.getFullYear());
				}

				$modalInstance.close();
			};

			$scope.cancel = function () {
				$modalInstance.dismiss('cancel');
			};




			//Date picker
			$scope.open = function($event) {
				$event.preventDefault();
				$event.stopPropagation();
			$scope.opened = true;
			};
			$scope.dt = new Date($scope.currentExpense.get('year'),$scope.currentExpense.get('month'),$scope.currentExpense.get('date')).toDateString();
			$scope.dateOptions = {
				formatYear: 'yy',
				startingDay: 1
			};

			$scope.today = function() {
				$scope.dt = new Date().toDateString();
			};


			$scope.clear = function () {
				$scope.dt = null;
			};




		});


		/*----------------------------------------------------------*/
		app.controller('showGraphsController', function($scope){

			$scope.today = new Date();
			$scope.currentDate = $scope.today.getDate();
			$scope.currentMonth = $scope.today.getMonth();
			$scope.currentYear = $scope.today.getFullYear();
			var queryMonth = $scope.currentMonth;
			var queryYear = $scope.currentYear;
			console.log("query month and year");
			console.log(queryMonth);
			console.log(queryYear);
			var expensesForMonth = function(queryMonth,queryYear){

			return $scope.datastore.getTable('expenses').query({month : queryMonth, year : queryYear });
			}
			var expensesForDay = function(queryDate,queryMonth,queryYear){

			return $scope.datastore.getTable('expenses').query({date: queryDate, month : queryMonth, year : queryYear });

			}
			var chartYValues = [];
			var chartXValues = [];
			$scope.total = {};
			var monthlyTotal = 0;
			//Populate
			for(var i=1; i <= 31; i++){
				var amount = 0;
				var dailyExpenses = expensesForDay(i,queryMonth,queryYear);
				for(var j=0; j < dailyExpenses.length; j++){
					amount += Number(dailyExpenses[j].get('amount'));

				}
				chartXValues.push(i);
				chartYValues.push(amount);
				monthlyTotal += amount;
			}
			$scope.total.monthly = monthlyTotal;
			$scope.$apply();

			//Show Chart
			$('#dailyChart').highcharts({
				chart: {
					type: 'column'
				},
				title: {
					text: 'Your Expenses Summary'
				},
				xAxis: {
					categories: chartXValues
				},
				yAxis: {
					title: {
						text: 'Amount'
					}
				},
				series: [{
					data: chartYValues
				}]
			});

		});

	/*----------------------------------------------------------*/
	app.controller('showGraphsByCategoriesCtrl', function($scope){

		var queryMonth = 11;
		var queryYear = 2014;
		//Get all Categories
		var allCategories = $scope.datastore.getTable('categories').query();
		var expensesForCategory = function(queryMonth,queryYear,queryCategory){

			return $scope.datastore.getTable('expenses').query({month : queryMonth,
																year : queryYear,
																category: queryCategory
			});
		}

		var chartYValues = [];
		var chartXValues = [];


		//Populate X and Y values
		for(var i=0; i < allCategories.length; i++){
			var amount = 0;
			var categoryExpenses = expensesForCategory(queryMonth,queryYear,allCategories[i].get('name'));
			for(var j=0; j < categoryExpenses.length; j++){
				amount += Number(categoryExpenses[j].get('amount'));

			}
			chartXValues.push(allCategories[i].get('name'));
			chartYValues.push(amount);

		}



		//Show Chart
		$('#categoryChart').highcharts({
			chart: {
				type: 'bar',
				zoomType: 'x'
			},
			title: {
				text: 'Drag on the chart to Zoom'
			},
			xAxis: {
				categories: chartXValues
			},
			yAxis: {
				title: {
					text: 'Amount'
				}
			},
			plotOptions: {
				bar: {
					dataLabels: {
						enabled: true
					}
				}
			},
			series: [{
				data: chartYValues
			}]
		});

	});

	/*----------------------------------------------------------*/
	app.controller('showGraphsByTagsCtrl', function($scope){

		var queryMonth = 11;
		var queryYear = 2014;
		//Get all tags
		var allTags = $scope.datastore.getTable('tags').query();

		var getExpenses = function(queryMonth,queryYear){

			return $scope.datastore.getTable('expenses').query({month : queryMonth,
				year : queryYear
			});
		};

		var chartYValues = [];
		var chartXValues = [];

		var allExpenses = getExpenses(queryMonth,queryYear);
		//Populate X and Y values
		for(var i=0; i < allTags.length; i++){
			var amount = 0;

			for (var k=0; k < allExpenses.length; k++) {
				if(_.contains(allExpenses[k].get('tags').toArray(),allTags[i].get('name'))){
					amount += Number(allExpenses[k].get('amount'));
				}

			}

			chartXValues.push(allTags[i].get('name'));
			chartYValues.push(amount);

		}




		//Show Chart
		$('#tagChart').highcharts({
			chart: {
				type: 'bar',
				zoomType: 'x'
			},
			title: {
				text: 'Drag on the chart to Zoom'
			},
			xAxis: {
				categories: chartXValues
			},
			yAxis: {
				title: {
					text: 'Amount'
				}
			},
			plotOptions: {
				bar: {
					dataLabels: {
						enabled: true
					}
				}
			},
			series: [{
				data: chartYValues
			}]
		});


	});

		/*----------------------------------------------------------*/
		app.controller('addExpenseController', function($scope,$timeout){
			$scope.isExpenseAdded = false;
			$scope.thisExpenseTags = [];
			$scope.allTags = [];
			$scope.categories = [];
			var tagsRecords = $scope.datastore.getTable('tags').query();
			var allCategories = $scope.datastore.getTable('categories').query();
			for (var i=0; i < allCategories.length; i++) {
				$scope.categories.push(allCategories[i].get('name'));
			}
			var getTags = function(){
				for (var i=0; i < tagsRecords.length; i++) {
					$scope.allTags.push(tagsRecords[i].get('name'));
				}
			};
			getTags();
			$("#expense_tag_handler").tagHandler({
				availableTags: $scope.allTags,
				onAdd: function(tag) {$scope.thisExpenseTags.push(tag);$scope.$apply();},
				onDelete: function(tag) {$scope.thisExpenseTags.pop(tag);$scope.$apply();},
				autocomplete: true
			});




			$scope.addExpense = function(){
				console.log("Add expense called");
				var store = $scope.datastore;
				var expensesTable = store.getTable('expenses');
				// Add expense to expenses table
				var newExpenseRecord = expensesTable.insert({
					amount : $scope.expenseAmount,
					category : $scope.expenseCategory,
					date: $scope.dt.getDate(),
					month: $scope.dt.getMonth(),
					year: $scope.dt.getFullYear(),
					tags: $scope.thisExpenseTags

				});
				// Add new tags to tags table
				var tagsTable = store.getTable('tags');
				//Update tags List with latest
				getTags();
				$scope.newTags = _.difference($scope.thisExpenseTags, $scope.allTags);
				var insertTags = $scope.newTags;
				for (var i=0; i < insertTags.length; i++) {
					tagsTable.insert({
					name: insertTags[i]
				});
				}
				$scope.isExpenseAdded = true;
				$timeout(function(){
					$scope.isExpenseAdded = false;
					$scope.$apply();
				},2000);


			};

			$scope.open = function($event) {
				$event.preventDefault();
				$event.stopPropagation();

				$scope.opened = true;
			};

			$scope.dateOptions = {
				formatYear: 'yy',
				startingDay: 1
			};

			$scope.today = function() {
				$scope.dt = new Date().toDateString();
			};
			$scope.today();

			$scope.clear = function () {
				$scope.dt = null;
			};


		});
		/*----------------------------------------------------------*/
		app.controller('welcomeController', function($scope){
			//Required for angular routing even though its empty
		});
		/*----------------------------------------------------------*/
		app.controller('resetController', function($scope) {
			$scope.deleteData = function(){
				$scope.myClient.getDatastoreManager().deleteDatastore($scope.datastore.getId(), function (error) {
					if (error) {
						alert('Sorry please try after sometime error: ' + error);
					} else {
						alert('Success, your data is gone');
					}

				});
			};

		});


		
		/*----------------------------------------------------------*/
		app.controller('addCategoriesController', function($scope,$timeout) {
			$scope.iconName = "";
			$scope.isCategoryAdded = false;
			$scope.close = function(){
				$scope.iconName = "";
			};
			$scope.categoryType = "Primary";
			$scope.addNewCategory = function(){
				var store = $scope.datastore;
				var categoriesTable = store.getTable('categories');
				var newCategoryRecord = {};
				newCategoryRecord.name = $scope.categoryName;
				newCategoryRecord.icon = $scope.iconName;
				newCategoryRecord.type = $scope.categoryType;
				if($scope.categoryType === 'Secondary'){
					newCategoryRecord.primary = $scope.categoryPrimary;
				}
				if($scope.categoryType === 'Tertiary'){
					newCategoryRecord.secondary = $scope.categorySecondary;
				}
				categoriesTable.insert(newCategoryRecord);
				$scope.isCategoryAdded = true;
				$timeout(function(){
					$scope.isCategoryAdded = false;
					$scope.$apply();
				},2000);
			};

			$scope.icons = ["adjust",
			"adn",
			"align-center",
			"align-justify",
			"align-left",
			"align-right",
			"ambulance",
			"anchor",
			"android",
			"angellist",
			"angle-double-down",
			"angle-double-left",
			"angle-double-right",
			"angle-double-up",
			"angle-down",
			"angle-left",
			"angle-right",
			"angle-up",
			"apple",
			"archive",
			"area-chart",
			"arrow-circle-down",
			"arrow-circle-left",
			"arrow-circle-o-down",
			"arrow-circle-o-left",
			"arrow-circle-o-right",
			"arrow-circle-o-up",
			"arrow-circle-right",
			"arrow-circle-up",
			"arrow-down",
			"arrow-left",
			"arrow-right",
			"arrow-up",
			"arrows",
			"arrows-alt",
			"arrows-h",
			"arrows-v",
			"asterisk",
			"at",
			"automobile",
			"backward",
			"ban",
			"bank",
			"bar-chart",
			"bar-chart-o",
			"barcode",
			"bars",
			"beer",
			"behance",
			"behance-square",
			"bell",
			"bell-o",
			"bell-slash",
			"bell-slash-o",
			"bicycle",
			"binoculars",
			"birthday-cake",
			"bitbucket",
			"bitbucket-square",
			"bitcoin",
			"bold",
			"bolt",
			"bomb",
			"book",
			"bookmark",
			"bookmark-o",
			"briefcase",
			"btc",
			"bug",
			"building",
			"building-o",
			"bullhorn",
			"bullseye",
			"bus",
			"cab",
			"calculator",
			"calendar",
			"calendar-o",
			"camera",
			"camera-retro",
			"car",
			"caret-down",
			"caret-left",
			"caret-right",
			"caret-square-o-down",
			"caret-square-o-left",
			"caret-square-o-right",
			"caret-square-o-up",
			"caret-up",
			"cc",
			"cc-amex",
			"cc-discover",
			"cc-mastercard",
			"cc-paypal",
			"cc-stripe",
			"cc-visa",
			"certificate",
			"chain",
			"chain-broken",
			"check",
			"check-circle",
			"check-circle-o",
			"check-square",
			"check-square-o",
			"chevron-circle-down",
			"chevron-circle-left",
			"chevron-circle-right",
			"chevron-circle-up",
			"chevron-down",
			"chevron-left",
			"chevron-right",
			"chevron-up",
			"child",
			"circle",
			"circle-o",
			"circle-o-notch",
			"circle-thin",
			"clipboard",
			"clock-o",
			"close",
			"cloud",
			"cloud-download",
			"cloud-upload",
			"cny",
			"code",
			"code-fork",
			"codepen",
			"coffee",
			"cog",
			"cogs",
			"columns",
			"comment",
			"comment-o",
			"comments",
			"comments-o",
			"compass",
			"compress",
			"copy",
			"copyright",
			"credit-card",
			"crop",
			"crosshairs",
			"css3",
			"cube",
			"cubes",
			"cut",
			"cutlery",
			"dashboard",
			"database",
			"dedent",
			"delicious",
			"desktop",
			"deviantart",
			"digg",
			"dollar",
			"dot-circle-o",
			"download",
			"dribbble",
			"dropbox",
			"drupal",
			"edit",
			"eject",
			"ellipsis-h",
			"ellipsis-v",
			"empire",
			"envelope",
			"envelope-o",
			"envelope-square",
			"eraser",
			"eur",
			"euro",
			"exchange",
			"exclamation",
			"exclamation-circle",
			"exclamation-triangle",
			"expand",
			"external-link",
			"external-link-square",
			"eye",
			"eye-slash",
			"eyedropper",
			"facebook",
			"facebook-square",
			"fast-backward",
			"fast-forward",
			"fax",
			"female",
			"fighter-jet",
			"file",
			"file-archive-o",
			"file-audio-o",
			"file-code-o",
			"file-excel-o",
			"file-image-o",
			"file-movie-o",
			"file-o",
			"file-pdf-o",
			"file-photo-o",
			"file-picture-o",
			"file-powerpoint-o",
			"file-sound-o",
			"file-text",
			"file-text-o",
			"file-video-o",
			"file-word-o",
			"file-zip-o",
			"files-o",
			"film",
			"filter",
			"fire",
			"fire-extinguisher",
			"flag",
			"flag-checkered",
			"flag-o",
			"flash",
			"flask",
			"flickr",
			"floppy-o",
			"folder",
			"folder-o",
			"folder-open",
			"folder-open-o",
			"font",
			"forward",
			"foursquare",
			"frown-o",
			"futbol-o",
			"gamepad",
			"gavel",
			"gbp",
			"ge",
			"gear",
			"gears",
			"gift",
			"git",
			"git-square",
			"github",
			"github-alt",
			"github-square",
			"gittip",
			"glass",
			"globe",
			"google",
			"google-plus",
			"google-plus-square",
			"google-wallet",
			"graduation-cap",
			"group",
			"h-square",
			"hacker-news",
			"hand-o-down",
			"hand-o-left",
			"hand-o-right",
			"hand-o-up",
			"hdd-o",
			"header",
			"headphones",
			"heart",
			"heart-o",
			"history",
			"home",
			"hospital-o",
			"html5",
			"ils",
			"image",
			"inbox",
			"indent",
			"info",
			"info-circle",
			"inr",
			"instagram",
			"institution",
			"ioxhost",
			"italic",
			"joomla",
			"jpy",
			"jsfiddle",
			"key",
			"keyboard-o",
			"krw",
			"language",
			"laptop",
			"lastfm",
			"lastfm-square",
			"leaf",
			"legal",
			"lemon-o",
			"level-down",
			"level-up",
			"life-bouy",
			"life-buoy",
			"life-ring",
			"life-saver",
			"lightbulb-o",
			"line-chart",
			"link",
			"linkedin",
			"linkedin-square",
			"linux",
			"list",
			"list-alt",
			"list-ol",
			"list-ul",
			"location-arrow",
			"lock",
			"long-arrow-down",
			"long-arrow-left",
			"long-arrow-right",
			"long-arrow-up",
			"magic",
			"magnet",
			"mail-forward",
			"mail-reply",
			"mail-reply-all",
			"male",
			"map-marker",
			"maxcdn",
			"meanpath",
			"medkit",
			"meh-o",
			"microphone",
			"microphone-slash",
			"minus",
			"minus-circle",
			"minus-square",
			"minus-square-o",
			"mobile",
			"mobile-phone",
			"money",
			"moon-o",
			"mortar-board",
			"music",
			"navicon",
			"newspaper-o",
			"openid",
			"outdent",
			"pagelines",
			"paint-brush",
			"paper-plane",
			"paper-plane-o",
			"paperclip",
			"paragraph",
			"paste",
			"pause",
			"paw",
			"paypal",
			"pencil",
			"pencil-square",
			"pencil-square-o",
			"phone",
			"phone-square",
			"photo",
			"picture-o",
			"pie-chart",
			"pied-piper",
			"pied-piper-alt",
			"pinterest",
			"pinterest-square",
			"plane",
			"play",
			"play-circle",
			"play-circle-o",
			"plug",
			"plus",
			"plus-circle",
			"plus-square",
			"plus-square-o",
			"power-off",
			"print",
			"puzzle-piece",
			"qq",
			"qrcode",
			"question",
			"question-circle",
			"quote-left",
			"quote-right",
			"ra",
			"random",
			"rebel",
			"recycle",
			"reddit",
			"reddit-square",
			"refresh",
			"remove",
			"renren",
			"reorder",
			"repeat",
			"reply",
			"reply-all",
			"retweet",
			"rmb",
			"road",
			"rocket",
			"rotate-left",
			"rotate-right",
			"rouble",
			"rss",
			"rss-square",
			"rub",
			"ruble",
			"rupee",
			"save",
			"scissors",
			"search",
			"search-minus",
			"search-plus",
			"send",
			"send-o",
			"share",
			"share-alt",
			"share-alt-square",
			"share-square",
			"share-square-o",
			"shekel",
			"sheqel",
			"shield",
			"shopping-cart",
			"sign-in",
			"sign-out",
			"signal",
			"sitemap",
			"skype",
			"slack",
			"sliders",
			"slideshare",
			"smile-o",
			"soccer-ball-o",
			"sort",
			"sort-alpha-asc",
			"sort-alpha-desc",
			"sort-amount-asc",
			"sort-amount-desc",
			"sort-asc",
			"sort-desc",
			"sort-down",
			"sort-numeric-asc",
			"sort-numeric-desc",
			"sort-up",
			"soundcloud",
			"space-shuttle",
			"spinner",
			"spoon",
			"spotify",
			"square",
			"square-o",
			"stack-exchange",
			"stack-overflow",
			"star",
			"star-half",
			"star-half-empty",
			"star-half-full",
			"star-half-o",
			"star-o",
			"steam",
			"steam-square",
			"step-backward",
			"step-forward",
			"stethoscope",
			"stop",
			"strikethrough",
			"stumbleupon",
			"stumbleupon-circle",
			"subscript",
			"suitcase",
			"sun-o",
			"superscript",
			"support",
			"table",
			"tablet",
			"tachometer",
			"tag",
			"tags",
			"tasks",
			"taxi",
			"tencent-weibo",
			"terminal",
			"text-height",
			"text-width",
			"th",
			"th-large",
			"th-list",
			"thumb-tack",
			"thumbs-down",
			"thumbs-o-down",
			"thumbs-o-up",
			"thumbs-up",
			"ticket",
			"times",
			"times-circle",
			"times-circle-o",
			"tint",
			"toggle-down",
			"toggle-left",
			"toggle-off",
			"toggle-on",
			"toggle-right",
			"toggle-up",
			"trash",
			"trash-o",
			"tree",
			"trello",
			"trophy",
			"truck",
			"try",
			"tty",
			"tumblr",
			"tumblr-square",
			"turkish-lira",
			"twitch",
			"twitter",
			"twitter-square",
			"umbrella",
			"underline",
			"undo",
			"university",
			"unlink",
			"unlock",
			"unlock-alt",
			"unsorted",
			"upload",
			"usd",
			"user",
			"user-md",
			"users",
			"video-camera",
			"vimeo-square",
			"vine",
			"vk",
			"volume-down",
			"volume-off",
			"volume-up",
			"warning",
			"wechat",
			"weibo",
			"weixin",
			"wheelchair",
			"wifi",
			"windows",
			"won",
			"wordpress",
			"wrench",
			"xing",
			"xing-square",
			"yahoo",
			"yelp",
			"yen",
			"youtube",
			"youtube-play",
			"youtube-square"
			];
		});
		/*----------------------------------------------------------*/


})();
