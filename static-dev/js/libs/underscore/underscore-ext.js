(function(){
_.mixin({
	/**
	 * Returns the age in years for a time interval, defined by a pair of <code>Date</code> objects.
	 *	If a final date is not provided, age will use new Date() to calculate today's date.
	 * @param from {Date} The initial date.
	 * @param to {Date} [Optional] The final date.
	 */
	age: function(from, to) {
		var age, m, msg;
		msg = '_.age(): "from" and "to" must be Date objects.';
		this.assert(from, this.isDate, msg);
		if (to) {
			this.assert(to, this.isDate, msg);
		}
		to = to || new Date();
	    age = to.getFullYear() - from.getFullYear();
	    m = to.getMonth() - from.getMonth();
	    if (m < 0 || (m === 0 && to.getDate() < from.getDate())) {
	        age--;
	    }
	    return age;
	},

	/**
	 * Asserts a value or array of values using an asertion function. 
	 *  The assertion function must return true if the assertion is met or false otherwise.
	 * @param value {Object} The value to assert.
	 * @param fn {Function} The function used to perform the assertion.
	 * @param message {String} [Optional] A message to display on the error thrown when the assertion fails.
	 */
	assert: function(value, fn, message) {
		var prefix = 'Assertion failed';
		if (!fn.call(this, value)) {
			throw new Error(message ? prefix + ': ' + message : prefix);
		}
	}

});
})();
