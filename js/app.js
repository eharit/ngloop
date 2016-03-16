var app = angular.module('app', ['ngResource', 'firebase']);

app.controller('mainController', ['$scope', '$firebaseObject', '$firebaseAuth', function ($scope, $firebaseObject, $firebaseAuth) {

    var ref = new Firebase("https://loopgrfikaeu.firebaseio.com");

    var syncObject = $firebaseObject(ref);
    // synchronize the object with a three-way data binding
    syncObject.$bindTo($scope, "data");

    // authenticate

    $scope.email = "";
    $scope.password = "";

    $scope.date = new Date();

    $scope.showAuth = function () {
        $scope.authShow = true;
    }

    $scope.hideAuth = function () {
        $scope.authShow = false;
        $scope.logoutShow = true;
    }

    $scope.logout = function () {
        $scope.logoutShow = false;
        $scope.authenticated = false;
        $scope.email = "";
        $scope.password = "";
        $scope.auth();
    }

    $scope.auth = function () {

        var authEmail = $scope.email;
        var authPassword = $scope.password;

        ref.authWithPassword({
            email: authEmail,
            password: authPassword
        }, function (error, authData) {
            if (error) {
                console.log("Login Failed!", error);
                console.log($scope.email, $scope.password);
                $scope.authenticated = false;
            } else {
                console.log($scope.email, $scope.password);
                console.log("Authenticated successfully with payload:", authData);
                $scope.$apply(function () {
                    $scope.authenticated = true;
                    $scope.hideAuth();
                });

            }
        });
    }
}]);


app.controller('galleryController', ['$scope', '$log', '$resource', function ($scope, $log, $resource) {

    var user = 'loop-grafika';
    var apiKey = 'Nevz7kXlgyfE1yCMqExjOZgKeS0v4obC';
    var url = 'http://behance.net/v2/users/' + user + '/projects?api_key=' + apiKey;

    $scope.quantity = 12;

    $scope.connectBehance = $resource(url, {
        q: '',
        callback: 'JSON_CALLBACK'
    }, {
        get: {
            method: 'JSONP',
            cache: true
        },
    }, {
        'get': {
            method: 'GET',
            cache: true
        }
    });

    $scope.behance = $scope.connectBehance.get();
    $log.info($scope.behance);

}]);

//app.factory('behanceFactory', function ($http) {
//    var factory = {
//        async: function (page) {
//            var user = 'loop-grafika';
//            var apiKey = 'Nevz7kXlgyfE1yCMqExjOZgKeS0v4obC';
//            var url = 'http://behance.net/v2/users/' + user + '/projects?api_key=' + apiKey + '&callback=JSON_CALLBACK';
//            var promise = $http.jsonp(url)
//                .error(function (response, status) {
//                    alert(status);
//                })
//                .success(function (response, status) {
//                    //console.log(response.projects);
//                })
//                .then(function (response, status) {
//                    return response.data;
//                });
//            return promise;
//        }
//    };
//    return factory;
//});

app.directive("contenteditable", function () {
    return {
        restrict: "A",
        require: "ngModel",
        link: function (scope, element, attrs, ngModel) {

            function read() {
                ngModel.$setViewValue(element.html());
            }

            ngModel.$render = function () {
                element.html(ngModel.$viewValue || "");
            };

            element.bind("blur keyup change", function () {
                scope.$apply(read);
            });
        }
    };
});
