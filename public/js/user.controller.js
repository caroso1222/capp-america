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

app.controller('mainController',function($scope,$http){
	$scope.requirements=[];
	$scope.resources = [];
	$scope.totalHoursVal = 0;
	$scope.constants = {};
	$scope.totalReqCostVal = 0;
	$scope.totalResourceCostVal = 0;


	// $scope.resources.forEach(function(elem,idx,array){
	// 	//elem.hours = elem.time_percentage*$scope.totalHoursVal/100;
	// 	elem.hours = 10;
	// });


	$scope.totalReqHours = function(){
		var sum = 0; 
		$scope.requirements.forEach(function(elem,idx,array){
			sum += elem.selected ? elem.hours: 0;
		});
		$scope.totalHoursVal = sum;
		return sum;
	};

	$scope.totalReqCost = function(){
		var sum = 0; 
		$scope.requirements.forEach(function(elem,idx,array){
			sum += elem.cost ? elem.cost : 0;
		});
		$scope.totalReqCostVal = sum;
		return sum;
	};

	function updateRequirements(){
		$http.get('/requirements').then(function(res){
			$scope.requirements = res.data;
			$scope.requirements.forEach(function(elem,idx,array){
				elem.selected = false;
			});
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

	$scope.calculateReqHours = function(elem){
		elem.hours = elem.design_hours + elem.frontend_hours + elem.backend_hours + elem.integration_hours;
		return elem.hours;
	}

	$scope.calculateReqCost = function(elem){
		elem.cost = elem.design_hours*$scope.salarioDisenador/160 + (elem.frontend_hours + elem.backend_hours + elem.integration_hours)*$scope.salarioDesarrollador/160;
		return elem.cost;
	}

	$scope.calculateResourceHours = function(elem){
		elem.hours = elem.time_percentage*$scope.totalHoursVal/100;
		return elem.hours;
	}

	$scope.calculateResourceCosts = function(elem){
		elem.cost = elem.hours*elem.wage/160;
		return elem.cost;
	}

	$scope.totalHoursResource = function(){
		var sum = 0;
		$scope.resources.forEach(function(elem,idx,array){
			sum += elem.hours;
		});
		return sum.toFixed(2);
	}

	$scope.totalCostsResource = function(){
		var sum = 0;
		$scope.resources.forEach(function(elem,idx,array){
			sum += elem.cost;
		});
		$scope.totalResourceCostVal = sum;
		return sum;
	}

	function updateConstants(){
		$http.get('/constants').then(function(res){
			$scope.constants = res.data;
			$scope.salarioDesarrollador = $scope.constants[0].value;
			$scope.salarioDisenador = $scope.constants[1].value;
		},function(err){
			console.log(err);
		});
	}

	updateRequirements();
	updateResources();
	updateConstants();
});





