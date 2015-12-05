describe("Unit tests for Mapper methods", function () {

	describe('Unit tests for Location mappers', function () {
		
		it("Address from API is mapped to location object", function () {
			var resp = window.getJSONFixture('../../../../responses/event_by_id_response.json');
			var address = resp.venue.address;
			var location = getLocation(address);
			expect(location.addressLine1).toEqual(address.address_1);
			expect(location.addressLine2).toEqual('');
			expect(location.city).toEqual(address.city);
			expect(location.state).toEqual(address.region);
			expect(location.country).toEqual(address.country);
			expect(location.postal).toEqual(address.postal_code);
			expect(location.addressLine1).toEqual(address.address_1);
		});
		
		it("Mapper method handles invalid input", function(){
			var location = getLocation(null);
			expect(location).toEqual(new Location());
			
			var location = getLocation(undefined);
			expect(location).toEqual(new Location());
			
			var address = {
					address_1: "360 Huntington Ave",
					address_2: null,
					cities: "Boston",
					postal_code: 02115
			};
			var location = getLocation(address);
			expect(location.addressLine1).toEqual(address.address_1);
			expect(location.addressLine2).toEqual("");
			expect(location.city).toEqual("");
			expect(location.state).toEqual("");
			expect(location.country).toEqual("");
			expect(location.postal).toEqual(02115);
		});
    });
	
	describe('Unit tests for Event mappers', function () {
		
		it("Events from API are mapped to event objects", function () {
			var resp = window.getJSONFixture('../../../../responses/search_events_response.json');
			var events = getEvents(resp.events);
			expect(events.length).toEqual(50);
			expect(events[0].name).toEqual("Extreme Beer Fest (2016)");
			expect(events[0].id).toEqual("17643961564");
			expect(events[0].imageUrl).toEqual("https://img.evbuc.com/http%3A%2F%2Fcdn.evbuc.com%2Fimages%2F14168736%2F17177330475%2F1%2Foriginal.jpg?h=200&w=450&s=66c76f3a794d7c310fb468b484690a33");
			expect(events[0].description).toEqual("Extreme Beer Fest is the ultimate throwdown of craft beer creativity. Join us as we celebrate brewers who push the boundaries of brewing and raise a fist at the norm. Minds will be blown. Palates will be inspired. Prepare for epicness. \nHosted by BeerAdvocate. Sponsored by Dogfish Head Craft Brewery. Don't accept (l)imitations. \nFebruary 5 & 6, 2016 #Boston \nBy purchasing fest tickets, or attending the fest, all attendees agree to any and all rules, restrictions, and forfeit any claims of liability as outlined here and on any and all fest related materials. Please read all fest info before purchasing tickets. \nFor more fest info: http://www.beeradvocate.com/ebf/ ");
			expect(events[0].startTime).toEqual("2016-02-05T23:00:00Z");
			expect(events[0].endTime).toEqual("2016-02-07T02:30:00Z");
			expect(events[0].eventUrl).toEqual("http://www.eventbrite.com/e/extreme-beer-fest-2016-tickets-17643961564?aff=ebapi");
			expect(events[0].liked).toEqual(false);
			expect(events[0].venue.venueId).toEqual("8257931");
			expect(events[0].venue.name).toEqual("Seaport World Trade Center");
			expect(events[0].venue.description).toEqual("");
			expect(events[0].venue.location.addressLine1).toEqual("200 Seaport Blvd");
			expect(events[0].venue.location.addressLine2).toEqual("");			
			expect(events[0].venue.location.city).toEqual("Boston");
			expect(events[0].venue.location.postal).toEqual("02210-2031");
			expect(events[0].venue.location.state).toEqual("MA");
			expect(events[0].venue.location.country).toEqual("US");
		});
		
		it("Mapper method handles invalid input", function(){
			var resp = [{
				id: "12234",
				name: {
					text: "Event 1"
				},				
			}];
			var events = getEvents(resp);
			
			expect(events.length).toEqual(1);
			expect(events[0].name).toEqual("Event 1");
			expect(events[0].id).toEqual("12234");
			expect(events[0].imageUrl).toEqual("");
			expect(events[0].description).toEqual("");
			expect(events[0].startTime).toEqual("");
			expect(events[0].endTime).toEqual("");
			expect(events[0].eventUrl).toEqual("");
			expect(events[0].liked).toEqual(false);
			expect(events[0].venue.venueId).toEqual("");
			expect(events[0].venue.name).toEqual("");
			expect(events[0].venue.description).toEqual("");
			expect(events[0].venue.location.addressLine1).toEqual("");
			expect(events[0].venue.location.addressLine2).toEqual("");			
			expect(events[0].venue.location.city).toEqual("");
			expect(events[0].venue.location.postal).toEqual("");
			expect(events[0].venue.location.state).toEqual("");
			expect(events[0].venue.location.country).toEqual("");
		});
    });

	describe('Unit tests for Marker mappers', function () {
		
		it("Event from API is mapped to marker objects", function () {
			var resp = window.getJSONFixture('../../../../responses/search_events_response.json');
			var events = getEvents(resp.events);
			expect(events.length).toEqual(50);	
			
			var marker = new Marker(events[0], null).marker;
			var event = events[0];
			var content = '<div class="infoWindowContent">' + "Seaport World Trade Center"
				+ "<br/>" + "200 Seaport Blvd" + "\n,"
				+ "Boston" + "\n,"
				+ "MA" + '<br/>'
				+ new Date("2016-02-05T23:00:00Z").format('M jS, Y - g:i A') + '</div>';
			var loc = new google.maps.LatLng(event.venue.location.latitude,
					event.venue.location.longitude);
			
			expect(marker.name).toEqual("Extreme Beer Fest (2016)");
			expect(marker.id).toEqual("17643961564");
			expect(marker.imageUrl).toEqual("https://img.evbuc.com/http%3A%2F%2Fcdn.evbuc.com%2Fimages%2F14168736%2F17177330475%2F1%2Foriginal.jpg?h=200&w=450&s=66c76f3a794d7c310fb468b484690a33");
			expect(marker.startTimestamp).toEqual("2016-02-05T23:00:00Z");
			expect(marker.endTimeStamp).toEqual("2016-02-07T02:30:00Z");
			expect(marker.eventUrl).toEqual("http://www.eventbrite.com/e/extreme-beer-fest-2016-tickets-17643961564?aff=ebapi");
			expect(marker.zoom).toEqual(12);
			expect(marker.venue_name).toEqual("Seaport World Trade Center");
			expect(marker.address).toEqual("200 Seaport Blvd");
			expect(marker.city).toEqual("Boston");
			expect(marker.fullPostalCode).toEqual("02210-2031");
			expect(marker.state).toEqual("MA");
			expect(marker.content).toEqual(content);
			expect(marker.position.lat()).toEqual(loc.lat());
			expect(marker.position.lng()).toEqual(loc.lng());
			expect(marker.map).toEqual(null);
		});
		
		it("Mapper method handles invalid input", function(){
			var resp = [{
				id: "12234",
				name: {
					text: "Event 1"
				},				
			}];
			var events = getEvents(resp);
			
			expect(events.length).toEqual(1);
			
			var marker = new Marker(events[0], null).marker;
			var content = '<div class="infoWindowContent">' + ""
				+ "<br/>" + "" + "\n,"
				+ "" + "\n,"
				+ "" + '<br/>'
				+ new Date("").format('M jS, Y - g:i A') + '</div>';
			var loc = new google.maps.LatLng(1,1);
			
			expect(marker.name).toEqual("Event 1");
			expect(marker.id).toEqual("12234");
			expect(marker.imageUrl).toEqual("");
			expect(marker.startTimestamp).toEqual("");
			expect(marker.endTimeStamp).toEqual("");
			expect(marker.eventUrl).toEqual("");
			expect(marker.zoom).toEqual(12);
			expect(marker.venue_name).toEqual("");
			expect(marker.address).toEqual("");
			expect(marker.city).toEqual("");
			expect(marker.fullPostalCode).toEqual("");
			expect(marker.state).toEqual("");
			expect(marker.content).toEqual(content);
			expect(marker.position.lat()).toEqual(loc.lat());
			expect(marker.position.lng()).toEqual(loc.lng());
			expect(marker.map).toEqual(null);
		});
    });
	
	
});
