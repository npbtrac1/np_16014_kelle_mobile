var controllers=angular.module("controllers",[]);siteUrl="http://lph-local.dev-srv.net/php/enpii/16/np_16014_kelle",ajaxUrl=siteUrl+"/api/web/v1",app.controller("MainController",["$scope","$location","$window",function(t,a,e){t.loggedIn=function(){return Boolean(e.sessionStorage.access_token)},t.logout=function(){delete e.sessionStorage.access_token,a.path("/login").replace()},void 0!=e.sessionStorage.access_token&&a.path("/dashboard")}]),app.controller("LoginController",["$scope","$http","$window","$location",function(t,a,e,i){t.login=function(){t.submitted=!0,t.dataLoading=!0,t.error={},a.post(ajaxUrl+"/user/login",t.userModel).success(function(a){t.dataLoading=!1,e.sessionStorage.access_token=a.access_token,e.sessionStorage.building_id=a.building_id,e.sessionStorage.user_type=a.user_type,i.path("/dashboard").replace()}).error(function(a){t.dataLoading=!1,angular.forEach(a,function(a){t.error[a.field]=a.message})})}}]),app.controller("HomeController",["$scope","$http","$window","$location",function(t,a,e,i){}]),app.controller("DashboardController",["$scope","$http","$window",function(t,a,e){function i(t){return t.toLowerCase().replace(/ /g,"-").replace(/[^\w-]+/g,"")}if(void 0!=localStorage.scrollTo&&"DashboardController"==t.controllerName&&$(document).ready(function(){$("html, body").animate({scrollTop:localStorage.scrollTo-30},800,function(){})}),building_id=e.sessionStorage.building_id,void 0!==building_id&&null!=building_id){jQuery.get(ajaxUrl+"/buildings/view-building?id="+building_id,function(t){$("#building-name").html(t.name),blocks=t.building_facilities,attachments=t.attachments,attachmentHtml="",jQuery.each(attachments,function(t,a){attachmentHtml+="<a href="+a.url+">"+a.title+"</a>"}),blockFilter="",blockFilterData=t.filterBlocks,jQuery.each(blockFilterData,function(t,a){blockFilter+='<option value="#block-'+i(a.block)+'">'+a.block+"</option>"}),floorFilter="",floorFilterData=t.filterFloors,jQuery.each(floorFilterData,function(t,a){floorFilter+='<option value="#floor-'+i(a.floor)+'">'+a.floor+"</option>"}),facilityIdFilter="",facilityIdFilterData=t.filterFacilities,jQuery.each(facilityIdFilterData,function(t,a){facilityIdFilter+='<option value="#facilityID-'+i(a.facility_name)+'">'+a.facility_name+"</option>"}),blockHtml="";var a=[];jQuery.each(blocks,function(t,e){blockHtml+='<li class="block-item" data-block-name="#block-'+i(e.block)+'" data-floor="#floor-'+i(e.floor)+'" data-facility-id="#facilityID-'+i(e.facility_name)+'" data-created-at="'+e.created_at+'"><a class="scroll-to-anchor" href="#/facility/'+e.id+'"><div class="block-info"><div class="block-title">'+e.block+'</div><div class="block-info-item"><label>Floor: </label>'+e.floor+'</div><div class="block-info-item"><label>Facility Type: </label>'+e.facility.facility_type+'</div><div class="block-info-item"><label>Facility ID:</label>'+e.facility_name+'</div></div><div class="block-rating"><select id="block-rating-'+e.id+'" class="block-rating-star" data-current-rating="'+e.rating+'"> <option value=""></option> <option value="1"></option> <option value="2"></option> <option value="3"></option> <option value="4"></option> <option value="5"></option> </select><div class="block-rating-number">'+e.rating+'</div><div class="block-rating-label">Ratings</div></div><div class="clearfix" ></div></a></li>',a.push("block-rating-"+e.id)}),$("#block-filter").html(blockFilter),$("#floor-filter").html(floorFilter),$("#facility-filter").html(facilityIdFilter),$("#building-attachments").html(attachmentHtml),$("#block-list").html(blockHtml).delegate(".scroll-to-anchor","click",function(){localStorage.scrollTo=$(this).offset().top}),$.each(a,function(t,a){blockID=$("#"+a),blockID.barrating({theme:"fontawesome-stars-o",readonly:!0,deselectable:!1,showSelectedRating:!1,initialRating:blockID.data("current-rating")})})});var n=["January","February","March","April","May","June","July","August","September","October","November","December"],l=new Date,o=l.getDate(),s=l.getMonth(),r=l.getFullYear(),c=o+"-"+n[s]+"-"+r;$("#block-status-filter").datepicker({format:"dd-MM-yyyy"}).on("show",function(){$(this).blur()}).on("changeDate",function(){$filterOrigin=new Date($(this).val()),$(".block-item").each(function(t){$block=$(this),$filterCompareVal=new Date($block.attr("data-created-at")),$filterOrigin.getDate()<=$filterCompareVal.getDate()?$block.show():$block.hide()})}).attr("placeholder",c),$("#block-filter").change(function(){$(".block-item").hide(),$("[data-block-name='"+$(this).val()+"']").show()}),$("#floor-filter").change(function(){$(".block-item").hide(),$("[data-floor='"+$(this).val()+"']").show()}),$("#facility-filter").change(function(){$(".block-item").hide(),$("[data-facility-id='"+$(this).val()+"']").show()})}}]),app.controller("FacilityController",["$scope","$location","$window","$routeParams",function(t,a,e,i){"admin"==e.sessionStorage.user_type||"supervisor"==e.sessionStorage.user_type?isReadOnly=!1:isReadOnly=!0,void 0!=localStorage.scrollToFacility&&"FacilityController"==t.controllerName&&$(document).ready(function(){$("html, body").animate({scrollTop:localStorage.scrollToFacility-30},800,function(){})}),jQuery.get(ajaxUrl+"/buildings/view-facility?id="+i.id,function(a){var i=[];t.facility=a,$("#building-name").html(a.building.name),$("#facility-name").html(a.block),$("#facility-date").html(a.created_at),$("#facility-floor").html(a.floor),$("#facility-type").html(a.facility.facility_type),$("#facility-id").html(a.facility_name),$("#request-adhoc a").attr("href","#/request-adhoc/"+a.id),isReadOnly&&$("#request-adhoc a").hide(),tasks=a.tasks,tasksHtml="",jQuery.each(tasks,function(t,e){attachments=e.attachments,images="",imageCounter=0,jQuery.each(attachments,function(a,e){void 0!=e.thumbnail&&(imageCounter++,images+='<li><a rel="image-row-'+t+' " class="popup-image" title="'+e.created_at+'" href="'+e.medium+'" class="image-thumbnail"  style="background-image: url('+e.thumbnail+')"><img src="'+e.thumbnail+'"></a></li>')}),isReadOnly?(ratetaskButton="",updateImageButton=""):(ratetaskButton='<a class="rate-task-btn hidden" data-value="'+e.rating+'" href="/buildings/rate-task?id='+e.id+"&buildingFacilityID="+a.id+'">Rate</a> ',updateImageButton='<li><a class="scroll-to-anchor image-button btn-image-update" href="#/update-image-task/'+e.id+"/"+a.id+'"><span><i class="fa fa-camera" aria-hidden="true"></i></span><img src="img/transparent-img.png" width="1" height="1"></a> </li>',imageCounter>=4&&(updateImageButton="")),tasksHtml+='<li class="task-item" id="task-rating-'+e.id+'"> <div class="inner"> <div class="container"> <div class="task-item-title">'+e.name+'</div> <div class="task-action"> <select  class="block-rating-star" data-current-rating="'+e.rating+'"> <option value=""></option> <option value="1"></option> <option value="2"></option> <option value="3"></option> <option value="4"></option> <option value="5"></option> </select> <a class="scroll-to-anchor edit-facility" href="#/task/'+e.id+"/"+a.id+'">Edit</a> '+ratetaskButton+'</div> </div> <div class="image-control"> <ul class="image-list">'+images+updateImageButton+"</ul></div> </div> </li>",i.push(e.id)}),$("#task-list").html(tasksHtml).delegate(".scroll-to-anchor","click",function(){localStorage.scrollToFacility=$(this).offset().top}),$("a.popup-image").colorbox({rel:$(this).attr("rel"),maxWidth:"95%",maxHeight:"95%",previous:' <i class="fa fa-chevron-left"></i>',next:'<i class="fa fa-chevron-right"></i>'}),$(document).ready(function(){$.each(i,function(t,a){taskID=$("#task-rating-"+a),taskRating=taskID.find(".block-rating-star"),taskRating.barrating({theme:"fontawesome-stars-o",readonly:isReadOnly,deselectable:!1,showSelectedRating:!1,initialRating:taskRating.data("current-rating"),onSelect:function(t,a,i){parentElement=$(i.currentTarget).closest(".task-item"),currentVal=taskRating.data("current-rating"),t!=currentVal&&(parentElement.find(".rate-task-btn").attr("data-value",t),parentElement.find(".rate-task-btn").removeClass("hidden"),parentElement.find(".edit-facility").addClass("hidden"),parentElement.find(".rate-task-btn").click(function(t){t.preventDefault(),self=this,t.preventDefault(),jQuery.ajax({url:ajaxUrl+$(self).attr("href"),type:"post",data:{access_token:e.sessionStorage.access_token,value:$(self).attr("data-value")},success:function(t){200==t.status&&($(self).addClass("hidden"),$(self).parent().find(".edit-facility").removeClass("hidden"))}})}))}})})})})}]),app.controller("TaskController",["$scope","$location","$window","$routeParams",function(t,a,e,i){"admin"==e.sessionStorage.user_type||"supervisor"==e.sessionStorage.user_type?isReadOnly=!1:isReadOnly=!0,isReadOnly&&$(".submit-rating").hide(),jQuery.get(ajaxUrl+"/buildings/view-task?id="+i.id+"&buildingFacilityID="+i.facility,function(a){t.facility=a,taskImages=a.mediaRelations,images="",jQuery.each(taskImages,function(t,a){a.attachment&&(images+='<li class="image-item"> <a data-toggle="modal" data-target="#image-gallery"  data-image-id="'+a.attachment.id+'" class="popup-image" data-image="'+a.attachment.medium+'" href="'+a.attachment.medium+'" style="background-image: url('+a.attachment.thumbnail+')"><img src="'+a.attachment.thumbnail+'"></a></li>')}),updateImageButton="",isReadOnly||(updateImageButton='<li class="image-item"><a class="image-button btn-image-update" href="#/update-image-task/'+i.id+"/"+i.facility+'"><span><i class="fa fa-camera" aria-hidden="true"></i></span><img src="img/transparent-img.png" width="1" height="1"></a> </li>'),$("#task-name").html(a.name),$("#task-image-list").html(images+updateImageButton),$("#task-rating-value").val(a.latestRating),taskRating=$("#single-task-rating"),currentRating=taskRating.attr("data-current-rating",a.latestRating),taskRating.barrating({theme:"fontawesome-stars-o",readonly:isReadOnly,deselectable:!1,showSelectedRating:!1,initialRating:a.latestRating,onSelect:function(t,a,e){parentElement=$(e.currentTarget).closest(".task-item"),currentVal=taskRating.data("current-rating"),t!=currentVal&&$("#task-rating-value").val(t)}}),$("a.popup-image").colorbox({rel:$(this).attr("rel"),maxWidth:"95%",maxHeight:"95%",previous:' <i class="fa fa-chevron-left"></i>',next:'<i class="fa fa-chevron-right"></i>'})}),buttonText=$("#submit-rating").html(),$("#submit-rating").click(function(t){t.preventDefault(),formSubmit=$("#single-task-form"),jQuery.ajax({url:ajaxUrl+"/buildings/rate-task?id="+i.id+"&buildingFacilityID="+i.facility,type:"post",data:{access_token:e.sessionStorage.access_token,value:$("#task-rating-value").val()},beforeSend:function(){$(".status-message").addClass("hidden"),formSubmit.find("button[type=submit]").attr("disabled",!0),formSubmit.find("button[type=submit]").html("Processing...")},complete:function(){formSubmit.find("button[type=submit]").attr("disabled",!1),formSubmit.find("button[type=submit]").html(buttonText)},success:function(t){200==t.status?e.history.back():$("#error-message").removeClass("hidden").find(".inner").html(t.message)}})})}]),app.controller("TaskUpdateImageController",["$scope","$location","$window","$routeParams",function(t,a,e,i){function n(t,a,e,i,n){return image="",void 0==n&&(n=!1),id=void 0!=a?a:"",void 0!=i&&(image='<img src="'+i+'" class="image-thumbnail">'),mediaId=void 0!=e?e:"",dynamicItem='<tr class="form-options-item dynamic-form-item"><td><div class="image-preview">'+image+'</div></td><td><input type="hidden" id="taskrelationmedia-'+t+'-id" name="TaskRelationMedia['+t+'][id]" value="'+id+'"><input type="hidden" id="taskrelationmedia-'+t+'-media_id" name="TaskRelationMedia['+t+'][media_id]" value="'+mediaId+'"><input type="hidden" id="taskrelationmedia-'+t+'-deleteimg" name="TaskRelationMedia['+t+'][deleteImg]"><input type="hidden" name="TaskRelationMedia['+t+'][attachment]" value=""><div class="btn btn-default btn-file">Choose Image<input  capture="camera" accept="image/*"  class="attachment-image-input" type="file" name="TaskRelationMedia['+t+'][attachment]" value="'+id+'"></div><button type="button" class="btn btn-default btn-danger delete-form-item">Delete</button></td></tr>',dynamicItem}jQuery.get(ajaxUrl+"/buildings/update-image-task?id="+i.id+"&buildingFacilityID="+i.facility,function(t){function a(t){if(t.files&&t.files[0]){var a=new FileReader;a.onload=function(a){$(t).closest(".dynamic-form-item").find(".image-preview").html('<img src="'+a.target.result+'">')},a.readAsDataURL(t.files[0])}}function l(t){if(1==t.target.files.length&&0==t.target.files[0].type.indexOf("image/")){var a=new FileReader;a.onload=function(a){$(t.target).closest(".dynamic-form-item").find(".image-preview").html('<img src="'+a.target.result+'">')},a.readAsDataURL(t.target.files[0])}}mediaRelations=t.mediaRelations,images="",fileIndex=0,maxValueID=0,$("#task-name").val(t.name),jQuery.each(mediaRelations,function(t,a){void 0!=a.attachment&&(a.attachment.id>maxValueID&&(maxValueID=a.attachment.id),imageUrl=void 0!=a.attachment.thumbnail?a.attachment.thumbnail:"",images+=n(fileIndex,a.id,a.media_id,imageUrl),fileIndex++)}),$("#task-title").html(t.name),$("#task-image-list").html(images),$.validator.addMethod("filesize",function(t,a,e){return this.optional(a)||a.files[0].size<=e},"Limit 2MB"),dynamicForm=jQuery("#dynamic-form"),dynamicForm.validate(),jQuery("input[type=file]").each(function(){jQuery(this).rules("add",{extension:"png|jpg|jpeg",accept:"image/*",filesize:2097152})}),dynamicForm.on("click",".add-item",function(t){t.preventDefault(),jQuery(".dynamicform_wrapper").triggerHandler("beforeInsert",[jQuery(this)]),jQuery(".dynamicform_wrapper").yiiDynamicForm("addItem",dynamicFormOptions,t,jQuery(this))}),dynamicForm.yiiActiveForm([{id:"task-name",name:"name",container:".field-task-name",input:"#task-name",error:".help-block.help-block-error",validate:function(t,a,e,i,n){yii.validation.required(a,e,{message:"Name cannot be blank."}),yii.validation.string(a,e,{message:"Name must be a string.",max:255,tooLong:"Name should contain at most 255 characters.",skipOnEmpty:1})}}],[]),dynamicForm.on("click",".delete-form-item",function(t){t.preventDefault(),jQuery(".dynamicform_wrapper").yiiDynamicForm("deleteItem",dynamicFormOptions,t,jQuery(this))}),$(".dynamicform_wrapper").on("afterInsert",function(t,a){$(".attachment-image-input").change(l),jQuery("input[type=file]").each(function(){jQuery(this).rules("add",{extension:"png|jpg|jpeg",accept:"image/*",filesize:2097152})})}),$(".attachment-image-input").change(l),$("#dynamic-form-submit").click(function(t){if(dynamicForm.valid()){t.preventDefault(),buttonText=$(this).html();var a=$("#dynamic-form"),n=new FormData($(this).parents("form")[0]);$.ajax({url:ajaxUrl+"/buildings/update-image-task?id="+i.id+"&buildingFacilityID="+i.facility,type:"POST",xhr:function(){var t=$.ajaxSettings.xhr();return t},beforeSend:function(){a.find("button[type=submit]").attr("disabled",!0),a.find("button[type=submit]").html("Processing...")},complete:function(){a.find("button[type=submit]").attr("disabled",!1),a.find("button[type=submit]").html(buttonText)},success:function(t){200==t.status?e.history.back():$("#error-message").removeClass("hidden").find(".inner").html(t.message)},data:n,cache:!1,contentType:!1,processData:!1})}return!1})})}]),app.controller("RequestController",["$scope","$location","$window","$routeParams",function(t,a,e,i){jQuery.get(ajaxUrl+"/buildings/view-facility?id="+i.id,function(t){console.log(t),$("#request-building-name").val(t.building.name),$("#request-block-name").val(t.block),$("#building-facility-facility_id").val(t.facility.facility_type),$("#building-facility-facility_name").val(t.facility_name),$("#building-facility-floor").val(t.floor),$("#building-facility-created_at").val(t.created_at),$("#timestamp").html(t.timestamp),tasks=t.tasks,tasksHtml="",jQuery.each(tasks,function(t,a){tasksHtml+='<label class="checkbox-item"><input type="checkbox" id="checkbox-item-'+t+'" name="BuildingFacility[tasks][]" value="'+a.id+'" checked=""> <label for="checkbox-item-'+t+'">'+a.name+"</label></label>"}),$("#building-tasks").html(tasksHtml)}),$("#request-adhoc-btn").click(function(t){t.preventDefault(),fromRequest=$("#request-form"),formData=fromRequest.serializeArray(),formData.push({name:"access_token",value:e.sessionStorage.access_token}),self=this,buttonText=$("#request-adhoc-btn").html(),jQuery.ajax({url:ajaxUrl+"/buildings/request-adhoc?id="+i.id,type:"post",data:formData,beforeSend:function(){fromRequest.find("#message").hide(),$(self).attr("disabled",!0),$(self).html("Processing...")},complete:function(){$(self).attr("disabled",!1),$(self).html(buttonText)},success:function(t){obj=jQuery.parseJSON(t),200==obj.status?e.history.back():$("#error-message").removeClass("hidden").find(".inner").html(obj.message)},error:function(t,a,e){$("#error-message").removeClass("hidden").find(".inner").html(e.message)}})})}]),app.controller("NotificationController",["$scope","$location","$window","$routeParams",function(t,a,e,i){jQuery.ajax({url:ajaxUrl+"/buildings/list-notifications",type:"post",data:{access_token:e.sessionStorage.access_token,building_id:e.sessionStorage.building_id},complete:function(){},success:function(t){notifications=t,notificationsHtml="",jQuery.each(notifications,function(t,a){a.is_read?unreadClass="":unreadClass="unread",notificationsHtml+='<li class="info-item "><div class="container"><a class="inner notification-item '+unreadClass+'" href="#/view-notification/'+a.id+'"><i class="fa fa-envelope-o" aria-hidden="true"></i><label class="notification-item-title">'+a.title+'</label><p class="notification-item-excerpt">'+a.short_description+"</p></a></div></li>"}),jQuery("#list-notifications").html(notificationsHtml)}})}]),app.controller("NotificationViewController",["$scope","$location","$window","$routeParams",function(t,a,e,i){jQuery.ajax({url:ajaxUrl+"/buildings/view-notification?id="+i.id,type:"post",data:{access_token:e.sessionStorage.access_token,building_id:e.sessionStorage.building_id},success:function(t){notification=t,jQuery("#notification-title").html(notification.title),jQuery("#notification-content").html(notification.description)}})}]),app.controller("LogoutController",["$location","$window",function(t,a){a.sessionStorage.clear(),t.path("/")}]);