(function(){
	app = _.namespace('ria.exercises.facebook');
	app.user = {};

	app.wakeFromResponse = function (response) {
		if (response.status === 'connected') {
			app.removeLoginButton();
			app.updateUserInfo(function(){
				app.showUserInfo();
			});
		} else {
			app.removeUserInfo();
			app.addLoginButton();
		}
	}

	app.removeLoginButton = function(){
		app.loginButton = $('#fb-login-button').detach();
	}

	app.addLoginButton = function(){
		if (app.loginButton) {
			app.loginButton.appendTo($('#content'));
			app.loginButton = null;
		}
	}

	app.updateUserInfo = function(callback){
		FB.api('/me', function (user) {
			user.age = app.getAge(user.birthday);
			app.user = user;
			callback();
		});
	}

	app.removeUserInfo = function () {
		$('#fb-user').remove();
	}

	app.getAge = function(dateString) {
	    var today = new Date();
	    var birthDate = new Date(dateString);
	    var age = today.getFullYear() - birthDate.getFullYear();
	    var m = today.getMonth() - birthDate.getMonth();
		    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
		        age--;
		    }
	    return age;
	}

	app.showUserInfo = function() {
		var t, ageClass;
		t = _.template($('#fb-user-template').html());
		$('#content').append(t({user:app.user}));
		if (app.user.age < 18){
			$('#fb-user').addClass('under-age');
		}
		$('#fb-logout').click(function(){
			FB.logout();
		})

	}
})();