app.config(function ($routeProvider) {

	$routeProvider
	
	.when('/', {
		templateUrl:'pages/works.html',
		controller:'mainController'
	})
	
	.when('/websites', {
		templateUrl:'pages/websites.html',
		controller:'mainController'
	})
	
	.when('/contact-me', {
		templateUrl:'pages/contact-me.html',
		controller:'mainController'
	})

});