function init() {
			var color = tinycolor.random()
			$('body').css('background-color', color.toHexString())
}

$(document).ready(function() {
	init();

	$('#color_input').on('keypress', function(e) {

		if(e.which == 13) {
			var input = $(this).val();

			var c_actual = tinycolor.random()
			var c_guess = tinycolor(input);

			$(this).val('');

			$('body').css('background-color', c_guess.toHexString())

		};

	});

});