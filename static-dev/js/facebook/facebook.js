define(
[
    // Libraries
    'jQuery', 'Backbone', 'Underscore',

    // Templates
    'text!facebook/fb-root.html',
    'text!facebook/fb-login.html'
], 

function($, Backbone, _, 
    t_fbRoot, t_login){
	var isInit, init, t, createLoginButton, events, User, createUser, getApi;

    // Create an event dispatcher
    events = {};
    _.extend(events, Backbone.Events);

    /**
     * @private
     * Templates
     */
    t = {
        root: _.template(t_fbRoot),
        login: _.template(t_login)
    }

    /**
     * @class User Defines a Facebook user
     */
    User = Backbone.Model.extend({
        initialize: function() {
            console.log('New Facebook user created');
        }
    });
    
    /**
     * Initializes the facebook module
     * @param appId {String} The facebook app id
     * @param callback {Function} [Optional] A function to be executed once the facebook module has been initialized.
     */
    init = function(appId){
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
    createLoginButton = function (permissions) {
        permissions = permissions || '';
        return t.login({permissions:permissions});
    }

    /**
     * Returns an empty facebook user model
     * @see Backbone.Model
     */
    createUser = function() {
        return new User;
    }

    /**
     * Checks if the FB.api is ready, and then returns it
     */
    getApi = function() {
        try {
            return FB.api;
        } catch (error) {
            console.error(error);
        }finally {
            return null;
        }
    }

	return {
		'init': init, 
        'createLoginButton': createLoginButton,
        'createUser': createUser,
        'events': events,
        'getApi': getApi
	};
})