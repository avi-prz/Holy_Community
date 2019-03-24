app.controller("newCommunityCtrl",function($scope,$log,$location,placesSvc,communitySvc ){
    $scope.counties=[];
  $scope.cities = [];
  $scope.errMsg = "";
  
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

  $scope.add = function () {
    angular.element("#btnAddCom").toggleClass("ng-hide");
    if (!$scope.name || $scope.name.length===0 || !$scope.description || $scope.description.length===0 || !$scope.country || $scope.country.length===0 || !$scope.city || !$scope.address || $scope.address.length===0) {
      $scope.errMsg = "חובה למלא את כל השדות!";
      angular.element("#btnAddCom").toggleClass("ng-hide");
      return;
    }
    communitySvc.addCommunity($scope.name, $scope.description, $scope.country, $scope.city.name, $scope.address, $scope.foundation_date).then(function (result) {
      $scope.errMsg = "";
      angular.element("#btnAddCom").toggleClass("ng-hide");
      $location.path("communities/"+result.id);
    },
      function (err) {
        $scope.errMsg = err;
        $log.error(err);
        angular.element("#btnAddCom").toggleClass("ng-hide");
      });
  };

  $scope.hasError = function () {
    return $scope.errMsg.length > 0;
  };
  
    //all code from here is related to the operation of the datepicker control
    $scope.today = function() {
        $scope.foundation_date = new Date();
    };
    
    $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
    $scope.format = $scope.formats[0];
    $scope.altInputFormats = ['M!/d!/yyyy'];
  
    $scope.popup1 = {
      opened: false
    };
  
    $scope.popup2 = {
      opened: false
    };

    $scope.open1 = function() {
        $scope.popup1.opened = true;
      };
    
      $scope.open2 = function() {
        $scope.popup2.opened = true;
    };
    
    $scope.clear = function() {
        $scope.foundation_date = null;
      };
    
      $scope.inlineOptions = {
        customClass: getDayClass,
        minDate: new Date(),
        showWeeks: false
      };
    
      $scope.dateOptions = {
        dateDisabled: disabled,
        formatYear: 'yy',
        maxDate: new Date(),//new Date(2020, 5, 22),
        minDate: new Date(1900,1,1),
        startingDay: 0
    };
    
    $scope.setDate = function(year, month, day) {
        $scope.foundation_date = new Date(year, month, day);
    };
    
    function getDayClass(data) {
        var date = data.date,
          mode = data.mode;
        if (mode === 'day') {
          var dayToCheck = new Date(date).setHours(0,0,0,0);
    
          for (var i = 0; i < $scope.events.length; i++) {
            var currentDay = new Date($scope.events[i].date).setHours(0,0,0,0);
    
            if (dayToCheck === currentDay) {
              return $scope.events[i].status;
            }
          }
        }
    
        return '';
    };

    // Disable weekend selection
  function disabled(data) {
    var date = data.date,
      mode = data.mode;
    return mode === 'day' && (date.getDay() === 5 || date.getDay() === 6);
  }

  $scope.toggleMin = function() {
    $scope.inlineOptions.minDate = $scope.inlineOptions.minDate ? null : new Date();
    $scope.dateOptions.minDate = $scope.inlineOptions.minDate;
  };

  $scope.toggleMin();
});