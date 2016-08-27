(function() {
  beforeEach(function() {
    var compare;
    compare = function(a, b, p) {
      return Math.abs(b - a) < (Math.pow(10, -p) / 2);
    };
    return this.addMatchers({
      toBeComponentArrayCloseTo: function(arr, precision) {
        var notText;
        if (precision == null) {
          precision = 0;
        }
        notText = this.isNot ? " not" : "";
        this.message = (function(_this) {
          return function() {
            return "Expected " + (jasmine.pp(_this.actual)) + " to" + notText + " be an array whose values are close to " + (jasmine.pp(arr)) + " with a precision of " + precision;
          };
        })(this);
        if (this.actual.length !== arr.length) {
          return false;
        }
        return this.actual.every(function(value, i) {
          return compare(value, arr[i], precision);
        });
      },
      toBeValid: function() {
        var notText;
        notText = this.isNot ? " not" : "";
        this.message = (function(_this) {
          return function() {
            return "Expected " + (jasmine.pp(_this.actual)) + " to" + notText + " be a valid color";
          };
        })(this);
        return this.actual.isValid();
      },
      toBeColor: function(colorOrRed, green, blue, alpha) {
        var color, hex, notText, red;
        if (green == null) {
          green = 0;
        }
        if (blue == null) {
          blue = 0;
        }
        if (alpha == null) {
          alpha = 1;
        }
        color = (function() {
          switch (typeof colorOrRed) {
            case 'object':
              return colorOrRed;
            case 'number':
              return {
                red: colorOrRed,
                green: green,
                blue: blue,
                alpha: alpha
              };
            case 'string':
              colorOrRed = colorOrRed.replace(/#|0x/, '');
              hex = parseInt(colorOrRed, 16);
              switch (colorOrRed.length) {
                case 8:
                  alpha = (hex >> 24 & 0xff) / 255;
                  red = hex >> 16 & 0xff;
                  green = hex >> 8 & 0xff;
                  blue = hex & 0xff;
                  break;
                case 6:
                  red = hex >> 16 & 0xff;
                  green = hex >> 8 & 0xff;
                  blue = hex & 0xff;
                  break;
                case 3:
                  red = (hex >> 8 & 0xf) * 17;
                  green = (hex >> 4 & 0xf) * 17;
                  blue = (hex & 0xf) * 17;
                  break;
                default:
                  red = 0;
                  green = 0;
                  blue = 0;
                  alpha = 1;
              }
              return {
                red: red,
                green: green,
                blue: blue,
                alpha: alpha
              };
            default:
              return {
                red: 0,
                green: 0,
                blue: 0,
                alpha: 1
              };
          }
        })();
        notText = this.isNot ? " not" : "";
        this.message = (function(_this) {
          return function() {
            return "Expected " + (jasmine.pp(_this.actual)) + " to" + notText + " be a color equal to " + (jasmine.pp(color));
          };
        })(this);
        return Math.round(this.actual.red) === color.red && Math.round(this.actual.green) === color.green && Math.round(this.actual.blue) === color.blue && compare(this.actual.alpha, color.alpha, 1);
      }
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rhd3NvbmJvdHNmb3JkLy5hdG9tL3BhY2thZ2VzL3BpZ21lbnRzL3NwZWMvaGVscGVycy9tYXRjaGVycy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFDQTtBQUFBLEVBQUEsVUFBQSxDQUFXLFNBQUEsR0FBQTtBQUNULFFBQUEsT0FBQTtBQUFBLElBQUEsT0FBQSxHQUFVLFNBQUMsQ0FBRCxFQUFHLENBQUgsRUFBSyxDQUFMLEdBQUE7YUFBVyxJQUFJLENBQUMsR0FBTCxDQUFTLENBQUEsR0FBSSxDQUFiLENBQUEsR0FBa0IsQ0FBQyxJQUFJLENBQUMsR0FBTCxDQUFTLEVBQVQsRUFBYSxDQUFBLENBQWIsQ0FBQSxHQUFtQixDQUFwQixFQUE3QjtJQUFBLENBQVYsQ0FBQTtXQUVBLElBQUMsQ0FBQSxXQUFELENBQ0U7QUFBQSxNQUFBLHlCQUFBLEVBQTJCLFNBQUMsR0FBRCxFQUFNLFNBQU4sR0FBQTtBQUN6QixZQUFBLE9BQUE7O1VBRCtCLFlBQVU7U0FDekM7QUFBQSxRQUFBLE9BQUEsR0FBYSxJQUFDLENBQUEsS0FBSixHQUFlLE1BQWYsR0FBMkIsRUFBckMsQ0FBQTtBQUFBLFFBQ0EsSUFBSSxDQUFDLE9BQUwsR0FBZSxDQUFBLFNBQUEsS0FBQSxHQUFBO2lCQUFBLFNBQUEsR0FBQTttQkFBSSxXQUFBLEdBQVUsQ0FBQyxPQUFPLENBQUMsRUFBUixDQUFXLEtBQUMsQ0FBQSxNQUFaLENBQUQsQ0FBVixHQUErQixLQUEvQixHQUFvQyxPQUFwQyxHQUE0Qyx5Q0FBNUMsR0FBb0YsQ0FBQyxPQUFPLENBQUMsRUFBUixDQUFXLEdBQVgsQ0FBRCxDQUFwRixHQUFxRyx1QkFBckcsR0FBNEgsVUFBaEk7VUFBQSxFQUFBO1FBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQURmLENBQUE7QUFHQSxRQUFBLElBQWdCLElBQUMsQ0FB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

//# sourceURL=/Users/dawsonbotsford/.atom/packages/pigments/spec/helpers/matchers.coffee
