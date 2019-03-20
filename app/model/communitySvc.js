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

    function Event(data) {
        this.id = data.id;
        this.title = data.get("title");
        this.date = data.get("event_date");
        this.time = data.get("event_time");
        this.description = data.get("description");
    }

    var communities = [];
    var currentComId = 0;
    var prayers = [];
    var lectures = [];
    var events = [];
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

    function getEvents(comId) {
        var async = $q.defer();
        lectures = [];
        const event = Parse.Object.extend("Events");
        const qry = new Parse.Query(event);
        const com = Parse.Object.extend("Community");
        var comQry = new com();
        comQry.id = comId;
        qry.equalTo("community", comQry);
        qry.find().then(function (data) { 
            if (data.length > 0) {
                for (var i = 0; i < data.length; i++) {
                    events.push(new Event(data[i]));
                }
            }
            async.resolve(events);
        }, function (error) {
                async.reject(error);
          });
        return async.promise;
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

    function getCommunityById(comId) {
        var async = $q.defer();
        var res = null;
        var idx = -1;
        if (wasInit) {            
            idx = communities.findIndex(com => com.id === comId);
            if (idx >= 0) {
                res = communities[idx];
            }
            async.resolve(res);
        } else {
            init().then(function (results) {                
                idx = results.findIndex(com => com.id === comId);
                if (idx >= 0) {
                    res = results[idx];
                }
                async.resolve(res);
            },
            function(error) {
                async.reject(error);
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
    
    function setCurrentCommunity(comId) {
        if (currentComId != comId) {
            currentComId = comId;
            prayers = [];
            wasPreyInit = false;
            lectures = [];
            wasLectureInit = false;
        }
    }

    function addPrayer(title,time,community) {
        var async = $q.defer();
        const prayMdl = Parse.Object.extend("Prayers");
        var newPrayer = new prayMdl();
        const comMdl = Parse.Object.extend("Community");
        var comObj = new comMdl();
        comObj.id = community.id;

        newPrayer.set('title', title);
        newPrayer.set('time', time);
        newPrayer.set('community', comObj);

        newPrayer.save().then(function(results){
            async.resolve(results);
        },
        function(error) {
            async.reject(error);
        });
        return async.promise;
    }

    function editPrayer(id,title,time) {
        var async = $q.defer();
        const prayMdl = Parse.Object.extend("Prayers");
        const qry = new Parse.Query(prayMdl);
        qry.get(id).then(function (prayObj) {
            prayObj.set('title', title);
            prayObj.set('time', time);
            prayObj.save().then(function (data) {
                async.resolve(data);
            },
            function (err) {
                async.reject(err);
            });
        },
        function (error) { 
            async.reject(error);
        });
        return async.promise;
    }

    function delPrayer(id) {
        var async = $q.defer();

        const prayMdl = Parse.Object.extend("Prayers");
        const qry = new Parse.Query(prayMdl);
        qry.get(id).then(function (prayObj) {
            prayObj.destroy().then(function (results) {
                async.resolve(results);
            },
            function (err) {
                async.reject(err);
            });
        },
        function(error) {
            async.reject(error);
        });
        return async.promise;
    }

    function addLesson(title,dayOfWeek,time,by,place,community) {
        var async = $q.defer();
        const lsnMdl = Parse.Object.extend("Lessons");
        var newLesson = new lsnMdl();
        const comMdl = Parse.Object.extend("Community");
        var comObj = new comMdl();
        comObj.id = community.id;

        newLesson.set('name', title);
        newLesson.set('dayOfWeek', dayOfWeek);
        newLesson.set('time', time);
        newLesson.set('teacher', by);
        newLesson.set('place', place);
        newLesson.set('community', comObj);

        newLesson.save().then(function(results){
            async.resolve(results);
        },
        function(error) {
            async.reject(error);
        });
        return async.promise;
    }

    function editLesson(id,title,dayOfWeek,time,by,place) {
        var async = $q.defer();
        const lsnMdl = Parse.Object.extend("Lessons");
        const qry = new Parse.Query(lsnMdl);
        qry.get(id).then(function (lsnObj) {
            lsnObj.set('name', title);
            lsnObj.set('dayOfWeek', dayOfWeek);
            lsnObj.set('time', time);
            lsnObj.set('teacher', by);
            lsnObj.set('place', place);
            lsnObj.save().then(function (data) {
                async.resolve(data);
            },
            function (err) {
                async.reject(err);
            });
        },
        function (error) { 
            async.reject(error);
        });
        return async.promise;
    }

    function delLesson(id) {
        var async = $q.defer();

        const lsnMdl = Parse.Object.extend("Lessons");
        const qry = new Parse.Query(lsnMdl);
        qry.get(id).then(function (lsnObj) {
            lsnObj.destroy().then(function (results) {
                async.resolve(results);
            },
            function (err) {
                async.reject(err);
            });
        },
        function(error) {
            async.reject(error);
        });
        return async.promise;
    }

    function addEvent(title,date,time,description,community) {
        var async = $q.defer();
        const Mdl = Parse.Object.extend("Events");
        var newObj = new Mdl();
        const comMdl = Parse.Object.extend("Community");
        var comObj = new comMdl();
        comObj.id = community.id;

        newObj.set('title', title);
        newObj.set('description', description);
        newObj.set('event_date', date);
        newObj.set('event_time', time);
        newObj.set('community', comObj);

        newObj.save().then(function(results){
            async.resolve(results);
        },
        function(error) {
            async.reject(error);
        });
        return async.promise;
    }

    function editEvent(id,title,description,date,time) {
        var async = $q.defer();
        const Mdl = Parse.Object.extend("Events");
        const qry = new Parse.Query(Mdl);
        qry.get(id).then(function (updObj) {
            updObj.set('title', title);
            updObj.set('description', description);
            updObj.set('event_date', date);
            updObj.set('event_time', time);
            updObj.save().then(function (data) {
                async.resolve(data);
            },
            function (err) {
                async.reject(err);
            });
        },
        function (error) { 
            async.reject(error);
        });
        return async.promise;
    }

    function delEvent(id) {
        var async = $q.defer();

        const Mdl = Parse.Object.extend("Events");
        const qry = new Parse.Query(Mdl);
        qry.get(id).then(function (objData) {
            objData.destroy().then(function (results) {
                async.resolve(results);
            },
            function (err) {
                async.reject(err);
            });
        },
        function(error) {
            async.reject(error);
        });
        return async.promise;
    }

    return {
        getCommunities:init,
        getPreyaers: getPreyaers,
        getLectures: getLectures,
        getEvents:getEvents,
        getCommunitiesByLocation: getCommunitiesByLocation,
        getCommunityById:getCommunityById,
        addCommunity: addCommunity,
        setActiveCommunity: setActiveCommunity,
        setCurrentCommunity:setCurrentCommunity,
        current: activeCommunity,
        addPrayer: addPrayer,
        editPrayer: editPrayer,
        delPrayer: delPrayer,
        addLesson: addLesson,
        editLesson: editLesson,
        delLesson: delLesson,
        addEvent: addEvent,
        editEvent: editEvent,
        delEvent: delEvent
    }
 });