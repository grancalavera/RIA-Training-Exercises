define([
    'jQuery', 'Underscore', 'Backbone',
    'facebook/facebook',
    'text!../templates/hello-world.html', 
    'text!../templates/simple-text.html'], 
    function(
        $, _, Backbone, facebook, 
        t_hello, t_text){
        var initialize, loginButton, FBApi;

        initialize = function (){
            $(document).ready(function(){
                var loginButton, FB_api;

                $('body').html(_.template(t_hello)({message: 'Razorfish!'}));
                loginButton = $('body').append(facebook.createLoginButton('user_birthday'));
                $('.fb-login-button').hide();

                facebook.events.on('fb:init', function(api){
                    console.log('init');
                    FBApi = api;
                });

                facebook.events.on('fb:auth:statusChange', function(response){
                    console.log('statusChange');
                    switch (response.status) {
                        case 'connected':
                            $('.fb-login-button').hide();
                            getUser();
                            break;
                        case 'unknown':
                        case 'not-authorized':
                        default:
                            $('.fb-login-button').show();
                    }
                }, this);

                facebook.init('216629731768132');
            });
        }

        function getUser(){
            FBApi('/me', function(user){
                console.log(user);
            });
        }
        return {initialize:initialize};
});