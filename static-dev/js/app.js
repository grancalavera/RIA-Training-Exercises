/**
 * RIA Training
 * 
 * Completed:
 *  - Facebook 1
 *  - Facebook 2
 *  - Facebook 3
 *  - Facebook 4
 *
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

        events: {
            'click .fb-send-dialog': 'send',
            'click .fb-feed-dialog': 'feed'
        },
        
        // todo: need to check the permissions, bc if the user is authenticated
        // from somewhere else the app breaks
        user_changeHandler: function(){
            if (user.has('birthday')) {
                ageAwareView = new AgeAwareView({model:user});
                this.$el.append(ageAwareView.render().el);
            } else if (ageAwareView) {
                ageAware.remove();
                ageAware = null;
            }
        },

        dialog: function(method, event) {
            var link, name;

            link = $(event.currentTarget).attr('href');
            name = $(event.currentTarget).attr('title');
            FB.ui({
                method: method,
                name: name,
                link: link,
            }, function(response){
                if (response) {
                    alert('Thanks for sharing!');
                } else {
                    alert('Something went wrong. Why not try again?');
                }
            });
        },

        send: function (event){
            event.preventDefault();
            this.dialog('send', event);
        },

        feed: function (event) {
            event.preventDefault();
            this.dialog('feed', event);
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
        },

    });

    //--------------------------------------------------------------------------
    //
    // Module methods
    //
    //--------------------------------------------------------------------------
    /*! @ignore */

    function facebookInitHandler() {
        var perms = 'user_birthday read_mailbox';

        user = facebook.getUser();
        session = facebook.getSession();

        $('#fb-login').html(facebook.createLoginView(perms).render().el);

        mainView = new MainView();
        $('#content').append(mainView.render().el);
    }

    function facebookInitHandler2() {
        console.log(facebook.getPermissions().toJSON());
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
            var birthday = '1976/03/23';
            // birthday = new Date(birthday);
            console.log(birthday);
            console.log(_.age(birthday));

            // facebook.init({
            //     appId: '216629731768132',
            //     permissions: [
            //         'user_birthday',
            //         'read_mailbox',
            //         'read_mailbox'
            //    ], 
            // }, facebookInitHandler2);
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

