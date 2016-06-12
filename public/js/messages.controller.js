'use strict'


app.controller('messagesCtrl', function($scope, $http) {

    $(document).ready(function() {
        $('select').material_select();
        $('textarea').characterCounter();
        $('ul.tabs').tabs();
    });

    $scope.text = {};
    $scope.goal = {};
    $scope.match = {};
    $scope.start = {};
    $scope.active_card = 'text';
    $scope.america = {}
    $scope.euro = {}

    $scope.sendText = function() {
        if ($scope.text.text) {
            console.log($scope.text.text);
            var payload = {
                type: 'text',
                text: $scope.text.text
            }
            $http.post('/bot/send_message', payload)
                .then(function success(response) {
                    console.log(response);
                }, function error(response) {
                    console.log(response);
                });
        }
    }

    $scope.sendGoal = function() {
        var payload = {
            type: 'goal',
            country: $scope.goal.scorer_country,
            minute: $scope.goal.minute,
            scorer: $scope.goal.scorer_name,
            team_1: {
                country: $scope.goal.team_1,
                score: $scope.goal.team_1_score
            },
            team_2: {
                country: $scope.goal.team_2,
                score: $scope.goal.team_2_score
            }
        }
        console.log(payload);
        $http.post('/bot/send_message', payload)
            .then(function success(response) {
                console.log(response);
            }, function error(response) {
                console.log(response);
            });
    }

    $scope.sendMatch = function(tournament) {
        var tournament_key = tournament.toLowerCase();
        var payload = {
            type: 'match',
            tournament:tournament,
            comment: $scope[tournament_key].match.comment,
            team_1: {
                country: $scope[tournament_key].match.team_1,
                score: $scope[tournament_key].match.team_1_score
            },
            team_2: {
                country: $scope[tournament_key].match.team_2,
                score: $scope[tournament_key].match.team_2_score
            }
        }
        console.log(payload);
        $http.post('/bot/send_message', payload)
            .then(function success(response) {
                console.log(response);
            }, function error(response) {
                console.log(response);
            });
    }

    $scope.sendStart = function() {
        var payload = {
            type: 'start',
            comment: $scope.start.comment,
            team_1: {
                country: $scope.start.team_1
            },
            team_2: {
                country: $scope.start.team_2
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

    function populateCountries(tournament){
      $http.get('/api/countries/' + tournament)
          .then(function success(response) {
            console.log(response);
              $scope[tournament.toLowerCase()].countries = response.data;
          }, function(error) {
              console.log(error);
          })
    }

    populateCountries('EURO');
    populateCountries('AMERICA');
});
