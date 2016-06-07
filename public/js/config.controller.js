'use strict'

angular.module('app.controllers',[])
.controller('configCtrl', function($scope,$http,$timeout){
	$(document).ready(function() {
		$('select').material_select();
		$('textarea').characterCounter();
		$('ul.tabs').tabs();
		$('.modal-trigger').leanModal();
	});

	$scope.scores = {}

	function updateScores(){
		$http.get('/api/scores')
		.then(function success(response){
			$scope.scores = response.data;
		},function error(response){
			console.log(response);
		});
	}


	$scope.registerScore = function(){
		var payload = {
			team_1:$scope.score.team_1,
			team_1_score:$scope.score.team_1_score,
			team_2:$scope.score.team_2,
			team_2_score:$scope.score.team_2_score,
			penalties:"none"
		}
		console.log(payload);
		$http.post('/api/score',payload)
		.then(function success(response){
			updateScores();
		},function error(response){
			console.log(response);
		});
		$scope.score = {}
	}

	updateScores();
});
