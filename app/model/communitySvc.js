app.factory("communitySvc", function ($http, $q) {
    function Community(data) {
        this.id = data.id;
        this.name = data.name;
        this.country = data.country;
        this.city = data.city;
        this.address = data.address;
        this.description = data.description;
        this.foundation_date = data.foundation_date;
    }

    var communities = [];
    var currentComId = 0;
    var prayers = [];
    var lectures = [];
    var wasPreyInit = false;
    var wasLectureInit = false;
    var wasInit = false;

    function init() {
        var async = $q.defer();
        if (wasInit) {
            async.resolve(communities);
        } else {
            var req = {
                method: "get",
                url: "./app/data/communities.json",
                dataType: "json",
                contentType: "application/json"
            };
            $http(req).then(function (results) {
                // communities = results.data;
                for (var i = 0; i < results.data.length; i++) {
                    communities.push(new Community(results.data[i]));
                }
                async.resolve(communities);
                wasInit = true;
            },
                function (err) {
                    async.reject(err);
                });
        }
        return async.promise;
    }

    function getPreyaers(comId) {
        var async = $q.defer();
        if (wasPreyInit) {
            async.resolve(prayers[comId]);
        } else {
            var req = {
                method: "get",
                url: "./app/data/Praytimes.json",
                dataType: "json",
                contentType: "application/json"
            };
            $http(req).then(function (results) {
                prayers = results.data;
                async.resolve(prayers[comId]);
                wasPreyInit = true;
            },
                function (err) {
                    async.reject(err);
                });
        }
        return async.promise;
    }

    function getLectures(comId) {
        var async = $q.defer();
        if (wasLectureInit) {
            async.resolve(lectures[comId]);
        } else {
            var req = {
                method: "get",
                url: "./app/data/lectures.json",
                dataType: "json",
                contentType: "application/json"
            };
            $http(req).then(function (results) {
                lectures = results.data;
                async.resolve(lectures[comId]);
            },
                function (err) {
                    async.reject(err);
                });
        }
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
            var comms = communities.find(com => com.country === country && com.city === city);
            async.resolve(comms);
        } else {
            init().then(function (results) {
                var comms = communities.find(com => com.country === country && com.city === city);
                async.resolve(comms);
            },
                function (err) {
                    async.reject(err);
                });
        }
        return async.promise;
    }

    return {
        getCommunities:init,
        setCuurentCommunity:setCurrentCommunity,
        getPreyaers: getPreyaers,
        getLectures: getLectures,
        getCommunitiesByLocation:getCommunitiesByLocation
    }
 });