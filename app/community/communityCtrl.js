app.controller('communityCtrl', function ($scope,$routeParams,$log,$location,loginSvc, communitySvc) {
    $scope.prayers = [];
    $scope.lectures = [];
    $scope.modalHeader = "";
    $scope.modalButton = "";

    $scope.current = loginSvc.current() ? loginSvc.current() : null;    

    $scope.isLoggedOn = function () {
        return $scope.current ? true : false;
    };

    if (!$scope.isLoggedOn()) {
        $location.path("/");
    };

    communitySvc.getCommunityById($routeParams.id).then(function (data) {
        $scope.community = data;
    },
    function (error) { 
        $log.error(error.message);
    });
    
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
        return ($scope.lectures.length > 0);
    };

    $scope.clickAddPrayer = function () {
        $scope.modalHeader = "הוספת תפילה";
        $scope.modalButton = "הוסף";
        $scope.mode = "add";
        $scope.prayerId = "";
        $scope.prayName = "";
        $scope.prayTime = "";
        angular.element("#prayerModal").modal('show');
    };

    $scope.clickEditPrayer = function (id) {
        $scope.modalHeader = "עדכן תפילה";
        $scope.modalButton = "עדכן";
        $scope.mode = "edit";
        var pray = $scope.prayers[$scope.prayers.findIndex(p => p.id === id)];
        $scope.prayName = pray.title;
        $scope.prayTime = pray.time;
        $scope.prayerId = id;
        angular.element("#prayerModal").modal('show');
    };

    $scope.addPrayer = function () {
        communitySvc.addPrayer($scope.prayName, $scope.prayTime, $scope.community).then(function (data) {            
            $scope.errorMsg = "";
            angular.element("#prayerModal").modal('hide');
            communitySvc.getPreyaers($routeParams.id).then(function (result) {
                $scope.prayers = result;
            });
        },
        function (error) {
            $log.error(error.message);
            $scope.errorMsg = error.message;
        });
    };

    $scope.delPrayer = function (prayId) {
        communitySvc.delPrayer(prayId).then(function (data) {
            communitySvc.getPreyaers($routeParams.id).then(function (result) {
                $scope.prayers = result;
            });
        },
            function (error) {
                $log.error(error);
                alert(error.message);
            });
    };

    $scope.editPrayer = function (prayId) {
        communitySvc.editPrayer(prayId, $scope.prayName, $scope.prayTime).then(function (data) {
            $scope.errorMsg = "";
            angular.element("#prayerModal").modal('hide');
            communitySvc.getPreyaers($routeParams.id).then(function (result) {
                $scope.prayers = result;
            });
        },
            function (error) { 
                $scope.errorMsg = error.message;
         });
    };

    $scope.modalClick = function (mode, prayerId) {
        switch (mode) {
            case "add":
                return $scope.addPrayer();
                break;
            case "edit":
                return $scope.editPrayer(prayerId);
                break;
            case "del":
                return $scope.delPrayer(prayerId);
                break;
        }
    };
 });