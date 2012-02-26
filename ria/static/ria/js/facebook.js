window.fbAsyncInit = function() {
    FB.init({
        appId: RIA.fbAppId,
        status: true, 
        cookie: true,
        xfbml: true,
        oauth: true,
    });

    // This can be passed as part of the template, in the future
    // RIA.facebookCallback();
    $('#content').append(_.template($('#fb-login-template').html()));
    console.log('append fb-login-template');
};

(function(d){
    var js, id = 'facebook-jssdk'; if (d.getElementById(id)) {return;}
    js = d.createElement('script'); js.id = id; js.async = true;
    js.src = "//connect.facebook.net/en_US/all.js";
    d.getElementsByTagName('head')[0].appendChild(js);
}(document));
