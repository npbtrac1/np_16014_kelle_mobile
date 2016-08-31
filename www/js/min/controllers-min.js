var controllers=angular.module("controllers",[]);siteUrl="http://demo.enpii.com/16/kelle",ajaxUrl=siteUrl+"/api/web/v1",app.controller("MainController",["$scope","$location","$window",function(t,e,a){t.loggedIn=function(){return Boolean(a.sessionStorage.access_token)},t.logout=function(){delete a.sessionStorage.access_token,e.path("/login").replace()}}]),app.controller("LoginController",["$scope","$http","$window","$location",function(t,e,a,i){t.login=function(){t.submitted=!0,t.dataLoading=!0,t.error={},e.post(ajaxUrl+"/user/login",t.userModel).success(function(e){t.dataLoading=!1,a.sessionStorage.access_token=e.access_token,a.sessionStorage.building_id=e.building_id,a.sessionStorage.user_type=e.user_type,i.path("/dashboard").replace()}).error(function(e){t.dataLoading=!1,angular.forEach(e,function(e){t.error[e.field]=e.message})})}}]),app.controller("DashboardController",["$scope","$http","$window",function(t,e,a){function i(t){return t.toLowerCase().replace(/ /g,"-").replace(/[^\w-]+/g,"")}building_id=a.sessionStorage.building_id,void 0!==building_id&&null!=building_id&&(jQuery.get(ajaxUrl+"/buildings/view-building?id="+building_id,function(e){t.building=e,console.log(e),$("#building-name").html(e.name),blocks=e.building_facilities,blockFilter="",blockFilterData=e.filterBlocks,jQuery.each(blockFilterData,function(t,e){blockFilter+='<option value="#block-'+i(e.block)+'">'+e.block+"</option>"}),floorFilter="",floorFilterData=e.filterFloors,jQuery.each(floorFilterData,function(t,e){floorFilter+='<option value="#floor-'+i(e.floor)+'">'+e.floor+"</option>"}),facilityIdFilter="",facilityIdFilterData=e.filterFacilities,jQuery.each(facilityIdFilterData,function(t,e){facilityIdFilter+='<option value="#facilityID-'+i(e.facility_name)+'">'+e.facility_name+"</option>"}),blockHtml="";var a=[];jQuery.each(blocks,function(t,e){blockHtml+='<li class="block-item" data-block-name="#block-'+i(e.block)+'" data-floor="#floor-'+i(e.floor)+'" data-facility-id="#facilityID-'+i(e.facility_name)+'"><a href="#/facility/'+e.id+'"><div class="block-info"><div class="block-title">'+e.block+'</div><div class="block-info-item"><label>Floor: </label>'+e.floor+'</div><div class="block-info-item"><label>Facility Type: </label>'+e.facility.facility_type+'</div><div class="block-info-item"><label>Facility ID:</label>'+e.facility_name+'</div></div><div class="block-rating"><select id="block-rating-'+e.id+'" class="block-rating-star" data-current-rating="'+e.rating+'"> <option value=""></option> <option value="1"></option> <option value="2"></option> <option value="3"></option> <option value="4"></option> <option value="5"></option> </select><div class="block-rating-number">'+e.rating+'</div><div class="block-rating-label">Ratings</div></div><div class="clearfix" ></div></a></li>',a.push("block-rating-"+e.id)}),$("#block-filter").html(blockFilter),$("#floor-filter").html(floorFilter),$("#facility-filter").html(facilityIdFilter),$("#block-list").html(blockHtml),$.each(a,function(t,e){blockID=$("#"+e),blockID.barrating({theme:"fontawesome-stars-o",readonly:!0,deselectable:!1,showSelectedRating:!1,initialRating:blockID.data("current-rating")})})}),$("#block-status-filter").datepicker({beforeShow:function(){$("input").blur()}}),$("#block-filter").change(function(){$(".block-item").hide(),$("[data-block-name='"+$(this).val()+"']").show()}),$("#floor-filter").change(function(){$(".block-item").hide(),$("[data-floor='"+$(this).val()+"']").show()}),$("#facility-filter").change(function(){$(".block-item").hide(),$("[data-facility-id='"+$(this).val()+"']").show()}))}]),app.controller("FacilityController",["$scope","$location","$window","$routeParams",function(t,e,a,i){"admin"==a.sessionStorage.user_type||"supervisor"==a.sessionStorage.user_type?isReadOnly=!1:isReadOnly=!0,jQuery.get(ajaxUrl+"/buildings/view-facility?id="+i.id,function(e){var i=[];t.facility=e,$("#building-name").html(e.building.name),$("#facility-name").html(e.block),$("#facility-date").html(e.created_at),$("#facility-floor").html(e.floor),$("#facility-type").html(e.facility.facility_type),$("#facility-id").html(e.facility_name),$("#request-adhoc a").attr("href","#/request-adhoc/"+e.id),isReadOnly&&$("#request-adhoc a").hide(),tasks=e.tasks,tasksHtml="",jQuery.each(tasks,function(t,a){attachments=a.attachments,images="",jQuery.each(attachments,function(e,a){void 0!=a.thumbnail&&(images+='<li><a rel="image-row-'+t+' " class="popup-image" href="'+a.full+'" class="image-thumbnail"  style="background-image: url('+a.thumbnail+')"><img src="'+a.thumbnail+'"></a></li>')}),isReadOnly?(ratetaskButton="",updateImageButton=""):(ratetaskButton='<a class="rate-task-btn hidden" data-value="'+a.rating+'" href="/buildings/rate-task?id='+a.id+"/"+e.id+'">Rate</a> ',updateImageButton='<li><a class="image-button btn-image-update" href="#/update-image-task/'+a.id+"/"+e.id+'"><span>Edit</span><img src="img/transparent-img.png" width="1" height="1"></a> </li>'),tasksHtml+='<li class="task-item" id="task-rating-'+a.id+'"> <div class="inner"> <div class="container"> <div class="task-item-title">'+a.name+'</div> <div class="task-action"> <select  class="block-rating-star" data-current-rating="'+a.rating+'"> <option value=""></option> <option value="1"></option> <option value="2"></option> <option value="3"></option> <option value="4"></option> <option value="5"></option> </select> <a class="edit-facility" href="#/task/'+a.id+"/"+e.id+'">Edit</a> '+ratetaskButton+'</div> </div> <div class="image-control"> <ul class="image-list">'+images+updateImageButton+"</ul></div> </div> </li>",i.push(a.id)}),$("#task-list").html(tasksHtml),$("a.popup-image").colorbox({rel:$(this).attr("rel"),maxWidth:"95%",maxHeight:"95%",previous:' <i class="fa fa-chevron-left"></i>',next:'<i class="fa fa-chevron-right"></i>'}),$(document).ready(function(){$.each(i,function(t,e){taskID=$("#task-rating-"+e),taskRating=taskID.find(".block-rating-star"),taskRating.barrating({theme:"fontawesome-stars-o",readonly:isReadOnly,deselectable:!1,showSelectedRating:!1,initialRating:taskRating.data("current-rating"),onSelect:function(t,e,i){parentElement=$(i.currentTarget).closest(".task-item"),currentVal=taskRating.data("current-rating"),t!=currentVal&&(parentElement.find(".rate-task-btn").attr("data-value",t),parentElement.find(".rate-task-btn").removeClass("hidden"),parentElement.find(".edit-facility").addClass("hidden"),parentElement.find(".rate-task-btn").click(function(t){t.preventDefault(),self=this,t.preventDefault(),jQuery.ajax({url:ajaxUrl+$(self).attr("href"),type:"post",data:{access_token:a.sessionStorage.access_token,value:$(self).attr("data-value")},success:function(t){200==t.status&&($(self).addClass("hidden"),$(self).parent().find(".edit-facility").removeClass("hidden"))}})}))}})})})})}]),app.controller("TaskController",["$scope","$location","$window","$routeParams",function(t,e,a,i){"admin"==a.sessionStorage.user_type||"supervisor"==a.sessionStorage.user_type?isReadOnly=!1:isReadOnly=!0,isReadOnly&&$(".submit-rating").hide(),jQuery.get(ajaxUrl+"/buildings/view-task?id="+i.id+"&buildingFacilityID="+i.facility,function(e){t.facility=e,taskImages=e.mediaRelations,images="",jQuery.each(taskImages,function(t,e){e.attachment&&(images+='<li class="image-item"> <a data-toggle="modal" data-target="#image-gallery"  data-image-id="'+e.attachment.id+'" class="popup-image" data-image="'+e.attachment.full+'" href="'+e.attachment.full+'" style="background-image: url('+e.attachment.thumbnail+')"><img src="'+e.attachment.thumbnail+'"></a></li>')}),$("#task-name").html(e.name),$("#task-image-list").html(images),$("#task-rating-value").val(e.latestRating),taskRating=$("#single-task-rating"),currentRating=taskRating.attr("data-current-rating",e.latestRating),taskRating.barrating({theme:"fontawesome-stars-o",readonly:isReadOnly,deselectable:!1,showSelectedRating:!1,initialRating:e.latestRating,onSelect:function(t,e,a){parentElement=$(a.currentTarget).closest(".task-item"),currentVal=taskRating.data("current-rating"),t!=currentVal&&$("#task-rating-value").val(t)}}),$("a.popup-image").colorbox({rel:$(this).attr("rel"),maxWidth:"95%",maxHeight:"95%",previous:' <i class="fa fa-chevron-left"></i>',next:'<i class="fa fa-chevron-right"></i>'})}),buttonText=$("#submit-rating").html(),$("#submit-rating").click(function(t){t.preventDefault(),formSubmit=$("#single-task-form"),jQuery.ajax({url:ajaxUrl+"/buildings/rate-task?id="+i.id+"&buildingFacilityID="+i.facility,type:"post",data:{access_token:a.sessionStorage.access_token,value:$("#task-rating-value").val()},beforeSend:function(){$(".status-message").addClass("hidden"),formSubmit.find("button[type=submit]").attr("disabled",!0),formSubmit.find("button[type=submit]").html("Processing...")},complete:function(){formSubmit.find("button[type=submit]").attr("disabled",!1),formSubmit.find("button[type=submit]").html(buttonText)},success:function(t){200==t.status?$("#success-message").removeClass("hidden").find(".inner").html(t.message):$("#error-message").removeClass("hidden").find(".inner").html(t.message)}})})}]),app.controller("TaskUpdateImageController",["$scope","$location","$window","$routeParams",function(t,e,a,i){function n(t,e,a,i){return image="",id=void 0!=e?e:"",void 0!=i&&(image='<img src="'+i+'" class="image-thumbnail">'),mediaId=void 0!=a?a:"",dynamicItem='<tr class="dynamic-form-item"><td><div class="image-preview">'+image+'</div></td><td><input type="hidden" id="taskrelationmedia-'+t+'-id" name="TaskRelationMedia['+t+'][id]" value="'+id+'"><input type="hidden" id="taskrelationmedia-'+t+'-media_id" name="TaskRelationMedia['+t+'][media_id]" value="'+mediaId+'"><input type="hidden" id="taskrelationmedia-'+t+'-deleteimg" name="TaskRelationMedia['+t+'][deleteImg]"><input type="hidden" name="TaskRelationMedia['+t+'][attachment]" value=""><div class="btn btn-default btn-file">Choose Image<input class="attachment-image-input" type="file" name="TaskRelationMedia['+t+'][attachment]" value="'+id+'"></div><button class="btn btn-default btn-danger delete-form-item">Delete</button></td></tr>',dynamicItem}jQuery.get(ajaxUrl+"/buildings/update-image-task?id="+i.id+"&buildingFacilityID="+i.facility,function(t){function e(t){if(t.files&&t.files[0]){var e=new FileReader;e.onload=function(e){$(t).closest(".dynamic-form-item").find(".image-preview").html('<img src="'+e.target.result+'">')},e.readAsDataURL(t.files[0])}}mediaRelations=t.mediaRelations,images="",fileIndex=0,maxValueID=0,$("#task-name").val(t.name),jQuery.each(mediaRelations,function(t,e){void 0!=e.attachment&&(e.attachment.id>maxValueID&&(maxValueID=e.attachment.id),imageUrl=void 0!=e.attachment.thumbnail?e.attachment.thumbnail:"",images+=n(fileIndex,e.id,e.media_id,imageUrl),fileIndex++)}),images+='<tr> <td colspan="2" class="text-center v-middle "> <button type="button" class="add-item btn btn-success btn-sm"><span class="fa fa-plus"></span> New</button> </td> </tr>',$("#task-title").html(t.name),$("#task-image-list").html(images),$(".add-item").click(function(t){t.preventDefault(),maxValueID++,fileIndex<=3&&($(this).closest("tr").before(n(fileIndex,maxValueID)),fileIndex++,$(".attachment-image-input").change(function(){e(this)}))}),$(".delete-form-item").click(function(){$(this).closest(".dynamic-form-item").remove()}),$(".attachment-image-input").change(function(){e(this)}),$("#dynamic-form-submit").click(function(t){t.preventDefault();var e=$("#dynamic-form"),n=new FormData($(this).parents("form")[0]);return $.ajax({url:ajaxUrl+"/buildings/update-image-task?id="+i.id+"&buildingFacilityID="+i.facility,type:"POST",xhr:function(){var t=$.ajaxSettings.xhr();return t},beforeSend:function(){e.find("button[type=submit]").attr("disabled",!0),e.find("button[type=submit]").html("Processing...")},complete:function(){e.find("button[type=submit]").attr("disabled",!1),e.find("button[type=submit]").html(buttonText)},success:function(t){console.log(t),200==t.status?a.location.reload():$("#error-message").removeClass("hidden").find(".inner").html(t.message)},data:n,cache:!1,contentType:!1,processData:!1}),!1})})}]),app.controller("RequestController",["$scope","$location","$window","$routeParams",function(t,e,a,i){jQuery.get(ajaxUrl+"/buildings/view-facility?id="+i.id,function(t){$("#request-building-name").val(t.building.name),$("#request-block-name").val(t.block),$("#request-facility-id").val(t.facility.facility_type),tasks=t.tasks,tasksHtml="",jQuery.each(tasks,function(t,e){tasksHtml+='<label class="checkbox-item"><input type="checkbox" id="checkbox-item-'+t+'" name="BuildingFacility[tasks][]" value="'+e.id+'" checked=""> <label for="checkbox-item-'+t+'">'+e.name+"</label></label>"}),$("#building-tasks").html(tasksHtml)}),buttonText=$("#request-adhoc-btn").html(),$("#request-adhoc-btn").click(function(t){t.preventDefault(),fromRequest=$("#request-form"),formData=fromRequest.serializeArray(),formData.push({name:"access_token",value:a.sessionStorage.access_token}),console.log(buttonText),jQuery.ajax({url:ajaxUrl+"/buildings/request-adhoc?id="+i.id,type:"post",data:formData,beforeSend:function(){fromRequest.find("#message").hide(),fromRequest.find("button[type=submit]").attr("disabled",!0),fromRequest.find("button[type=submit]").html("Processing...")},complete:function(){fromRequest.find("button[type=submit]").attr("disabled",!1),fromRequest.find("button[type=submit]").html(buttonText)},success:function(t){obj=jQuery.parseJSON(t),200==obj.status?$("#success-message").removeClass("hidden").find(".inner").html(obj.message):$("#error-message").removeClass("hidden").find(".inner").html(obj.message)},error:function(t,e,a){$("#error-message").removeClass("hidden").find(".inner").html(a.message)}})})}]),app.controller("LogoutController",["$location","$window",function(t,e){e.sessionStorage.clear(),t.path("/")}]);