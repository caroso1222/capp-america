'use strict';
var app = angular.module('app',[]);

app.directive('format', function ($filter) {
	return {
		require: '?ngModel',
		link: function (scope, elem, attrs, ctrl) {
			if (!ctrl) {
				return;
			}

			ctrl.$formatters.unshift(function () {
				return $filter('number')(ctrl.$modelValue);
			});

			ctrl.$parsers.unshift(function (viewValue) {
				var plainNumber = viewValue.replace(/[\,\.]/g, ''),
				b = $filter('number')(plainNumber);

				elem.val(b);

				return plainNumber;
			});
		}
	};
});

app.controller('mainController',function($scope,$http, $timeout){
	$('.modal-trigger').leanModal();
	$scope.requirement = {};
	$scope.requirements = {};
	$scope.resources = {};
	$scope.resource = {};
	$scope.constants = {};
	$scope.constant = {};
	$scope.isSaving = false;
	var shouldSave = false;

	$scope.saveSalary = function(elem){
		if(shouldSave){
			shouldSave = false;
			$scope.isSaving = true;
			$http.put('/resource/'+elem._id,elem);
			$timeout(function() {
				$scope.isSaving = false;
			}, 2000);
		}
	}

	$scope.saveConstant = function(elem){
		if(shouldSave){
			shouldSave = false;
			$scope.isSaving = true;
			$http.put('/constant/'+elem._id,elem);
			$timeout(function() {
				$scope.isSaving = false;
			}, 2000);
		}
	}

	$scope.addResource = function(){
		$http.post('/resource',$scope.resource);
		$scope.resource = {};
		updateResources();
	}
	$scope.addRequeriment = function(){
		$http.post('/requirement',$scope.requirement);
		$scope.requirement = {};
		updateRequirements();
	}
	$scope.addConstant = function(){
		$http.post('/constant',$scope.constant);
		$scope.constant = {};
		updateConstants();
	}
	function updateRequirements(){
		$http.get('/requirements').then(function(res){
			$scope.requirements = res.data;
		},function(err){
			console.log(err);
		});
	}
	function updateResources(){
		$http.get('/resources').then(function(res){
			$scope.resources = res.data;
		},function(err){
			console.log(err);
		});
	}
	function updateConstants(){
		$http.get('/constants').then(function(res){
			$scope.constants = res.data;
			console.log($scope.constants);
		},function(err){
			console.log(err);
		});
	}

	$scope.setShouldSave = function(){
		shouldSave = true;
	}
	updateRequirements();
	updateResources();
	updateConstants();
});






