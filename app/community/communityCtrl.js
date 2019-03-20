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

    $scope.modalPrayClick = function (mode, prayerId) {
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

    $scope.modalLsnClick = function (mode, lessonId) {
        switch (mode) {
            case "add":
                return $scope.addLesson();
                break;
            case "edit":
                return $scope.editLesson(lessonId);
                break;
            case "del":
                return $scope.delLesson(lessonId);
                break;
        }
    };

    $scope.addLesson = function () {
        communitySvc.addLesson($scope.lessonTitle,$scope.lessonDOW, $scope.lessonTime,$scope.lessonBy,$scope.lessonPlace, $scope.community).then(function (data) {            
            $scope.errorMsg = "";
            angular.element("#lessonModal").modal('hide');
            communitySvc.getLectures($routeParams.id).then(function (result) {
                $scope.lectures = result;
            });
        },
        function (error) {
            $log.error(error.message);
            $scope.errorMsg = error.message;
        });
    };

    $scope.delLesson = function (lessonId) {
        communitySvc.delLesson(lessonId).then(function (data) {
            communitySvc.getLectures($routeParams.id).then(function (result) {
                $scope.lectures = result;
            });
        },
            function (error) {
                $log.error(error);
                alert(error.message);
            });
    };

    $scope.editLesson = function (lessonId) {
        communitySvc.editLesson(lessonId, $scope.lessonTitle,$scope.lessonDOW, $scope.lessonTime,$scope.lessonBy,$scope.lessonPlace).then(function (data) {
            $scope.errorMsg = "";
            angular.element("#lessonModal").modal('hide');
            communitySvc.getLectures($routeParams.id).then(function (result) {
                $scope.lectures = result;
            });
        },
            function (error) { 
                $scope.errorMsg = error.message;
         });
    };

    $scope.clickAddLesson = function () {
        $scope.modalHeader = "הוספת שיעור";
        $scope.modalButton = "הוסף";
        $scope.mode = "add";
        $scope.lessonId = "";
        $scope.lessonTitle = "";
        $scope.lessonDOW = "";
        $scope.lessonTime = "";
        $scope.lessonBy = "";
        $scope.lessonPlace = "";
        angular.element("#lessonModal").modal('show');
    };

    $scope.clickEditLesson = function (id) {
        $scope.modalHeader = "עדכן שיעור";
        $scope.modalButton = "עדכן";
        $scope.mode = "edit";
        var lsn = $scope.lectures[$scope.lectures.findIndex(l => l.id === id)];
        $scope.lessonTitle = lsn.title;
        $scope.lessonDOW = lsn.dayOfWeek;
        $scope.lessonTime = lsn.time;
        $scope.lessonBy = lsn.by;
        $scope.lessonPlace = lsn.place;
        $scope.lessonId = id;
        angular.element("#lessonModal").modal('show');
    };
 });