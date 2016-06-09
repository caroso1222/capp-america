
var app = angular.module('app',['ui.router']);


app.config(function($stateProvider, $urlRouterProvider, $locationProvider){
	$locationProvider.html5Mode(true);
	$urlRouterProvider.otherwise("/admin/messages");
	$stateProvider
	.state('messages',{
		url:"/admin/messages",
		templateUrl:"/templates/admin/messages.html",
		controller:'messagesCtrl'
	})
	.state('config',{
		url:"/admin/config",
		templateUrl:"/templates/admin/config.html",
		controller:'configCtrl'
	})
	.state('countries',{
		url:"/admin/countries",
		templateUrl:"/templates/admin/countries.html",
		controller:'countriesCtrl'
	});
});
