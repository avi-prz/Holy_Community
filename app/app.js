var app = angular.module('holyCommunityApp', ['ngRoute','ngAnimate', 'ngTouch','ui.bootstrap']).config(function ($routeProvider) {
    $routeProvider.when('/', {
        templateUrl: "app/main/main.html",
        controller: "mainCtrl"
    }).when("/communities/new", {
        templateUrl: "app/community/newcommunity.html", 
        controller: "newCommunityCtrl"
    }).when('/communities/:id', {
        templateUrl: "app/community/community.html",
        controller: "communityCtrl"
    }).when('/members/new', {
        templateUrl: "app/member/newmember.html",
        controller: "newMemberCtrl"
    }).when('/members/new/:id', {
        templateUrl: "app/member/newmember.html",
        controller: "newMemberCtrl"
    }).otherwise({
        redirectTo: "/"
    });
});