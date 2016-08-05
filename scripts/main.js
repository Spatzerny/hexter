/* random number from a range */
function randomRange(min, max) {
	return Math.floor(Math.random() * (max - min + 1) + min);
}

/* returns a random object with hex, rgb and hsl color formats (String) as well as array of Array of rgb(Number) */
/* if provided with r g b arguments - uses those instead of randomising */
function getColorObject(r,g,b) {
	var r = r || randomRange(0, 255);
	var g = g || randomRange(0, 255);
	var b = b || randomRange(0, 255);
	
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

/* just leftpad :P */
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

/* validates and parses a string for an array of values */
function validateColor(s,f) {
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
function rgbToHsl(r, g, b) {
		r /= 255, g /= 255, b /= 255;
		var max = Math.max(r, g, b), min = Math.min(r, g, b);
		var h, s, l = (max + min) / 2;

		if(max == min){
				h = s = 0; // achromatic
		} else {
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

function hslToRgb(h, s, l){
        var r, g, b;

        if(s == 0){
            r = g = b = l; // achromatic
        }else{
            function hue2rgb(p, q, t){
                if(t < 0) t += 1;
                if(t > 1) t -= 1;
                if(t < 1/6) return p + (q - p) * 6 * t;
                if(t < 1/2) return q;
                if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
                return p;
            }

            var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            var p = 2 * l - q;
            r = hue2rgb(p, q, h + 1/3);
            g = hue2rgb(p, q, h);
            b = hue2rgb(p, q, h - 1/3);
        }

        return [r * 255, g * 255, b * 255];
    }

$('document').ready(function() {

	var formats = ['hex', 'rgb', 'hsl'];
	var query = true;
	var cIndex = 0;
	var cFormat = formats[cIndex];
	var cTrue = getColorObject();
	var cPick;

	/* calculates wheter the font should be light or dark to be visible */
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

	/* args: color_true, color_picked, color_format */
	function submit(c1, c2, f) {
		console.log(c1,c2,f);
		
		$('#submit').animate({
			/* animate the fadeout of the submit button */
			top: '60px',
			opacity: 0
		}, 250, function() {
			if (query) {
				/* if 'submit' */

/* NEED TO MAKE A CONVERSION of c2 to c1 format HERE */
/* and only then compare */

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


				$('#c_true').text(cTrue[f].toString())
				$('#c_guess').text(cTrue[f].toString())
				$('#c_guess').text(cTrue[f].toString())
				$('#c_result').fadeIn('fast');


			} else {
				/* if 'next' */
				cTrue = getColorObject();
				$('body').css('background-color', cTrue.hex);
				cContrast(cTrue.num[0], cTrue.num[1], cTrue.num[2]);
				$('#input').val('');
				query = true;
				$('#submit').text('done');


				$('#c_result').fadeOut();


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
			if (validateColor($('#input').val(), formats[cIndex])) {
				/* input correct */
				cPick = validateColor($('#input').val(), formats[cIndex])[0];
				submit(cTrue, cPick, cFormat);
			} else {
				/* input incorrect */
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
	
	//keyboard events
	$('body').keydown(function(e) {
		if (e.which == 13) {
			preSubmit()
		}
		else if (e.which == 38 || e.which == 40) {
			changeFormat();
		}
	});
	
	//submit answer
	$('#submit').on('click', preSubmit)
	
	//color format change
	$('#format').on('click', changeFormat);
	
	//init
	$('body').css('background-color', cTrue.hex);
	cContrast(cTrue.num[0], cTrue.num[1], cTrue.num[2]);
});