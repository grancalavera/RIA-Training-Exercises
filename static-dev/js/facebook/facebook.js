define(
[
    // Libraries
    'jQuery', 'Backbone', 'Underscore',

    // Templates
    'text!facebook/fb-root.html',
    'text!facebook/fb-login.html'
], 

function(
    $, Backbone, _, 
    t_fbRoot, t_login){
	var isInit, init, t, loginButton, events, on, off;

    // Make it an event dispatcher
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

            FB.Event.subscribe('auth.login', function(response){
                events.trigger('fb:auth:login', response);
            });

            FB.Event.subscribe('auth.statusChange', function(response){
                events.trigger('fb:auth:statusChange', response);
            });

            FB.Event.subscribe('auth.authResponseChange', function(response){
                events.trigger('fb:auth:authResponseChange', response);
            });

            // Force an status update upon initialzation
            FB.getLoginStatus(function(response){
                events.trigger('fb:auth:statusChange', response);
            })

            isInit = true;
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
     */
    loginButton = function () {
        return t.login();
    }

	return {
		'init': init, 
        'loginButton': loginButton,
        'events': events
	};
})