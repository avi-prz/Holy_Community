app.factory("loginSvc", function ($http, $q, $location, communitySvc) {
    function User(id, firstName, lastName, loginName, password, email, isAdmin, adminDescription, isSuperAdmin, community) {
        if (arguments.length === 1 && typeof id === "object") {
            this.id = id.id;
            this.firstName = id.firstName;
            this.lastName = id.lastName;
            this.loginName = id.loginName;
            this.password = id.password;
            this.email = id.email;
            this.isAdmin = id.isAdmin;
            this.adminDescription = id.adminDescription;
            this.isSuperAdmin = id.isSuperAdmin;
            this.community = id.community;
        } else {
            this.id = id;
            this.firstName = firstName;
            this.lastName = lastName;
            this.loginName = loginName;
            this.password = password;
            this.email = email;
            this.isAdmin = isAdmin;
            this.adminDescription = adminDescription;
            this.isSuperAdmin = isSuperAdmin;
            this.community = community;
        }                
    }

    var activeUser = null;

    var users = [];
    var wasInit = false;

    function init() {
        var async = $q.defer();
        if (wasInit) {
            async.resolve(users);
        } else {
            var req = {
                method: "GET",
                url: "app/data/users.json",
                dataType: "json",
                contentType: "application/json"
            };
            $http(req).then(function (result) {
                for (var i = 0; i < result.data.length; i++){
                    var rawData = result.data[i];
                    users.push(new User(result.data[i]));
                }
                async.resolve(users);
                wasInit = true;
            },
            function (err) {
                async.reject(err);
            });
        }
        return async.promise;
    }
    
    function isUserLoggedOn() {
        if (activeUser) {
            return true;
        } else {
            return false;
        }
    }

    function isCommunityAdmin() {
        if (isUserLoggedOn()) {
            if (activeUser.community && activeUser.isAdmin) {
                return true;
            } 
        }
        
        return false;        
    }

    function canCreateCommunity() {
        if (isUserLoggedOn()) {
            if (activeUser.isSuperAdmin) {
                return true;
            }
        }

        return false;
    }

    function checkLogin(login, password) {
        var i = users.findIndex(u => u.loginName === login);
        if (i >= 0) {
            if (users[i].password === password) {
                activeUser = users[i];
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    }

    function login(login, password) {
        activeUser = null;
        var async = $q.defer();
        if (wasInit) {
            if (checkLogin(login, password)) {                
                if (activeUser.community.length > 0) {
                    communitySvc.setActiveCommunity(activeUser.community);
                }
                async.resolve(activeUser);
            } else {
                async.reject("שם משתמש או סיסמה לא חוקי");
            }   
        } else {
            init().then(function (result) {
                if (checkLogin(login, password)) {
                    async.resolve(activeUser);
                } else {
                    async.reject("שם משתמש או סיסמה לא חוקי");
                } 
            },
            function (err) {
                async.reject(err);
            });
        }

        return async.promise;
    }

    function logout() {
        activeUser = null;
        $location.path("/");
    }

    return {
        current: activeUser,
        isLoggedOn: isUserLoggedOn,
        isCommunityAdmin: isCommunityAdmin,
        canCreateCommunity: canCreateCommunity,
        login: login,
        logout:logout
    }
 });