app.controller("countriesCtrl", function($scope, $http, $filter) {
    $(document).ready(function() {
        $('textarea').characterCounter();
        $('ul.tabs').tabs();
        $('.modal-trigger').leanModal();
    });

    $scope.active_card = 'countries';

    function getTournaments() {
        $http.get('/api/tournaments')
            .then(function success(response) {
                $scope.tournaments = response.data;
                angular.forEach($scope.tournaments, function(obj, key) {
                  populateCountries(obj)
                });
            }, function error(response) {
                console.log(error)
            })
    }

    function populateCountries(tournament){
      $http.get('/api/countries/' + tournament.code)
          .then(function success(response) {
              tournament.countries = response.data;
          }, function(error) {
              console.log(error);
          })
    }

    $scope.addCountry = function() {
        $http.post('/api/country', $scope.country)
            .then(function success(response) {
                let tournament = $filter("filter")($scope.tournaments,{code:$scope.country.tournament})[0];
                populateCountries(tournament);
                $scope.country = {}
            }, function(error) {
                console.log(error);
            })
    }

    getTournaments();
})
