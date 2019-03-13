app.controller('mainCtrl', function ($scope, $log, $location,placesSvc,communitySvc) {
    $scope.countries = [];
    $scope.cities = [];
    $scope.communities = [];
    $scope.city = 0;
    $scope.community = 0;
    
    placesSvc.getCountriesList().then(function (data) {
        $scope.countries = data;
    },
        function(err) {
            $log.error(err);
        }
    );

    $scope.loadCities = function () {
        if ($scope.country.length > 0) {
            $scope.cities=placesSvc.getCitiesList($scope.country);
        } else {
            $scope.cities = [];
        } 
    };

    $scope.getCommunities = function () {
        if ($scope.city.id > 0) {
            communitySvc.getCommunitiesByLocation($scope.country, $scope.city.name.trim()).then(function (data) {
                $scope.communities = data;
            }, function (err) {
                $log.error(err);
                $scope.communities = [];
            });
        }
    };

    $scope.showCommunity = function () {
        if ($scope.community && $scope.community.id > 0) {
            $location.path("/communities/" + $scope.community.id);
        }        
    }
});