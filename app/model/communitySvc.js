app.factory("communitySvc", function ($http, $q) {
    var prayers = [];
    var lectures = [];
    var wasPreyInit = false;
    var wasLectureInit = false;

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

    return {
        getPreyaers: getPreyaers,
        getLectures:getLectures
    }
 });