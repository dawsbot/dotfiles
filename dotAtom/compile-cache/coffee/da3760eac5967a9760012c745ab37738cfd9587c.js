(function() {
  var Palette;

  module.exports = Palette = (function() {
    Palette.deserialize = function(state) {
      return new Palette(state.variables);
    };

    function Palette(variables) {
      this.variables = variables != null ? variables : [];
    }

    Palette.prototype.getTitle = function() {
      return 'Palette';
    };

    Palette.prototype.getURI = function() {
      return 'pigments://palette';
    };

    Palette.prototype.getIconName = function() {
      return "pigments";
    };

    Palette.prototype.sortedByColor = function() {
      return this.variables.slice().sort((function(_this) {
        return function(_arg, _arg1) {
          var a, b;
          a = _arg.color;
          b = _arg1.color;
          return _this.compareColors(a, b);
        };
      })(this));
    };

    Palette.prototype.sortedByName = function() {
      var collator;
      collator = new Intl.Collator("en-US", {
        numeric: true
      });
      return this.variables.slice().sort(function(_arg, _arg1) {
        var a, b;
        a = _arg.name;
        b = _arg1.name;
        return collator.compare(a, b);
      });
    };

    Palette.prototype.getColorsNames = function() {
      return this.variables.map(function(v) {
        return v.name;
      });
    };

    Palette.prototype.getColorsCount = function() {
      return this.variables.length;
    };

    Palette.prototype.eachColor = function(iterator) {
      var v, _i, _len, _ref, _results;
      _ref = this.variables;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        v = _ref[_i];
        _results.push(iterator(v));
      }
      return _results;
    };

    Palette.prototype.compareColors = function(a, b) {
      var aHue, aLightness, aSaturation, bHue, bLightness, bSaturation, _ref, _ref1;
      _ref = a.hsl, aHue = _ref[0], aSaturation = _ref[1], aLightness = _ref[2];
      _ref1 = b.hsl, bHue = _ref1[0], bSaturation = _ref1[1], bLightness = _ref1[2];
      if (aHue < bHue) {
        return -1;
      } else if (aHue > bHue) {
        return 1;
      } else if (aSaturation < bSaturation) {
        return -1;
      } else if (aSaturation > bSaturation) {
        return 1;
      } else if (aLightness < bLightness) {
        return -1;
      } else if (aLightness > bLightness) {
        return 1;
      } else {
        return 0;
      }
    };

    Palette.prototype.serialize = function() {
      return {
        deserializer: 'Palette',
        variables: this.variables
      };
    };

    return Palette;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rhd3NvbmJvdHNmb3JkLy5hdG9tL3BhY2thZ2VzL3BpZ21lbnRzL2xpYi9wYWxldHRlLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUNBO0FBQUEsTUFBQSxPQUFBOztBQUFBLEVBQUEsTUFBTSxDQUFDLE9BQVAsR0FDTTtBQUNKLElBQUEsT0FBQyxDQUFBLFdBQUQsR0FBYyxTQUFDLEtBQUQsR0FBQTthQUFlLElBQUEsT0FBQSxDQUFRLEtBQUssQ0FBQyxTQUFkLEVBQWY7SUFBQSxDQUFkLENBQUE7O0FBRWEsSUFBQSxpQkFBRSxTQUFGLEdBQUE7QUFBaUIsTUFBaEIsSUFBQyxDQUFBLGdDQUFBLFlBQVUsRUFBSyxDQUFqQjtJQUFBLENBRmI7O0FBQUEsc0JBSUEsUUFBQSxHQUFVLFNBQUEsR0FBQTthQUFHLFVBQUg7SUFBQSxDQUpWLENBQUE7O0FBQUEsc0JBTUEsTUFBQSxHQUFRLFNBQUEsR0FBQTthQUFHLHFCQUFIO0lBQUEsQ0FOUixDQUFBOztBQUFBLHNCQVFBLFdBQUEsR0FBYSxTQUFBLEdBQUE7YUFBRyxXQUFIO0lBQUEsQ0FSYixDQUFBOztBQUFBLHNCQVVBLGFBQUEsR0FBZSxTQUFBLEdBQUE7YUFDYixJQUFDLENBQUEsU0FBUyxDQUFDLEtBQVgsQ0FBQSxDQUFrQixDQUFDLElBQW5CLENBQXdCLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFDLElBQUQsRUFBWSxLQUFaLEdBQUE7QUFBMEIsY0FBQSxJQUFBO0FBQUEsVUFBbEIsSUFBUCxLQUFDLEtBQXdCLENBQUE7QUFBQSxVQUFQLElBQVAsTUFBQyxLQUFhLENBQUE7aUJBQUEsS0FBQyxDQUFBLGFBQUQsQ0FBZSxDQUFmLEVBQWlCLENBQWpCLEVBQTFCO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBeEIsRUFEYTtJQUFBLENBVmYsQ0FBQTs7QUFBQSxzQkFhQSxZQUFBLEdBQWMsU0FBQSxHQUFBO0FBQ1osVUFBQSxRQUFBO0FBQUEsTUFBQSxRQUFBLEdBQWUsSUFBQSxJQUFJLENBQUMsUUFBTCxDQUFjLE9BQWQsRUFBdUI7QUFBQSxRQUFBLE9BQUEsRUFBUyxJQUFUO09BQXZCLENBQWYsQ0FBQTthQUNBLElBQUMsQ0FBQSxTQUFTLENBQUMsS0FBWCxDQUFBLENBQWtCLENBQUMsSUFBbkIsQ0FBd0IsU0FBQyxJQUFELEVBQVcsS0FBWCxHQUFBO0FBQXdCLFlBQUEsSUFBQTtBQUFBLFFBQWpCLElBQU4sS0FBQyxJQUFzQixDQUFBO0FBQUEsUUFBUCxJQUFOLE1BQUMsSUFBWSxDQUFBO2VBQUEsUUFBUSxDQUFDLE9BQVQsQ0FBaUIsQ0FBakIsRUFBbUIsQ0FBbkIsRUFBeEI7TUFBQSxDQUF4QixFQUZZO0lBQUEsQ0FiZCxDQUFBOztBQUFBLHNCQWlCQSxjQUFBLEdBQWdCLFNBQUEsR0FBQTthQUFHLElBQUMsQ0FBQSxTQUFTLENBQUMsR0FBWCxDQUFlLFNBQUMsQ0FBRCxHQUFBO2VBQU8sQ0FBQyxDQUFDLEtBQVQ7TUFBQSxDQUFmLEVBQUg7SUFBQSxDQWpCaEIsQ0FBQTs7QUFBQSxzQkFtQkEsY0FBQSxHQUFnQixTQUFBLEdBQUE7YUFBRyxJQUFDLENBQUEsU0FBUyxDQUFDLE9BQWQ7SUFBQSxDQW5CaEIsQ0FBQTs7QUFBQSxzQkFxQkEsU0FBQSxHQUFXLFNBQUMsUUFBRCxHQUFBO0FBQWMsVUFBQSwyQkFBQTtBQUFBO0FBQUE7V0FBQSwyQ0FBQTtxQkFBQTtBQUFBLHNCQUFBLFFBQUEsQ0FBUyxDQUFULEVBQUEsQ0FBQTtBQUFBO3NCQUFkO0lBQUEsQ0FyQlgsQ0FBQTs7QUFBQSxzQkF1QkEsYUFBQSxHQUFlLFNBQUMsQ0FBRCxFQUFHLENBQUgsR0FBQTtBQUNiLFVBQUEseUVBQUE7QUFBQSxNQUFBLE9BQWtDLENBQUMsQ0FBQyxHQUFwQyxFQUFDLGNBQUQsRUFBTyxxQkFBUCxFQUFvQixvQkFBcEIsQ0FBQTtBQUFBLE1BQ0EsUUFBa0MsQ0FBQyxDQUFDLEdBQXBDLEVBQUMsZUFBRCxFQUFPLHNCQUFQLEVBQW9CLHFCQURwQixDQUFBO0FBRUEsTUFBQSxJQUFHLElBQUEsR0FBTyxJQUFWO2VBQ0UsQ0FBQSxFQURGO09BQUEsTUFFSyxJQUFHLElBQUEsR0FBTyxJQUFWO2VBQ0gsRUFERztPQUFBLE1BRUEsSUFBRyxXQUFBLEdBQWMsV0FBakI7ZUFDSCxDQUFBLEVBREc7T0FBQSxNQUVBLElBQUcsV0FBQSxHQUFjLFdBQWpCO2VBQ0gsRUFERztPQUFBLE1BRUEsSUFBRyxVQUFBLEdBQWEsVUFBaEI7ZUFDSCxDQUFBLEVBREc7T0FBQSxNQUVBLElBQUcsVUFBQSxHQUFhLFVBQWhCO2VBQ0gsRUFERztPQUFBLE1BQUE7ZUFHSCxFQUhHO09BYlE7SUFBQSxDQXZCZixDQUFBOztBQUFBLHNCQXlDQSxTQUFBLEdBQVcsU0FBQSxHQUFBO2FBQ1Q7QUFBQSxRQUNFLFlBQUEsRUFBYyxTQURoQjtBQUFBLFFBRUcsV0FBRCxJQUFDLENBQUEsU0FGSDtRQURTO0lBQUEsQ0F6Q1gsQ0FBQTs7bUJBQUE7O01BRkYsQ0FBQTtBQUFBIgp9

//# sourceURL=/Users/dawsonbotsford/.atom/packages/pigments/lib/palette.coffee
