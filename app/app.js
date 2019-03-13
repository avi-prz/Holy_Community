var app = angular.module('holyCommunityApp', ['ngRoute','ui.bootstrap']).config(function ($routeProvider) {
    $routeProvider.when("/", {
        templateUrl: "app/community/newcommunity.html", //"app/main/main.html",
        controller: "newCommunityCtrl"
        // redirectTo: "/communities/1"
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