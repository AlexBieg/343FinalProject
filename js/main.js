Parse.initialize("Wbo1H7gcYHPiHoWdEiPmDEC2SBXyzIac4VCPSFCL", "yiDwktPQEWp8Ea7K3YfxqvbaI5AKXicUmYn9N1Wf");

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
		templateUrl: 'fragments/buy.html',
		//controller: 'buyController'
	})
	.state('contact', {
		url: '/contact',
		templateUrl: 'fragments/contact.html',
		//controller: 'contactController'
	})
	.state('cart', {
		url: '/cart',
		templateUrl: 'fragments/cart.html',
		//controller: 'cartController'
	});
});