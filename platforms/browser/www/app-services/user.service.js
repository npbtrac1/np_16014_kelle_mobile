(function () {
    'use strict';

    angular
        .module('app')
        .factory('UserService', UserService);
    UserService.$inject = ['$http'];
    function UserService($http) {
        var service = {};
        var ajaxUrl = 'http://kelle.don/api/web/v1';
        service.GetAll = GetAll;
        service.GetById = GetById;
        service.GetByUsername = GetByUsername;
        service.Create = Create;
        service.Update = Update;
        service.Delete = Delete;

        return service;

        function GetAll() {
            return $http.get( ajaxUrl + '/users').then(handleSuccess, handleError('Error getting all users'));
        }

        function GetById(id) {
            return $http.get( ajaxUrl + '/users/' + id).then(handleSuccess, handleError('Error getting user by id'));
        }

        function GetByUsername(username) {
            return $http.get( ajaxUrl + '/users/' + username).then(handleSuccess, handleError('Error getting user by username'));
        }

        function Create(user) {
            return $http.post( ajaxUrl + '/users', user).then(handleSuccess, handleError('Error creating user'));
        }

        function Update(user) {
            return $http.put( ajaxUrl + '/users/' + user.id, user).then(handleSuccess, handleError('Error updating user'));
        }

        function Delete(id) {
            return $http.delete( ajaxUrl + '/users/' + id).then(handleSuccess, handleError('Error deleting user'));
        }

        // private functions

        function handleSuccess(res) {
            return res.data;
        }

        function handleError(error) {
            return function () {
                return { success: false, message: error };
            };
        }
    }

})();
