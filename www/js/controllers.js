var controllers = angular.module('controllers', []);
siteUrl = 'http://lph-local.dev-srv.net/php/enpii/16/np_16014_kelle';
ajaxUrl = siteUrl + '/api/web/v1';
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
                var arrayBlockID = [];
                jQuery.each(blocks, function (index, item) {
                    blockFilter += '<option value="#block-' + convertToSlug(item.block) + '">' + item.block + '</option>';
                    floorFilter += '<option value="#floor-' + convertToSlug(item.floor) + '">' + item.floor + '</option>';
                    facilityIdFilter += '<option value="#facilityID-' + convertToSlug(item.facility_name) + '">' + item.facility_name + '</option>';
                    blockHtml +=
                        '<li class="block-item" data-block-name="#block-' + convertToSlug(item.block) + '" data-floor="#floor-' + convertToSlug(item.floor) + '" data-facility-id="#facilityID-' + convertToSlug(item.facility_name) + '">' +
                        '<a href="#/facility/' + item.id + '">' +
                        '<div class="block-info">' +
                        '<div class="block-title">' + item.block + '</div>' +
                        '<div class="block-info-item"><label>Floor: </label>' + item.floor + '</div>' +
                        '<div class="block-info-item"><label>Facility Type: </label>' + item.facility.facility_type + '</div>' +
                        '<div class="block-info-item"><label>Facility ID:</label>' + item.facility_name + '</div>' +
                        '</div>' +
                        '<div class="block-rating">' +
                        '<select id="block-rating-' + item.id + '" class="block-rating-star" data-current-rating="' + item.rating + '"> ' +
                        '<option value=""></option> ' +
                        '<option value="1"></option> ' +
                        '<option value="2"></option> ' +
                        '<option value="3"></option> ' +
                        '<option value="4"></option> ' +
                        '<option value="5"></option> ' +
                        '</select>' +
                        '<div class="block-rating-number">' + item.rating + '</div>' +
                        '<div class="block-rating-label">Ratings</div>' +
                        '</div>' +
                        '<div class="clearfix" ></div>' +
                        '</a>' +
                        '</li>';
                    arrayBlockID.push('block-rating-' + item.id);

                });
                $('#block-filter').html(blockFilter);
                $('#floor-filter').html(floorFilter);
                $('#facility-filter').html(facilityIdFilter);
                $('#block-list').html(blockHtml);


                $.each(arrayBlockID, function (index, value) {
                    blockID = $('#' + value);
                    blockID.barrating({
                        theme: 'fontawesome-stars-o',
                        readonly: true,
                        deselectable: false,
                        showSelectedRating: false,
                        initialRating: blockID.data('current-rating')
                    });
                });

            });
            $('#block-filter').change(function () {
                $('.block-item').hide();
                $("[data-block-name='"+$(this).val()+"']").show();
            });
            $('#floor-filter').change(function () {
                $('.block-item').hide();
                $("[data-floor='"+$(this).val()+"']").show();
            });
            $('#facility-filter').change(function () {
                $('.block-item').hide();
                $("[data-facility-id='"+$(this).val()+"']").show();
            });

        }
    }
]);
app.controller('FacilityController', ['$scope', '$location', '$window', '$routeParams',
    function ($scope, $location, $window, $routeParams) {

        jQuery.get(ajaxUrl + '/buildings/view-facility?id=' + $routeParams.id, function (response) {
            var arrayTaskID = [];
            $scope.facility = response;
            console.log(response);

            $('#building-name').html(response.building.name);

            $('#facility-name').html(response.block);
            $('#facility-date').html(response.created_at);
            $('#facility-floor').html(response.floor);
            $('#facility-type').html(response.facility.facility_type);
            $('#facility-id').html(response.facility_name);
            $('#request-adhoc a').attr('href', '#/request-adhoc/' + response.id);

            tasks = response.tasks;

            tasksHtml = '';
            jQuery.each(tasks, function (index, item) {
                attachments = item.attachments;
                images = '';
                jQuery.each(attachments, function (key, image) {
                    if (image.thumbnail != undefined) {
                        images += '<li><a class="popup-image" href="' + image.thumbnail + '" class="image-thumbnail"  style="background-image: url(' + image.thumbnail + ')"></a></li>';
                    }
                });
                tasksHtml +=
                    '<li class="task-item" id="task-rating-' + item.id + '"> ' +
                    '<div class="inner"> ' +
                    '<div class="container"> ' +
                    '<div class="task-item-title">' +
                    item.name +
                    '</div> ' +
                    '<div class="task-action"> ' +
                    '<select  class="block-rating-star" data-current-rating="' + item.rating + '"> ' +
                    '<option value=""></option> ' +
                    '<option value="1"></option> ' +
                    '<option value="2"></option> ' +
                    '<option value="3"></option> ' +
                    '<option value="4"></option> ' +
                    '<option value="5"></option> ' +
                    '</select> ' +
                    '<a class="edit-facility" href="#/task/' + item.id + '">Edit</a> ' +
                    '<a class="rate-task-btn hidden" data-value="' + item.rating + '" href="/buildings/rate-task?id=' + item.id + '">Rate</a> ' +
                    '</div> ' +
                    '</div> ' +
                    '<div class="image-control"> ' +
                    '<ul class="image-list">' +
                    images +
                    '<li><a class="image-button btn-image-update" href="#/update-image-task/' + item.id + '"><i class="fa fa-camera" aria-hidden="true"></i></a> </li>' +
                    '</ul>' +
                    '</div> ' +
                    '</div> ' +
                    '</li>'
                ;
                arrayTaskID.push(item.id);
            });
            $('#task-list').html(tasksHtml);
            $('a.popup-image').colorbox({rel:'popup-image'});
            $(document).ready(function () {
                $.each(arrayTaskID, function (index, id) {
                    taskID = $('#task-rating-' + id);
                    taskRating = taskID.find('.block-rating-star');
                    taskRating.barrating({
                        theme: 'fontawesome-stars-o',
                        readonly: false,
                        deselectable: false,
                        showSelectedRating: false,
                        initialRating: taskRating.data('current-rating'),
                        onSelect: function (value, text, event) {
                            parentElement = $(event.currentTarget).closest('.task-item');
                            currentVal = taskRating.data('current-rating');
                            if (value != currentVal) {
                                parentElement.find('.rate-task-btn').attr('data-value', value);
                                parentElement.find('.rate-task-btn').removeClass('hidden');
                                parentElement.find('.edit-facility').addClass('hidden');
                                parentElement.find('.rate-task-btn').click(function (e) {
                                    e.preventDefault();
                                    self = this;
                                    e.preventDefault();
                                    jQuery.ajax({
                                        url: ajaxUrl + $(self).attr('href'),
                                        type: 'post',
                                        data: {
                                            access_token: $window.sessionStorage.access_token,
                                            value: $(self).attr('data-value')
                                        },
                                        success: function (response) {
                                            if (response.status == 200) {
                                                $(self).addClass('hidden');
                                                $(self).parent().find('.edit-facility').removeClass('hidden');
                                            }

                                        }
                                    });
                                });
                            }
                        }
                    });

                });
            });

        });
    }
]);
app.controller('TaskController', ['$scope', '$location', '$window', '$routeParams',
    function ($scope, $location, $window, $routeParams) {
        jQuery.get(ajaxUrl + '/buildings/view-task?id=' + $routeParams.id, function (response) {
            $scope.facility = response;
            taskImages = response.mediaRelations;

            images = '';
            jQuery.each(taskImages, function (index, mediaRelation) {
                if(mediaRelation.attachment) {
                    images += '<li class="image-item"> ' +
                        '<a data-toggle="modal" data-target="#image-gallery"  data-image-id="'+ mediaRelation.attachment.id +'" class="popup-image" data-image="'+ mediaRelation.attachment.full +'" href="'+ mediaRelation.attachment.full +'" style="background-image: url('+mediaRelation.attachment.thumbnail+')"></a>' +
                        '</li>';
                }

            });
            $('#task-name').html(response.name);
            $('#task-image-list').html(images);
            $('#task-rating-value').val(response.latestRating);
            taskRating = $('#single-task-rating');
            currentRating = taskRating.attr('data-current-rating',response.latestRating);
            taskRating.barrating({
                theme: 'fontawesome-stars-o',
                readonly: false,
                deselectable: false,
                showSelectedRating: false,
                initialRating: response.latestRating,
                onSelect: function (value, text, event) {
                    parentElement = $(event.currentTarget).closest('.task-item');
                    currentVal = taskRating.data('current-rating');
                    if (value != currentVal) {
                        $('#task-rating-value').val(value);
                    }
                }
            });
            $('a.popup-image').colorbox({rel:'popup-image'});
        });
        $('#submit-rating').click(function (e) {
            e.preventDefault();
            jQuery.ajax({
                url: ajaxUrl + '/buildings/rate-task?id=' + $routeParams.id,
                type: 'post',
                data: {
                    access_token: $window.sessionStorage.access_token,
                    value: $('#task-rating-value').val()
                },
                beforeSend: function () {
                    $('.status-message').addClass('hidden');
                },
                success: function (response) {
                    if (response.status == 200) {
                        $('#success-message').removeClass('hidden').find('.inner').html(response.message);
                    } else {
                        $('#error-message').removeClass('hidden').find('.inner').html(response.message);
                    }
                }
            });
        });

    }
]);
app.controller('TaskUpdateImageController', ['$scope', '$location', '$window', '$routeParams',
    function ($scope, $location, $window, $routeParams) {

        function appendDynamicItem(index, itemID, itemMediaID, thumbnail) {
            image = '';
            id = itemID != undefined ? itemID : '';
            if (thumbnail != undefined) {
                image = '<img src="' + thumbnail + '" class="image-thumbnail">'
            }

            mediaId = itemMediaID != undefined ? itemMediaID : '';

            dynamicItem = '<tr class="dynamic-form-item">' +
                '<td>' +
                '<div class="image-preview">' + image + '</div>' +
                '</td>' +
                '<td>' +
                '<input type="hidden" id="taskrelationmedia-' + index + '-id" name="TaskRelationMedia[' + index + '][id]" value="' + id + '">' +
                '<input type="hidden" id="taskrelationmedia-' + index + '-media_id" name="TaskRelationMedia[' + index + '][media_id]" value="' + mediaId + '">' +
                '<input type="hidden" id="taskrelationmedia-' + index + '-deleteimg" name="TaskRelationMedia[' + index + '][deleteImg]">' +
                '<input type="hidden" name="TaskRelationMedia[' + index + '][attachment]" value="">' +
                '<div class="btn btn-default btn-file">Choose Image<input class="attachment-image-input" type="file" name="TaskRelationMedia[' + index + '][attachment]" value="' + id + '"></div>' +
                '<button class="btn btn-default btn-danger delete-form-item">Delete</button>' +
                '</td>' +
                '</tr>';
            return dynamicItem;
        }

        jQuery.get(ajaxUrl + '/buildings/update-image-task?id=' + $routeParams.id, function (response) {
            console.log(response);
            mediaRelations = response.mediaRelations;
            images = '';
            fileIndex = 0;
            maxValueID = 0;
            $('#task-name').val(response.name);
            jQuery.each(mediaRelations, function (key, mediaRelation) {
                if (mediaRelation.attachment != undefined) {
                    if (mediaRelation.attachment.id > maxValueID) {
                        maxValueID = mediaRelation.attachment.id;
                    }
                    imageUrl = mediaRelation.attachment.thumbnail != undefined ? mediaRelation.attachment.thumbnail : '';
                    images += appendDynamicItem(fileIndex, mediaRelation.id, mediaRelation.media_id, imageUrl);
                    fileIndex++;
                }
            });
            images += '<tr> ' +
                '<td colspan="2" class="text-center v-middle "> ' +
                '<button type="button" class="add-item btn btn-success btn-sm"><span class="fa fa-plus"></span> New</button> ' +
                '</td> ' +
                '</tr>';

            $('#task-title').html(response.name);
            $('#task-image-list').html(images);

            $('.add-item').click(function (e) {
                e.preventDefault();
                maxValueID++;
                $(this).closest('tr').before(appendDynamicItem(fileIndex, maxValueID));
                fileIndex++;
                $('.attachment-image-input').change(function () {
                    readURL(this);
                });
            });
            $('.delete-form-item').click(function () {
                $(this).closest('.dynamic-form-item').remove();
            });

            $('.attachment-image-input').change(function () {
                readURL(this);
            });
            function readURL(input) {

                if (input.files && input.files[0]) {

                    var reader = new FileReader();
                    reader.onload = function (e) {
                        $(input).closest('.dynamic-form-item').find('.image-preview').html('<img src="' + e.target.result + '">');
                    }
                    reader.readAsDataURL(input.files[0]);
                }
            }


            $('#dynamic-form-submit').click(function (e) {
                e.preventDefault();
                var formData = new FormData($(this).parents('form')[0]);
                $.ajax({
                    url: ajaxUrl + '/buildings/update-image-task?id=' + $routeParams.id,
                    type: 'POST',
                    xhr: function () {
                        var myXhr = $.ajaxSettings.xhr();
                        return myXhr;
                    },
                    success: function (response) {
                        console.log(response);
                        if (response.status == 200) {
                            $window.location.reload();
                        }
                    },
                    data: formData,
                    cache: false,
                    contentType: false,
                    processData: false
                });
                return false;
            });
        });
    }
]);
app.controller('RequestController', ['$scope', '$location', '$window', '$routeParams',
    function ($scope, $location, $window, $routeParams) {

        jQuery.get(ajaxUrl + '/buildings/view-facility?id=' + $routeParams.id, function (response) {
            $('#request-building-name').val(response.building.name);
            $('#request-block-name').val(response.block);
            $('#request-facility-id').val(response.facility.facility_type);
            tasks = response.tasks;
            tasksHtml = '';
            jQuery.each(tasks, function (index, item) {
                tasksHtml += '<label class="checkbox-item"><input type="checkbox" id="checkbox-item-' + index + '" name="BuildingFacility[tasks][]" value="' + item.id + '" checked=""> <label for="checkbox-item-' + index + '">' + item.name + '</label></label>';
            });
            $('#building-tasks').html(tasksHtml);
        });
        $('#request-adhoc-btn').click(function (e) {

            e.preventDefault();
            fromRequest = $('#request-form');
            formData = fromRequest.serializeArray();
            formData.push({
                name: "access_token",
                value: $window.sessionStorage.access_token
            });
            buttonText = $(this).html();
            jQuery.ajax({
                url: ajaxUrl + '/buildings/request-adhoc?id=' + $routeParams.id,
                type: 'post',
                data: formData,
                beforeSend: function () {
                    fromRequest.find('#message').hide();
                    fromRequest.find('button[type=submit]').attr("disabled", true);
                    fromRequest.find('button[type=submit]').html('Processing...');
                },
                complete: function () {
                    fromRequest.find('button[type=submit]').attr("disabled", false);
                    fromRequest.find('button[type=submit]').html(buttonText);
                },

                success: function (response) {
                    obj = jQuery.parseJSON(response);
                    if (obj.status == 200) {
                        fromRequest.trigger("reset");
                        fromRequest.find('#message').html(obj.message);
                        fromRequest.find('#message').show();
                    } else {

                    }
                }
            })

        });


    }
]);
app.controller('LogoutController', ['$location', '$window',
    function ($location, $window) {
        $window.sessionStorage.clear();
        $location.path('/');
    }
]);

