app.controller("eventCtrl", function($scope) {
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
    minDate: new Date(),
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
