app.controller('configCtrl', function($scope,$http,$timeout){
	$(document).ready(function() {
		$('select').material_select();
		$('textarea').characterCounter();
		$('ul.tabs').tabs();
		$('.modal-trigger').leanModal();
	});

	$scope.text = {};
	$scope.goal = {};
	$scope.match = {};
	$scope.active_card = 'scores';

	$scope.sendText = function(){
		if($scope.text.text){
			console.log($scope.text.text);
			var payload = {
				type:'text',
				text:$scope.text.text
			}
			$http.post('/bot/send_message',payload)
			.then(function success(response){
				console.log(response);
			},function error(response){
				console.log(response);
			});
		}
	}


	$scope.sendGoal = function(){
		var payload = {
			type:'goal',
			country: $scope.goal.scorer_country,
			minute: $scope.goal.minute,
			scorer:$scope.goal.scorer_name,
			team_1:{
				country:$scope.goal.team_1,
				score:$scope.goal.team_1_score
			},
			team_2:{
				country:$scope.goal.team_2,
				score:$scope.goal.team_2_score
			}
		}
		console.log(payload);
		$http.post('/bot/send_message',payload)
		.then(function success(response){
			console.log(response);
		},function error(response){
			console.log(response);
		});
	}


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



