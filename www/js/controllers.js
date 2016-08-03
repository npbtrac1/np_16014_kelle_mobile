var controllers = angular.module('controllers', []);
var ajaxUrl = 'http://kelle.don/api/web/v1';
app.controller('MainController', ['$scope', '$location', '$window',
    function ($scope, $location, $window) {

        $scope.loggedIn = function () {
            return Boolean($window.sessionStorage.access_token);
        };
        $scope.logout = function () {
            delete $window.sessionStorage.access_token;
            $location.path('/login').replace();
        };
    }
]);
/**
 * Created by lacphan on 7/31/16.
 */
app.controller('LoginController', ['$scope', '$http', '$window', '$location',
    function ($scope, $http, $window, $location) {

        $scope.login = function () {
            $scope.submitted = true;
            $scope.error = {};
            $http.post(ajaxUrl + '/user/login', $scope.userModel).success(
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
app.controller('DashboardController', ['$scope', '$http', '$window',
    function ($scope, $http, $window) {

        var buildingController = '';
        var viewAction = '/view-building?id=';

        function convertToSlug(Text) {
            return Text
                .toLowerCase()
                .replace(/ /g, '-')
                .replace(/[^\w-]+/g, '')
                ;
        }

        building_id = $window.sessionStorage.building_id;
        if (building_id !== undefined && building_id != null) {
            jQuery.get(ajaxUrl + '/buildings/view-building?id=' + building_id, function (response) {
                $scope.building = response;


                $('#building-name').html(response.name);
                blocks = response.building_facilities;
                blockFilter = '';
                floorFilter = '';
                facilityIdFilter = '';
                blockHtml = '';
                jQuery.each(blocks, function (index, item) {
                    blockFilter += '<option value="#block-' + convertToSlug(item.block) + '">' + item.block + '</option>';
                    floorFilter += '<option value="#floor-' + convertToSlug(item.floor) + '">' + item.floor + '</option>';
                    facilityIdFilter += '<option value="#facilityID-' + convertToSlug(item.facility_name) + '">' + item.facility_name + '</option>';
                    blockHtml +=
                        '<li class="block-item" >' +
                        '<a href="#/facility/' + item.id + '">' +
                        '<div class="block-info">' +
                        '<div class="block-title">' + item.block + '</div>' +
                        '<div class="block-info-item"><label>Floor: </label>' + item.floor + '</div>' +
                        '<div class="block-info-item"><label>Facility Type: </label>' + item.facility.facility_type + '</div>' +
                        '<div class="block-info-item"><label>Facility ID:</label>' + item.facility_name + '</div>' +
                        '</div>' +
                        '<div class="block-rating">' +
                        '<select class="block-rating-star"> ' +
                        '<option value="1"></option> ' +
                        '<option value="2"></option> ' +
                        '<option value="3"></option> ' +
                        '<option selected value="4"></option> ' +
                        '<option value="5"></option> ' +
                        '</select>' +
                        '<div class="block-rating-number">4.5</div>' +
                        '<div class="block-rating-label">Ratings</div>' +
                        '</div>' +
                        '<div class="clearfix" ></div>' +
                        '</a>' +
                        '</li>';

                });
                $('#block-filter').html(blockFilter);
                $('#floor-filter').html(floorFilter);
                $('#facility-filter').html(facilityIdFilter);
                $('#block-list').html(blockHtml);
                $('.block-rating-star').barrating({
                    theme: 'fontawesome-stars',
                    readonly: true
                });
            });

        }


    }
]);
app.controller('FacilityController', ['$scope','$location', '$window','$routeParams',
    function ($scope,$location, $window, $routeParams) {
        jQuery.get(ajaxUrl + '/buildings/view-facility?id=' + $routeParams.id, function (response) {
            $scope.facility = response;
            console.log(response);

            $('#building-name').html(response.building.name);

            $('#facility-name').html(response.block);
            $('#facility-date').html(response.created_at);
            $('#facility-floor').html(response.floor);
            $('#facility-type').html(response.facility.facility_type);
            $('#facility-id').html(response.facility_name);
            // $('#facility-name').html(response.block);
            // $('#facility-name').html(response.block);

            tasks = response.tasks;

            tasksHtml = '';
            jQuery.each(tasks, function (index, item) {
                tasksHtml +=
                    '<li class="task-item"> ' +
                        '<div class="inner"> ' +
                            '<div class="container"> ' +
                                '<div class="task-item-title">' +
                                item.name+
                                '</div> ' +
                                '<div class="task-action"> ' +
                                    '<select class="block-rating-star"> ' +
                                        '<option value="1"></option> ' +
                                        '<option value="2"></option> ' +
                                        '<option value="3"></option> ' +
                                        '<option selected value="4"></option> ' +
                                        '<option value="5"></option> ' +
                                    '</select> ' +
                                    '<a class="edit-facility" href="#/task/' + item.id + '">Edit</a> ' +
                                '</div> ' +
                            '</div> ' +
                            '<div class="image-control"> ' +
                                '<a class="image-button btn-image-update" href="#"><i class="fa fa-camera" aria-hidden="true"></i></a> ' +
                            '</div> ' +
                        '</div> ' +
                    '</li>'
                   ;
            });
            $('#task-list').html(tasksHtml);

            $('.block-rating-star').barrating({
                theme: 'fontawesome-stars',
                readonly: true
            });
        });
    }
]);
app.controller('TaskController', ['$scope','$location', '$window','$routeParams',
    function ($scope,$location, $window, $routeParams) {
        jQuery.get(ajaxUrl + '/buildings/view-task?id=' + $routeParams.id, function (response) {
            $scope.facility = response;
            console.log(response);

            $('#building-name').html(response.building.name);

            $('#facility-name').html(response.block);
            $('#facility-date').html(response.created_at);
            $('#facility-floor').html(response.floor);
            $('#facility-type').html(response.facility.facility_type);
            $('#facility-id').html(response.facility_name);

            tasks = response.tasks;

            tasksHtml = '';
            jQuery.each(tasks, function (index, item) {
                tasksHtml +=
                    '<li class="task-item"> ' +
                    '<div class="inner"> ' +
                    '<div class="container"> ' +
                    '<div class="task-item-title">' +
                    item.name+
                    '</div> ' +
                    '<div class="task-action"> ' +
                    '<select class="block-rating-star"> ' +
                    '<option value="1"></option> ' +
                    '<option value="2"></option> ' +
                    '<option value="3"></option> ' +
                    '<option selected value="4"></option> ' +
                    '<option value="5"></option> ' +
                    '</select> ' +
                    '<a class="edit-facility" href="#/view-task/' + item.id + '">Edit</a> ' +
                    '</div> ' +
                    '</div> ' +
                    '<div class="image-control"> ' +
                    '<a class="image-button btn-image-update" href="#"><i class="fa fa-camera" aria-hidden="true"></i></a> ' +
                    '</div> ' +
                    '</div> ' +
                    '</li>'
                ;
            });
            $('#task-list').html(tasksHtml);

            $('.block-rating-star').barrating({
                theme: 'fontawesome-stars',
                readonly: true
            });
        });
    }
]);

app.controller('LogoutController', ['$location', '$window',
    function ($location, $window) {
        $window.sessionStorage.clear();
        $location.path('/');
    }
]);

