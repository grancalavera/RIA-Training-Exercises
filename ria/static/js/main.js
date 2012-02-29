define(["require_jquery"], function($) {
 	var start = function() {
    	$(document).ready(function() {
    		console.log('main.js');
    		$("body").html("Hello world!");
    	})
  	}
  return {"start":start};
});