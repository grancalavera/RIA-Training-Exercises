_.mixin({
	namespace: function(){
		var i, j, tokens, name, nsp;
		nsp = window; /* initial parent */
		for (i = 0; i < arguments.length; i += 1) {
			tokens = arguments[i].split('.');
			for (j = 0; j < tokens.length; j += 1) {
				name = tokens[j];
				nsp[name] = nsp[name] || {};
				nsp = nsp[name];
			}
		}
		return nsp;
	}
});