define([
    'jQuery', 'Underscore', 'Backbone',
    'facebook/facebook',
    'text!../templates/hello-world.html', 
    'text!../templates/simple-text.html'], 
    function(
        $, _, Backbone, facebook, 
        t_hello, t_text){

        var initialize = function (){
            $(document).ready(function(){
                var loginButton;

                $('body').html(_.template(t_hello)({message: 'Razorfish!'}));
                loginButton = $('body').append(facebook.loginButton());
                $('.fb-login-button').hide();

                facebook.events.on('facebook:init', function(message){
                    console.log('from app > facebook:init ( ' + message + ' )');
                });

                facebook.init('216629731768132', function(response){
                    switch(response.status) {
                        case 'connected':
                            break;
                        case 'not-authorized':
                        case 'unknown':
                        default:
                            $('.fb-login-button').show();
                    }
                    $('body').append(_.template(t_text)({text: response.status}));
                });
            });
        }

        return {initialize:initialize};
});