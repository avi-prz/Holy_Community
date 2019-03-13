app.factory('placesSvc', function ($http, $q) {
    function City(id, name, region, moaatza) {
        if (arguments.length === 1 && typeof id === "object") {
            this.id = id.id;
            this.name = id.name;
            this.region = id.region;
            this.moaatza = id.moaatza;
        } else {
            this.id = id;
            this.name = name;
            this.region = region;
            this.moaatza = moaatza;
        }
        
    }

    function Country(name, cities) {
        this.name = name;
        this.cities = new Array();
        for (var i = 0; i < cities.length; i++) {
            this.cities.push(new City(cities[i]));
        }
    }

    var countries = [];
    var countriesData = [];
    var wasInit = false;

    function init() {
        var async = $q.defer();
        if (wasInit) {
            async.resolve(countries);
        } else {
            var req = {
                method: "GET",
                url: "app/data/cities.json",
                dataType: "json",
                contentType: "application/json"
            };
            $http(req).then(function (results) {
                countries = Object.keys(results.data);                
                for (var i = 0; i < countries.length; i++) {
                    countriesData.push(new Country(countries[i], results.data[countries[i]]));
                }                
                async.resolve(countries);
                wasInit = true;
            }, 
                function (err) { 
                    async.reject(err);
                });
        }
        
        return async.promise;
    }

    function getCitiesListByCountry(country) {
        if (wasInit) {
            var i = countriesData.findIndex(c => c.name === country);
            if (i >= 0) {
                return countriesData[i].cities;
            } else {
                return [];
            }
        } else {
            return [];
        }
    }

    return {
        getCountriesList: init,
        getCitiesList:getCitiesListByCountry
    }
 });