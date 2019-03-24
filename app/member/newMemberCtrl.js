app.controller('newMemberCtrl', function ($scope, $log, $location, membersSvc,$routeParams,loginSvc) {
    $scope.hasFailed = false;
    $scope.error = "";
    $scope.gender = "HHYTbMLfFV"; //זכר
    $scope.isUserAdmin = "no";

    $scope.community = $routeParams ? $routeParams.id : "";
    
    $scope.isBusy = function (value) {
        var btn = angular.element("#btnAddMember");
        var sts = angular.element("#stsAddMember");
        btn.toggleClass("ng-hide");
        sts.toggleClass("ng-hide");
    };

    $scope.createMember = function () {
        $scope.isBusy(true);
        membersSvc.createMember($scope.community, $scope.fName, $scope.lName, $scope.gender, $scope.phone, $scope.home_phone, $scope.userName, $scope.userPass, $scope.userMail, $scope.address, $scope.floor, $scope.flat_number, $scope.isUserAdmin, $scope.adminDesc).then(function (result) {
            if (!loginSvc.current()) {
                loginSvc.login(result.userName, result.userPass).then(function (data) {
                    $scope.isBusy(false);
                    $location.path("communities/" + $scope.community);                    
                }, function (error) {
                    $log.error(error);
                    $scope.isBusy(false);
                    $location.path("/");
                }); 
            } else {
                if ($scope.community.length > 0) {
                    $scope.isBusy(false);
                    $location.path("communities/" + $scope.community);
                } else {
                    $scope.isBusy(false);
                    $location.path("/");
                }
            }                           
        },
            function (err) {
                $log.error(err);
                $scope.error = err;
                $scope.hasFailed = true;
            });
            $scope.isBusy(false);
    };
    
    $scope.cancel = function () {
        if ($routeParams && $routeParams.id) {
            $location.path("/communities/" + $routeParams.id);
        } else {
            $location.path("/");
        }        
    };
 });