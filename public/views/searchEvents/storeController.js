app.controller('StoreController', function($anchorScroll, $scope,$http, $timeout, ProductService){
	  
	
	$scope.searchStores = function(){
		ProductService.storeLocator($scope.zipcode, function(response){
			$scope.stores = response.stores;
			// Map code starts here	
			var stores = [];
			var lat, long;
			for(var i in $scope.stores){
				var store = {
						city : $scope.stores[i].city,
						desc : $scope.stores[i].longName,
						lat :  $scope.stores[i].lat,
						long : $scope.stores[i].lng,
						address : $scope.stores[i].address,
						fullPostalCode : $scope.stores[i].fullPostalCode,
						hours : $scope.stores[i].hours,
						storeType : $scope.stores[i].storeType 
				}
				lat = $scope.stores[i].lat;
				long = $scope.stores[i].lng;
				stores.push(store);
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
			            title: info.city,
			            address : info.address,
			            city : info.city,
						fullPostalCode : info.fullPostalCode,
						hours : info.hours,
						storeType : info.storeType
			        });
			        marker.content = '<div class="infoWindowContent">' + info.address + "\n"+ info.city+"\n"+ info.fullPostalCode + '</div>';
			        
			        google.maps.event.addListener(marker, 'click', function(){
			            infoWindow.setContent('<h3>' + marker.storeType + '</h3>' + marker.content);
			            infoWindow.open($scope.map, marker);
			        });
			        
			        $scope.markers.push(marker);
			        
			    }  
			    
			    for (i = 0; i < stores.length; i++){
			        createMarker(stores[i]);
			    }

			    $scope.openInfoWindow = function(e, selectedMarker){
			        e.preventDefault();
			        google.maps.event.trigger(selectedMarker, 'click');
			    }
		})
	}
	
})
