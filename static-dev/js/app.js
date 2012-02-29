define([
    'jQuery', 'Underscore', 'Backbone',
    'facebook/facebook',
    'text!../templates/hello-world.html', 
    'text!../templates/fb-root.html',
    'text!../templates/simple-text.html'], 
    function(
        $, _, Backbone, facebook, 
        t_hello, t_fb_root, t_text){

        var initialize = function (){
            $(document).ready(function(){
                $('body').html(_.template(t_hello)({message: 'Masmelo!'}));
                $('body').append(_.template(t_fb_root));
                facebook.init('216629731768132', function(response){
                    $('body').append(_.template(t_text)({text: response.status}));
                });
            });
        }

        return {initialize:initialize};
});