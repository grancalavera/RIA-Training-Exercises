define(['jQuery', 'Underscore', 'Backbone'], function($, _, Backbone){
    var init = function (){
        $(document).ready(function(){
            var t = _.template('<h1><%= message %></h1>');
            $('body').html(t({message: 'Hello :D'}));
        });
    }
    return {initialize:init};
});