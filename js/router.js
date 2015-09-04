ar router = angular.module('angular-custom.router', []);

router
    .config(['$urlRouterProvider',
        function($urlRouterProvider) {

            $urlRouterProvider.otherwise("/login");

        }]);

router
    .config(['$stateProvider',
        function($stateProvider) {

            $stateProvider

                .state('addCategories', {
                    url :'/addCategories',
                    views :  {
                        '': {
                            templateUrl: 'templates/addCategories.html'
                        },
                    },
                })

                .state('addExpense', {
                    url :'/addExpense',
                    templateUrl: 'templates/addExpense.html',
                    controller: 'addExpenseController'
                   
                        },
                    },
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

                .state('showGraphsByCategories', {
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
                    views :  {
                        '': {
                            templateUrl: 'index.html',
                        },
                    },
                })

    }])