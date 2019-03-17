app.factory("loginSvc", function ($http, $q, $location, communitySvc) {
    function User(user) {//, firstName, lastName, loginName, password, email, isAdmin, adminDescription, isSuperAdmin, community) {
        // if (arguments.length === 1 && typeof id === "object") {
        //     this.id = id.id;
        //     this.firstName = id.firstName;
        //     this.lastName = id.lastName;
        //     this.loginName = id.loginName;
        //     this.password = id.password;
        //     this.email = id.email;
        //     this.isAdmin = id.isAdmin;
        //     this.adminDescription = id.adminDescription;
        //     this.isSuperAdmin = id.isSuperAdmin;
        //     this.community = id.community;
        // } else {
        //     this.id = id;
        //     this.firstName = firstName;
        //     this.lastName = lastName;
        //     this.loginName = loginName;
        //     this.password = password;
        //     this.email = email;
        //     this.isAdmin = isAdmin;
        //     this.adminDescription = adminDescription;
        //     this.isSuperAdmin = isSuperAdmin;
        //     this.community = community;
        // }
        this.id = user.id;
        this.firstName = "";//user.attributes.firstName;
        this.lastName = "";//user.attributes.lastName;
        this.loginName = user.attributes.username;
        this.password = user.attributes.password;
        this.email = user.attributes.email;
        this.isAdmin = user.attributes.isAdmin;
        this.adminDescription = user.attributes.admin_description;
        this.isSuperAdmin = user.attributes.isSuperAdmin;
        this.community = "";
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
            const m_type = Parse.Object.extend("Member_Type");
            const query = new Parse.Query(m_type);
            const query2 = new Parse.Query(member);
            query.equalTo("description", "ראשי");
            query.find().then(function (results) {
                query2.equalTo("member_type", results[0]);
                query2.equalTo("member_user", Parse.User.current());
                query2.find().then(function (results) {
                    if (results.length > 0) {
                        activeUser.firstName = results[0].attributes.first_name;
                        activeUser.lastName = results[0].attributes.last_name;
                    }                    
                    async.resolve(activeUser);
                });
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