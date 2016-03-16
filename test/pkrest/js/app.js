var app = angular.module('pkrest', ['ngRoute', 'ngResource']);

app.config(function ($routeProvider, $locationProvider) {
    $routeProvider
        .when('/', {
            templateUrl: 'views/home.html',
        })
});

app.service("Post", function ($resource) {
    return $resource("http://parkocka.hu/wp-json/posts");
});

app.controller('homeController', ['$scope', '$filter', 'Post', function ($scope, $filter, Post) {
    Post.query(function (posts) {
        
        // set the default amount of items being displayed
        $scope.limit = 5;

        // loadMore function
        $scope.loadMore = function () {
            $scope.limit += 5; 
        }
        $scope.htmlToPlaintext = function (text) {
            return text ? String(text).replace(/<[^>]+>/gm, '') : '';
        }
        $scope.extrImgPath = /<img[^>]+src\s*=\s*['"]([^'"]+)['"][^>]*>/g;
        
        $scope.posts = $filter('filter')(posts, {status: 'publish'}[0]);
    });
}]);

//app.controller('heroController', ['$scope', 'Post', function ($scope, Post) {
//    Post.query(function (posts) {
//        $scope.posts = posts;
//        // set the default amount of items being displayed
//        $scope.limit = 1;
//
//        // loadMore function
//        $scope.htmlToPlaintext = function (text) {
//            return text ? String(text).replace(/<[^>]+>/gm, '') : '';
//        }
//        $scope.extrImgPath = /<img[^>]+src\s*=\s*['"]([^'"]+)['"][^>]*>/g;
//    });
//}]);
