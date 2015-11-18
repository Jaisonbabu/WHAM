/**
 * New node file
 */
var res = function() {
	//$.get("/Users/vjvsha/Documents/CourseWork/Fall15/MSD/Project/MSD_Agilers_new/Jasmine/response/response.json", function(response) {
	$.get("/Users/vjvsha/Documents/CourseWork/Fall15/MSD/Project/MSD_Agilers_new/Jasmine/response/response.json", function(response) {
	console.log('hello');
	var resp = jQuery.parseJSON(response);
	console.log(response.events);
	});
}

res();