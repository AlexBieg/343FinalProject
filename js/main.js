var myApp = angular.module('myApp', ['ui.router']);

myApp.config(function($stateProvider) {
    $stateProvider
	.state('home', {
		url:'/',
		templateUrl: 'fragments/home.html',
		//controller: 'HomeController',
	})
	.state('sell', {
		url:'/sell',
		templateUrl: 'fragments/sell.html',
		//controller: 'sellController',
	})
	.state('about', {
		url: '/about',
		templateUrl: 'fragments/about.html',
		//controller: 'aboutController'
	})
	.state('buy', {
		url: '/buy',
		templateUrl: 'fragments/about.html',
		//controller: 'buyController'
	})
	.state('contact', {
		url: '/about',
		templateUrl: 'fragments/contact/html',
		//controller: 'contactController'
	});
});