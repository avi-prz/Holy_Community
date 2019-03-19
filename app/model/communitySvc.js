app.factory("communitySvc", function ($http, $q) {
    function Community(data) {
        this.id = data.id;
        this.name = data.get("name");
        this.country = data.get("country");
        this.city = data.get("city");
        this.address = data.get("address");
        this.description = data.get("description");
        this.foundation_date = data.get("foundation_date");
    }

    function Prayer(data) {
        this.id = data.id;
        this.title = data.get("title");
        this.time = data.get("time");
    }

    function Lesson(data) { 
        this.id = data.id;
        this.title = data.get("name");
        this.dayOfWeek = data.get("dayOfWeek");
        this.time = data.get("time");
        this.by = data.get("teacher");
        this.place = data.get("place");
    }

    var communities = [];
    var currentComId = 0;
    var prayers = [];
    var lectures = [];
    var wasPreyInit = false;
    var wasLectureInit = false;
    var wasInit = false;
    var activeCommunity = null;

    function init() {
        var async = $q.defer();
        if (wasInit) {
            async.resolve(communities);
        } else {            
            loadCommunities().then(function (results) {                
                async.resolve(communities);
                wasInit = true;
            },
                function (err) {
                    async.reject(err);
                });
        }
        return async.promise;
    }

    function loadCommunities() {
        var async = $q.defer();
        const community = Parse.Object.extend("Community");
        const query = new Parse.Query(community);
        query.find().then(function (results) {
            if (results.length > 0) {
                for (var i = 0; i < results.length; i++) {
                    communities.push(new Community(results[i]));
                }
                async.resolve(communities);
                wasInit = true;
            } else {
                async.resolve([]);
            }
        }, function (err) {
                async.reject(err);
        });
        return async.promise;
    }

    function getPreyaers(comId) {
        var async = $q.defer();
        prayers = [];
        const prayer = Parse.Object.extend("Prayers");
        const query = new Parse.Query(prayer);
        const com = Parse.Object.extend("Community");
        var comQry = new com();
        comQry.id = comId;
        query.equalTo("community", comQry);
        query.find().then(function (data) {
            if (data.length > 0) {
                for (var i = 0; i < data.length; i++) {
                    prayers.push(new Prayer(data[i]));
                }
            }
            async.resolve(prayers);
        }, function (error) {
                async.reject(error);
          });
        return async.promise;
    }

    function getLectures(comId) {
        var async = $q.defer();
        lectures = [];
        const lesson = Parse.Object.extend("Lessons");
        const qry = new Parse.Query(lesson);
        const com = Parse.Object.extend("Community");
        var comQry = new com();
        comQry.id = comId;
        qry.equalTo("community", comQry);
        qry.find().then(function (data) { 
            if (data.length > 0) {
                for (var i = 0; i < data.length; i++) {
                    lectures.push(new Lesson(data[i]));
                }
            }
            async.resolve(lectures);
        }, function (error) {
                async.reject(error);
          });
        return async.promise;
    }

    function setCurrentCommunity(comId) {
        if (currentComId != comId) {
            currentComId = comId;
            prayers = [];
            wasPreyInit = false;
            lectures = [];
            wasLectureInit = false;
        }
    }

    function getCommunitiesByLocation(country, city) {
        var async = $q.defer();
        if (wasInit) {
            var comms = communities.filter(com => com.country === country && com.city === city);
            async.resolve(comms);
        } else {
            init().then(function (results) {
                var comms = communities.filter(com => com.country === country && com.city === city);
                async.resolve(comms);
            },
                function (err) {
                    async.reject(err);
                });
        }
        return async.promise;
    }

    function addCommunity(name,description,country,city,address,foundation_date) { 
        var async = $q.defer();
        
        createCommunity(name, description, country, city, address, foundation_date).then(function (data) {
            async.resolve(data);
        },
            function (error) {
                async.reject(error);
            });
        return async.promise;
    }

    function createCommunity(name,description,country,city,address,foundation_date) {
        var async = $q.defer();

        const pCommunity = Parse.Object.extend('Community');
        const myNewObject = new pCommunity();

        myNewObject.set('name', name);
        myNewObject.set('country', country);
        myNewObject.set('city', city);
        myNewObject.set('address', address);
        myNewObject.set('description', description);
        myNewObject.set('foundation_date', foundation_date);
        // myNewObject.set('association_number', '');
        // myNewObject.set('bank_name', '');
        // myNewObject.set('bank_number', 0);
        // myNewObject.set('bank_branch', 0);
        // myNewObject.set('bank_account', '');
        //myNewObject.set('community_image', null); //new Parse.File("resume.txt", { base64: btoa("My file content") }));
        // myNewObject.set('coordinates', '');

        myNewObject.save().then(function (data) { 
            communities.push(new Community(data));
            async.resolve(communities[communities.length - 1]);
        }, function (error) {
            async.reject(error);
            });
        
        return async.promise;
    }

    function setActiveCommunity(communityId) {
        activeCommunity = null;
        currentComId = "";
        if (communities && communities.length > 0) {
            var i = communities.findIndex(com => com.id === communityId);
            if (i >= 0) {
                activeCommunity = communities[i];
                currentComId = communityId;
            } 
        }
    }

    return {
        getCommunities:init,
        setCurrentCommunity:setCurrentCommunity,
        getPreyaers: getPreyaers,
        getLectures: getLectures,
        getCommunitiesByLocation: getCommunitiesByLocation,
        addCommunity: addCommunity,
        setActiveCommunity: setActiveCommunity,
        current:activeCommunity
    }
 });