app.controller('communityCtrl', function ($scope,$routeParams,$log,$location,loginSvc, communitySvc) {
    $scope.prayers = [];
    $scope.lectures = [];
    $scope.events = [];
    $scope.modalHeader = "";
    $scope.modalButton = "";
    $scope.errorMsg = "";

    $scope.current = loginSvc.current() ? loginSvc.current() : null;    

    $scope.isLoggedOn = function () {
        $scope.current = loginSvc.current() ? loginSvc.current() : null;
        return $scope.current ? true : false;
    };

    if (!$scope.isLoggedOn() && $location.path().indexOf("/manage/")>=0) {
        $location.path("/");
    };

    communitySvc.getCommunityById($routeParams.id).then(function (data) {
        $scope.community = data;
    },
    function (error) { 
        $log.error(error.message);
    });
    
    communitySvc.getPrayers($routeParams.id).then(function (result) {
        $scope.prayers = result;
        //angular.element('#prayersScroll').start();
    });
    
    communitySvc.getLectures($routeParams.id).then(function (result) {
        $scope.lectures = result;
    });

    communitySvc.getEvents($routeParams.id).then(function (result) {
        $scope.events = result;
    });

    $scope.hasPrayers = function () {
        return ($scope.prayers.length > 0);
    };
    
    $scope.hasLectures = function () {
        return ($scope.lectures.length > 0);
    };

    $scope.hasEvents = function () {
        return ($scope.events.length > 0);
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
            communitySvc.getPrayers($routeParams.id).then(function (result) {
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
            communitySvc.getPrayers($routeParams.id).then(function (result) {
                $scope.errorMsg = "";
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
            communitySvc.getPrayers($routeParams.id).then(function (result) {
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
                $scope.errorMsg = "";
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

    $scope.clickAddEvent = function () {
        $scope.modalHeader = "הוספת אירוע";
        $scope.modalButton = "הוסף";
        $scope.mode = "add";
        $scope.eventId = "";
        $scope.eventTitle = "";
        $scope.eventDate = new Date();
        $scope.eventTime = "";
        $scope.eventDesc = "";
        angular.element("#eventModal").modal('show');
    };

    $scope.clickEditEvent = function (id) {
        $scope.modalHeader = "עדכן אירוע";
        $scope.modalButton = "עדכן";
        $scope.mode = "edit";
        var evnt = $scope.events[$scope.events.findIndex(ev => ev.id === id)];
        $scope.eventTitle = evnt.title;
        $scope.eventDate = new Date(evnt.date);
        $scope.eventTime = evnt.time;
        $scope.eventDesc = evnt.description;
        $scope.eventId = id;
        angular.element("#eventModal").modal('show');
    };

    $scope.addEvent = function () {
        communitySvc.addEvent($scope.eventTitle,$scope.eventDate, $scope.eventTime,$scope.eventDesc, $scope.community).then(function (data) {            
            $scope.errorMsg = "";
            angular.element("#eventModal").modal('hide');
            communitySvc.getEvents($routeParams.id).then(function (result) {
                $scope.events = result;
            });
        },
        function (error) {
            $log.error(error.message);
            $scope.errorMsg = error.message;
        });
    };

    $scope.delEvent = function (eventId) {
        communitySvc.delEvent(eventId).then(function (data) {
            communitySvc.getEvents($routeParams.id).then(function (result) {
                $scope.errorMsg = "";
                $scope.events = result;
            });
        },
            function (error) {
                $log.error(error);
                alert(error.message);
            });
    };

    $scope.editEvent = function (eventId) {
        communitySvc.editEvent(eventId, $scope.eventTitle,$scope.eventDate, $scope.eventTime,$scope.eventDesc).then(function (data) {
            $scope.errorMsg = "";
            angular.element("#eventModal").modal('hide');
            communitySvc.getEvents($routeParams.id).then(function (result) {
                $scope.events = result;
            });
        },
            function (error) { 
                $scope.errorMsg = error.message;
         });
    };

    $scope.modalEventClick = function (mode, eventId) {
        switch (mode) {
            case "add":
                return $scope.addEvent();
                break;
            case "edit":
                return $scope.editEvent(eventId);
                break;
            case "del":
                return $scope.delEvent(eventId);
                break;
        }
    };

    //all code from here is related to the operation of the datepicker control
  $scope.today = function() {
    $scope.eventDate = new Date();
  };

  $scope.formats = ["dd-MM-yyyy","dd-MMMM-yyyy","yyyy/MM/dd","dd.MM.yyyy","shortDate"];
  $scope.format = $scope.formats[0];
  $scope.altInputFormats = ["M!/d!/yyyy"];

  $scope.clear = function() {
    $scope.eventDate = null;
  };

  $scope.options = {
    customClass: getDayClass,
    minDate: null,
    showWeeks: true
  };

  $scope.setDate = function(year, month, day) {
    $scope.eventDate = new Date(year, month, day);
  };

  var tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  var afterTomorrow = new Date(tomorrow);
  afterTomorrow.setDate(tomorrow.getDate() + 1);

  $scope.events = [
    {
      date: tomorrow,
      status: "full"
    },
    {
      date: afterTomorrow,
      status: "partially"
    }
  ];

  function getDayClass(data) {
    var date = data.date,
      mode = data.mode;
    if (mode === "day") {
      var dayToCheck = new Date(date).setHours(0, 0, 0, 0);

      for (var i = 0; i < $scope.events.length; i++) {
        var currentDay = new Date($scope.events[i].date).setHours(0, 0, 0, 0);

        if (dayToCheck === currentDay) {
          return $scope.events[i].status;
        }
      }
    }

    return "";
  };

  $scope.toggleMin = function() {
    $scope.options.minDate = $scope.options.minDate ? null : new Date();
  };

  $scope.toggleMin();
 });
