function init() {
	var color = tinycolor.random()
	$('body').css('background-color', color.toHexString())
	return color;
}

$(document).ready(function() {

	var c_actual = init(),
			c_guess;

	$('#color_input').on('keypress', function(e) {

		if (e.which == 13) {

			var input = $(this).val();
			c_guess = tinycolor(input);

			$('.color_text').empty().append($('<ul>'
				+'<li>R:'+ (c_guess.toRgb().r - c_actual.toRgb().r) +'</li>'
				+'<li>G:'+ (c_guess.toRgb().g - c_actual.toRgb().g) +'</li>'
				+'<li>B:'+ (c_guess.toRgb().b - c_actual.toRgb().b) +'</li>'
				+'</ul><p>What\'s the color of the background?</p>'))

			$('.color_container').css({
				'transform': 'rotateX(270deg)'
			}, 150);

			setTimeout(function() {
				$('.color_container').css({
					'transform': 'rotateX(360deg)'
				});
			}, 500)

			c_actual = tinycolor.random()
			$(this).val('');
			$('body').css('background-color', c_actual.toHexString())

		};

	});

});