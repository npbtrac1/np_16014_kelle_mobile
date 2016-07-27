/**
 * Created by lacphan on 6/8/16.
 */
var ajaxUrl = 'http://kelle.demo.enpii.com/api/web/v1';
var siteController = '/users';
var loginAction = '/login';

jQuery(document).ready(function () {
    loginForm = jQuery('#form-sign-in');

    loginForm.submit(function(e){
        e.preventDefault();
        console.log(ajaxUrl + siteController + loginAction);
        jQuery.ajax({
            type: "post",
            url: ajaxUrl + siteController + loginAction,
            data: {
                username: loginForm.find('#inputEmail').val(),
                password: loginForm.find('#inputPassword').val()
            },
            beforeSend: function () {
                loginForm.find('.btn').attr("disabled", true);
                loginForm.find('.btn').html('Logging...');
            },
            complete: function () {
                loginForm.find('.btn').attr("disabled", false);
                loginForm.find('.btn').html('Sign in');
            },
            success: function (data) {
                obj = jQuery.parseJSON( data);
                loginForm.find('.alert').remove();
                if(obj.status == 200) {
                    loginForm.find('.form-actions').after("<div class='alert alert-success fade in'>"+ obj.message +"</div>");
                    window.location.href = "dashboard.html";
                } else {
                    loginForm.find('.form-actions').after("<div class='alert alert-danger fade in'>"+ obj.message +"</div>");
                }
            }
        });
    });

});
