//Parse stuff
Parse.initialize("Wbo1H7gcYHPiHoWdEiPmDEC2SBXyzIac4VCPSFCL", "yiDwktPQEWp8Ea7K3YfxqvbaI5AKXicUmYn9N1Wf");

var Products = Parse.Object.extend('Products');	

//angular stuff
var myApp = angular.module('myApp', ['ui.router', 'firebase']);



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
			}
			console.log($scope.products);
		}
	})
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
	

});


myApp.controller('charityController', function($scope, $firebaseArray){
  var ref = new Firebase("https://charitylist.firebaseio.com/");
  var projRef = ref.child("projects");
  $scope.projects = $firebaseArray(projRef);
})


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
		logOut.click(function() {
			logOutUser();
		})

		var hello = $("<span>");
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