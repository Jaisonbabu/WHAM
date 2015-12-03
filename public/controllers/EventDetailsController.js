app.controller('EventDetailsController', function($scope, $rootScope,$location, DbService, EventsService, $routeParams, $cookieStore, $window){
	$scope.username = $cookieStore.get('username');
	$scope.userLoc = $cookieStore.get('userLoc');
	console.log($scope.userLoc);
	$scope.showDialog = false;
	var searchEventsResponseHandler = function(response) {
		$scope.event = getEvent(response.data);
		var mapOptions = {
				zoom: 12,
				center: new google.maps.LatLng($scope.event.venue.location.latitude, $scope.event.venue.location.longitude),
				mapTypeId: google.maps.MapTypeId.ROADMAP
		};

		$scope.map = new google.maps.Map(document.getElementById('eventMap'), mapOptions);
		var image = new google.maps.MarkerImage(
				'http://plebeosaur.us/etc/map/bluedot_retina.png',
				null, // size
				null, // origin
				new google.maps.Point( 8, 8 ), // anchor (move to center of marker)
				new google.maps.Size( 17, 17 ) // scaled size (required for Retina display icon)
		);

		userMarker = new MarkerWithLabel({
			flat: true,
			icon: image,
			map: $scope.map,
			optimized: true,
			position: $scope.userLoc,
			title: 'You are here',
			visible: true,
		});

		userMarker.setAnimation(google.maps.Animation.BOUNCE);
		var marker = new Marker($scope.event, $scope.map).marker;
	}
	
	var updateProfileResponseHandler = function(resp) {
		//TODO: handle both positive and negative cases and show msgs
		$cookieStore.put('userDetails', resp.data);
		console.log(resp.data);
	};

	EventsService.fetchEventById($routeParams.eventId, searchEventsResponseHandler);
	$scope.openDialog = function(){

		if ($cookieStore.get('username') == null || $cookieStore.get('username') == undefined){
			$("#dialogContent").html('You need to login to like or dislike events. Please click login if you would like to login. Cancel otherwise.');
			$("#dialog").dialog({
				dialogClass: "no-close",
				title:'oops! something went wrong',
				width:400,
				buttons: [
				          {

				        	  text : "Login",
				        	  click: function(){
				        		  $(this).dialog('close');
				        		  $window.location.href = '/#/login';
				        	  }

				          },
				          {
				        	  text : "Cancel",
				        	  click: function(){
				        		  $(this).dialog('close')
				        	  }
				          }
				          ]
			});
		}
		else {
			var category = Number($scope.event.categoryId);
			console.log(category);
			
			var userCategory = [];
			$scope.user = $cookieStore.get('userDetails');
			userCategory = $scope.user.liked_categories;
			
			console.log(userCategory);
			console.log(userCategory.indexOf(category));
			console.log($.inArray(category, userCategory));
			
			var idx = userCategory.indexOf(category);
			if (idx < 0){
				$scope.user.liked_categories.push(category);
			}
			console.log($scope.user.liked_categories);
			
			DbService.updateUserDetails($scope.user, updateProfileResponseHandler);
		}
	}	
})