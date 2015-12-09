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
	});

	$scope.showIfLogged = function() {
		return isLogged();
	}

	$scope.addToCart = function(id) {
		addToCart(id);
		showSuccess(id);
	}

	$scope.sortType = 'name'
});

//cart controller
myApp.controller('cartController', function($scope) {
	if (Parse.User.current() != null) {
		var items = [];
		Parse.User.current().fetch({
			success: function(user) {
				var items = user.get('cart');
				console.log(items);
				$scope.products = [];
				for(var i = 0; i < items.length; i++) {
					var id = items[i];
					var query = new Parse.Query(Products);
					query.get(id, {
						success: function(object) {
							var item = {
								name: object.get('name'),
								price: object.get('price'),
								region: object.get('region'),
								charity: object.get('charity'),
								image: object.get('image'),
								user: object.get('user'),
								id: object.id,
								description: object.get('description')
							}
							$scope.products.push(item);
							$scope.$apply();
						},

						error: function(object, error) {
							console.log(error);
						}
					});
				}
			},
			error: function(user, error) {
				console.log(error);
			}
		});
	}

	$scope.removeFromCart = function(id) {
		removeFromCart(id);
	}
});

//sell controller
myApp.controller('sellController', function($scope, $http) {
	$.getJSON("charity-list.json", function(results) {
		$scope.charities = results.charities;
		$scope.$apply();
	});

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

//remove one of the given item id from the current users cart.
var removeFromCart = function(id) {
	var cart = Parse.User.current().get('cart');
	var newCart = [];
	var notFound = true;
	for (var i = 0; i < cart.length && notFound; i++) {
		if (cart[i] == id) {
			newCart = $.grep(cart, function(n, index) {
				return (index != i);
			});
			notFound = false;
		}
	}
	Parse.User.current().set('cart', newCart);
	Parse.User.current().save();
	location.reload(true);
}

var showSuccess = function(id) {
	$("#" + id).find('#success').removeClass('hide');
}

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