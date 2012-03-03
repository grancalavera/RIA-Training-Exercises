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
    'facebook/facebook'
], 
function($, _, Backbone, facebook){

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
            facebook.init('216629731768132', function(){
                $('#fb-login').html(facebook.createLoginView(
                    'user_birthday').render().el);
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

