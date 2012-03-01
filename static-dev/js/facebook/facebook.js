define(
[
    // Libraries
    'jQuery', 'Backbone', 'Underscore',

    // Templates
    'text!facebook/fb-root.html',
    'text!facebook/fb-login.html'
],

function($, Backbone, _, t_fbRoot, t_login){
	var 
        // Config
        events, isInit, t,

        // Models and Views
        User, LoginView;

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
        logout: ''
    }

    //--------------------------------------------------------------------------
    //
    // Models
    //
    //--------------------------------------------------------------------------

    /**
     * @class {User} Defines a Facebook user
     */
    User = Backbone.Model.extend({
        initialize: function() {
        }
    });

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
        tLogout: t.logout,
        user: new User, // this is a Backbone.Model
        permissions: '', // and this just a String

        /**
         * TBD
         */
        initialize: function(){
            this.user.bind('change', this.render, this);
            $el.html(this.tLogin({permissions: this.permissions}));
        },

        /**
         * TBD
         */
        render: function(){
            return this;
        }
    });

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
    function init(appId) {
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
            events.trigger('fb:init', FB.api);

            FB.Event.subscribe('auth.login', function(response){
                events.trigger('fb:auth:login', response);
            });

            FB.Event.subscribe('auth.statusChange', function(response){
                events.trigger('fb:auth:statusChange', response);
            });

            FB.Event.subscribe('auth.authResponseChange', function(response){
                events.trigger('fb:auth:authResponseChange', response);
            });

            // Force an status update upon initialzation, for cases where the user is not "connected"
            // "connected" will fire an "statusChange" event, so no need to fire it twice
            FB.getLoginStatus(function(response){
                if (response.status !== 'connected') {
                    events.trigger('fb:auth:statusChange', response);
                }
            })

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
     * Returns a compiled template for the login button
     * @params permissions {String} Space separated facebook permissions
     */
    function createLoginButton(permissions) {
        permissions = permissions || '';
        return t.login({ permissions:permissions });
    }

    /**
     * Returns an empty facebook user model
     * @see Backbone.Model
     * @param json {Object} [Optional] An object with the user information.
     */
    function createUser(json) {
        return new User(json);
    }

    /**
     * Updates an User from a JSON object
     */
    function updateUser(json) {

    }

    /**
     * Checks if the FB.api is ready, and then returns it
     */
    function api () {
        try {
            return FB.api.apply(this, arguments);
        } catch (error) {
            console.error(error);
        }finally {
            return null;
        }
    }

    //--------------------------------------------------------------------------
    //
    // Exports
    //
    //--------------------------------------------------------------------------

	return {
		'init': init, 
        'createLoginButton': createLoginButton,
        'createUser': createUser,
        'updateUser': updateUser,
        'events': events,
        'api': api
	};
})