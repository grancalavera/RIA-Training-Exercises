/**
 * Bootstrapping for the main JS Application
 * 
 * Dependencies:
 * - RequireJS
 * - RequireJS/order
 * - jQuery
 * - Underscore.js
 * - Underscore-ext.js
 * - Backbone.js
 */
 /*!
  * RequireJS configuration
  */
require.config({
    paths: {
        loader: 'libs/loader',
        jQuery: 'libs/jquery/jquery',
        Underscore: 'libs/underscore/underscore',
        Backbone: 'libs/backbone/backbone'
    }
});
/**
 * @api true
 */
require(
[
    'app',
    'order!libs/jquery/jquery-min',
    'order!libs/underscore/underscore-min',
    'order!libs/backbone/backbone-min',
],
function(App){
    App.initialize();
});
