
var app = angular.module('app',['ui.router']);


app.config(function($stateProvider, $urlRouterProvider){
	$urlRouterProvider.otherwise("/messages");
	$stateProvider
	.state('messages',{
		url:"/messages",
		templateUrl:"/templates/admin/messages.html",
		controller:'messagesCtrl'
	})
	.state('config',{
		url:"/config",
		templateUrl:"/templates/admin/config.html",
		controller:'configCtrl'
	});
});



