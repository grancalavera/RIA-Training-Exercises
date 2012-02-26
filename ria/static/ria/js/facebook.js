(function(){
    facebook = _.namespace('ria.facebook');
    facebook.init = function(appId, callback){
        var js, id = 'facebook-jssdk';
        window.fbAsyncInit = function() {
            FB.init({
                appId: appId,
                status: true, 
                cookie: true,
                xfbml: true,
                oauth: true,
            });

            FB.getLoginStatus(function(response) {
                if (callback) {
                    callback(response);
                }
            });
        }
        if (document.getElementById(id)) {
            return;
        }
        js = document.createElement('script'); 
        js.id = id; 
        js.async = true;
        js.src = "//connect.facebook.net/en_US/all.js";
        document.getElementsByTagName('head')[0].appendChild(js);
    }
})();