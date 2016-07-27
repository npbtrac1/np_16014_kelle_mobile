(function () {
    'use strict';
    angular
        .module('app')
        .controller('DashboardController', DashboardController);

    DashboardController.$inject = ['$scope', '$http'];
    function DashboardController($scope, $http) {

        var ajaxUrl = 'http://kelle.don/api/web/v1';
        var buildingController = '/buildings';
        var viewAction = '/view-building?id=2';

        var vm = this;
        $http.get(ajaxUrl + buildingController + viewAction).success( function(response) {
            $scope.building = response;
        });
    }

})();
