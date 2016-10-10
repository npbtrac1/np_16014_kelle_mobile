/**
 * Created by lacphan on 6/27/16.
 */

var app = angular.module('app', [
    'ngRoute',          //$routeProvider
    'mgcrea.ngStrap',   //bs-navbar, data-match-route directives
    'controllers'       //Our module frontend/web/js/controllers.js
]);

app.config(['$routeProvider', '$httpProvider','$provide',
    function ($routeProvider, $httpProvider,$provide) {
        $routeProvider.when('/', {
            controller: 'MainController',
            templateUrl: 'view/home/home.view.html',
        }).when('/login', {
            controller: 'LoginController',
            templateUrl: 'view/login/login.view.html',
        }).when('/dashboard', {
            controller: 'DashboardController',
            templateUrl: 'view/dashboard/dashboard.view.html',
        }).when('/facility/:id', {
            templateUrl: 'view/facility/facility.view.html',
            controller: 'FacilityController'
        }).when('/task/:id/:facility', {
            templateUrl: 'view/task/task.view.html',
            controller: 'TaskController'
        }).when('/request-adhoc/:id', {
            templateUrl: 'view/request/request.view.html',
            controller: 'RequestController'
        }).when('/update-image-task/:id/:facility', {
            templateUrl: 'view/task/update-image.view.html',
            controller: 'TaskUpdateImageController'
        }).when('/notification', {
            templateUrl: 'view/notification/index.html',
            controller: 'NotificationController'
        }).when('/view-notification/:id', {
            templateUrl: 'view/notification/view.html',
            controller: 'NotificationViewController'
        }).when('/logout', {
            templateUrl: 'view/home/home.view.html',
            controller: 'LogoutController'
        }).otherwise({
            templateUrl: '404.html'
        });
        $httpProvider.interceptors.push('authInterceptor');
        $provide.decorator('$controller', function($delegate) {
            return function(constructor, locals, later, indent) {
                if (typeof constructor === 'string' && !locals.$scope.controllerName) {
                    locals.$scope.controllerName =  constructor;
                }
                return $delegate(constructor, locals, later, indent);
            };
        });
    }
]);

app.factory('authInterceptor', function ($q, $window, $location) {
    return {
        request: function (config) {
            if ($window.sessionStorage.access_token) {
                //HttpBearerAuth
                config.headers.Authorization = 'Bearer ' + $window.sessionStorage.access_token;
            }
            return config;
        },
        responseError: function (rejection) {
            if (rejection.status === 401) {
                $location.path('/login').replace();
            }
            return $q.reject(rejection);
        }
    };
});
app.service('rest', function ($http, $location, $routeParams) {

    return {

        baseUrl: 'http://lph-local.dev-srv.net/php/enpii/16/np_16014_kelle',
        path: undefined,

        models: function () {
            return $http.get(this.baseUrl + this.path + location.search);
        },

        model: function () {
            if ($routeParams.expand != null) {
                return $http.get(this.baseUrl + this.path + "/" + $routeParams.id + '?expand=' + $routeParams.expand);
            }
            return $http.get(this.baseUrl + this.path + "/" + $routeParams.id);
        },

        get: function () {
            return $http.get(this.baseUrl + this.path);
        },

        postModel: function (model) {
            return $http.post(this.baseUrl + this.path, model);
        },

        putModel: function (model) {
            return $http.put(this.baseUrl + this.path + "/" + $routeParams.id, model);
        },

        deleteModel: function () {
            return $http.delete(this.baseUrl + this.path);
        }
    };

});

app.directive('login', ['$http', function ($http) {
        return {
            transclude: true,
            link: function (scope, element, attrs) {
                scope.isGuest = window.sessionStorage._auth == undefined;
            },

            template: '<a href="login" ng-if="isGuest">Login</a>'
        }
    }])
    .filter('checkmark', function () {
        return function (input) {
            return input ? '\u2713' : '\u2718';
        };
    });
app.directive('back', ['$window', function($window) {
    return {
        restrict: 'A',
        link: function (scope, elem, attrs) {
            elem.bind('click', function () {
                $window.history.back();
            });
        }
    };
}]);
