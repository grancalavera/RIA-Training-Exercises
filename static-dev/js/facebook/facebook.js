/**
 * Facebook module
 * 
 * Provides basic initialization functionality and shortcuts for common tasks.
 *
 * Dependencies:
 *
 * - RequireJS
 * - RequireJS/text
 * - jQuery
 * - Underscore.js
 * - Backbone.js
 * - Underscore-ext.js
 * 
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
    user, session, login, permissions,

    // Models
    UserModel, SessionModel, LoginModel, PermissionsModel,

    // Views
    LoginView;

    t = {
        root: _.template(t_fbRoot),
        login: _.template(t_login),
        logout: _.template(t_logout)
    };
    user = session = login = permissions = null;

    //--------------------------------------------------------------------------
    //
    // Models
    //
    //--------------------------------------------------------------------------

    /**
     * `PermissionsModel`
     * 
     * Models the list of requested and granted Facebook permissions.
     *
     * Usage:
     *
     *      var permissions = new PermissionsModel();
     *      permissions.set({'requested': ['user_birthday', 'read_mailbox']});
     *
     * @param {Array} requested Model attribute: The list of permissions requested by the application.
     * @param {Array} granted Model attribute: The list of permissions granted by the user.
     */
    PermissionsModel = Backbone.Model.extend({
        defaults: function(){
            return {
                requested: [],
                granted: []
            }
        }
    });

    /**
     * `UserModel`
     * 
     * Models a Facebook user
     * 
     */
    UserModel = Backbone.Model.extend();

    /**
     * `SessionModel`
     * 
     * Models a Facebook session
     *
     */
    SessionModel = Backbone.Model.extend();

    /**
     * `LoginModel`
     *
     * Models the relationship between a session, a set of permissions and an user.
     * 
     * Usage:
     *
     *      var user, session, login;
     *      user = new UserModel;
     *      session = new SessionModel;
     *      login = new LoginModel;
     *      login.set ({
     *          user: user,
     *          session: session,
     *          permissions: permissions
     *      });
     *
     * @param {UserModel} user
     * @param {SessionModel} session
     */
    LoginModel = Backbone.Model.extend();

    //--------------------------------------------------------------------------
    //
    // Views
    //
    //--------------------------------------------------------------------------

    /**
     * `LoginView`
     * 
     * Defines a view that allows the user to log in and out of Facebook. 
     *
     * @param {LoginModel} model Allows the view to track changes in both the current session and the current user.
     */
    LoginView = Backbone.View.extend({
        tLogin: t.login,
        tLogout: t.logout,
        events: {
            'click .fb-logout-button button': 'logout'
        },

        initialize: function(){
            var p;

            this.model.get('user').bind('change', this.render, this);
            this.model.get('session').bind('change', this.render, this);
            
            p = this.model.get('permissions').get('requested');
            this.$el.html(this.tLogin({permissions: p}));
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
     * `facebook.init()`
     * 
     * Initializes the Facebook api
     *
     * @param {Object} options Initialization options (listed below).
     * @param {String} options.appId Facebook app id
     * @param {Array} options.permissions The initial set of permissions requested by the application. Default: <code>undefined</code>
     * @param {Function} callback A function to be executed once the facebook module has been initialized. Default: <code>null</code>
     */
    function init(options, callback) {
        var script, id, p;

        if (isInit) {
            return;
        }

        id = 'facebook-jssdk';

        if (!$('#fb-root').length) {
            $('body').append(t.root());
        }

        user = new UserModel();
        session = new SessionModel();
        login = new LoginModel();
        permissions = new PermissionsModel();
        if (_.has(options, 'permissions')){
            addPermissions(options.permissions);
        }
        login.set({
            user: user, 
            session: session, 
            permissions:permissions
        });

        window.fbAsyncInit = function() {
            FB.init({
                appId: options.appId,
                status: true, 
                cookie: true,
                xfbml: true,
                oauth: true,
            });

            isInit = true;

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
     * `facebook.createLoginView()`
     *
     * Creates a login view and ties it with a user model. You need to initialize the Facebook module in order to create a LoginView.
     * 
     * @param {String|Array} perms  Space separated facebook permissions, or an <code>Array</code> of Facebook permissions.
     * @return {LoginView}
     */
    function createLoginView (perms) {
        if (!isInit) {
            throw new Error('You need to initialize the Facebook module in order to create a LoginView');
        }
        addPermissions(perms);
        return new LoginView({ model:login });
    }

    /**
     * `facebook.updateUser()`
     *
     * Calls `FB.api('/me')` and updates the `UserModel` instance in the Facebook module.
     */
    function updateUser(){
        FB.api('/me', function (response) {
            user.clear({silent:true});
            user.set(response);
        });
    }

    /**
     * `facebook.getUser()` 
     *
     * Returns the current `UserModel` instance.
     *
     * @return {UserModel}
     */
    function getUser() {
        return user;
    }

    /**
     * `facebook.getSession()`
     * 
     * Returns the current `SessionModel` instance.
     *
     * @return {SessionModel}
     */
    function getSession() {
        return session;
    }

    /**
     * `facebook.getPermissions()`
     * 
     * Returns the current `PermissionsModel` instance.
     *
     * @return {PermissionsModel}
     */
    function getPermissions() {
        return permissions;
    }

    /**
     * `facebook.addPermissions()`
     * 
     * Adds one or more permissions to the <code>requested</code> attribute in the 
     * <code>PermissionsModel</code>. This method will not attempt to updtate any non-granted 
     * permission, just ensures the same permission is not added more than one 
     * time to the <code>requested</code> permissions <code>Array</code>.
     *
     * Complete list of [valid Facebook permission strings](http://developers.facebook.com/docs/reference/api/permissions/ "Valid Facebook permission strings").
     * 
     * @param {String|Array} perms If a <code>String</code> is passed, this method will attempt to produce an <code>Array</code> of permissions performing a <code>split(" ")</code> on the passed <code>String</code>. In an <code>Array</code> is passed, this method will assume each index in the <code>Array</code> contains a permission <code>String</code>.
     * @return {Boolean} <code>true</code> if any permission is added to the <code>requested</code> or <code>false</code> if no permission is added.
     */
    function addPermissions(perms) {
        var requested;
        if (_.isString(perms)) {
            perms = perms.split(' ');
        }
        requested = permissions.get('requested');
        perms = _.uniq(perms);
        perms = _.difference(perms, requested);
        if (perms.length) {
            permissions.set({'requested': requested.concat(perms)});
            return true;
        } else {
            return false;
        }
    }

    /**
     * `facebook.updatePermissions()`
     * 
     * Requests all the non-granted permissions and updates the 
     * <code>PermissionsModel</code>
     * accordingly in the case the user grants additonal permissions.
     */
    function updatePermissions() {

    }

    //--------------------------------------------------------------------------
    //
    // Exports
    //
    //--------------------------------------------------------------------------

    /**
     * Module exports
     * 
     * - `addPermissions`
     * - `createLoginView`
     * - `getPermissions`
     * - `getSession`
     * - `getUser`
     * - `init`
     * - `updatePermissions`
     */
    return {
        'addPermissions': addPermissions,
        'createLoginView': createLoginView,
        'getPermissions': getPermissions,
        'getSession': getSession,
        'getUser': getUser,
        'init': init,
        'updatePermissions': updatePermissions
    };
})
