app.controller('newMemberCtrl', function ($scope, $log, $location, membersSvc,communitySvc) {
    $scope.hasFailed = false;
    $scope.error = "";

    $scope.community = communitySvc.current ? communitySvc.current.id : "";
    
    
    $scope.createMember = function () {
        membersSvc.createMember($scope.community, $scope.fName, $scope.lName, $scope.gender, $scope.phone, $scope.home_phone, $scope.userName, $scope.userPass, $scope.userMail, $scope.address, $scope.floor, $scope.flat_number).then(function (result) {
        //redirect to login; 
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