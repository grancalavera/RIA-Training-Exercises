/**
 * Facebook module. Provides basic initialzation functionality and shortcuts for
 * common taks, like generating a login/logout button with permissions, the user 
 * as well as access to Facebook events using Backbone.Events.
 */
define(
[
    // Libraries
    'jQuery', 'Backbone', 'Underscore',

    // Templates
    'text!facebook/fb-root.html',
    'text!facebook/fb-login.html',
    'text!facebook/fb-logout.html'
],
function($, Backbone, _, t_fbRoot, t_login, t_logout){
    var 
    // Config
    events, isInit, t,

    // Module internal state
    user, session, login,

    // Models
    UserModel, SessionModel, LoginModel,

    // Views
    LoginView;

    //--------------------------------------------------------------------------
    //
    // Configuration
    //
    //--------------------------------------------------------------------------

    /**
     * @private
     */
    events = {};
    _.extend(events, Backbone.Events);

    /**
     * @private
     */
    t = {
        root: _.template(t_fbRoot),
        login: _.template(t_login),
        logout: _.template(t_logout)
    };

    /**
     * @private
     */
    user = null;

    //--------------------------------------------------------------------------
    //
    // Models
    //
    //--------------------------------------------------------------------------

    /**
     * @class {UserModel} Model for a Facebook user
     */
    UserModel = Backbone.Model.extend();

    /**
     * @class {SessionModel} Model for a Facebook session
     */
    SessionModel = Backbone.Model.extend();

    /**
     * @class {LoginModel} Model to keep track of the login status
     */
    LoginModel = Backbone.Model.extend();

    //--------------------------------------------------------------------------
    //
    // Views
    //
    //--------------------------------------------------------------------------

    /**
     * @class {LoginView}
     * Defines a view that allows the user to log in and out of Facebook. Also
     *  provides a short user feedback in the case the user is logged in.
     * @param user {User} A facebook user
     * @param permissions {String} [Optional] A space separated string of 
     *  facebook permissions.
     */
    LoginView = Backbone.View.extend({
        /**
         * @private
         */
        tLogin: t.login,
        /**
         * @private
         */
        tLogout: t.logout,
        /**
         * @private
         */
        events: {
            'click .fb-logout-button': 'logout'
        },

        /**
         * @constructor All model (User) manipulation is handled by the module
         * itself.
         */
        initialize: function(){
            var self = this;
            this.model.get('user').bind('change', this.render, this);
        },

        /**
         * @see Backbone.View#render
         */
        render: function(){
            console.log(this.model.get('user').toJSON());
            console.log(this.model.get('session').toJSON());

            // var loginMode = true;
            // if (this.firstRender){
            //     this.$el.html(this.tLogin(this.model.toJSON()));
            //     this.$('.fb-login-button').hide();
            //     this.firstRender = false;
            // }
            // if (this.model.has('name')) {
            //     this.$('.fb-login-button').hide();
            //     this.$el.append(this.tLogout(this.model.toJSON()));
            // } else {
            //     this.$('.fb-login-button').show();
            //     if(this.$('.fb-logout-button').length){
            //         this.$('.fb-logout-button').remove();
            //     }
            // }

            return this;
        },

        /**
         * @private
         */
        logout: function(){
            FB.logout(function(response){
                updateUserModel()
            });
        }
    });

    //--------------------------------------------------------------------------
    //
    // Module methods
    //
    //--------------------------------------------------------------------------

    /**
     * @private
     */
    function updateSession(response) {
        _.extend(response, {
            permissions: session.get('permissions')
        });
        session.clear({silent:true});
        session.set(response);
    }

    //--------------------------------------------------------------------------
    //
    // API
    //
    //--------------------------------------------------------------------------

    /**
     * Initializes the Facebook api
     * @param appId {String} The facebook app id
     * @param callback {Function} [Optional] A function to be executed once the 
     *  facebook module has been initialized.
     */
    function init(appId, callback) {
        var script, id;

        if (isInit) {
            return;
        }

        id = 'facebook-jssdk';

        if (!$('#fb-root').length) {
            $('body').append(t.root());
        }

        window.fbAsyncInit = function() {
            FB.init({
                appId: appId,
                status: true, 
                cookie: true,
                xfbml: true,
                oauth: true,
            });

            isInit = true;

            user = new UserModel;
            session = new SessionModel;
            login = new LoginModel;
            login.set({user: user, session: session});

            events.trigger('fb:init', FB.api);

            FB.Event.subscribe('auth.login', function(response){
                events.trigger('fb:auth:login', response);
                updateUser();
            });

            FB.Event.subscribe('auth.statusChange', function(response){
                events.trigger('fb:auth:statusChange', response);
                updateSession(response);
            });

            FB.Event.subscribe('auth.authResponseChange', function(response){
                events.trigger('fb:auth:authResponseChange', response);
            });

            // Force an status update upon initialzation, for cases where the 
            // user is not "connected", "connected" will fire an "statusChange" 
            // event, so no need to fire it twice
            FB.getLoginStatus(function(response){
                if (response.status !== 'connected') {
                    events.trigger('fb:auth:statusChange', response);
                } else {
                    updateUser();
                }
            });

            if (callback) {
                callback();
            }

        }

        if ($(id).length) {
            return;
        }

        script = document.createElement('script'); 
        script.id = id; 
        script.async = true;
        script.src = "//connect.facebook.net/en_US/all.js";
        $('head').append(script);
    };

    /**
     * Checks if the FB.api is ready, and then returns it
     */
    function api () {
        try {
            return FB.api.apply(this, arguments);
        } catch (error) {
            throw new Error(error);
        }
    }

    /**
     * Creates a login view and ties it with a user model. You need to 
     * initialize the Facebook module in order to create a LoginView.
     * @param el {Element} The parent element for the view
     * @params permissions {String} Space separated facebook permissions
     */
    function createLoginView (el, permissions) {
        if (!isInit) {
            throw new Error('You need to initialize the Facebook module in order to create a LoginView');
        }
        session.set('permissions', permissions);
        return new LoginView({el:el, model:login});
    }

    /**
     * Updates the user data
     */
    function updateUser(){
        FB.api('/me', function (response) {
            user.clear({silent:true});
            user.set(response);
        });
    }

    //--------------------------------------------------------------------------
    //
    // Exports
    //
    //--------------------------------------------------------------------------

    return {
        'init': init, 
        'api': api,
        'createLoginView': createLoginView,
        'events': events
    };
})
