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
    'facebook/facebook'
], 
function($, _, Backbone, facebook){

    //--------------------------------------------------------------------------
    //
    // Configuration
    //
    //--------------------------------------------------------------------------

    // Module internal state
    var 
        activityLog             =
        additionalPermissions   =
        ageAwareView            =
        authResponse            =
        mainModel               =
        mainView                =
        permissions             =
        sharingLinksView        =
        user                    =
        null;

    //--------------------------------------------------------------------------
    //
    // Utils
    //
    //--------------------------------------------------------------------------

    /*! @ignore */
    function t(id){
        return _.template($(id).html());
    }

    //--------------------------------------------------------------------------
    //
    // Models
    //
    //--------------------------------------------------------------------------

    /**
     * MainModel
     * 
     * Describes the state of the application
     */
    var MainModel = Backbone.Model.extend({
        defaults: function(){
            return {
                hasAllPermissions: false,
                hasUser: false,
                isConnected: false
            }
        }
    });

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
    var MainView = Backbone.View.extend({

        el: '#content',

        hasAllPermissions: false,
        hasUser: false,
        isConnected: false,

        events: {
            'click .fb-dialog .fb-send': 'send',
            'click .fb-dialog .fb-feed': 'feed'
        },
        
        initialize: function() {
            this.model.bind('change', this.render, this);
        },

        render: function() {
            this.hasAllPermissions = this.model.get('hasAllPermissions');
            this.hasUser = this.model.get('hasUser');
            this.isConnected = this.model.get('isConnected');
            this.toggleAgeAwareContent();
            this.toggleSharingLinks();
            return this;
        },

        toggleAgeAwareContent: function() {
            if (!ageAwareView && this.isConnected && this.hasUser && this.hasAllPermissions){
                ageAwareView = new AgeAwareView({model:user});
                this.$('#suggested-content').append(ageAwareView.render().el);
            } else if (ageAwareView) {
                ageAwareView.remove();
                ageAwareView = null;
            }
        },

        toggleSharingLinks: function() {
            if (!sharingLinksView && this.isConnected) {
                sharingLinksView = new SharingLinksView();
                this.$('#sharing-links').append(sharingLinksView.render().el);
            } else if (sharingLinksView && !this.isConnected) {
                sharingLinksView.remove();
                sharingLinksView = null;
            }
        },

        send: function (event){
            event.preventDefault();
            this.dialog('send', event);
        },

        feed: function (event) {
            event.preventDefault();
            this.dialog('feed', event);
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
        }

    });

    /**
     * AgeAwareView
     * 
     * Renders different content based on the user's age
     */
    var AgeAwareView = Backbone.View.extend({

        template: t('#t-suggestions'),
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

            this.$el.html(this.template({
                message:message, 
                label:label, 
                access:access
            }));
            return this;
        },

    });

    /**
     * SharingLinksView
     * 
     * Renders links to share this page in Facebook, using different sharing methods
     */
    var SharingLinksView = Backbone.View.extend({
        render: function(){
            this.$el.append(t('#t-fb-dialog')({
                cta: 'Update your timeline with Backbone.js!',
                title: 'Backbone.js',
                type: 'fb-feed',
                url: 'http://documentcloud.github.com/backbone'
            }));

            this.$el.append(t('#t-fb-dialog')({
                cta: 'Send a message about Backbone.js!',
                title: 'Backbone.js',
                type: 'fb-send',
                url: 'http://documentcloud.github.com/backbone'
            }));
            return this;
        }
    });

    /**
     * ActivityLogView
     * 
     * Shows the application activity
     */
    var ActivityLogView = Backbone.View.extend({
        
        el: '#activity-log',
        isLogging: false,
        doClear: false,
        buffer: [],

        events: {
            'click .toggle': 'toggle',
            'click .clear': 'clear'
        },

        initialize: function(){
            if(this.options.enable) {
                this.$('.toggle').button('toggle');
                this.toggle();
            }
        },

        render: function() {

            // Toggle button, account for log activation other than clicking 
            // the button
            if (this.isLogging) {
                this.$('.toggle').html('Stop');
            } else {
                this.$('.toggle').html('Start');
            }

            // Clear
            if (this.doClear) {
                this.$('.log').html('');
                this.buffer = [];
                this.doClear = false;
            }

            // Log
            if (this.isLogging && this.buffer.length) {

                this.$('.log').append(t('#t-activity-log')({
                    log: _.last(this.buffer)
                }));

                this.$('.log').animate(
                    {scrollTop: this.$('.log').prop('scrollHeight')},
                    500
                );
            }

            return this;
        },

        foo: function(){
            this.$('.toggle').button('toggle');
        },

        toggle: function(){
            this.isLogging = !this.isLogging
            if (this.isLogging) {
                this.model.bind('change', this.updateBuffer, this);
            } else {
                this.model.unbind('change', this.updateBuffer, this);
            }
            this.render();
        },

        clear: function(){
            this.doClear = true;
            this.render();
        },

        updateBuffer: function(){
            var activity = [];
            activity.push('--------------------------------------------------------------');
            activity.push('Actity origin:         ' + mainModel.get('origin'));
            activity.push('--------------------------------------------------------------');
            activity.push('Timestamp:             ' + new Date());
            activity.push('Status:                ' + authResponse.get('status'));
            activity.push('Requested permissions: ' + permissions.get('requested'));
            activity.push('Granted permissions:   ' + permissions.get('granted'));
            activity.push('User id:               ' + user.get('id'));
            activity.push('User name:             ' + user.get('name'));
            activity.push('Is connected:          ' + mainModel.get('isConnected'));
            activity.push('Has user:              ' + mainModel.get('hasUser'));
            activity.push('Has all permissions:   ' + mainModel.get('hasAllPermissions'));
            activity.push('--------------------------------------------------------------');
            this.buffer.push(activity.join('\n'));
            this.render();
        }

    });

    /**
     * AdditionalPermissionsView
     * 
     * Prompts the user to grant additional permissions in exchange to be allowed
     * to store he/her personal details on our database.
     */
    var AdditionalPermissionsView = Backbone.View.extend({
        el: '#additional-permissions',
        permissions: ['user_location', 'user_religion_politics', 'user_relationships'],
        fields: ['relationship_status', 'religion', 'location'],
        state: '', // missing-permissions, incomplete, complete

        events: {
            'click .grant-permissions': 'grantPermissions'
        },

        initialize: function (){
            user.bind('change', this.handleActivity, this);
            permissions.bind('change', this.handleActivity, this);
        },

        render: function(){
            var template, context = {};
            switch(this.state) {
                case 'incomplete':
                    template = t('#t-additional-permissions-granted');
                    break;
                case 'complete':
                    template = t('#t-additional-permissions-granted');
                    break;
                case 'missing-permissions':
                    template = t('#t-additional-permissions-prompt');
                    break;
                default:
                    template = _.template('');
            }
            this.$el.html(template(context));
            return this;
        },

        handleActivity: function() {
            // permissions are updated AFTER the user is updated, so if we have
            // been granted ALL the permissions and still we have missing fields
            // that comes straight from the particular user profile

            var hasAllFields, hasAllPermissions
            
            hasAllFields = _.all(this.fields, function(field){
                user.get(field);
            }, this);

            hasAllPermissions = facebook.hasPermissionsTo(this.permissions);

            if (hasAllFields) {
                // Prompt to store his/her personal info with us
                this.state = 'complete';
            } else if (hasAllPermissions) {
                // Prompt to store his/her personal info with us and suggest to 
                // do a profile update with Facebook
                this.state = 'incomplete';
            } else {
                // Prompt to grant more permissions to our app
                this.state = 'missing-permissions';
            }

            this.render();
        },

        grantPermissions: function() {
            facebook.addPermissions(this.permissions);
            FB.login();
        }

    });

    //--------------------------------------------------------------------------
    //
    // Module methods
    //
    //--------------------------------------------------------------------------
    /*! @ignore */

    function facebookInitHandler() {
        mainModel = new MainModel();

        user = facebook.getUser();
        authResponse = facebook.getAuthResponse();
        permissions = facebook.getPermissions();

        user.on('change', activityHandler);
        authResponse.on('change', activityHandler);
        permissions.on('change', activityHandler);
        
        // user.on('change', printUser);

        $('#fb-login').html(facebook.createLoginView().render().el);

        additionalPermissions = new AdditionalPermissionsView({});
        additionalPermissions.render();

        activityLog = new ActivityLogView({model:mainModel, enable:true});
        activityLog.render();
        
        mainView = new MainView({model:mainModel});
        mainView.render();
    }

    function printUser(){
        console.log(user.toJSON());
    }

    function activityHandler(event) {
        var origin;

        switch (event) {
            case authResponse:
                origin = 'authResponse';
                break;
            case user:
                origin = 'user';
                break;
            case permissions:
                origin = 'permissions';
                break;
            default:
                origin = 'unknown';
        }

        mainModel.set({
            hasAllPermissions: facebook.hasAllPermissions(),
            hasUser: !_.isNull(user.get('id')) && !_.isUndefined(user.get('id')),
            isConnected: authResponse.get('status') === 'connected',
            origin: origin
        });
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
            facebook.init({
                appId: '216629731768132',
                permissions: 'user_birthday'
            }, facebookInitHandler);
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

