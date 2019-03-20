app.controller('navbarCtrl', function ($scope,$location,loginSvc,$routeParams) {
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

    $scope.username = "";
    $scope.password = "";
    $scope.errorMsg = "";
    $scope.current = loginSvc.current() ? new User(loginSvc.current()) : null;    

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
        if ($scope.username.length > 0 && $scope.password.length > 0) {
            loginSvc.login($scope.username, $scope.password).then(function (userData) {
                $scope.current = new User(userData);
                errorMsg = "";
                angular.element("#loginModal").modal("hide");
                if (userData.community.length > 0) {
                    $location.path("/communities/" + userData.community);
                }
            },
                function (err) {
                    if (err.code === 101) {
                        $scope.errorMsg = "שם משתמש או סיסמה לא נכונים!";
                    } else {
                        $scope.errorMsg = err.message;
                }                
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

    //add new member without login
    $scope.newMember = function () { 
        $location.path("/members/new");
    };

    //add a member to a community by community admin
    $scope.addMember = function () { 
        $location.path("/members/new/" + $scope.getCurrentCommunityId());
    };

    $scope.messages = function () { };
    $scope.addCommunity = function () {
        $location.path("/communities/new");
    };

    $scope.showCommunity = function () {
        if ($scope.getCurrentCommunityId().length > 0) {
            $location.path("/communities/" + $scope.getCurrentCommunityId());
        }
    };

    $scope.getName = function () {
        return ($scope.current ? $scope.current.firstName : '');
    };

    $scope.getCurrentCommunityId = function () { 
        var id = ($scope.current ? ($scope.current.communityId.length>0 ? $scope.current.communityId : ($routeParams.id ? $routeParams.id : "")) : ($routeParams.id ? $routeParams.id : ""));
        return id;
    };
});