define([
    'jQuery', 'Underscore', 'Backbone',
    'facebook/facebook',
    'text!../templates/hello-world.html', 
    'text!../templates/simple-text.html'], 
    function(
        $, _, Backbone, facebook, t_hello, t_text){

        function initialize() {
            $(document).ready(function(){
                $('#content').html(_.template(t_hello)({message: 'Razorfish!'}));
                // loginButton = $('#fb-login').append(facebook.createLoginButton('user_birthday'));
                // $('.fb-login-button').hide();
                // facebook.events.on('fb:auth:statusChange', function(response){
                //     switch (response.status) {
                //         case 'connected':
                //             $('.fb-login-button').hide();
                //             getUser();
                //             break;
                //         case 'unknown':
                //         case 'not-authorized':
                //         default:
                //             $('.fb-login-button').show();
                //             loggedUser = facebook.createUser();
                //     }
                // }, this);
                facebook.init('216629731768132');
            });
        }

        // function getUser(){
        //     facebook.api('/me', function(user){
        //         loggedUser = facebook.createUser(user);
        //     });
        // }

        return {initialize:initialize};
});