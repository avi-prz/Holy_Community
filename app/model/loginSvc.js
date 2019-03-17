app.factory("loginSvc", function ($http, $q, $location, communitySvc) {
    function User(user) {
        this.id = user.id;
        this.firstName = "";
        this.lastName = "";
        this.loginName = user.get("username");
        this.password = user.get("password");
        this.email = user.get("email");
        this.isAdmin = user.get("isAdmin");
        this.adminDescription = user.get("admin_description");
        this.isSuperAdmin = user.get("isSuperAdmin");
        this.community = user.get("community") ? user.get("community").id : "";
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
        Parse.User.logIn(login, password).then(function (user) {           
            activeUser = new User(user);
            const member = Parse.Object.extend("members");
            const query = new Parse.Query(member);
            query.include("Member_Type");
            query.equalTo("member_user", Parse.User.current());
            query.find().then(function (data) {
                if (data.length > 0) {
                    activeUser.firstName = data[0].attributes.first_name;
                    activeUser.lastName = data[0].last_name;
                }
                async.resolve(activeUser);
            });                 
        },
        function (error) {            
            async.reject(error);
        });
        return async.promise;
    }

    function logout() {
        activeUser = null;
        $location.path("/");
    }

    function getActiveUser() {
        return activeUser;
    }

    return {
        current: getActiveUser,
        isLoggedOn: isUserLoggedOn,
        isCommunityAdmin: isCommunityAdmin,
        canCreateCommunity: canCreateCommunity,
        login: login,
        logout:logout
    }
 });