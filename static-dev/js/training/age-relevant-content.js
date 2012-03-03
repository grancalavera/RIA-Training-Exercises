/**
 * Age Relevant Content
 *
 * Fetches content dynamically
 *
 * Dependencies:
 * - RequireJS
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
    'jQuery', 
    'Underscore', 
    'Backbone',

    // 
    'text!static/templates/training/age-relevant-content.html'
],
function($, _, Backbone, t_content){
    var
    // Config
    t;

    //--------------------------------------------------------------------------
    //
    // Configuration
    //
    //--------------------------------------------------------------------------
    
    /*! @ignore */
    t = {
        content: _.template(t_content)
    };

    //--------------------------------------------------------------------------
    //
    // Views
    //
    //--------------------------------------------------------------------------

    ContentView = Backbone.View.extend();

    //--------------------------------------------------------------------------
    //
    // Exports
    //
    //--------------------------------------------------------------------------
    /**
     * Listing of all module exports:
     * 
     * - ``
     */
    return {

    };
});
