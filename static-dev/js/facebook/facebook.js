/**
 * Facebook module. 
 * 
 * Provides basic initialzation functionality and shortcuts for
 * common taks, like generating a login/logout button with permissions, the user 
 * as well as access to Facebook events using Backbone.Events.
 * 
 * Dependencies:
 * - RequireJS
 * - RequireJS/text
 * - Underscore.js
 * - Backbone.js
 * - Underscore-ext.js
 * 
 * @author leon.coto@razorfish.com
 */
/*! @ignore */
define(
[
    // Libraries
    'jQuery', 'Backbone', 'Underscore',

    // Templates
    'text!/static/templates/facebook/fb-root.html',
    'text!/static/templates/facebook/fb-login.html',
    'text!/static/templates/facebook/fb-logout.html'
],
function($, Backbone, _, t_fbRoot, t_login, t_logout){

    //--------------------------------------------------------------------------
    //
    // Configuration
    //
    //--------------------------------------------------------------------------

    var 
    // Config
    isInit, t,

    // Module internal state
    user, session, login,

    // Models
    UserModel, SessionModel, LoginModel,

    // Views
    LoginView;

    t = {
        root: _.template(t_fbRoot),
        login: _.template(t_login),
        logout: _.template(t_logout)
    };
    user, session, login = null;

    //--------------------------------------------------------------------------
    //
    // Models
    //
    //--------------------------------------------------------------------------

    /**
     * UserModel 
     * 
     * Models a Facebook user
     */
    UserModel = Backbone.Model.extend();

    /**
     * SessionModel 
     * 
     * Models a Facebook session
     */
    SessionModel = Backbone.Model.extend();

    /**
     * LoginModel
     *
     * Usage:
     *      var user, session, login;
     *      user = new UserModel;
     *      session = new SessionModel;
     *      login = new LoginModel;
     *      login.set ({
     *          user: user,
     *          session: session
     *      })
     * Models the relationship between a session and an user.
     * @attribute user {UserModel}
     * @attribute session {SessionModel} 
     */
    LoginModel = Backbone.Model.extend();

    //--------------------------------------------------------------------------
    //
    // Views
    //
    //--------------------------------------------------------------------------

    /**
     * LoginView
     * 
     * Defines a view that allows the user to log in and out of Facebook. Also
     * provides a short user feedback in the case the user is logged in.
     * @attribute model {LoginModel} Allows the view to track changes in both 
     * the current session and the current user.
     */
    LoginView = Backbone.View.extend({
        tLogin: t.login,
        tLogout: t.logout,
        events: {
            'click .fb-logout-button button': 'logout'
        },

        initialize: function(){
            this.model.get('user').bind('change', this.render, this);
            this.model.get('session').bind('change', this.render, this);
            this.$el.html(this.tLogin(this.model.get('session').toJSON()));
            this.$('.fb-login-button').hide();
        },

        render: function(){
            var user, session, status;

            user = this.model.get('user');
            session = this.model.get('session');

            if (session.has('status')){
                status = session.get('status');
                if ((status === 'connected') && user.has('name')) {
                    this.$('.fb-login-button').hide();
                    this.$el.append(this.tLogout(user.toJSON()));
                } else if (status !== 'connected') {
                    this.$('.fb-login-button').show();
                    if(this.$('.fb-logout-button').length){
                        this.$('.fb-logout-button').remove();
                    }
                }
            }

            return this;
        },

        logout: function(){
            var self = this;
            FB.logout(function(response){
                self.model.get('user').clear();
                updateSession(response);
            });
        }
    });
    
    /*! @ignore */
    //--------------------------------------------------------------------------
    //
    // Module methods
    //
    //--------------------------------------------------------------------------

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
     *
     * @param appId {String} The facebook app id
     * @param callback {Function} [Optional] A function to be executed once the 
     * facebook module has been initialized.
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

            user = new UserModel();
            session = new SessionModel();
            login = new LoginModel();

            login.set({user: user, session: session});

            FB.Event.subscribe('auth.login', function(response){
                updateUser();
            });

            FB.Event.subscribe('auth.statusChange', function(response){
                updateSession(response);
            });

            FB.Event.subscribe('auth.authResponseChange', function(response){
            });

            // Force an status update upon initialzation, for cases where the 
            // user is not "connected", "connected" will fire an "statusChange" 
            // event, so no need to fire it twice
            FB.getLoginStatus(function(response){
                updateSession(response);
                if (response.status === 'connected') {
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
     * Creates a login view and ties it with a user model. You need to 
     * initialize the Facebook module in order to create a LoginView.
     * @param el {DOMElement} The parent element for the view
     * @params permissions {String} Space separated facebook permissions
     * @return {LoginView}
     */
    function createLoginView (permissions) {
        if (!isInit) {
            throw new Error('You need to initialize the Facebook module in order to create a LoginView');
        }
        session.set('permissions', permissions || '' );
        return new LoginView({ model:login });
    }

    /**
     * Updates the user model for the module.
     */
    function updateUser(){
        FB.api('/me', function (response) {
            user.clear({silent:true});
            user.set(response);
        });
    }

    /**
     * Returns the current UserModel instance
     */
    function getUser() {
        return user;
    }

    /**
     * Returns the current SessionModel instance
     */
    function getSession() {
        return session;
    }

    //--------------------------------------------------------------------------
    //
    // Facebook API proxies
    //
    //--------------------------------------------------------------------------
    
    /**
     * Access to the Facebook Graph API
     */
    function api () {
        try {
            return FB.api;
        } catch (error) {
            throw new Error(error);
        }
    }

    /**
     * Access to the Facebook Event module
     */
    function Event() {
        try {
            return FB.Event
        } catch (error) {
            throw new Error(error);
        }
    }

    //--------------------------------------------------------------------------
    //
    // Exports
    //
    //--------------------------------------------------------------------------

    /**
     * Listing of all module exports:
     * 
     * - `api`
     * - `createLoginView`
     * - `Event`
     * - `init`
     * - `session`
     * - `user`
     */
    return {
        'api': api,
        'createLoginView': createLoginView,
        'Event': Event,
        'getUser': getUser,
        'getSession': getSession,
        'init': init, 
        'session': this.session,
        'user': user
    };
})
