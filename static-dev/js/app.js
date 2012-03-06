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
    user, session, mainView, ageAwareView,

    // Views
    Main, AgeAwareView;

    t = {
        ageAware: _.template(t_ageAware)
    };
    user, session, ageAwareView = null;

    //--------------------------------------------------------------------------
    //
    // Views
    //
    //--------------------------------------------------------------------------

    /**
     * MainView
     * 
     * Acts as the main view controller, coordinating the interaction between 
     * different models and views.
     */
    MainView = Backbone.View.extend({
        initialize: function() {
            user.bind('change', this.user_changeHandler, this);
        },

        user_changeHandler: function(){
            if (user.has('birthday')) {
                ageAware = new AgeAwareView({model:user});
                this.$el.append(ageAware.render().el);
            } else if (ageAware) {
                ageAware.remove();
                ageAware = null;
            }
        }
    });

    /**
     * AgeAwareView
     * 
     * Renders different content based on the user's age
     */
    AgeAwareView = Backbone.View.extend({

        template: t.ageAware,
        ageLimit: 18,

        initialize: function(){
            this.model.bind('change', this.render, this);
        },

        render: function(){
            var age, html, message, label, access;

            age = _.age(new Date(this.model.get('birthday')));
            if (age >= this.ageLimit) {
                message = 'You can access all the content without restrictions.';
                access = 'Unrestricted';
                label = 'label-success';

            } else {
                message = 'You have restricted access to the content.';
                access = 'Restricted';
                label = 'label-warning';
            }

            this.$el.html(this.template({message:message, label:label, access:access}));
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

        mainView = new MainView();
        $('#content').append(mainView.render().el);

        // ageAware = new AgeAwareView({model:user});
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

