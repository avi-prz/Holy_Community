app.controller('newMemberCtrl', function ($scope, $log, $location, membersSvc,$routeParams,loginSvc) {
    $scope.hasFailed = false;
    $scope.error = "";
    $scope.gender = "HHYTbMLfFV";
    $scope.isUserAdmin = "no";

    $scope.community = $routeParams ? $routeParams.id : "";
    
    $scope.createMember = function () {
        membersSvc.createMember($scope.community, $scope.fName, $scope.lName, $scope.gender, $scope.phone, $scope.home_phone, $scope.userName, $scope.userPass, $scope.userMail, $scope.address, $scope.floor, $scope.flat_number,$scope.isUserAdmin,$scope.adminDesc).then(function (result) {
        //redirect to login;
            $location.path("communities/"+$scope.community);    
        },
            function (err) {
                $log.error(err);
                $scope.error = err;
                $scope.hasFailed = true;
            });
    };
    
    $scope.cancel = function () {
      $location.path("/")  
    };
 });