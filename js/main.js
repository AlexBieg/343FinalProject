//Parse stuff
Parse.initialize("Wbo1H7gcYHPiHoWdEiPmDEC2SBXyzIac4VCPSFCL", "yiDwktPQEWp8Ea7K3YfxqvbaI5AKXicUmYn9N1Wf");

var Products = Parse.Object.extend('Products');	

//angular stuff
var myApp = angular.module('myApp', ['ui.router']);



//ui config
myApp.config(function($stateProvider, $urlRouterProvider) {
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
		controller: 'charityController'
	})
	.state('cart', {
		url: '/cart',
		templateUrl: 'fragments/cart.html',
		controller: 'cartController'
	});

	$urlRouterProvider.when('', '/');
});

//home page
myApp.controller('homeController', function($scope, $http) {
	$scope.selectedTab = 1;
	$scope.products = [];
	var query = new Parse.Query(Products);
	query.find({
		success: function (results) {
			console.log(results);
			for (var i = 0; i < results.length; i++) {
				var object = results[i]
				var product = {
					name: object.get('name'),
					price: object.get('price'),
					region: object.get('region'),
					charity: object.get('charity'),
					image: object.get('image'),
					user: object.get('user'),
					id: object.id
				}
				$scope.products.push(product);
				$scope.$apply();
			}
		}
	})

	$scope.showIfLogged = function() {
		return isLogged();
	}

	$scope.addToCart = function(id) {
		addToCart(id);
	}
});

//cart controller
myApp.controller('cartController', function($scope) {
	if (Parse.User.current() != null) {
		var items = Parse.User.current().get('cart');
		console.log(items);
		$scope.products = [];
		for(var i = 0; i < items.length; i++) {
			var object = products[i];
			var item = {
				name: object.get('name'),
				price: object.get('price'),
				region: object.get('region'),
				charity: object.get('charity'),
				image: object.get('image'),
				user: object.get('user'),
				id: object.id
			}
			$scope.products.push(item);
		}
	}
});

//sell controller
myApp.controller('sellController', function($scope, $http) {
	console.log('checking user')
	if (Parse.User.current() != null) {
		$('.login-message').hide();
		$('.logged-in').removeClass('hide');
	}

	//adds item to parse database
	$scope.addItem = function() {
		var product = new Products();
		product.set('name', $scope.name);
		product.set('price', $scope.price);
		product.set('region', $scope.region);
		product.set('charity', $scope.charity);
		product.set('image', $scope.image);
		product.set('description', $scope.description);
		product.set('user', Parse.User.current().getUsername());
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
	$('#activateForm').click(function() {
		$(this).hide();
		$('#sellForm').removeClass('hide');
	}); 
});


myApp.controller('charityController', function($scope){
	$.getJSON("charity-list.json", function(results) {
		$scope.charities = results.charities;
		console.log($scope.charities);
		$scope.$apply();
	});
});

var addToCart = function(id) {
	var cart = Parse.User.current().get('cart');
	cart.push(id);
	Parse.User.current().set('cart', cart);
	Parse.User.current().save();
}

//retrun boolean indicating if user is logged in
var isLogged = function() {
	return Parse.User.current() != null;
}


//logout current user
var logOutUser = function() {
	Parse.User.logOut().then(function() {
		location.reload();
	});
}

//chek if a user is logged in and show correct info
var checkLogged = function() {
	if(Parse.User.current() != null) {
		$('#loginButton').hide();

		var logOut = $("<button>Log Out</button>");
		logOut.addClass("btn");
		logOut.addClass("btn-primary");
		logOut.addClass("logOutButton");
		logOut.click(function() {
			logOutUser();
		})

		var hello = $("<span>");
		hello.addClass("welcome");
		hello.html('Welcome back ' + Parse.User.current().getUsername() + "!")

		var li = $("<li>");
		li.html(hello);
		li.append(logOut);

		$('#loginList').append(li)
	}
}

//when document is finshed loading do this
$(function() {
	$('#myTabs a').click(function (e) {
		e.preventDefault()
		$(this).tab('show')
	});
	$('.dropdown-toggle').dropdown();

	checkLogged();

	$('#sign-up-button').click(function() {
		var form = $(this).parent();
		var user = new Parse.User();
		user.set("username", form.find('#user').val());
		user.set("password", form.find('#pass').val());
		user.set("cart", []);
		user.signUp(null, {
			success: function(user) {
				console.log('signed up');
				location.reload();
			},
			error: function(user, error) {
				console.log(error);
				$('#user-error').html(error.message);
			}
		})
	});

	$('#login-button').click(function() {
		var form = $(this).parent();
		Parse.User.logIn(form.find('#user').val(), form.find('#pass').val()).then(
			function(user) {
				console.log('signed user in');
				location.reload();
			},

			function(error) {
				console.log(error);
				$('#user-error').html(error.message);
			}
		);
	})
});