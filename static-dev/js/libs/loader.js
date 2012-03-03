define(
	[
		'order!libs/jquery/jquery-min',
		'order!libs/bootstrap/bootstrap-min', // jQuery plugins
		'order!libs/underscore/underscore-min',
		'order!libs/underscore/underscore-ext',
		'order!libs/backbone/backbone-min'
	], 
	function(){
		return {
			$: $.noConflict(),
			_: _.noConflict(),
			Backbone: Backbone.noConflict()
		}
});
