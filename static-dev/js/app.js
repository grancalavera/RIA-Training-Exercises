/**
 * Facebook Exercise #1
 *
 * As a Client, I want to provide a way for my customers to Login or Register on 
 * my single website page, using their existing Facebook account. I need to 
 * know whether the Registered/Logged in customer is under or over 18 years old, 
 * in order to display relevant content to each age group.</p>
 */
/*! @ignore */
define(
[
    'jQuery', 'Underscore', 'Backbone',
    'facebook/facebook',

    'text!/static/templates/training/age-aware.html'
], 
function($, _, Backbone, facebook, t_ageAware){

    //--------------------------------------------------------------------------
    //
    // Configuration
    //
    //--------------------------------------------------------------------------
    var
    // Config
    t,

    // Module internal state
    user, session, ageAwareView,

    // Views
    AgeAwareView;

    t = {
        ageAware: _.template(t_ageAware)
    };
    user, session, ageAwareView = null;

    //--------------------------------------------------------------------------
    //
    // Views
    //
    //--------------------------------------------------------------------------

    AgeAwareView = Backbone.View.extend({

        template: t.ageAware,

        initialize: function(){
            this.model.bind('change', this.render, this);
        },

        render: function(){
            var age, underAge = 18, html, message, label, access;

            if (this.model.has('birthday')) {
                age = _.age(new Date(this.model.get('birthday')));
                if (age >= 18) {
                    message = 'You can access all the content without restrictions.';
                    access = 'Unrestricted';
                    label = 'label-success';

                } else {
                    message = 'You have restricted access to the content.';
                    access = 'Restricted';
                    label = 'label-warning';
                }
                html = this.template({message:message, label:label, access:access});
            } else {
                html = 'Login to get content recommendations.';
            }

            this.$el.html(html);

            return this;
        }
    })

    //--------------------------------------------------------------------------
    //
    // Module methods
    //
    //--------------------------------------------------------------------------
    /*! @ignore */

    function facebookInitHandler() {
        var perms = 'user_birthday';

        user = facebook.getUser();
        session = facebook.getSession();

        $('#fb-login').html(facebook.createLoginView(perms).render().el);

        ageAware = new AgeAwareView({model:user});
        $('#content').append(ageAware.render().el);
    }

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
            facebook.init('216629731768132', facebookInitHandler);
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

