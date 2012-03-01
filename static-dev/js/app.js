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
                facebook.init('216629731768132', function(){
                    facebook.createLoginView($('#fb-login'), 'user_birthday').render();
                });
            });
        }
        return {initialize:initialize};
});