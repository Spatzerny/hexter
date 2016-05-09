function randomRange(min, max) {
	return Math.floor(Math.random() * (max - min + 1) + min);
}

function randomColor() {
	var r = randomRange(0, 255);
	var g = randomRange(0, 255);
	var b = randomRange(0, 255);
	
	return {
		num: [r,g,b],
		hex: '#' 
			+ leftpad(r.toString(16), 2, '0')
			+ leftpad(g.toString(16), 2, '0')
			+ leftpad(b.toString(16), 2, '0'),
		rgb: 'rgb(' + r + ', ' + g + ', ' + b + ')',
		hsl: 'hsl(' + rgbToHsl(r, g, b).join(', ') + ')'
	}
}

function leftpad (str, len, ch) {
  str = String(str);
  var i = -1;
  if (!ch && ch !== 0) ch = ' ';
  len = len - str.length;
  while (++i < len) {
    str = ch + str;
  }
  return str;
}

function validColor(s,f) {
	s = s.toString();
	if (f == 'hex') {
		if (s.length <= 4) {
			return s.match(/^#?([a-f0-9])([a-f0-9])([a-f0-9])$/i);
		} else {
			return s.match(/^#?([a-f0-9]{2})([a-f0-9]{2})([a-f0-9]{2})$/i);
		}
	} else if (f == 'rgb') {
		return s.match(/^(?:rgb\()?([0-9]{1,3})(?:,|\s){1,3}([0-9]{1,3})(?:,|\s){1,3}([0-9]{1,3})\)?$/i);
	} else if (f == 'hsl') {
		return s.match(/^(?:hsl\()?([0-9]{1,3})(?:,|\s){1,3}([0-9]{1,3})%?(?:,|\s){1,3}([0-9]{1,3})%?\)?$/i);
	} else {
		return false;
	}
}


// https://github.com/mjackson/mjijackson.github.com/blob/master/2008/02/rgb-to-hsl-and-rgb-to-hsv-color-model-conversion-algorithms-in-javascript.txt
function rgbToHsl(r, g, b){
		r /= 255, g /= 255, b /= 255;
		var max = Math.max(r, g, b), min = Math.min(r, g, b);
		var h, s, l = (max + min) / 2;

		if(max == min){
				h = s = 0; // achromatic
		}else{
				var d = max - min;
				s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
				switch(max){
						case r: h = (g - b) / d + (g < b ? 6 : 0); break;
						case g: h = (b - r) / d + 2; break;
						case b: h = (r - g) / d + 4; break;
				}
				h /= 6;
		}
		
		return [Math.round(h*360), Math.round(s*100), Math.round(l*100)];
}


$('document').ready(function() {

	var formats = ['hex', 'rgb', 'hsl'];
	var query = true;
	var cIndex = 0;
	var cFormat = formats[cIndex];
	var cTrue = randomColor();
	var cPick;

	function cContrast(r, g, b) {
		var brightness;
		brightness = r * 299 + g * 587 + b * 114;
		brightness = brightness / 255000;
		if (brightness >= 0.5) {
			$('.color-adjust').addClass('dark');
			$('.color-adjust').removeClass('light');
		} else {
			$('.color-adjust').addClass('light');
			$('.color-adjust').removeClass('dark');	
		}
	}

	function submit(c1, c2, f) {
		
		$('#submit').animate({
			top: '60px',
			opacity: 0
		}, 250, function() {
			if (query) {
				
				for (var i=1; i < c1.length; i++) {
					if (f = 'hex') {
						c2[i] = c2[i].toLowerCase();

						if (c1[i].length == 1) {
							c1[i] = leftpad(c1[i], 2, c1[i]);
						}
						if (c2[i].length == 1) {
							c2[i] = leftpad(c2[i], 2, c2[i]);
						}
					}
					console.log(c1[i], c2[i], c1[i] == c2[i], 'beep');
				}
				
				query = false;
				$('#submit').text('next');
				$('#temp').text(cTrue[f].toString()).fadeIn('fast');
			} else {
				cTrue = randomColor();
				$('body').css('background-color', cTrue.hex);
				cContrast(cTrue.num[0], cTrue.num[1], cTrue.num[2]);
				$('#input').val('');
				query = true;
				$('#submit').text('done');
				$('#temp').fadeOut();
			}
			$('#submit').css('top', '-60px');
			$('#submit').animate( {
				top: '0',
				opacity: 1
			}, 250, function() {
				$('#input').css('width', (($('#input').val().length+1) * 26+6).toString() + 'px');
			});
		});
	}

	function changeFormat(e) {
		$('#format').animate({
			top: '60px',
			opacity: 0
		}, 250, function() {
			if (cIndex == formats.length-1) {
				cIndex = 0;
			} else {
				cIndex++;
			}
			cFormat = formats[cIndex];
			$('#format').text(formats[cIndex]);
			$('#format').css('top', '-60px');
			$('#format').animate( {
				top: '0',
				opacity: 1
			}, 250);
		});
	}
	
	function preSubmit(e) {
		if ($('#input').val().length != 0) {
			if (validColor($('#input').val(), formats[cIndex])) {
				cPick = validColor($('#input').val(), formats[cIndex])[0];
				submit(cTrue, cPick, cFormat);
			} else {
				$('#input')
					.css('text-decoration', 'line-through')
					.animate({
					opacity: 0
				}, 500, function() {
					$('#input')
						.val('')
						.css({
						width: '32px',
						'text-decoration': 'none'
					});
					$('#input').animate({
						opacity: 1
					}, 500)
				});
			}
    }
	};
	
	//because <input> hates css
	$('#input').on('keyup', function(e) {
		var s = $(this).val().length;
		$(this).css('width', (s+1)*26+6);
	});
	
	//on enter key
	$('body').keydown(function(e) {
		if (e.which == 13) {preSubmit()};
	});
	
	//submit answer
	$('#submit').on('click', preSubmit)
	
	//color format change
	$('#format').on('click', changeFormat);
	
	//init
	$('body').css('background-color', cTrue.hex);
	cContrast(cTrue.num[0], cTrue.num[1], cTrue.num[2]);
});