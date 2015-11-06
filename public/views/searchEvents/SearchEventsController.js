app.controller('SearchEventsController', function($anchorScroll, $scope,$http, $timeout, EventsService){
	
	$scope.searchEvents = function(){
		EventsService.fetchEventsByLocation('11.23', function(response){
			$scope.events = response.events;
			console.log(response.events);
			// Map code starts here	
			var events = [];
			var lat, long;
			
			/*dummy values for now*/
			var initialLat = 42.12;
			var initialLon = -71.05;
			var address = '360 Huntington avenue';
			var postalCode = '21058';
			/*dummy values for now*/
			
			for(var i in $scope.events){
				var event = {
						name : $scope.events[i].name.text, 
						city : 'Boston',   // this has to be replaced by the data from venue
						lat :  initialLat+((Math.random() * 10) + 1)*0.1,  // this has to be replaced by the data from venue
						long : initialLon-((Math.random() * 10) + 1)*0.1,  // this has to be replaced by the data from venue
						address : address, // this has to be replaced by the data from venue
						city : 'Boston', // this has to be replaced by the data from venue
						fullPostalCode : postalCode+i // this has to be replaced by the data from venue
				}
				lat = initialLat+((Math.random() * 10) + 1)*0.1;
				long = initialLon-((Math.random() * 10) + 1)*0.1;
				events.push(event);
			}
			
			var mapOptions = {
			        zoom: 10,
			        center: new google.maps.LatLng(lat, long),
			        mapTypeId: google.maps.MapTypeId.ROADMAP
			    }

			    $scope.map = new google.maps.Map(document.getElementById('map'), mapOptions);

			    $scope.markers = [];
			    
			    var infoWindow = new google.maps.InfoWindow();
			    
			    var createMarker = function (info){
			        
			        var marker = new google.maps.Marker({
			            map: $scope.map,
			            position: new google.maps.LatLng(info.lat, info.long),
			            zoom : 12,
			            name : info.name,
			            address : info.address,
			            city : info.city,
						fullPostalCode : info.fullPostalCode,
			        });
			        marker.content = '<div class="infoWindowContent">' + info.address + "\n"+ info.city+"\n"+ info.fullPostalCode + '</div>';
			        
			        google.maps.event.addListener(marker, 'click', function(){
			            infoWindow.setContent('<h3>' + marker.name + '</h3>'+ marker.content);
			            infoWindow.open($scope.map, marker);
			        });
			        
			        $scope.markers.push(marker);
			        
			    }  
			    
			    for (i = 0; i < events.length; i++){
			        createMarker(events[i]);
			    }

			    $scope.openInfoWindow = function(e, selectedMarker){
			        e.preventDefault();
			        google.maps.event.trigger(selectedMarker, 'click');
			    }
		})
	}
	
	$scope.searchEvents();
	
})
