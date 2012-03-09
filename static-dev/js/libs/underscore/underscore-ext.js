/**
 * Underscore extensions module
 * 
 * Adds custom extensions to Underscore.js
 *
 * Dependencies:
 *
 * - jQuery
 * - Underscore.js
 *
 */

(function(){
_.mixin({
    /**
     * `age`
     *
     * Returns the age in years for a time interval, defined by a pair of `Date` objects. 
     *
     * If a final date is not provided, age will use `new Date()` to calculate today's date.
     *
     * @param {Date} from The initial date.
     * @param {Date} to The final date. Default <code>new Date()</code>.
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
     * `assert`
     * 
     * Asserts a value or array of values using an asertion function. The assertion function must return `true` if the assertion is succeeds or `false` otherwise.
     *
     * @param {Object} value The value to assert.
     * @param {Function} fn The function used to perform the assertion.
     * @param {String} message A message to display on the error thrown when the assertion fails. Default <code>""</code>.
     */
    assert: function(value, fn, message) {
        var prefix = 'Assertion failed';
        if (!fn.call(this, value)) {
            throw new Error(message ? prefix + ': ' + message : prefix);
        }
    }
});
})();
