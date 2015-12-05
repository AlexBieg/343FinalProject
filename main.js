var myApp = angular.module('myApp', ['ui.router']);

myApp.config(function($stateProvider) {
    $stateProvider
	.state('home', {
		url:'/',
		templateUrl: 'templates/home.html',
		//controller: 'HomeController',
	})
	.state('sell', {
		url:'/sell',
		templateUrl: 'templates/sell.html',
		//controller: 'sellController',
	})
	.state('about', {
		url: '/about',
		templateUrl: 'templates/about.html',
		//controller: 'aboutController'
	})
	.state('buy', {
		url: '/buy',
		templateUrl: 'templates/about.html',
		//controller: 'buyController'
	})
	.state('contact' {
		url: '/about',
		templateUrl: 'templates/contact/html',
		//controller: 'contactController'
	});
});