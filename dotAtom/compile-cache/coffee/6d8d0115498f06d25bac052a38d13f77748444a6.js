(function() {
  var ColorExpression, ExpressionsRegistry, SVGColors, colorRegexp, colors, comma, elmAngle, float, floatOrPercent, hexadecimal, insensitive, int, intOrPercent, namePrefixes, notQuote, optionalPercent, pe, percent, ps, registry, strip, variables, _ref, _ref1;

  _ref = require('./regexes'), int = _ref.int, float = _ref.float, percent = _ref.percent, optionalPercent = _ref.optionalPercent, intOrPercent = _ref.intOrPercent, floatOrPercent = _ref.floatOrPercent, comma = _ref.comma, notQuote = _ref.notQuote, hexadecimal = _ref.hexadecimal, ps = _ref.ps, pe = _ref.pe, variables = _ref.variables, namePrefixes = _ref.namePrefixes;

  _ref1 = require('./utils'), strip = _ref1.strip, insensitive = _ref1.insensitive;

  ExpressionsRegistry = require('./expressions-registry');

  ColorExpression = require('./color-expression');

  SVGColors = require('./svg-colors');

  module.exports = registry = new ExpressionsRegistry(ColorExpression);

  registry.createExpression('pigments:css_hexa_8', "#(" + hexadecimal + "{8})(?![\\d\\w-])", 1, ['css', 'less', 'styl', 'stylus', 'sass', 'scss'], function(match, expression, context) {
    var hexa, _;
    _ = match[0], hexa = match[1];
    return this.hexRGBA = hexa;
  });

  registry.createExpression('pigments:argb_hexa_8', "#(" + hexadecimal + "{8})(?![\\d\\w-])", ['*'], function(match, expression, context) {
    var hexa, _;
    _ = match[0], hexa = match[1];
    return this.hexARGB = hexa;
  });

  registry.createExpression('pigments:css_hexa_6', "#(" + hexadecimal + "{6})(?![\\d\\w-])", ['*'], function(match, expression, context) {
    var hexa, _;
    _ = match[0], hexa = match[1];
    return this.hex = hexa;
  });

  registry.createExpression('pigments:css_hexa_4', "(?:" + namePrefixes + ")#(" + hexadecimal + "{4})(?![\\d\\w-])", ['*'], function(match, expression, context) {
    var colorAsInt, hexa, _;
    _ = match[0], hexa = match[1];
    colorAsInt = context.readInt(hexa, 16);
    this.colorExpression = "#" + hexa;
    this.red = (colorAsInt >> 12 & 0xf) * 17;
    this.green = (colorAsInt >> 8 & 0xf) * 17;
    this.blue = (colorAsInt >> 4 & 0xf) * 17;
    return this.alpha = ((colorAsInt & 0xf) * 17) / 255;
  });

  registry.createExpression('pigments:css_hexa_3', "(?:" + namePrefixes + ")#(" + hexadecimal + "{3})(?![\\d\\w-])", ['*'], function(match, expression, context) {
    var colorAsInt, hexa, _;
    _ = match[0], hexa = match[1];
    colorAsInt = context.readInt(hexa, 16);
    this.colorExpression = "#" + hexa;
    this.red = (colorAsInt >> 8 & 0xf) * 17;
    this.green = (colorAsInt >> 4 & 0xf) * 17;
    return this.blue = (colorAsInt & 0xf) * 17;
  });

  registry.createExpression('pigments:int_hexa_8', "0x(" + hexadecimal + "{8})(?!" + hexadecimal + ")", ['*'], function(match, expression, context) {
    var hexa, _;
    _ = match[0], hexa = match[1];
    return this.hexARGB = hexa;
  });

  registry.createExpression('pigments:int_hexa_6', "0x(" + hexadecimal + "{6})(?!" + hexadecimal + ")", ['*'], function(match, expression, context) {
    var hexa, _;
    _ = match[0], hexa = match[1];
    return this.hex = hexa;
  });

  registry.createExpression('pigments:css_rgb', strip("" + (insensitive('rgb')) + ps + "\\s* (" + intOrPercent + "|" + variables + ") " + comma + " (" + intOrPercent + "|" + variables + ") " + comma + " (" + intOrPercent + "|" + variables + ") " + pe), ['*'], function(match, expression, context) {
    var b, g, r, _;
    _ = match[0], r = match[1], g = match[2], b = match[3];
    this.red = context.readIntOrPercent(r);
    this.green = context.readIntOrPercent(g);
    this.blue = context.readIntOrPercent(b);
    return this.alpha = 1;
  });

  registry.createExpression('pigments:css_rgba', strip("" + (insensitive('rgba')) + ps + "\\s* (" + intOrPercent + "|" + variables + ") " + comma + " (" + intOrPercent + "|" + variables + ") " + comma + " (" + intOrPercent + "|" + variables + ") " + comma + " (" + float + "|" + variables + ") " + pe), ['*'], function(match, expression, context) {
    var a, b, g, r, _;
    _ = match[0], r = match[1], g = match[2], b = match[3], a = match[4];
    this.red = context.readIntOrPercent(r);
    this.green = context.readIntOrPercent(g);
    this.blue = context.readIntOrPercent(b);
    return this.alpha = context.readFloat(a);
  });

  registry.createExpression('pigments:stylus_rgba', strip("rgba" + ps + "\\s* (" + notQuote + ") " + comma + " (" + float + "|" + variables + ") " + pe), ['*'], function(match, expression, context) {
    var a, baseColor, subexpr, _;
    _ = match[0], subexpr = match[1], a = match[2];
    baseColor = context.readColor(subexpr);
    if (context.isInvalid(baseColor)) {
      return this.invalid = true;
    }
    this.rgb = baseColor.rgb;
    return this.alpha = context.readFloat(a);
  });

  registry.createExpression('pigments:css_hsl', strip("" + (insensitive('hsl')) + ps + "\\s* (" + float + "|" + variables + ") " + comma + " (" + optionalPercent + "|" + variables + ") " + comma + " (" + optionalPercent + "|" + variables + ") " + pe), ['css', 'sass', 'scss', 'styl', 'stylus'], function(match, expression, context) {
    var h, hsl, l, s, _;
    _ = match[0], h = match[1], s = match[2], l = match[3];
    hsl = [context.readInt(h), context.readFloat(s), context.readFloat(l)];
    if (hsl.some(function(v) {
      return (v == null) || isNaN(v);
    })) {
      return this.invalid = true;
    }
    this.hsl = hsl;
    return this.alpha = 1;
  });

  registry.createExpression('pigments:less_hsl', strip("hsl" + ps + "\\s* (" + float + "|" + variables + ") " + comma + " (" + floatOrPercent + "|" + variables + ") " + comma + " (" + floatOrPercent + "|" + variables + ") " + pe), ['less'], function(match, expression, context) {
    var h, hsl, l, s, _;
    _ = match[0], h = match[1], s = match[2], l = match[3];
    hsl = [context.readInt(h), context.readFloatOrPercent(s) * 100, context.readFloatOrPercent(l) * 100];
    if (hsl.some(function(v) {
      return (v == null) || isNaN(v);
    })) {
      return this.invalid = true;
    }
    this.hsl = hsl;
    return this.alpha = 1;
  });

  registry.createExpression('pigments:css_hsla', strip("" + (insensitive('hsla')) + ps + "\\s* (" + float + "|" + variables + ") " + comma + " (" + optionalPercent + "|" + variables + ") " + comma + " (" + optionalPercent + "|" + variables + ") " + comma + " (" + float + "|" + variables + ") " + pe), ['*'], function(match, expression, context) {
    var a, h, hsl, l, s, _;
    _ = match[0], h = match[1], s = match[2], l = match[3], a = match[4];
    hsl = [context.readInt(h), context.readFloat(s), context.readFloat(l)];
    if (hsl.some(function(v) {
      return (v == null) || isNaN(v);
    })) {
      return this.invalid = true;
    }
    this.hsl = hsl;
    return this.alpha = context.readFloat(a);
  });

  registry.createExpression('pigments:hsv', strip("(?:" + (insensitive('hsv')) + "|" + (insensitive('hsb')) + ")" + ps + "\\s* (" + float + "|" + variables + ") " + comma + " (" + optionalPercent + "|" + variables + ") " + comma + " (" + optionalPercent + "|" + variables + ") " + pe), ['*'], function(match, expression, context) {
    var h, hsv, s, v, _;
    _ = match[0], h = match[1], s = match[2], v = match[3];
    hsv = [context.readInt(h), context.readFloat(s), context.readFloat(v)];
    if (hsv.some(function(v) {
      return (v == null) || isNaN(v);
    })) {
      return this.invalid = true;
    }
    this.hsv = hsv;
    return this.alpha = 1;
  });

  registry.createExpression('pigments:hsva', strip("(?:" + (insensitive('hsva')) + "|" + (insensitive('hsba')) + ")" + ps + "\\s* (" + float + "|" + variables + ") " + comma + " (" + optionalPercent + "|" + variables + ") " + comma + " (" + optionalPercent + "|" + variables + ") " + comma + " (" + float + "|" + variables + ") " + pe), ['*'], function(match, expression, context) {
    var a, h, hsv, s, v, _;
    _ = match[0], h = match[1], s = match[2], v = match[3], a = match[4];
    hsv = [context.readInt(h), context.readFloat(s), context.readFloat(v)];
    if (hsv.some(function(v) {
      return (v == null) || isNaN(v);
    })) {
      return this.invalid = true;
    }
    this.hsv = hsv;
    return this.alpha = context.readFloat(a);
  });

  registry.createExpression('pigments:hcg', strip("(?:" + (insensitive('hcg')) + ")" + ps + "\\s* (" + float + "|" + variables + ") " + comma + " (" + optionalPercent + "|" + variables + ") " + comma + " (" + optionalPercent + "|" + variables + ") " + pe), ['*'], function(match, expression, context) {
    var c, gr, h, hcg, _;
    _ = match[0], h = match[1], c = match[2], gr = match[3];
    hcg = [context.readInt(h), context.readFloat(c), context.readFloat(gr)];
    if (hcg.some(function(v) {
      return (v == null) || isNaN(v);
    })) {
      return this.invalid = true;
    }
    this.hcg = hcg;
    return this.alpha = 1;
  });

  registry.createExpression('pigments:hcga', strip("(?:" + (insensitive('hcga')) + ")" + ps + "\\s* (" + float + "|" + variables + ") " + comma + " (" + optionalPercent + "|" + variables + ") " + comma + " (" + optionalPercent + "|" + variables + ") " + comma + " (" + float + "|" + variables + ") " + pe), ['*'], function(match, expression, context) {
    var a, c, gr, h, hcg, _;
    _ = match[0], h = match[1], c = match[2], gr = match[3], a = match[4];
    hcg = [context.readInt(h), context.readFloat(c), context.readFloat(gr)];
    if (hcg.some(function(v) {
      return (v == null) || isNaN(v);
    })) {
      return this.invalid = true;
    }
    this.hcg = hcg;
    return this.alpha = context.readFloat(a);
  });

  registry.createExpression('pigments:vec4', strip("vec4" + ps + "\\s* (" + float + ") " + comma + " (" + float + ") " + comma + " (" + float + ") " + comma + " (" + float + ") " + pe), ['*'], function(match, expression, context) {
    var a, h, l, s, _;
    _ = match[0], h = match[1], s = match[2], l = match[3], a = match[4];
    return this.rgba = [context.readFloat(h) * 255, context.readFloat(s) * 255, context.readFloat(l) * 255, context.readFloat(a)];
  });

  registry.createExpression('pigments:hwb', strip("" + (insensitive('hwb')) + ps + "\\s* (" + float + "|" + variables + ") " + comma + " (" + optionalPercent + "|" + variables + ") " + comma + " (" + optionalPercent + "|" + variables + ") (?:" + comma + "(" + float + "|" + variables + "))? " + pe), ['*'], function(match, expression, context) {
    var a, b, h, w, _;
    _ = match[0], h = match[1], w = match[2], b = match[3], a = match[4];
    this.hwb = [context.readInt(h), context.readFloat(w), context.readFloat(b)];
    return this.alpha = a != null ? context.readFloat(a) : 1;
  });

  registry.createExpression('pigments:cmyk', strip("" + (insensitive('cmyk')) + ps + "\\s* (" + float + "|" + variables + ") " + comma + " (" + float + "|" + variables + ") " + comma + " (" + float + "|" + variables + ") " + comma + " (" + float + "|" + variables + ") " + pe), ['*'], function(match, expression, context) {
    var c, k, m, y, _;
    _ = match[0], c = match[1], m = match[2], y = match[3], k = match[4];
    return this.cmyk = [context.readFloat(c), context.readFloat(m), context.readFloat(y), context.readFloat(k)];
  });

  registry.createExpression('pigments:gray', strip("" + (insensitive('gray')) + ps + "\\s* (" + optionalPercent + "|" + variables + ") (?:" + comma + "(" + float + "|" + variables + "))? " + pe), 1, ['*'], function(match, expression, context) {
    var a, p, _;
    _ = match[0], p = match[1], a = match[2];
    p = context.readFloat(p) / 100 * 255;
    this.rgb = [p, p, p];
    return this.alpha = a != null ? context.readFloat(a) : 1;
  });

  colors = Object.keys(SVGColors.allCases);

  colorRegexp = "(?:" + namePrefixes + ")(" + (colors.join('|')) + ")\\b(?![ \\t]*[-\\.:=\\(])";

  registry.createExpression('pigments:named_colors', colorRegexp, [], function(match, expression, context) {
    var name, _;
    _ = match[0], name = match[1];
    this.colorExpression = this.name = name;
    return this.hex = context.SVGColors.allCases[name].replace('#', '');
  });

  registry.createExpression('pigments:darken', strip("darken" + ps + " (" + notQuote + ") " + comma + " (" + optionalPercent + "|" + variables + ") " + pe), ['*'], function(match, expression, context) {
    var amount, baseColor, h, l, s, subexpr, _, _ref2;
    _ = match[0], subexpr = match[1], amount = match[2];
    amount = context.readFloat(amount);
    baseColor = context.readColor(subexpr);
    if (context.isInvalid(baseColor)) {
      return this.invalid = true;
    }
    _ref2 = baseColor.hsl, h = _ref2[0], s = _ref2[1], l = _ref2[2];
    this.hsl = [h, s, context.clampInt(l - amount)];
    return this.alpha = baseColor.alpha;
  });

  registry.createExpression('pigments:lighten', strip("lighten" + ps + " (" + notQuote + ") " + comma + " (" + optionalPercent + "|" + variables + ") " + pe), ['*'], function(match, expression, context) {
    var amount, baseColor, h, l, s, subexpr, _, _ref2;
    _ = match[0], subexpr = match[1], amount = match[2];
    amount = context.readFloat(amount);
    baseColor = context.readColor(subexpr);
    if (context.isInvalid(baseColor)) {
      return this.invalid = true;
    }
    _ref2 = baseColor.hsl, h = _ref2[0], s = _ref2[1], l = _ref2[2];
    this.hsl = [h, s, context.clampInt(l + amount)];
    return this.alpha = baseColor.alpha;
  });

  registry.createExpression('pigments:fade', strip("(?:fade|alpha)" + ps + " (" + notQuote + ") " + comma + " (" + floatOrPercent + "|" + variables + ") " + pe), ['*'], function(match, expression, context) {
    var amount, baseColor, subexpr, _;
    _ = match[0], subexpr = match[1], amount = match[2];
    amount = context.readFloatOrPercent(amount);
    baseColor = context.readColor(subexpr);
    if (context.isInvalid(baseColor)) {
      return this.invalid = true;
    }
    this.rgb = baseColor.rgb;
    return this.alpha = amount;
  });

  registry.createExpression('pigments:transparentize', strip("(?:transparentize|fadeout|fade-out|fade_out)" + ps + " (" + notQuote + ") " + comma + " (" + floatOrPercent + "|" + variables + ") " + pe), ['*'], function(match, expression, context) {
    var amount, baseColor, subexpr, _;
    _ = match[0], subexpr = match[1], amount = match[2];
    amount = context.readFloatOrPercent(amount);
    baseColor = context.readColor(subexpr);
    if (context.isInvalid(baseColor)) {
      return this.invalid = true;
    }
    this.rgb = baseColor.rgb;
    return this.alpha = context.clamp(baseColor.alpha - amount);
  });

  registry.createExpression('pigments:opacify', strip("(?:opacify|fadein|fade-in|fade_in)" + ps + " (" + notQuote + ") " + comma + " (" + floatOrPercent + "|" + variables + ") " + pe), ['*'], function(match, expression, context) {
    var amount, baseColor, subexpr, _;
    _ = match[0], subexpr = match[1], amount = match[2];
    amount = context.readFloatOrPercent(amount);
    baseColor = context.readColor(subexpr);
    if (context.isInvalid(baseColor)) {
      return this.invalid = true;
    }
    this.rgb = baseColor.rgb;
    return this.alpha = context.clamp(baseColor.alpha + amount);
  });

  registry.createExpression('pigments:stylus_component_functions', strip("(red|green|blue)" + ps + " (" + notQuote + ") " + comma + " (" + int + "|" + variables + ") " + pe), ['*'], function(match, expression, context) {
    var amount, baseColor, channel, subexpr, _;
    _ = match[0], channel = match[1], subexpr = match[2], amount = match[3];
    amount = context.readInt(amount);
    baseColor = context.readColor(subexpr);
    if (context.isInvalid(baseColor)) {
      return this.invalid = true;
    }
    if (isNaN(amount)) {
      return this.invalid = true;
    }
    return this[channel] = amount;
  });

  registry.createExpression('pigments:transparentify', strip("transparentify" + ps + " (" + notQuote + ") " + pe), ['*'], function(match, expression, context) {
    var alpha, bestAlpha, bottom, expr, processChannel, top, _, _ref2;
    _ = match[0], expr = match[1];
    _ref2 = context.split(expr), top = _ref2[0], bottom = _ref2[1], alpha = _ref2[2];
    top = context.readColor(top);
    bottom = context.readColor(bottom);
    alpha = context.readFloatOrPercent(alpha);
    if (context.isInvalid(top)) {
      return this.invalid = true;
    }
    if ((bottom != null) && context.isInvalid(bottom)) {
      return this.invalid = true;
    }
    if (bottom == null) {
      bottom = new context.Color(255, 255, 255, 1);
    }
    if (isNaN(alpha)) {
      alpha = void 0;
    }
    bestAlpha = ['red', 'green', 'blue'].map(function(channel) {
      var res;
      res = (top[channel] - bottom[channel]) / ((0 < top[channel] - bottom[channel] ? 255 : 0) - bottom[channel]);
      return res;
    }).sort(function(a, b) {
      return a < b;
    })[0];
    processChannel = function(channel) {
      if (bestAlpha === 0) {
        return bottom[channel];
      } else {
        return bottom[channel] + (top[channel] - bottom[channel]) / bestAlpha;
      }
    };
    if (alpha != null) {
      bestAlpha = alpha;
    }
    bestAlpha = Math.max(Math.min(bestAlpha, 1), 0);
    this.red = processChannel('red');
    this.green = processChannel('green');
    this.blue = processChannel('blue');
    return this.alpha = Math.round(bestAlpha * 100) / 100;
  });

  registry.createExpression('pigments:hue', strip("hue" + ps + " (" + notQuote + ") " + comma + " (" + int + "deg|" + variables + ") " + pe), ['*'], function(match, expression, context) {
    var amount, baseColor, h, l, s, subexpr, _, _ref2;
    _ = match[0], subexpr = match[1], amount = match[2];
    amount = context.readFloat(amount);
    baseColor = context.readColor(subexpr);
    if (context.isInvalid(baseColor)) {
      return this.invalid = true;
    }
    if (isNaN(amount)) {
      return this.invalid = true;
    }
    _ref2 = baseColor.hsl, h = _ref2[0], s = _ref2[1], l = _ref2[2];
    this.hsl = [amount % 360, s, l];
    return this.alpha = baseColor.alpha;
  });

  registry.createExpression('pigments:stylus_sl_component_functions', strip("(saturation|lightness)" + ps + " (" + notQuote + ") " + comma + " (" + intOrPercent + "|" + variables + ") " + pe), ['*'], function(match, expression, context) {
    var amount, baseColor, channel, subexpr, _;
    _ = match[0], channel = match[1], subexpr = match[2], amount = match[3];
    amount = context.readInt(amount);
    baseColor = context.readColor(subexpr);
    if (context.isInvalid(baseColor)) {
      return this.invalid = true;
    }
    if (isNaN(amount)) {
      return this.invalid = true;
    }
    baseColor[channel] = amount;
    return this.rgba = baseColor.rgba;
  });

  registry.createExpression('pigments:adjust-hue', strip("adjust-hue" + ps + " (" + notQuote + ") " + comma + " (-?" + int + "deg|" + variables + "|-?" + optionalPercent + ") " + pe), ['*'], function(match, expression, context) {
    var amount, baseColor, h, l, s, subexpr, _, _ref2;
    _ = match[0], subexpr = match[1], amount = match[2];
    amount = context.readFloat(amount);
    baseColor = context.readColor(subexpr);
    if (context.isInvalid(baseColor)) {
      return this.invalid = true;
    }
    _ref2 = baseColor.hsl, h = _ref2[0], s = _ref2[1], l = _ref2[2];
    this.hsl = [(h + amount) % 360, s, l];
    return this.alpha = baseColor.alpha;
  });

  registry.createExpression('pigments:mix', "mix" + ps + "(" + notQuote + ")" + pe, ['*'], function(match, expression, context) {
    var amount, baseColor1, baseColor2, color1, color2, expr, _, _ref2, _ref3;
    _ = match[0], expr = match[1];
    _ref2 = context.split(expr), color1 = _ref2[0], color2 = _ref2[1], amount = _ref2[2];
    if (amount != null) {
      amount = context.readFloatOrPercent(amount);
    } else {
      amount = 0.5;
    }
    baseColor1 = context.readColor(color1);
    baseColor2 = context.readColor(color2);
    if (context.isInvalid(baseColor1) || context.isInvalid(baseColor2)) {
      return this.invalid = true;
    }
    return _ref3 = context.mixColors(baseColor1, baseColor2, amount), this.rgba = _ref3.rgba, _ref3;
  });

  registry.createExpression('pigments:stylus_tint', strip("tint" + ps + " (" + notQuote + ") " + comma + " (" + floatOrPercent + "|" + variables + ") " + pe), ['styl', 'stylus', 'less'], function(match, expression, context) {
    var amount, baseColor, subexpr, white, _;
    _ = match[0], subexpr = match[1], amount = match[2];
    amount = context.readFloatOrPercent(amount);
    baseColor = context.readColor(subexpr);
    if (context.isInvalid(baseColor)) {
      return this.invalid = true;
    }
    white = new context.Color(255, 255, 255);
    return this.rgba = context.mixColors(white, baseColor, amount).rgba;
  });

  registry.createExpression('pigments:stylus_shade', strip("shade" + ps + " (" + notQuote + ") " + comma + " (" + floatOrPercent + "|" + variables + ") " + pe), ['styl', 'stylus', 'less'], function(match, expression, context) {
    var amount, baseColor, black, subexpr, _;
    _ = match[0], subexpr = match[1], amount = match[2];
    amount = context.readFloatOrPercent(amount);
    baseColor = context.readColor(subexpr);
    if (context.isInvalid(baseColor)) {
      return this.invalid = true;
    }
    black = new context.Color(0, 0, 0);
    return this.rgba = context.mixColors(black, baseColor, amount).rgba;
  });

  registry.createExpression('pigments:compass_tint', strip("tint" + ps + " (" + notQuote + ") " + comma + " (" + floatOrPercent + "|" + variables + ") " + pe), ['sass:compass', 'scss:compass'], function(match, expression, context) {
    var amount, baseColor, subexpr, white, _;
    _ = match[0], subexpr = match[1], amount = match[2];
    amount = context.readFloatOrPercent(amount);
    baseColor = context.readColor(subexpr);
    if (context.isInvalid(baseColor)) {
      return this.invalid = true;
    }
    white = new context.Color(255, 255, 255);
    return this.rgba = context.mixColors(baseColor, white, amount).rgba;
  });

  registry.createExpression('pigments:compass_shade', strip("shade" + ps + " (" + notQuote + ") " + comma + " (" + floatOrPercent + "|" + variables + ") " + pe), ['sass:compass', 'scss:compass'], function(match, expression, context) {
    var amount, baseColor, black, subexpr, _;
    _ = match[0], subexpr = match[1], amount = match[2];
    amount = context.readFloatOrPercent(amount);
    baseColor = context.readColor(subexpr);
    if (context.isInvalid(baseColor)) {
      return this.invalid = true;
    }
    black = new context.Color(0, 0, 0);
    return this.rgba = context.mixColors(baseColor, black, amount).rgba;
  });

  registry.createExpression('pigments:bourbon_tint', strip("tint" + ps + " (" + notQuote + ") " + comma + " (" + floatOrPercent + "|" + variables + ") " + pe), ['sass:bourbon', 'scss:bourbon'], function(match, expression, context) {
    var amount, baseColor, subexpr, white, _;
    _ = match[0], subexpr = match[1], amount = match[2];
    amount = context.readFloatOrPercent(amount);
    baseColor = context.readColor(subexpr);
    if (context.isInvalid(baseColor)) {
      return this.invalid = true;
    }
    white = new context.Color(255, 255, 255);
    return this.rgba = context.mixColors(white, baseColor, amount).rgba;
  });

  registry.createExpression('pigments:bourbon_shade', strip("shade" + ps + " (" + notQuote + ") " + comma + " (" + floatOrPercent + "|" + variables + ") " + pe), ['sass:bourbon', 'scss:bourbon'], function(match, expression, context) {
    var amount, baseColor, black, subexpr, _;
    _ = match[0], subexpr = match[1], amount = match[2];
    amount = context.readFloatOrPercent(amount);
    baseColor = context.readColor(subexpr);
    if (context.isInvalid(baseColor)) {
      return this.invalid = true;
    }
    black = new context.Color(0, 0, 0);
    return this.rgba = context.mixColors(black, baseColor, amount).rgba;
  });

  registry.createExpression('pigments:desaturate', "desaturate" + ps + "(" + notQuote + ")" + comma + "(" + floatOrPercent + "|" + variables + ")" + pe, ['*'], function(match, expression, context) {
    var amount, baseColor, h, l, s, subexpr, _, _ref2;
    _ = match[0], subexpr = match[1], amount = match[2];
    amount = context.readFloatOrPercent(amount);
    baseColor = context.readColor(subexpr);
    if (context.isInvalid(baseColor)) {
      return this.invalid = true;
    }
    _ref2 = baseColor.hsl, h = _ref2[0], s = _ref2[1], l = _ref2[2];
    this.hsl = [h, context.clampInt(s - amount * 100), l];
    return this.alpha = baseColor.alpha;
  });

  registry.createExpression('pigments:saturate', strip("saturate" + ps + " (" + notQuote + ") " + comma + " (" + floatOrPercent + "|" + variables + ") " + pe), ['*'], function(match, expression, context) {
    var amount, baseColor, h, l, s, subexpr, _, _ref2;
    _ = match[0], subexpr = match[1], amount = match[2];
    amount = context.readFloatOrPercent(amount);
    baseColor = context.readColor(subexpr);
    if (context.isInvalid(baseColor)) {
      return this.invalid = true;
    }
    _ref2 = baseColor.hsl, h = _ref2[0], s = _ref2[1], l = _ref2[2];
    this.hsl = [h, context.clampInt(s + amount * 100), l];
    return this.alpha = baseColor.alpha;
  });

  registry.createExpression('pigments:grayscale', "gr(?:a|e)yscale" + ps + "(" + notQuote + ")" + pe, ['*'], function(match, expression, context) {
    var baseColor, h, l, s, subexpr, _, _ref2;
    _ = match[0], subexpr = match[1];
    baseColor = context.readColor(subexpr);
    if (context.isInvalid(baseColor)) {
      return this.invalid = true;
    }
    _ref2 = baseColor.hsl, h = _ref2[0], s = _ref2[1], l = _ref2[2];
    this.hsl = [h, 0, l];
    return this.alpha = baseColor.alpha;
  });

  registry.createExpression('pigments:invert', "invert" + ps + "(" + notQuote + ")" + pe, ['*'], function(match, expression, context) {
    var b, baseColor, g, r, subexpr, _, _ref2;
    _ = match[0], subexpr = match[1];
    baseColor = context.readColor(subexpr);
    if (context.isInvalid(baseColor)) {
      return this.invalid = true;
    }
    _ref2 = baseColor.rgb, r = _ref2[0], g = _ref2[1], b = _ref2[2];
    this.rgb = [255 - r, 255 - g, 255 - b];
    return this.alpha = baseColor.alpha;
  });

  registry.createExpression('pigments:complement', "complement" + ps + "(" + notQuote + ")" + pe, ['*'], function(match, expression, context) {
    var baseColor, h, l, s, subexpr, _, _ref2;
    _ = match[0], subexpr = match[1];
    baseColor = context.readColor(subexpr);
    if (context.isInvalid(baseColor)) {
      return this.invalid = true;
    }
    _ref2 = baseColor.hsl, h = _ref2[0], s = _ref2[1], l = _ref2[2];
    this.hsl = [(h + 180) % 360, s, l];
    return this.alpha = baseColor.alpha;
  });

  registry.createExpression('pigments:spin', strip("spin" + ps + " (" + notQuote + ") " + comma + " (-?(" + int + ")(deg)?|" + variables + ") " + pe), ['*'], function(match, expression, context) {
    var angle, baseColor, h, l, s, subexpr, _, _ref2;
    _ = match[0], subexpr = match[1], angle = match[2];
    baseColor = context.readColor(subexpr);
    angle = context.readInt(angle);
    if (context.isInvalid(baseColor)) {
      return this.invalid = true;
    }
    _ref2 = baseColor.hsl, h = _ref2[0], s = _ref2[1], l = _ref2[2];
    this.hsl = [(360 + h + angle) % 360, s, l];
    return this.alpha = baseColor.alpha;
  });

  registry.createExpression('pigments:contrast_n_arguments', strip("contrast" + ps + " ( " + notQuote + " " + comma + " " + notQuote + " ) " + pe), ['*'], function(match, expression, context) {
    var base, baseColor, dark, expr, light, res, threshold, _, _ref2, _ref3;
    _ = match[0], expr = match[1];
    _ref2 = context.split(expr), base = _ref2[0], dark = _ref2[1], light = _ref2[2], threshold = _ref2[3];
    baseColor = context.readColor(base);
    dark = context.readColor(dark);
    light = context.readColor(light);
    if (threshold != null) {
      threshold = context.readPercent(threshold);
    }
    if (context.isInvalid(baseColor)) {
      return this.invalid = true;
    }
    if (dark != null ? dark.invalid : void 0) {
      return this.invalid = true;
    }
    if (light != null ? light.invalid : void 0) {
      return this.invalid = true;
    }
    res = context.contrast(baseColor, dark, light);
    if (context.isInvalid(res)) {
      return this.invalid = true;
    }
    return _ref3 = context.contrast(baseColor, dark, light, threshold), this.rgb = _ref3.rgb, _ref3;
  });

  registry.createExpression('pigments:contrast_1_argument', strip("contrast" + ps + " (" + notQuote + ") " + pe), ['*'], function(match, expression, context) {
    var baseColor, subexpr, _, _ref2;
    _ = match[0], subexpr = match[1];
    baseColor = context.readColor(subexpr);
    if (context.isInvalid(baseColor)) {
      return this.invalid = true;
    }
    return _ref2 = context.contrast(baseColor), this.rgb = _ref2.rgb, _ref2;
  });

  registry.createExpression('pigments:css_color_function', "(?:" + namePrefixes + ")(" + (insensitive('color')) + ps + "(" + notQuote + ")" + pe + ")", ['css'], function(match, expression, context) {
    var cssColor, e, expr, k, rgba, v, _, _ref2;
    try {
      _ = match[0], expr = match[1];
      _ref2 = context.vars;
      for (k in _ref2) {
        v = _ref2[k];
        expr = expr.replace(RegExp("" + (k.replace(/\(/g, '\\(').replace(/\)/g, '\\)')), "g"), v.value);
      }
      cssColor = require('css-color-function');
      rgba = cssColor.convert(expr.toLowerCase());
      this.rgba = context.readColor(rgba).rgba;
      return this.colorExpression = expr;
    } catch (_error) {
      e = _error;
      return this.invalid = true;
    }
  });

  registry.createExpression('pigments:sass_adjust_color', "adjust-color" + ps + "(" + notQuote + ")" + pe, 1, ['*'], function(match, expression, context) {
    var baseColor, param, params, res, subexpr, subject, _, _i, _len;
    _ = match[0], subexpr = match[1];
    res = context.split(subexpr);
    subject = res[0];
    params = res.slice(1);
    baseColor = context.readColor(subject);
    if (context.isInvalid(baseColor)) {
      return this.invalid = true;
    }
    for (_i = 0, _len = params.length; _i < _len; _i++) {
      param = params[_i];
      context.readParam(param, function(name, value) {
        return baseColor[name] += context.readFloat(value);
      });
    }
    return this.rgba = baseColor.rgba;
  });

  registry.createExpression('pigments:sass_scale_color', "scale-color" + ps + "(" + notQuote + ")" + pe, 1, ['*'], function(match, expression, context) {
    var MAX_PER_COMPONENT, baseColor, param, params, res, subexpr, subject, _, _i, _len;
    MAX_PER_COMPONENT = {
      red: 255,
      green: 255,
      blue: 255,
      alpha: 1,
      hue: 360,
      saturation: 100,
      lightness: 100
    };
    _ = match[0], subexpr = match[1];
    res = context.split(subexpr);
    subject = res[0];
    params = res.slice(1);
    baseColor = context.readColor(subject);
    if (context.isInvalid(baseColor)) {
      return this.invalid = true;
    }
    for (_i = 0, _len = params.length; _i < _len; _i++) {
      param = params[_i];
      context.readParam(param, function(name, value) {
        var dif, result;
        value = context.readFloat(value) / 100;
        result = value > 0 ? (dif = MAX_PER_COMPONENT[name] - baseColor[name], result = baseColor[name] + dif * value) : result = baseColor[name] * (1 + value);
        return baseColor[name] = result;
      });
    }
    return this.rgba = baseColor.rgba;
  });

  registry.createExpression('pigments:sass_change_color', "change-color" + ps + "(" + notQuote + ")" + pe, 1, ['*'], function(match, expression, context) {
    var baseColor, param, params, res, subexpr, subject, _, _i, _len;
    _ = match[0], subexpr = match[1];
    res = context.split(subexpr);
    subject = res[0];
    params = res.slice(1);
    baseColor = context.readColor(subject);
    if (context.isInvalid(baseColor)) {
      return this.invalid = true;
    }
    for (_i = 0, _len = params.length; _i < _len; _i++) {
      param = params[_i];
      context.readParam(param, function(name, value) {
        return baseColor[name] = context.readFloat(value);
      });
    }
    return this.rgba = baseColor.rgba;
  });

  registry.createExpression('pigments:stylus_blend', strip("blend" + ps + " ( " + notQuote + " " + comma + " " + notQuote + " ) " + pe), ['*'], function(match, expression, context) {
    var baseColor1, baseColor2, color1, color2, expr, _, _ref2;
    _ = match[0], expr = match[1];
    _ref2 = context.split(expr), color1 = _ref2[0], color2 = _ref2[1];
    baseColor1 = context.readColor(color1);
    baseColor2 = context.readColor(color2);
    if (context.isInvalid(baseColor1) || context.isInvalid(baseColor2)) {
      return this.invalid = true;
    }
    return this.rgba = [baseColor1.red * baseColor1.alpha + baseColor2.red * (1 - baseColor1.alpha), baseColor1.green * baseColor1.alpha + baseColor2.green * (1 - baseColor1.alpha), baseColor1.blue * baseColor1.alpha + baseColor2.blue * (1 - baseColor1.alpha), baseColor1.alpha + baseColor2.alpha - baseColor1.alpha * baseColor2.alpha];
  });

  registry.createExpression('pigments:lua_rgba', strip("(?:" + namePrefixes + ")Color" + ps + "\\s* (" + int + "|" + variables + ") " + comma + " (" + int + "|" + variables + ") " + comma + " (" + int + "|" + variables + ") " + comma + " (" + int + "|" + variables + ") " + pe), ['lua'], function(match, expression, context) {
    var a, b, g, r, _;
    _ = match[0], r = match[1], g = match[2], b = match[3], a = match[4];
    this.red = context.readInt(r);
    this.green = context.readInt(g);
    this.blue = context.readInt(b);
    return this.alpha = context.readInt(a) / 255;
  });

  registry.createExpression('pigments:multiply', strip("multiply" + ps + " ( " + notQuote + " " + comma + " " + notQuote + " ) " + pe), ['*'], function(match, expression, context) {
    var baseColor1, baseColor2, color1, color2, expr, _, _ref2, _ref3;
    _ = match[0], expr = match[1];
    _ref2 = context.split(expr), color1 = _ref2[0], color2 = _ref2[1];
    baseColor1 = context.readColor(color1);
    baseColor2 = context.readColor(color2);
    if (context.isInvalid(baseColor1) || context.isInvalid(baseColor2)) {
      return this.invalid = true;
    }
    return _ref3 = baseColor1.blend(baseColor2, context.BlendModes.MULTIPLY), this.rgba = _ref3.rgba, _ref3;
  });

  registry.createExpression('pigments:screen', strip("screen" + ps + " ( " + notQuote + " " + comma + " " + notQuote + " ) " + pe), ['*'], function(match, expression, context) {
    var baseColor1, baseColor2, color1, color2, expr, _, _ref2, _ref3;
    _ = match[0], expr = match[1];
    _ref2 = context.split(expr), color1 = _ref2[0], color2 = _ref2[1];
    baseColor1 = context.readColor(color1);
    baseColor2 = context.readColor(color2);
    if (context.isInvalid(baseColor1) || context.isInvalid(baseColor2)) {
      return this.invalid = true;
    }
    return _ref3 = baseColor1.blend(baseColor2, context.BlendModes.SCREEN), this.rgba = _ref3.rgba, _ref3;
  });

  registry.createExpression('pigments:overlay', strip("overlay" + ps + " ( " + notQuote + " " + comma + " " + notQuote + " ) " + pe), ['*'], function(match, expression, context) {
    var baseColor1, baseColor2, color1, color2, expr, _, _ref2, _ref3;
    _ = match[0], expr = match[1];
    _ref2 = context.split(expr), color1 = _ref2[0], color2 = _ref2[1];
    baseColor1 = context.readColor(color1);
    baseColor2 = context.readColor(color2);
    if (context.isInvalid(baseColor1) || context.isInvalid(baseColor2)) {
      return this.invalid = true;
    }
    return _ref3 = baseColor1.blend(baseColor2, context.BlendModes.OVERLAY), this.rgba = _ref3.rgba, _ref3;
  });

  registry.createExpression('pigments:softlight', strip("softlight" + ps + " ( " + notQuote + " " + comma + " " + notQuote + " ) " + pe), ['*'], function(match, expression, context) {
    var baseColor1, baseColor2, color1, color2, expr, _, _ref2, _ref3;
    _ = match[0], expr = match[1];
    _ref2 = context.split(expr), color1 = _ref2[0], color2 = _ref2[1];
    baseColor1 = context.readColor(color1);
    baseColor2 = context.readColor(color2);
    if (context.isInvalid(baseColor1) || context.isInvalid(baseColor2)) {
      return this.invalid = true;
    }
    return _ref3 = baseColor1.blend(baseColor2, context.BlendModes.SOFT_LIGHT), this.rgba = _ref3.rgba, _ref3;
  });

  registry.createExpression('pigments:hardlight', strip("hardlight" + ps + " ( " + notQuote + " " + comma + " " + notQuote + " ) " + pe), ['*'], function(match, expression, context) {
    var baseColor1, baseColor2, color1, color2, expr, _, _ref2, _ref3;
    _ = match[0], expr = match[1];
    _ref2 = context.split(expr), color1 = _ref2[0], color2 = _ref2[1];
    baseColor1 = context.readColor(color1);
    baseColor2 = context.readColor(color2);
    if (context.isInvalid(baseColor1) || context.isInvalid(baseColor2)) {
      return this.invalid = true;
    }
    return _ref3 = baseColor1.blend(baseColor2, context.BlendModes.HARD_LIGHT), this.rgba = _ref3.rgba, _ref3;
  });

  registry.createExpression('pigments:difference', strip("difference" + ps + " ( " + notQuote + " " + comma + " " + notQuote + " ) " + pe), ['*'], function(match, expression, context) {
    var baseColor1, baseColor2, color1, color2, expr, _, _ref2, _ref3;
    _ = match[0], expr = match[1];
    _ref2 = context.split(expr), color1 = _ref2[0], color2 = _ref2[1];
    baseColor1 = context.readColor(color1);
    baseColor2 = context.readColor(color2);
    if (context.isInvalid(baseColor1) || context.isInvalid(baseColor2)) {
      return this.invalid = true;
    }
    return _ref3 = baseColor1.blend(baseColor2, context.BlendModes.DIFFERENCE), this.rgba = _ref3.rgba, _ref3;
  });

  registry.createExpression('pigments:exclusion', strip("exclusion" + ps + " ( " + notQuote + " " + comma + " " + notQuote + " ) " + pe), ['*'], function(match, expression, context) {
    var baseColor1, baseColor2, color1, color2, expr, _, _ref2, _ref3;
    _ = match[0], expr = match[1];
    _ref2 = context.split(expr), color1 = _ref2[0], color2 = _ref2[1];
    baseColor1 = context.readColor(color1);
    baseColor2 = context.readColor(color2);
    if (context.isInvalid(baseColor1) || context.isInvalid(baseColor2)) {
      return this.invalid = true;
    }
    return _ref3 = baseColor1.blend(baseColor2, context.BlendModes.EXCLUSION), this.rgba = _ref3.rgba, _ref3;
  });

  registry.createExpression('pigments:average', strip("average" + ps + " ( " + notQuote + " " + comma + " " + notQuote + " ) " + pe), ['*'], function(match, expression, context) {
    var baseColor1, baseColor2, color1, color2, expr, _, _ref2, _ref3;
    _ = match[0], expr = match[1];
    _ref2 = context.split(expr), color1 = _ref2[0], color2 = _ref2[1];
    baseColor1 = context.readColor(color1);
    baseColor2 = context.readColor(color2);
    if (context.isInvalid(baseColor1) || context.isInvalid(baseColor2)) {
      return this.invalid = true;
    }
    return _ref3 = baseColor1.blend(baseColor2, context.BlendModes.AVERAGE), this.rgba = _ref3.rgba, _ref3;
  });

  registry.createExpression('pigments:negation', strip("negation" + ps + " ( " + notQuote + " " + comma + " " + notQuote + " ) " + pe), ['*'], function(match, expression, context) {
    var baseColor1, baseColor2, color1, color2, expr, _, _ref2, _ref3;
    _ = match[0], expr = match[1];
    _ref2 = context.split(expr), color1 = _ref2[0], color2 = _ref2[1];
    baseColor1 = context.readColor(color1);
    baseColor2 = context.readColor(color2);
    if (context.isInvalid(baseColor1) || context.isInvalid(baseColor2)) {
      return this.invalid = true;
    }
    return _ref3 = baseColor1.blend(baseColor2, context.BlendModes.NEGATION), this.rgba = _ref3.rgba, _ref3;
  });

  registry.createExpression('pigments:elm_rgba', strip("rgba\\s+ (" + int + "|" + variables + ") \\s+ (" + int + "|" + variables + ") \\s+ (" + int + "|" + variables + ") \\s+ (" + float + "|" + variables + ")"), ['elm'], function(match, expression, context) {
    var a, b, g, r, _;
    _ = match[0], r = match[1], g = match[2], b = match[3], a = match[4];
    this.red = context.readInt(r);
    this.green = context.readInt(g);
    this.blue = context.readInt(b);
    return this.alpha = context.readFloat(a);
  });

  registry.createExpression('pigments:elm_rgb', strip("rgb\\s+ (" + int + "|" + variables + ") \\s+ (" + int + "|" + variables + ") \\s+ (" + int + "|" + variables + ")"), ['elm'], function(match, expression, context) {
    var b, g, r, _;
    _ = match[0], r = match[1], g = match[2], b = match[3];
    this.red = context.readInt(r);
    this.green = context.readInt(g);
    return this.blue = context.readInt(b);
  });

  elmAngle = "(?:" + float + "|\\(degrees\\s+(?:" + int + "|" + variables + ")\\))";

  registry.createExpression('pigments:elm_hsl', strip("hsl\\s+ (" + elmAngle + "|" + variables + ") \\s+ (" + float + "|" + variables + ") \\s+ (" + float + "|" + variables + ")"), ['elm'], function(match, expression, context) {
    var elmDegreesRegexp, h, hsl, l, m, s, _;
    elmDegreesRegexp = new RegExp("\\(degrees\\s+(" + context.int + "|" + context.variablesRE + ")\\)");
    _ = match[0], h = match[1], s = match[2], l = match[3];
    if (m = elmDegreesRegexp.exec(h)) {
      h = context.readInt(m[1]);
    } else {
      h = context.readFloat(h) * 180 / Math.PI;
    }
    hsl = [h, context.readFloat(s), context.readFloat(l)];
    if (hsl.some(function(v) {
      return (v == null) || isNaN(v);
    })) {
      return this.invalid = true;
    }
    this.hsl = hsl;
    return this.alpha = 1;
  });

  registry.createExpression('pigments:elm_hsla', strip("hsla\\s+ (" + elmAngle + "|" + variables + ") \\s+ (" + float + "|" + variables + ") \\s+ (" + float + "|" + variables + ") \\s+ (" + float + "|" + variables + ")"), ['elm'], function(match, expression, context) {
    var a, elmDegreesRegexp, h, hsl, l, m, s, _;
    elmDegreesRegexp = new RegExp("\\(degrees\\s+(" + context.int + "|" + context.variablesRE + ")\\)");
    _ = match[0], h = match[1], s = match[2], l = match[3], a = match[4];
    if (m = elmDegreesRegexp.exec(h)) {
      h = context.readInt(m[1]);
    } else {
      h = context.readFloat(h) * 180 / Math.PI;
    }
    hsl = [h, context.readFloat(s), context.readFloat(l)];
    if (hsl.some(function(v) {
      return (v == null) || isNaN(v);
    })) {
      return this.invalid = true;
    }
    this.hsl = hsl;
    return this.alpha = context.readFloat(a);
  });

  registry.createExpression('pigments:elm_grayscale', "gr(?:a|e)yscale\\s+(" + float + "|" + variables + ")", ['elm'], function(match, expression, context) {
    var amount, _;
    _ = match[0], amount = match[1];
    amount = Math.floor(255 - context.readFloat(amount) * 255);
    return this.rgb = [amount, amount, amount];
  });

  registry.createExpression('pigments:elm_complement', strip("complement\\s+(" + notQuote + ")"), ['elm'], function(match, expression, context) {
    var baseColor, h, l, s, subexpr, _, _ref2;
    _ = match[0], subexpr = match[1];
    baseColor = context.readColor(subexpr);
    if (context.isInvalid(baseColor)) {
      return this.invalid = true;
    }
    _ref2 = baseColor.hsl, h = _ref2[0], s = _ref2[1], l = _ref2[2];
    this.hsl = [(h + 180) % 360, s, l];
    return this.alpha = baseColor.alpha;
  });

  registry.createExpression('pigments:latex_gray', strip("\\[gray\\]\\{(" + float + ")\\}"), ['tex'], function(match, expression, context) {
    var amount, _;
    _ = match[0], amount = match[1];
    amount = context.readFloat(amount) * 255;
    return this.rgb = [amount, amount, amount];
  });

  registry.createExpression('pigments:latex_html', strip("\\[HTML\\]\\{(" + hexadecimal + "{6})\\}"), ['tex'], function(match, expression, context) {
    var hexa, _;
    _ = match[0], hexa = match[1];
    return this.hex = hexa;
  });

  registry.createExpression('pigments:latex_rgb', strip("\\[rgb\\]\\{(" + float + ")" + comma + "(" + float + ")" + comma + "(" + float + ")\\}"), ['tex'], function(match, expression, context) {
    var b, g, r, _;
    _ = match[0], r = match[1], g = match[2], b = match[3];
    r = Math.floor(context.readFloat(r) * 255);
    g = Math.floor(context.readFloat(g) * 255);
    b = Math.floor(context.readFloat(b) * 255);
    return this.rgb = [r, g, b];
  });

  registry.createExpression('pigments:latex_RGB', strip("\\[RGB\\]\\{(" + int + ")" + comma + "(" + int + ")" + comma + "(" + int + ")\\}"), ['tex'], function(match, expression, context) {
    var b, g, r, _;
    _ = match[0], r = match[1], g = match[2], b = match[3];
    r = context.readInt(r);
    g = context.readInt(g);
    b = context.readInt(b);
    return this.rgb = [r, g, b];
  });

  registry.createExpression('pigments:latex_cmyk', strip("\\[cmyk\\]\\{(" + float + ")" + comma + "(" + float + ")" + comma + "(" + float + ")" + comma + "(" + float + ")\\}"), ['tex'], function(match, expression, context) {
    var c, k, m, y, _;
    _ = match[0], c = match[1], m = match[2], y = match[3], k = match[4];
    c = context.readFloat(c);
    m = context.readFloat(m);
    y = context.readFloat(y);
    k = context.readFloat(k);
    return this.cmyk = [c, m, y, k];
  });

  registry.createExpression('pigments:latex_predefined', strip('\\{(black|blue|brown|cyan|darkgray|gray|green|lightgray|lime|magenta|olive|orange|pink|purple|red|teal|violet|white|yellow)\\}'), ['tex'], function(match, expression, context) {
    var name, _;
    _ = match[0], name = match[1];
    return this.hex = context.SVGColors.allCases[name].replace('#', '');
  });

  registry.createExpression('pigments:latex_predefined_dvipnames', strip('\\{(Apricot|Aquamarine|Bittersweet|Black|Blue|BlueGreen|BlueViolet|BrickRed|Brown|BurntOrange|CadetBlue|CarnationPink|Cerulean|CornflowerBlue|Cyan|Dandelion|DarkOrchid|Emerald|ForestGreen|Fuchsia|Goldenrod|Gray|Green|GreenYellow|JungleGreen|Lavender|LimeGreen|Magenta|Mahogany|Maroon|Melon|MidnightBlue|Mulberry|NavyBlue|OliveGreen|Orange|OrangeRed|Orchid|Peach|Periwinkle|PineGreen|Plum|ProcessBlue|Purple|RawSienna|Red|RedOrange|RedViolet|Rhodamine|RoyalBlue|RoyalPurple|RubineRed|Salmon|SeaGreen|Sepia|SkyBlue|SpringGreen|Tan|TealBlue|Thistle|Turquoise|Violet|VioletRed|White|WildStrawberry|Yellow|YellowGreen|YellowOrange)\\}'), ['tex'], function(match, expression, context) {
    var name, _;
    _ = match[0], name = match[1];
    return this.hex = context.DVIPnames[name].replace('#', '');
  });

  registry.createExpression('pigments:latex_mix', strip('\\{([^!\\n\\}]+[!][^\\}\\n]+)\\}'), ['tex'], function(match, expression, context) {
    var expr, mix, nextColor, op, triplet, _;
    _ = match[0], expr = match[1];
    op = expr.split('!');
    mix = function(_arg) {
      var a, b, colorA, colorB, p;
      a = _arg[0], p = _arg[1], b = _arg[2];
      colorA = a instanceof context.Color ? a : context.readColor("{" + a + "}");
      colorB = b instanceof context.Color ? b : context.readColor("{" + b + "}");
      percent = context.readInt(p);
      return context.mixColors(colorA, colorB, percent / 100);
    };
    if (op.length === 2) {
      op.push(new context.Color(255, 255, 255));
    }
    nextColor = null;
    while (op.length > 0) {
      triplet = op.splice(0, 3);
      nextColor = mix(triplet);
      if (op.length > 0) {
        op.unshift(nextColor);
      }
    }
    return this.rgb = nextColor.rgb;
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rhd3NvbmJvdHNmb3JkLy5hdG9tL3BhY2thZ2VzL3BpZ21lbnRzL2xpYi9jb2xvci1leHByZXNzaW9ucy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsNFBBQUE7O0FBQUEsRUFBQSxPQWNJLE9BQUEsQ0FBUSxXQUFSLENBZEosRUFDRSxXQUFBLEdBREYsRUFFRSxhQUFBLEtBRkYsRUFHRSxlQUFBLE9BSEYsRUFJRSx1QkFBQSxlQUpGLEVBS0Usb0JBQUEsWUFMRixFQU1FLHNCQUFBLGNBTkYsRUFPRSxhQUFBLEtBUEYsRUFRRSxnQkFBQSxRQVJGLEVBU0UsbUJBQUEsV0FURixFQVVFLFVBQUEsRUFWRixFQVdFLFVBQUEsRUFYRixFQVlFLGlCQUFBLFNBWkYsRUFhRSxvQkFBQSxZQWJGLENBQUE7O0FBQUEsRUFnQkEsUUFBdUIsT0FBQSxDQUFRLFNBQVIsQ0FBdkIsRUFBQyxjQUFBLEtBQUQsRUFBUSxvQkFBQSxXQWhCUixDQUFBOztBQUFBLEVBa0JBLG1CQUFBLEdBQXNCLE9BQUEsQ0FBUSx3QkFBUixDQWxCdEIsQ0FBQTs7QUFBQSxFQW1CQSxlQUFBLEdBQWtCLE9BQUEsQ0FBUSxvQkFBUixDQW5CbEIsQ0FBQTs7QUFBQSxFQW9CQSxTQUFBLEdBQVksT0FBQSxDQUFRLGNBQVIsQ0FwQlosQ0FBQTs7QUFBQSxFQXNCQSxNQUFNLENBQUMsT0FBUCxHQUNBLFFBQUEsR0FBZSxJQUFBLG1CQUFBLENBQW9CLGVBQXBCLENBdkJmLENBQUE7O0FBQUEsRUFrQ0EsUUFBUSxDQUFDLGdCQUFULENBQTBCLHFCQUExQixFQUFrRCxJQUFBLEdBQUksV0FBSixHQUFnQixtQkFBbEUsRUFBc0YsQ0FBdEYsRUFBeUYsQ0FBQyxLQUFELEVBQVEsTUFBUixFQUFnQixNQUFoQixFQUF3QixRQUF4QixFQUFrQyxNQUFsQyxF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

//# sourceURL=/Users/dawsonbotsford/.atom/packages/pigments/lib/color-expressions.coffee
