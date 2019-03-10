app.controller('communityCtrl', function ($scope,$routeParams, communitySvc) {
    $scope.prayers = [];
    $scope.lectures = [];
    
    communitySvc.getPreyaers($routeParams.id).then(function (result) {
        $scope.prayers = result;
    });
    
    communitySvc.getLectures($routeParams.id).then(function (result) {
        $scope.lectures = result;
    });

    $scope.hasPreyers = function () {
        return ($scope.prayers.length > 0);
    };
    
    $scope.hasLectures = function () {
        return ($scope.lectures.length>0);
    }
 });