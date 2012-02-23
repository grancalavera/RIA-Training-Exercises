window.fbAsyncInit = function() {
    FB.init({
        appId: '216629731768132',
        status: true, 
        cookie: true,
        xfbml: true,
        oauth: true,
    });

    // This can be passed as part of the template, in the future
    RIA.facebookCallback();
};

(function(d){
    var js, id = 'facebook-jssdk'; if (d.getElementById(id)) {return;}
    js = d.createElement('script'); js.id = id; js.async = true;
    js.src = "//connect.facebook.net/en_US/all.js";
    d.getElementsByTagName('head')[0].appendChild(js);
}(document));
