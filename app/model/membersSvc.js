app.factory('membersSvc', function ($q) {
    function User(community, userName, userPassword, userEmail, isAdmin, adminDescription) {
        this.community = community;
        this.userName = userName;
        this.userPass = userPassword;
        this.userEmail = userEmail;
        this.isAdmin = isAdmin;
        this.adminDescription = adminDescription;
        this.id = "";
    }

    function Member(community,userId,fName,lName,gender,phone,home_phone,userEmail,address,floor,flat_number) {
        this.community = community;
        this.userId = userId;
        this.fName = fName;
        this.lName = lName
        this.gender = gender;
        this.phone = phone;
        this.home_phone = home_phone;
        this.userEmail = userEmail
        this.address = address;
        this.floor = floor;
        this.flat_number = flat_number;
    }

    function createMember(community, fName, lName, gender, phone, home_phone, userName, userPass, userMail, address, floor, flat_number) {
        var async = $q.defer();
        async.reject("DB is not connected yet!");
        return async.promise;
    }

    return {
        createMember:createMember
    }
 });