app.controller('navbarCtrl', function ($scope,$log,$location,loginSvc) {
    function User(user) {
        this.id = user.id;
        this.firstName = user.firstName;
        this.LastName = user.lastName;
        this.login = user.loginName;
        this.email = user.email;
        this.isAdmin = user.isAdmin;
        this.adminDescription = user.adminDescription;
        this.isSuperAdmin = user.isSuperAdmin;
        this.communityId = user.community;
    }

    $scope.userName = "";
    $scope.userPass = "";
    $scope.errorMsg = "";
    $scope.current = loginSvc.current ? new User(loginSvc.current) : null;    

    $scope.isLoggedOn = function () {
        return $scope.current ? true : false;
    };

    $scope.canAddCommunity = function () { 
        return $scope.current ? $scope.current.isSuperAdmin : false;
    }; 

    $scope.isCommunityAdmin = function () { 
        return $scope.current ? $scope.current.communityId && $scope.current.isAdmin : false;
    }; 

    $scope.login = function () { 
        if ($scope.userName.length > 0 && $scope.userPass.length > 0) {
            loginSvc.login($scope.userName, $scope.userPass).then(function (userData) {
                $scope.current = new User(userData);
                errorMsg = "";
                angular.element("#loginModal").modal("hide");
            },
            function (err) {
                $scope.errorMsg = err;
            });
        } else {
            $scope.errorMsg = "נא להקליד שם משתמש וסיסמה!";
        }
    };

    $scope.logout = function () { 
        loginSvc.logout();
        $scope.current = null;
        $location.path("/");
    };

    $scope.newMember = function () { 
        $location.path("/members/new");
    };

    $scope.messages = function () { };
    $scope.addCommunity = function () {
        $location.path("/communities/new");
    };
});