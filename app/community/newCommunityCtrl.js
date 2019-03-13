app.controller("newCommunityCtrl",function($scope,$log,$location,placesSvc ){
    $scope.counties=[];
    $scope.cities=[];

    placesSvc.getCountriesList().then(function(result){
        $scope.countries=result;
    },
    function(err){
        $log.error(err);
    });

    $scope.getCities=function(){
        if ($scope.country.length>0) {
            $scope.cities = placesSvc.getCitiesList($scope.country);
        } else {
            $scope.cities = [];
        }
    };
});