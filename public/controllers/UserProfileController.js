//TODO: check user is logged in
app.controller('UserProfileController', function ($scope, $routeParams, $rootScope, DbService, $location) {

	$scope.showEdit = true;
	
	// user who is currently logged in
	$scope.username = $rootScope.currentUser;
	console.log( $rootScope);
	
	DbService.getUserDetails($scope.username, function(userObj, status){
		console.log("status "+status);
		console.log("obj "+userObj);
		console.log("username "+$scope.username);
		$scope.user = userObj;
		$scope.userId = userObj._id;
		
	$scope.updateLikedCategories = function (productId) {
		UserService.checkLoggedIn(function(user)
				{
// User is Authenticated
			if (user !== '0'){
				$scope.userId = $rootScope.user._id;
				var cart = {id:productId, count : 1};
				ProductService.fetchLogin(function(response){
					for(var i in response){
						if(response[i]._id == $scope.userId){
							$scope.user = response[i];

							var alreadyPresent = false;	
							for(var i in $scope.user.cart)	{
								(function(i){
									if($scope.user.cart[i].id == productId){
										alreadyPresent = true;
										$scope.user.cart[i].count +=1;
										$rootScope.cartCount += 1;
										ProductService.addToCart($scope.user);
										$location.url('/profile/'+"cart");
									}
								})(i);
							}
							if(!alreadyPresent){
								$scope.user.cart.push(cart);
								$rootScope.cartCount += 1;
								ProductService.addToCartFromFavorite($scope.user, function(response){
									console.log(response);
									$location.url('/profile/'+"cart");
								});
							}
						}
					}
				});
			}

// User is Not Authenticated
			else
			{
				$location.url('/login');
			}
				});
	};

	$scope.updatePassword = function(pswd){
		console.log(pswd);
		UserService.checkLoggedIn(function(user)
				{
// User is Authenticated
			if (user !== '0'){
				$scope.userId = $rootScope.user._id;
				UserService.getUserDetails($scope.username, function(response){
					response.password = pswd;
					console.log(response);
					UserService.updateUser(response, function(resp){
						UserService.logout(function(response)
								{
							$rootScope.currentuser = null;	
							$rootScope.userId = null;
							$rootScope.user = null;
							$location.path('/login');
								});
					});
				});
			}
				});
	};

	$scope.updateProfile = function(){
		UserService.checkLoggedIn(function(user)
				{
// User is Authenticated
			if (user !== '0'){
				$scope.userId = $rootScope.user._id;
				UserService.getUserDetails($scope.username, function(response){
					response.firstname = $scope.user.firstname;
					response.lastname = $scope.user.lastname;
					response.email = $scope.user.email;
					response.address = $scope.user.address;
					response.phone = $scope.user.phone;
					console.log(response);
					UserService.updateUser(response, function(resp){
						$scope.user = resp;
						$rootScope.user = resp;
					});
				});
			}
				});
	};
	
	});
});