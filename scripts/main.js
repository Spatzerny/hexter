function randomHexColor() {
	return '#' + Math.floor(Math.random()*16777215).toString(16);
}

function isHex(h) {
	var a = parseInt(h,16);
	return (a.toString(16) === h.toLowerCase())
}

function returnDifferences(hex1, hex2) {
	var diffs = [];
	var a = hex1.match(/[^#].{0,1}/g);
	var b = hex2.match(/[^#].{0,1}/g);
	
	for (var i = 0; i<3; i++) {
		diffs.push(parseInt(a[i],16)-parseInt(b[i],16));
	}
	return diffs;
}

$('document').ready(function() {
	var currentColor = randomHexColor();
	var stats = {};
	
	$('body').css('background-color', currentColor);
	
	$('#answer').keypress(function(e) {
    if(e.which == 13) {
			
			var newNote = 
				'<li>' +
				  '<div class="color-box" style="background-color:  ' + currentColor + '">'+ currentColor + '</div>' +
				  '<div class="color-box" style="background-color: #' + $('#answer').val() +'">#' + $('#answer').val() + '</div>' +
				  '<div>' + returnDifferences(currentColor, $('#answer').val()) + '</div>' +
		  ' </li>'
			$('#results').prepend(newNote);
			
			currentColor = randomHexColor();
			$('body').css('background-color', currentColor);
    };
	});
});