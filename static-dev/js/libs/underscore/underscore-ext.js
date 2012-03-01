(function(){
_.mixin({
	/**
	 * Returns the age in years for a time interval, defined by a pair of <code>Date</code> objects.
	 *	If a final date is not provided, age will use new Date() to calculate today's date.
	 * @param from {Date} The initial date.
	 * @param to {Date} [Optional] The final date.
	 */
	age: function(from, to) {
		var age, m;
		to = to || new Date();
	    age = to.getFullYear() - from.getFullYear();
	    m = to.getMonth() - from.getMonth();
	    if (m < 0 || (m === 0 && to.getDate() < from.getDate())) {
	        age--;
	    }
	    return age;
	}
});
})();