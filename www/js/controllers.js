var controllers = angular.module('controllers', []);
siteUrl = 'http://top3.dev-srv.net/16/kelle';
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
        if($window.sessionStorage.access_token != undefined) {
            $location.path('/dashboard');
        }
    }
]);
/**
 * Created by lacphan on 7/31/16.
 */
app.controller('LoginController', ['$scope', '$http', '$window', '$location',
    function ($scope, $http, $window, $location) {

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
                }
            );
        };
    }
])
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

        if(localStorage.scrollTo != undefined && $scope.controllerName == 'DashboardController') {

            $('html, body').animate({
                scrollTop: localStorage.scrollTo - 30
            }, 800, function () {
            });
        }

        building_id = $window.sessionStorage.building_id;
        if (building_id !== undefined && building_id != null) {

            jQuery.get(ajaxUrl + '/buildings/view-building?id=' + building_id, function (response) {
                $('#building-name').html(response.name);
                blocks = response.building_facilities;

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
                        '<li class="block-item" data-block-name="#block-' + convertToSlug(item.block) + '" data-floor="#floor-' + convertToSlug(item.floor) + '" data-facility-id="#facilityID-' + convertToSlug(item.facility_name) + '" data-created-at="'+item.created_at+'">' +
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
                $('#block-list').html(blockHtml).delegate('.scroll-to-anchor','click',function () {
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
            $('#block-status-filter').datepicker({
                format: 'dd-MM-yyyy'
            }).on('show',function () {
                $(this).blur();
            }).on('changeDate',function () {
                $filterOrigin = new Date($(this).val());

                $('.block-item').each(function (e) {
                    $block = $(this);

                    $filterCompareVal = new Date(($block.attr('data-created-at')));
                    if($filterOrigin.getDate() <= $filterCompareVal.getDate()) {
                        $block.show();
                    } else {
                        $block.hide();
                    }
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

        if($window.sessionStorage.user_type == 'admin' || $window.sessionStorage.user_type == 'supervisor')  {
            isReadOnly = false;
        } else  {
            isReadOnly = true;
        }
        console.log($scope.controllerName);
        console.log(localStorage.scrollToFacility);
        if(localStorage.scrollToFacility != undefined && $scope.controllerName == 'FacilityController') {

            $('html, body').animate({
                scrollTop: localStorage.scrollToFacility - 30
            }, 800, function () {
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
            if(isReadOnly) {
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
                        imageCounter ++;
                        images += '<li><a rel="image-row-'+index+' " class="popup-image" href="' + image.medium + '" class="image-thumbnail"  style="background-image: url(' + image.thumbnail + ')"><img src="' + image.thumbnail + '"></a></li>';
                    }
                });
                if(isReadOnly) {
                    ratetaskButton = '';
                    updateImageButton = '';
                } else {
                    ratetaskButton = '<a class="rate-task-btn hidden" data-value="' + item.rating + '" href="/buildings/rate-task?id=' + item.id +  '&buildingFacilityID=' + response.id + '">Rate</a> ';
                    updateImageButton = '<li><a class="scroll-to-anchor image-button btn-image-update" href="#/update-image-task/' + item.id + '/' +response.id +'"><span><i class="fa fa-camera" aria-hidden="true"></i></span><img src="img/transparent-img.png" width="1" height="1"></a> </li>';
                    if(imageCounter >= 4) {
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
                    '<a class="scroll-to-anchor edit-facility" href="#/task/' + item.id +  '/' + response.id + '">Edit</a> ' +
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

            $('#task-list').html(tasksHtml).delegate('.scroll-to-anchor','click',function () {
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
        if($window.sessionStorage.user_type == 'admin' || $window.sessionStorage.user_type == 'supervisor')  {
            isReadOnly = false;
        } else  {
            isReadOnly = true;
        }

        if(isReadOnly) {
            $('.submit-rating').hide();

        }
        jQuery.get(ajaxUrl + '/buildings/view-task?id=' + $routeParams.id + '&buildingFacilityID=' + $routeParams.facility, function (response) {
            $scope.facility = response;
            taskImages = response.mediaRelations;

            images = '';
            jQuery.each(taskImages, function (index, mediaRelation) {
                if(mediaRelation.attachment) {
                    images += '<li class="image-item"> ' +
                        '<a data-toggle="modal" data-target="#image-gallery"  data-image-id="'+ mediaRelation.attachment.id +'" class="popup-image" data-image="'+ mediaRelation.attachment.medium +'" href="'+ mediaRelation.attachment.medium +'" style="background-image: url('+mediaRelation.attachment.thumbnail+')"><img src="'+mediaRelation.attachment.thumbnail+'"></a>' +
                        '</li>';
                }

            });
            updateImageButton = '';
            if(!isReadOnly) {
                updateImageButton = '<li class="image-item"><a class="image-button btn-image-update" href="#/update-image-task/' + $routeParams.id + '/' + $routeParams.facility +'"><span><i class="fa fa-camera" aria-hidden="true"></i></span><img src="img/transparent-img.png" width="1" height="1"></a> </li>';
            }
            $('#task-name').html(response.name);
            $('#task-image-list').html(images + updateImageButton);
            $('#task-rating-value').val(response.latestRating);
            taskRating = $('#single-task-rating');
            currentRating = taskRating.attr('data-current-rating',response.latestRating);
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
        buttonText =  $('#submit-rating').html();
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
                '<div class="btn btn-default btn-file ">Choose Image<input  accept="image/*;capture=camera"  class="attachment-image-input get-photo" type="file" name="TaskRelationMedia[' + index + '][attachment]" value="' + id + '"></div>' +
                '<button type="button" class="btn btn-default btn-file  get-photo">Choose Image</button>' +
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
                if(fileIndex <= 3) {
                    $(this).closest('tr').before(appendDynamicItem(fileIndex, maxValueID));
                    fileIndex++;
                    $('.attachment-image-input').change(gotPic);
                }
                if(fileIndex >= 4) {
                    $('.add-item').hide();
                }
                $('.delete-form-item').click(function () {
                    $(this).closest('.dynamic-form-item').remove();
                    fileIndex--;
                    if(fileIndex <= 3) {
                        $('.add-item').show();
                    }
                });

            });
            if(fileIndex >= 4) {
                $('.add-item').hide();
            }
            $('.delete-form-item').click(function () {
                $(this).closest('.dynamic-form-item').remove();
                fileIndex--;
                if(fileIndex <= 3) {
                    $('.add-item').show();
                }
            });

            $('.attachment-image-input').change(gotPic);
            $('.get-photo').click(function (event) {
                event.preventDefault();
                openPhotoNav(event);
            });

            function openPhotoNav(input) {
                $('#photo-nav').modal('show');

            }
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

                if(event.target.files.length == 1 && event.target.files[0].type.indexOf("image/") == 0) {

                    var reader = new FileReader();
                    reader.onload = function (e) {
                        $(event.target).closest('.dynamic-form-item').find('.image-preview').html('<img src="' + e.target.result + '">');
                    };
                    reader.readAsDataURL(event.target.files[0]);

                }
            }

            function getImage() {
                // Retrieve image file location from specified source
                navigator.camera.getPicture(uploadPhoto, function(message) {
                        console.log('get picture failed');
                    },{
                        quality: 50,
                        destinationType: navigator.camera.PictureSourceType.DATA_URL
                    }
                );
            }
            function getImageFromLib() {
                // Retrieve image file location from specified source
                navigator.camera.getPicture(uploadPhoto, function(message) {
                        console.log('get picture failed');
                    },{
                        quality: 50,
                        destinationType: navigator.camera.DestinationType.FILE_URI,
                        sourceType: navigator.camera.PictureSourceType.PHOTOLIBRARY
                    }
                );
            }
            function uploadPhoto(imageURI) {
                var options = new FileUploadOptions();
                options.fileKey="file";
                options.fileName=imageURI.substr(imageURI.lastIndexOf('/')+1);
                options.mimeType="image/jpeg";

                var params = new Object();
                params.value1 = "test";
                params.value2 = "param";

                options.params = params;
                options.chunkedMode = false;

                var ft = new FileTransfer();
                ft.upload(imageURI, "http://yourdomain.com/upload.php", win, fail, options);
            }

            function win(r) {
                console.log("Code = " + r.responseCode);
                console.log("Response = " + r.response);
                console.log("Sent = " + r.bytesSent);
                alert(r.response);
            }

            function fail(error) {
                console.log(error.code);
            }

            $('#dynamic-form-submit').click(function (e) {
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
        buttonText = $('#request-adhoc-btn').html();
        $('#request-adhoc-btn').click(function (e) {
            e.preventDefault();
            fromRequest = $('#request-form');
            formData = fromRequest.serializeArray();
            formData.push({
                name: "access_token",
                value: $window.sessionStorage.access_token
            });

            console.log(buttonText);
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
                        $('#success-message').removeClass('hidden').find('.inner').html(obj.message);
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
app.controller('LogoutController', ['$location', '$window',
    function ($location, $window) {
        $window.sessionStorage.clear();
        $location.path('/');
    }
]);

