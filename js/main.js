Parse.initialize("Wbo1H7gcYHPiHoWdEiPmDEC2SBXyzIac4VCPSFCL", "yiDwktPQEWp8Ea7K3YfxqvbaI5AKXicUmYn9N1Wf");

var Products = Parse.Object.extend('Products');
var Charities = Parse.Object.extend('Charities');


var myApp = angular.module('myApp', ['ui.router']);

myApp.config(function($stateProvider) {
    $stateProvider
	.state('home', {
		url:'/',
		templateUrl: 'fragments/home.html',
		controller: 'homeController',
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
	.state('charity', {
		url: '/charity',
		templateUrl: 'fragments/charity.html',
		//controller: 'charityController'
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

$(document).ready(function() {
	$('#myTabs a').click(function (e) {
		e.preventDefault()
		$(this).tab('show')
	});
	$('.dropdown-toggle').dropdown();
});

//buy page
myApp.controller('homeController', function($scope, $http) {
	var query = new Parse.Query(Products);
	query.find({
		success: function (results) {
			console.log(results);
			$scope.products = results;		}
	})
});

myApp.controller('sellController', function($scope, $http) {
	$scope.addItem = function() {
		var product = new Products();
		product.set('name', $scope.name);
		product.set('price', $scope.price);
		product.set('region', $scope.region);
		product.set('charity', $scope.charity);
		product.set('image', $scope.image);
		$scope.name = '';
		$scope.price = '';
		$scope.region = '';
		$scope.charity = '';
		$scope.image = '';
		product.save(null, {
			success: function() {
				$scope.name = '';
			},
			error: function(product, error) {
				console.log(error);
			}
		})
	}
});

myApp.controller('homeController', function($scope) {
	
});
