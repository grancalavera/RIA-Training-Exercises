require.config({
    paths: {
        loader: 'libs/loader',
        jQuery: 'libs/jquery/jquery',
        Underscore: 'libs/underscore/underscore',
        Backbone: 'libs/backbone/backbone'
    }
});

require([
    'app',
    'order!libs/jquery/jquery-min',
    'order!libs/underscore/underscore-min',
    'order!libs/backbone/backbone-min',
    ], function(App){
    App.initialize();
});