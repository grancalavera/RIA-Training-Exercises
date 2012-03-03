/**
 * Facebook Exercise #1
 *
 * As a Client, I want to provide a way for my customers to Login or Register on 
 * my single website page, using their existing Facebook account. I need to 
 * know whether the Registered/Logged in customer is under or over 18 years old, 
 * in order to display relevant content to each age group.</p>
 */
define(
[
    'jQuery', 'Underscore', 'Backbone',
    'facebook/facebook',
    'text!../templates/hello-world.html', 
    'text!../templates/simple-text.html'
], 
function($, _, Backbone, facebook, t_hello, t_text){

    //--------------------------------------------------------------------------
    //
    // API
    //
    //--------------------------------------------------------------------------

    /**
     * Initializes the main application
     */
    function initialize() {
        $(document).ready(function(){
            $('#content').html(_.template(t_hello)({message: 'Razorfish!'}));
            // check for permission-less button
            facebook.init('216629731768132', function(){
                facebook.createLoginView(
                    $('#fb-login'), 
                    'user_birthday').render();
            });
        });
    }

    //--------------------------------------------------------------------------
    //
    // Exports
    //
    //--------------------------------------------------------------------------

    /**
     * Exported APIs
     * 
     * - initialize: initializes the application.
     */
    return {initialize:initialize};
});

