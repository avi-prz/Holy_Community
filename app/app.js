var app = angular.module('holyCommunityApp', ['ngRoute']).config(function ($routeProvider) {
    $routeProvider.when("/", {
        templateUrl: "app/main/main.html",
        controller: "mainCtrl"
        /*redirectTo: "/communities/1"*/
    }).when('/communities/:id', {
        templateUrl: "app/community/community.html",
        controller: "communityCtrl"
    }).when('/members/new', {
        templateUrl: "app/member/newmember.html",
        controller: "newMemberCtrl"
    }).otherwise({
        redirectTo: "/"
    });
});