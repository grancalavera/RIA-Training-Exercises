define([
    'jQuery', 'Underscore', 'Backbone',
    'facebook/facebook',
    'text!../templates/hello-world.html', 
    'text!../templates/simple-text.html'], 
    function(
        $, _, Backbone, facebook, 
        t_hello, t_text){
        var initialize, loginButton;

        initialize = function (){
            $(document).ready(function(){
                var loginButton;

                $('body').html(_.template(t_hello)({message: 'Razorfish!'}));
                loginButton = $('body').append(facebook.createLoginButton('user_birthday'));
                $('.fb-login-button').hide();

                facebook.events.on(
                    'fb:auth:statusChange', 
                    updateFromResponse,
                    this);

                facebook.init('216629731768132');
            });
        }

        function updateFromResponse(response) {
            switch (response.status) {
                case 'connected':
                    $('.fb-login-button').hide();
                    facebook.createUser();
                    break;
                case 'unknown':
                case 'not-authorized':
                default:
                    $('.fb-login-button').show();
            }
        }

        return {initialize:initialize};
});