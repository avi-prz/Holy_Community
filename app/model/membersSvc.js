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

    function createMember(community, fName, lName, gender, phone, home_phone, userName, userPass, userMail, address, floor, flat_number,isAdmin,adminDesc) {
        var async = $q.defer();
        addUser(community, fName, lName, gender, phone, home_phone, userName, userPass, userMail, address, floor, flat_number, isAdmin, adminDesc).then(function (newUser) {
            async.resolve(newUser); 
        }, function (error) {
                async.reject(error);
        });
        return async.promise;
    }

    function addUser(community, fName, lName, gender, phone, home_phone, userName, userPass, userMail, address, floor, flat_number,isAdmin,adminDesc) {
        var async = $q.defer();
        const user = new Parse.User()
        user.set('username', userName);
        user.set('email', userMail);
        user.set('isAdmin', (isAdmin ? (isAdmin==='yes' ? true : false) : false));
        user.set('admin_description', adminDesc);
        user.set('isSuperAdmin', false);
        const comExt = Parse.Object.extend("Community");
        var comObj = new comExt();
        comObj.id = community;
        user.set('community', comObj);
        user.set('password', userPass);

        user.signUp().then(function (usrData) {
            addMember(usrData, fName, lName, userMail, gender, phone, home_phone, address, floor, flat_number, comObj).then(function (data) {
                var usr = new User(community, userName, userPass, userMail, usrData.get("isAdmin"), adminDesc);
                usr.id = usrData.id;
                async.resolve(usr);
            }, function (err) {
                    async.reject("יצירת משתמש חדש נכשלה : " + err.message);
                    ///TODO: delete the new user as the member data failed to be created!
            });
        }, function (error) {
            async.reject("יצירת משתמש חדש נכשלה : " + error.message);
        });
        return async.promise;
    }

    function addMember(user,fName,lName,userMail,gender,phone,home_phone,address,floor,flat_number,community) {
        var async = $q.defer();
        const members = Parse.Object.extend('members');
        const myNewObject = new members();

        myNewObject.set('member_user', user);
        myNewObject.set('community', community);
        myNewObject.set('first_name', fName);
        myNewObject.set('last_name', lName);
        myNewObject.set('address', address);
        myNewObject.set('phone', phone);
        myNewObject.set('email', userMail);
        // myNewObject.set('birth_date', new Date());
        // myNewObject.set('bar_mitzva', new Date());
        // myNewObject.set('bar_mitzva_parasha', 'A string');
        // myNewObject.set('wantToRead', true);
        // myNewObject.set('bar_mitzva_aliya', 'A string');
        // myNewObject.set('bar_mitzva_reading', 'A string');
        // myNewObject.set('marriage_date', new Date());
        const genMdl = Parse.Object.extend("Gender");
        var genObj = new genMdl();
        genObj.id = gender;
        myNewObject.set('gender', genObj);
        const mtMdl = Parse.Object.extend('Member_Type');
        var mtObj = new mtMdl();
        mtObj.id = "kxrEnJtK6h";  //ראשי
        myNewObject.set('member_type', mtObj);
        myNewObject.set('phone_home', home_phone);
        myNewObject.set('home_floor', floor);
        myNewObject.set('flat_number', flat_number);

        myNewObject.save().then(function (memberData) { 
            async.resolve(memberData);
        },
        function (error) {
            async.reject(error);
        });
        return async.promise;
    }

    return {
        createMember:createMember
    }
 });