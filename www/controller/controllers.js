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
        if ($window.sessionStorage.access_token != undefined) {
            $location.path('/dashboard');
        }
    }
]);
/**
 * Created by lacphan on 7/31/16.
 */
app.controller('LoginController', ['$scope', '$http', '$window', '$location',
    function ($scope, $http, $window, $location) {
        var push = PushNotification.init({ "android": {"senderID": "632908270656"}});
        var registerId = '';
        push.on('registration', function(data) {
            registerId = data.registrationId;
        });
        $scope.login = function () {
            $scope.submitted = true;
            $scope.dataLoading = true;
            $scope.error = {};
            $http.post(ajaxUrl + '/user/login', $scope.userModel).success(
                function (data) {
                    $scope.dataLoading = false;
                    $window.sessionStorage.access_token = data.access_token;
                    $window.sessionStorage.building_id = data.building_id;
                    $window.sessionStorage.user_type = data.user_type;
                    $location.path('/dashboard').replace();
                }).error(
                function (data) {
                    $scope.dataLoading = false;
                    angular.forEach(data, function (error) {
                        $scope.error[error.field] = error.message;
                    });
                    jQuery.ajax({
                        type: "POST",
                        url: ajaxUrl + 'user/update-app-id',
                        data: {
                            'access_token':$window.sessionStorage.access_token,
                            'register_id':registerId
                        },
                        success: success,
                        cache: false,
                        contentType: false,
                        processData: false
                    });
                }
            );
        };
    }
]);
app.controller('HomeController', ['$scope', '$http', '$window', '$location',
    function ($scope, $http, $window, $location) {

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

        if (localStorage.scrollTo != undefined && $scope.controllerName == 'DashboardController') {
            $(document).ready(function () {
                $('html, body').animate({
                    scrollTop: localStorage.scrollTo - 30
                }, 800, function () {
                });
            });

        }

        building_id = $window.sessionStorage.building_id;
        if (building_id !== undefined && building_id != null) {

            jQuery.get(ajaxUrl + '/buildings/view-building?id=' + building_id, function (response) {

                $('#building-name').html(response.name);
                blocks = response.building_facilities;

                attachments = response.attachments;
                attachmentHtml = '';
                jQuery.each(attachments, function (index, item) {
                    attachmentHtml += '<a href='+ item.url + '>' + item.title + '</a>';
                });


                blockFilter = '';
                blockFilterData = response.filterBlocks;
                jQuery.each(blockFilterData, function (index, item) {
                    blockFilter += '<option value="#block-' + convertToSlug(item.block) + '">' + item.block + '</option>';
                });

                floorFilter = '';
                floorFilterData = response.filterFloors;
                jQuery.each(floorFilterData, function (index, item) {
                    floorFilter += '<option value="#floor-' + convertToSlug(item.floor) + '">' + item.floor + '</option>';
                });

                facilityIdFilter = '';
                facilityIdFilterData = response.filterFacilities;
                jQuery.each(facilityIdFilterData, function (index, item) {
                    facilityIdFilter += '<option value="#facilityID-' + convertToSlug(item.facility_name) + '">' + item.facility_name + '</option>';
                });
                blockHtml = '';
                var arrayBlockID = [];
                jQuery.each(blocks, function (index, item) {
                    blockHtml +=
                        '<li class="block-item" data-block-name="#block-' + convertToSlug(item.block) + '" data-floor="#floor-' + convertToSlug(item.floor) + '" data-facility-id="#facilityID-' + convertToSlug(item.facility_name) + '" data-created-at="' + item.created_at + '">' +
                        '<a class="scroll-to-anchor" href="#/facility/' + item.id + '">' +
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
                $('#building-attachments').html(attachmentHtml);
                $('#block-list').html(blockHtml).delegate('.scroll-to-anchor', 'click', function () {
                    localStorage.scrollTo = $(this).offset().top;
                });

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
            var monthNames = ["January", "February", "March", "April", "May", "June",
                "July", "August", "September", "October", "November", "December"
            ];
            var d = new Date();
            var currDate = d.getDate();
            var currMonth = d.getMonth();
            var currYear = d.getFullYear();
            var dateStr = currDate + "-" + monthNames[currMonth] + "-" + currYear;
            $('#block-status-filter').datepicker({
                format: 'dd-MM-yyyy',
            }).on('show', function () {
                $(this).blur();
            }).on('changeDate', function () {
                $filterOrigin = new Date($(this).val());

                $('.block-item').each(function (e) {
                    $block = $(this);

                    $filterCompareVal = new Date(($block.attr('data-created-at')));
                    if ($filterOrigin.getDate() <= $filterCompareVal.getDate()) {
                        $block.show();
                    } else {
                        $block.hide();
                    }
                });

            }).attr('placeholder', dateStr);
            $('#block-filter').change(function () {
                $('.block-item').hide();
                $("[data-block-name='" + $(this).val() + "']").show();
            });
            $('#floor-filter').change(function () {
                $('.block-item').hide();
                $("[data-floor='" + $(this).val() + "']").show();
            });
            $('#facility-filter').change(function () {
                $('.block-item').hide();
                $("[data-facility-id='" + $(this).val() + "']").show();
            });


        }

    }
]);
app.controller('FacilityController', ['$scope', '$location', '$window', '$routeParams',
    function ($scope, $location, $window, $routeParams) {

        if ($window.sessionStorage.user_type == 'admin' || $window.sessionStorage.user_type == 'supervisor') {
            isReadOnly = false;
        } else {
            isReadOnly = true;
        }
        if (localStorage.scrollToFacility != undefined && $scope.controllerName == 'FacilityController') {
            $(document).ready(function () {
                $('html, body').animate({
                    scrollTop: localStorage.scrollToFacility - 30
                }, 800, function () {
                });
            });
        }

        jQuery.get(ajaxUrl + '/buildings/view-facility?id=' + $routeParams.id, function (response) {
            var arrayTaskID = [];
            $scope.facility = response;

            $('#building-name').html(response.building.name);

            $('#facility-name').html(response.block);
            $('#facility-date').html(response.created_at);
            $('#facility-floor').html(response.floor);
            $('#facility-type').html(response.facility.facility_type);
            $('#facility-id').html(response.facility_name);
            $('#request-adhoc a').attr('href', '#/request-adhoc/' + response.id);
            if (isReadOnly) {
                $('#request-adhoc a').hide();
            }


            tasks = response.tasks;

            tasksHtml = '';
            jQuery.each(tasks, function (index, item) {
                attachments = item.attachments;
                images = '';
                imageCounter = 0;
                jQuery.each(attachments, function (key, image) {
                    if (image.thumbnail != undefined) {
                        imageCounter++;
                        images += '<li><a rel="image-row-' + index + ' " class="popup-image" title="' + image.created_at + '" href="' + image.medium + '" class="image-thumbnail"  style="background-image: url(' + image.thumbnail + ')"><img src="' + image.thumbnail + '"></a></li>';
                    }
                });
                if (isReadOnly) {
                    ratetaskButton = '';
                    updateImageButton = '';
                } else {
                    ratetaskButton = '<a class="rate-task-btn hidden" data-value="' + item.rating + '" href="/buildings/rate-task?id=' + item.id + '&buildingFacilityID=' + response.id + '">Rate</a> ';
                    updateImageButton = '<li><a class="scroll-to-anchor image-button btn-image-update" href="#/update-image-task/' + item.id + '/' + response.id + '"><span><i class="fa fa-camera" aria-hidden="true"></i></span><img src="img/transparent-img.png" width="1" height="1"></a> </li>';
                    if (imageCounter >= 4) {
                        updateImageButton = '';
                    }
                }

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
                    '<a class="scroll-to-anchor edit-facility" href="#/task/' + item.id + '/' + response.id + '">Edit</a> ' +
                    ratetaskButton +
                    '</div> ' +
                    '</div> ' +
                    '<div class="image-control"> ' +
                    '<ul class="image-list">' +
                    images +
                    updateImageButton +
                    '</ul>' +
                    '</div> ' +
                    '</div> ' +
                    '</li>'
                ;
                arrayTaskID.push(item.id);
            });

            $('#task-list').html(tasksHtml).delegate('.scroll-to-anchor', 'click', function () {
                localStorage.scrollToFacility = $(this).offset().top;
            });
            $('a.popup-image').colorbox({
                rel: $(this).attr('rel'),
                maxWidth: '95%',
                maxHeight: '95%',
                previous: ' <i class="fa fa-chevron-left"></i>',
                next: '<i class="fa fa-chevron-right"></i>'
            });
            $(document).ready(function () {
                $.each(arrayTaskID, function (index, id) {
                    taskID = $('#task-rating-' + id);
                    taskRating = taskID.find('.block-rating-star');
                    taskRating.barrating({
                        theme: 'fontawesome-stars-o',
                        readonly: isReadOnly,
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
        if ($window.sessionStorage.user_type == 'admin' || $window.sessionStorage.user_type == 'supervisor') {
            isReadOnly = false;
        } else {
            isReadOnly = true;
        }

        if (isReadOnly) {
            $('.submit-rating').hide();

        }
        jQuery.get(ajaxUrl + '/buildings/view-task?id=' + $routeParams.id + '&buildingFacilityID=' + $routeParams.facility, function (response) {
            $scope.facility = response;
            taskImages = response.mediaRelations;

            images = '';
            jQuery.each(taskImages, function (index, mediaRelation) {
                if (mediaRelation.attachment) {
                    images += '<li class="image-item"> ' +
                        '<a data-toggle="modal" data-target="#image-gallery"  data-image-id="' + mediaRelation.attachment.id + '" class="popup-image" data-image="' + mediaRelation.attachment.medium + '" href="' + mediaRelation.attachment.medium + '" style="background-image: url(' + mediaRelation.attachment.thumbnail + ')"><img src="' + mediaRelation.attachment.thumbnail + '"></a>' +
                        '</li>';
                }

            });
            updateImageButton = '';
            if (!isReadOnly) {
                updateImageButton = '<li class="image-item"><a class="image-button btn-image-update" href="#/update-image-task/' + $routeParams.id + '/' + $routeParams.facility + '"><span><i class="fa fa-camera" aria-hidden="true"></i></span><img src="img/transparent-img.png" width="1" height="1"></a> </li>';
            }
            $('#task-name').html(response.name);
            $('#task-image-list').html(images + updateImageButton);
            $('#task-rating-value').val(response.latestRating);
            taskRating = $('#single-task-rating');
            currentRating = taskRating.attr('data-current-rating', response.latestRating);
            taskRating.barrating({
                theme: 'fontawesome-stars-o',
                readonly: isReadOnly,
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
            $('a.popup-image').colorbox({
                rel: $(this).attr('rel'),
                maxWidth: '95%',
                maxHeight: '95%',
                previous: ' <i class="fa fa-chevron-left"></i>',
                next: '<i class="fa fa-chevron-right"></i>'
            });
        });
        buttonText = $('#submit-rating').html();
        $('#submit-rating').click(function (e) {
            e.preventDefault();
            formSubmit = $('#single-task-form');
            jQuery.ajax({
                url: ajaxUrl + '/buildings/rate-task?id=' + $routeParams.id + '&buildingFacilityID=' + $routeParams.facility,
                type: 'post',
                data: {
                    access_token: $window.sessionStorage.access_token,
                    value: $('#task-rating-value').val()
                },
                beforeSend: function () {
                    $('.status-message').addClass('hidden');
                    formSubmit.find('button[type=submit]').attr("disabled", true);
                    formSubmit.find('button[type=submit]').html('Processing...');
                },
                complete: function () {
                    formSubmit.find('button[type=submit]').attr("disabled", false);
                    formSubmit.find('button[type=submit]').html(buttonText);
                },
                success: function (response) {
                    if (response.status == 200) {
                        $window.history.back();
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

        function appendDynamicItem(index, itemID, itemMediaID, thumbnail, isNewRecord ) {
            image = '';
            if(isNewRecord == undefined) {
                isNewRecord = false;
            }
            id = itemID != undefined ? itemID : '';
            if (thumbnail != undefined) {
                image = '<img src="' + thumbnail + '" class="image-thumbnail">'
            }

            mediaId = itemMediaID != undefined ? itemMediaID : '';

            dynamicItem = '<tr class="form-options-item dynamic-form-item">' +
                '<td>' +
                '<div class="image-preview">' + image + '</div>' +
                '</td>' +
                '<td>' +
                '<input type="hidden" id="taskrelationmedia-' + index + '-id" name="TaskRelationMedia[' + index + '][id]" value="' + id + '">' +
                '<input type="hidden" id="taskrelationmedia-' + index + '-media_id" name="TaskRelationMedia[' + index + '][media_id]" value="' + mediaId + '">' +
                '<input type="hidden" id="taskrelationmedia-' + index + '-deleteimg" name="TaskRelationMedia[' + index + '][deleteImg]">' +
                '<input type="hidden" name="TaskRelationMedia[' + index + '][attachment]" value="">' +
                '<div class="btn btn-default btn-file">Choose Image<input  capture="camera" accept="image/*"  class="attachment-image-input" type="file" name="TaskRelationMedia[' + index + '][attachment]" value="' + id + '"></div>' +
                '<button type="button" class="btn btn-default btn-danger delete-form-item">Delete</button>' +
                '</td>' +
                '</tr>';

            return dynamicItem;
        }

        jQuery.get(ajaxUrl + '/buildings/update-image-task?id=' + $routeParams.id + '&buildingFacilityID=' + $routeParams.facility, function (response) {
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

            $('#task-title').html(response.name);
            $('#task-image-list').html(images);



            function readURL(input) {

                if (input.files && input.files[0]) {

                    var reader = new FileReader();
                    reader.onload = function (e) {
                        $(input).closest('.dynamic-form-item').find('.image-preview').html('<img src="' + e.target.result + '">');
                    };
                    reader.readAsDataURL(input.files[0]);
                }
            }

            function gotPic(event) {

                if (event.target.files.length == 1 && event.target.files[0].type.indexOf("image/") == 0) {

                    var reader = new FileReader();
                    reader.onload = function (e) {
                        $(event.target).closest('.dynamic-form-item').find('.image-preview').html('<img src="' + e.target.result + '">');
                    };
                    reader.readAsDataURL(event.target.files[0]);

                }
            }


            $.validator.addMethod('filesize', function (value, element, param) {
                return this.optional(element) || (element.files[0].size <= param)
            }, 'Limit 2MB');
            dynamicForm = jQuery('#dynamic-form');
            dynamicForm.validate();
            jQuery("input[type=file]").each(function () {
                jQuery(this).rules("add", {
                    extension: "png|jpg|jpeg",
                    accept: "image/*",
                    filesize: 2097152
                });
            });

            dynamicForm.on("click", ".add-item", function(e) {
                e.preventDefault();
                jQuery(".dynamicform_wrapper").triggerHandler("beforeInsert", [jQuery(this)]);
                jQuery(".dynamicform_wrapper").yiiDynamicForm("addItem", dynamicFormOptions, e, jQuery(this));

            });
            dynamicForm.yiiActiveForm([{"id":"task-name","name":"name","container":".field-task-name","input":"#task-name","error":".help-block.help-block-error","validate":function (attribute, value, messages, deferred, $form) {yii.validation.required(value, messages, {"message":"Name cannot be blank."});yii.validation.string(value, messages, {"message":"Name must be a string.","max":255,"tooLong":"Name should contain at most 255 characters.","skipOnEmpty":1});}}], []);

            dynamicForm.on("click", ".delete-form-item", function(e) {
                e.preventDefault();
                jQuery(".dynamicform_wrapper").yiiDynamicForm("deleteItem", dynamicFormOptions, e, jQuery(this));
            });
            $(".dynamicform_wrapper").on("afterInsert", function(e, item) {
                $('.attachment-image-input').change(gotPic);
                jQuery("input[type=file]").each(function () {
                    jQuery(this).rules("add", {
                        extension: "png|jpg|jpeg",
                        accept: "image/*",
                        filesize: 2097152
                    });
                });
            });
            $('.attachment-image-input').change(gotPic);

            $('#dynamic-form-submit').click(function (e) {
                if (dynamicForm.valid()) {
                    e.preventDefault();
                    buttonText = $(this).html();
                    var formSubmit = $('#dynamic-form');
                    var formData = new FormData($(this).parents('form')[0]);
                    $.ajax({
                        url: ajaxUrl + '/buildings/update-image-task?id=' + $routeParams.id + '&buildingFacilityID=' + $routeParams.facility,
                        type: 'POST',
                        xhr: function () {
                            var myXhr = $.ajaxSettings.xhr();
                            return myXhr;
                        },
                        beforeSend: function () {
                            formSubmit.find('button[type=submit]').attr("disabled", true);
                            formSubmit.find('button[type=submit]').html('Processing...');
                        },
                        complete: function () {
                            formSubmit.find('button[type=submit]').attr("disabled", false);
                            formSubmit.find('button[type=submit]').html(buttonText);
                        },
                        success: function (response) {
                            if (response.status == 200) {
                                $window.history.back();
                            } else {
                                $('#error-message').removeClass('hidden').find('.inner').html(response.message);
                            }
                        },
                        data: formData,
                        cache: false,
                        contentType: false,
                        processData: false
                    });
                }
                return false;
            });

        });
    }
]);
app.controller('RequestController', ['$scope', '$location', '$window', '$routeParams',
    function ($scope, $location, $window, $routeParams) {

        jQuery.get(ajaxUrl + '/buildings/view-facility?id=' + $routeParams.id, function (response) {
            console.log(response);
            $('#request-building-name').val(response.building.name);
            $('#request-block-name').val(response.block);
            $('#building-facility-facility_id').val(response.facility.facility_type);
            $('#building-facility-facility_name').val(response.facility_name);
            $('#building-facility-floor').val(response.floor);
            $('#building-facility-created_at').val(response.created_at);
            $('#timestamp').html(response.timestamp);
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
            self = this;
            buttonText = $('#request-adhoc-btn').html();
            jQuery.ajax({
                url: ajaxUrl + '/buildings/request-adhoc?id=' + $routeParams.id,
                type: 'post',
                data: formData,
                beforeSend: function () {
                    fromRequest.find('#message').hide();
                    $(self).attr("disabled", true);
                    $(self).html('Processing...');
                },
                complete: function () {
                    $(self).attr("disabled", false);
                    $(self).html(buttonText);
                },

                success: function (response) {
                    obj = jQuery.parseJSON(response);
                    if (obj.status == 200) {
                        $window.history.back();
                    } else {
                        $('#error-message').removeClass('hidden').find('.inner').html(obj.message);
                    }
                },
                error: function (xhr, ajaxOptions, thrownError) {
                    $('#error-message').removeClass('hidden').find('.inner').html(thrownError.message);
                }
            })

        });


    }
]);
app.controller('NotificationController', ['$scope', '$location', '$window', '$routeParams',
    function ($scope, $location, $window, $routeParams) {
        jQuery.ajax({
            url: ajaxUrl + '/buildings/list-notifications',
            type: 'post',
            data: {
                access_token: $window.sessionStorage.access_token,
                building_id:  $window.sessionStorage.building_id
            },
            complete: function () {

            },
            success: function (response) {
                notifications = response;
                notificationsHtml = '';

                jQuery.each(notifications, function (index, item) {
                    if(!item.is_read) {
                        unreadClass = 'unread';
                    } else {
                        unreadClass = '';
                    }
                    notificationsHtml += '<li class="info-item ">' +
                        '<div class="container">' +
                        '<a class="inner notification-item '+ unreadClass +'" href="#/view-notification/'+ item.id +'">' +
                        '<i class="fa fa-envelope-o" aria-hidden="true"></i>' +
                        '<label class="notification-item-title">'+ item.title +'</label>' +
                        '<p class="notification-item-excerpt">'+ item.short_description +'</p>' +
                        '</a>' +
                        '</div>' +
                       '</li>';
                });
                jQuery('#list-notifications').html(notificationsHtml);
            }
        });
    }
]);
app.controller('NotificationViewController', ['$scope', '$location', '$window', '$routeParams',
    function ($scope, $location, $window, $routeParams) {
        jQuery.ajax({
            url: ajaxUrl + '/buildings/view-notification?id=' + $routeParams.id,
            type: 'post',
            data: {
                access_token: $window.sessionStorage.access_token,
                building_id:  $window.sessionStorage.building_id
            },
            success: function (response) {
                notification = response;
                jQuery('#notification-title').html(notification.title);
                jQuery('#notification-content').html(notification.description);
            }
        });

    }
]);
app.controller('LogoutController', ['$location', '$window',
    function ($location, $window) {
        $window.sessionStorage.clear();
        $location.path('/');
    }
]);

