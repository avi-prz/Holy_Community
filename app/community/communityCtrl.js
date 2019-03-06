app.controller('communityCtrl', function ($scope, communitySvc) {
    $scope.prayers = [];
    $scope.lectures = [];
    
    communitySvc.getPreyaers("1").then(function (result) {
        $scope.prayers = result;
    });
    
    communitySvc.getLectures("1").then(function (result) {
        $scope.lectures = result;
    });

    $scope.hasPreyers = function () {
        return ($scope.prayers.length > 0);
    };
    
    $scope.hasLectures = function () {
        return ($scope.lectures.length>0);
    }
 });