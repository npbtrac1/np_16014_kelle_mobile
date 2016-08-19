/**
 * Created by lacphan on 6/27/16.
 */

var app = angular.module('app', [
    'ngRoute',          //$routeProvider
    'mgcrea.ngStrap',   //bs-navbar, data-match-route directives
    'controllers'       //Our module frontend/web/js/controllers.js
]);

app.config(['$routeProvider', '$httpProvider',
    function ($routeProvider, $httpProvider) {
        $routeProvider.when('/', {
            controller: 'HomeController',
            templateUrl: 'home/home.view.html',
            controllerAs: 'vm'
        }).when('/login', {
            controller: 'LoginController',
            templateUrl: 'login/login.view.html',
            controllerAs: 'vm'
        }).when('/dashboard', {
            controller: 'DashboardController',
            templateUrl: 'dashboard/dashboard.view.html',
            controllerAs: 'vm'
        }).when('/facility/:id', {
            templateUrl: 'facility/facility.view.html',
            controller: 'FacilityController'
        }).when('/task/:id/:facility', {
            templateUrl: 'task/task.view.html',
            controller: 'TaskController'
        }).when('/request-adhoc/:id', {
            templateUrl: 'request/request.view.html',
            controller: 'RequestController'
        }).when('/update-image-task/:id/:facility', {
            templateUrl: 'task/update-image.view.html',
            controller: 'TaskUpdateImageController'
        }).when('/logout', {
            templateUrl: 'home/home.view.html',
            controller: 'LogoutController'
        }).otherwise({
            templateUrl: '404.html'
        });
        $httpProvider.interceptors.push('authInterceptor');
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

        baseUrl: 'http://kelle.don/api/web/v1/',
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

