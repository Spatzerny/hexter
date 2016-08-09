/* TODO
all the 'next' animations and such
tutorial with a set of colors (red, green, blue, magenta, cyan, black white, pink and such)
*/

function randomRange(min, max) {
  /* random number from a range */
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function leftpad(str, len, ch) {
  /* just leftpad :P */
  str = String(str);
  var i = -1;
  if (!ch && ch !== 0) ch = ' ';
  len = len - str.length;
  while (++i < len) {
    str = ch + str;
  }
  return str;
}

function rgbToHsl(r, g, b) {
  // https://github.com/mjackson/mjijackson.github.com/blob/master/2008/02/rgb-to-hsl-and-rgb-to-hsv-color-model-conversion-algorithms-in-javascript.txt
  r /= 255, g /= 255, b /= 255;
  var max = Math.max(r, g, b),
    min = Math.min(r, g, b);
  var h, s, l = (max + min) / 2;

  if (max == min) {
    h = s = 0; // achromatic
  } else {
    var d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }

  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
}

function hslToRgb(h, s, l) {
  /* accepts values in range [0-1]*/
  var r, g, b;

  if (s == 0) {
    r = g = b = l; // achromatic
  } else {
    function hue2rgb(p, q, t) {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    }

    var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    var p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }

  return [r * 255, g * 255, b * 255];
}

function getColorObject(r, g, b) {
  /**
   *    accepts rgb values range [0-255] (Number)
   *    if any of the arguments is not provided generates a random value (0-255) for it 
   *    returns an Object with string and numerical formats of color formats
   **/
  if (typeof r == "undefined") {
    r = randomRange(0, 255)
  };
  if (typeof g == "undefined") {
    g = randomRange(0, 255)
  };
  if (typeof b == "undefined") {
    b = randomRange(0, 255)
  };

  return {

    n_rgb: [r, g, b],
    n_hsl: rgbToHsl(r, g, b),
    n_hex: [r, g, b], //for completeness sake i guess

    rgb: 'rgb(' + r + ', ' + g + ', ' + b + ')',
    hsl: 'hsl(' + rgbToHsl(r, g, b).join(', ') + ')',
    hex: '#' + leftpad(r.toString(16), 2, '0') + leftpad(g.toString(16), 2, '0') + leftpad(b.toString(16), 2, '0')

  }
}

function parseColorInput(s, f) {
  /**
  *    validates and parses a string, accepts a string and string name for format ['rgb','hex','hsl']
  *    returns an Object generated by getColorObject() or false
  **/
  var regexMatch, rgbVal;
  s = s.toString();

  if (f == 'hex') {
    if (s.length <= 4) {
      regexMatch = s.match(/^#?([a-f0-9])([a-f0-9])([a-f0-9])$/i);
      if (!regexMatch) {
        return false
      }

      rgbVal = [
        parseInt(leftpad(regexMatch[1], 2, regexMatch[1]), 16),
        parseInt(leftpad(regexMatch[2], 2, regexMatch[2]), 16),
        parseInt(leftpad(regexMatch[3], 2, regexMatch[3]), 16)
      ];

    } else {
      regexMatch = s.match(/^#?([a-f0-9]{2})([a-f0-9]{2})([a-f0-9]{2})$/i);
      if (!regexMatch) {
        return false
      }

      rgbVal = [
        parseInt(regexMatch[1], 16),
        parseInt(regexMatch[2], 16),
        parseInt(regexMatch[3], 16)
      ];
    }

  } else if (f == 'rgb') {
    regexMatch = s.match(/^(?:rgb\()?([0-9]{1,3})(?:,|\s){1,3}([0-9]{1,3})(?:,|\s){1,3}([0-9]{1,3})\)?$/i);
    if (!regexMatch) {
      return false
    }

    rgbVal = [
      parseInt(regexMatch[1]),
      parseInt(regexMatch[2]),
      parseInt(regexMatch[3])
    ];

  } else if (f == 'hsl') {
    regexMatch = s.match(/^(?:hsl\()?([0-9]{1,3})(?:,|\s){1,3}([0-9]{1,3})%?(?:,|\s){1,3}([0-9]{1,3})%?\)?$/i);
    if (!regexMatch) {
      return false
    }

    rgbVal = hslToRgb(parseInt(regexMatch[1]) / 360, parseInt(regexMatch[2]) / 100, parseInt(regexMatch[3]) / 100);

  } else {
    throw new Error('Failed to parse color');
  }

  return (getColorObject(Math.floor(rgbVal[0]), Math.floor(rgbVal[1]), Math.floor(rgbVal[2])));
}

function isColorBright(r, g, b) {
  /* calculates wheter the font should be light or dark to be visible */
  var brightness;
  brightness = r * 299 + g * 587 + b * 114;
  brightness = brightness / 255000;
  return (brightness >= 0.5)
}


$('document').ready(function() {

  var formats = ['hex', 'rgb', 'hsl'];
  var query = true;
  var cIndex = 0;
  var cFormat = formats[cIndex];
  var cTrue = getColorObject();
  var cPick;

  function animateSubmit() {

    /* animate the change of the submit button and input */
    $('#submit').animate({
      top: '60px',
      opacity: 0
    }, 250, function() {
      $('#submit')
        .text('next')
        .css('top', '-60px')
        .animate({
          top: '0',
          opacity: 1
        }, 250, function() {
          $('#input').keyup();
        });
    })
  }

  function updateView(colorTrue, colorPick, colorFormat) {
    var colorDiff = getColorObject(
      Math.abs(colorTrue['n_' + colorFormat][0] - colorPick['n_' + colorFormat][0]),
      Math.abs(colorTrue['n_' + colorFormat][1] - colorPick['n_' + colorFormat][1]),
      Math.abs(colorTrue['n_' + colorFormat][2] - colorPick['n_' + colorFormat][2])
    )

    function fillData(element, colorObject) {
      $(element)
        .css({
          'background-color': colorObject.hex,
          'color': isColorBright(colorObject.n_rgb[0], colorObject.n_rgb[1], colorObject.n_rgb[2]) ? '#333' : '#ccc'
        })
      $(element).find('.rgb').text(colorObject.rgb)
      $(element).find('.hsl').text(colorObject.hsl)
      $(element).find('.hex').text(colorObject.hex)
    }

    fillData('.c_pick', colorPick)
    fillData('.c_diff', colorDiff)
    fillData('.c_true', colorTrue)

    $('#input').val('');
  }

  function clearInput() {
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
          })
          .animate({
            opacity: 1
          }, 500)
      });
  }

  function changeInputFormat(e) {
    $('#format').animate({
      top: '60px',
      opacity: 0
    }, 250, function() {
      if (cIndex == formats.length - 1) {
        cIndex = 0;
      } else {
        cIndex++;
      }
      cFormat = formats[cIndex];
      $('#format').text(formats[cIndex]);
      $('#format').css('top', '-60px');
      $('#format').animate({
        top: '0',
        opacity: 1
      }, 250);
    });
  }

  function validateInput() {
    if ($('#input').val().length !== 0) {

      if (parseColorInput($('#input').val(), formats[cIndex])) {

        /* input correct - submit it */
        cPick = parseColorInput($('#input').val(), formats[cIndex]);
        animateSubmit();
        updateView(colorTrue, colorPick, colorFormat);
        query = false;

      } else {
        clearInput()
      }
    }
  }

  //because <input> hates css (updating width of input)
  $('#input').on('keyup', function(e) {

    var s = $(this).val().length;
    $(this).css('width', (s + 1) * 26 + 6);

  });

  //keyboard events
  $('body').keydown(function(e) {
    console.log(e.which);
    if (e.which == 13) {
      $('#submit').click();
    } else if (e.which == 38 || e.which == 40) {
      changeInputFormat();
    } else if (e.which >= 48 && e.which <= 90) {
      $('#input').focus();
    }
  });

  //submit answer
  $('#submit').on('click', function() {

    if (query) {
      validateInput();
    } else {
      cTrue = getColorObject();
      $('body').css('background-color', cTrue.hex);

      if (isColorBright(cTrue.n_rgb[0], cTrue.n_rgb[1], cTrue.n_rgb[2])) {
        $('.color-adjust').addClass('dark').removeClass('light');
      } else {
        $('.color-adjust').addClass('light').removeClass('dark');
      }
      $('#input').val('');
      $('#submit').text('done');

      query = true;
    }

  });

  //color format change
  $('#format').on('click', changeInputFormat);

  //init
  $('body').css('background-color', cTrue.hex);
  if (isColorBright(cTrue.n_rgb[0], cTrue.n_rgb[1], cTrue.n_rgb[2])) {
    $('.color-adjust').addClass('dark').removeClass('light');
  } else {
    $('.color-adjust').addClass('light').removeClass('dark');
  }
});