var app = angular.module('holyCommunityApp', ['ngRoute']).config(function ($routeProvider) {
    $routeProvider.when("/", {
        templateUrl: "main.html"/*,
        controller: "communityCtrl"
        redirectTo: "/communities/1"*/
    }).when('/communities/:id', {
        templateUrl: "app/community/community.html",
        controller: "communityCtrl"
    }).otherwise({
        redirectTo: "/"
    });
});