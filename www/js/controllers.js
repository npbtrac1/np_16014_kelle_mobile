var controllers = angular.module('controllers', []);
controllers.controller('MainController', ['$scope', '$location', '$window',
    function ($scope, $location, $window) {

        $scope.loggedIn = function() {
            return Boolean($window.sessionStorage.access_token);
        };
        $scope.logout = function () {
            delete $window.sessionStorage.access_token;
            $location.path('/login').replace();
        };
    }
]);/**
 * Created by lacphan on 7/31/16.
 */
controllers.controller('LoginController', ['$scope', '$http', '$window', '$location',
    function($scope, $http, $window, $location) {
        var siteUrl = 'http://kelle.don/api/web/v1';
        $scope.login = function () {
            $scope.submitted = true;
            $scope.error = {};
            $http.post(siteUrl + '/user/login', $scope.userModel).success(
                function (data) {
                    console.log(data);
                    $window.sessionStorage.access_token = data.access_token;
                    $window.sessionStorage.building_id = data.building_id;
                    $location.path('/dashboard').replace();
                }).error(
                function (data) {
                    angular.forEach(data, function (error) {
                        $scope.error[error.field] = error.message;
                    });
                }
            );
        };
    }
]);
controllers.controller('DashboardController', ['$scope', '$http','$window',
    function ($scope, $http,$window) {
        var ajaxUrl = 'http://kelle.don/api/web/v1';
        var buildingController = '/buildings';
        var viewAction = '/view-building?id=';
        building_id =  $window.sessionStorage.building_id;
        var vm = this;
        if(building_id != undefined) {
            jQuery.get( ajaxUrl + buildingController + viewAction + building_id, function( response ) {
                $scope.building = response;
                console.log($scope.building);
            });
        }

    }
]);