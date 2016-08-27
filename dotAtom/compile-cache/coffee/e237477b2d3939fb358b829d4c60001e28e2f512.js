(function() {
  var BackgroundRenderer, RegionRenderer,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  RegionRenderer = require('./region-renderer');

  module.exports = BackgroundRenderer = (function(_super) {
    __extends(BackgroundRenderer, _super);

    function BackgroundRenderer() {
      return BackgroundRenderer.__super__.constructor.apply(this, arguments);
    }

    BackgroundRenderer.prototype.includeTextInRegion = true;

    BackgroundRenderer.prototype.render = function(colorMarker) {
      var color, colorText, l, region, regions, _i, _len;
      color = colorMarker != null ? colorMarker.color : void 0;
      if (color == null) {
        return {};
      }
      regions = this.renderRegions(colorMarker);
      l = color.luma;
      colorText = l > 0.43 ? 'black' : 'white';
      for (_i = 0, _len = regions.length; _i < _len; _i++) {
        region = regions[_i];
        if (region != null) {
          this.styleRegion(region, color.toCSS(), colorText);
        }
      }
      return {
        regions: regions
      };
    };

    BackgroundRenderer.prototype.styleRegion = function(region, color, textColor) {
      region.classList.add('background');
      region.style.backgroundColor = color;
      return region.style.color = textColor;
    };

    return BackgroundRenderer;

  })(RegionRenderer);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rhd3NvbmJvdHNmb3JkLy5hdG9tL3BhY2thZ2VzL3BpZ21lbnRzL2xpYi9yZW5kZXJlcnMvYmFja2dyb3VuZC5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsa0NBQUE7SUFBQTttU0FBQTs7QUFBQSxFQUFBLGNBQUEsR0FBaUIsT0FBQSxDQUFRLG1CQUFSLENBQWpCLENBQUE7O0FBQUEsRUFFQSxNQUFNLENBQUMsT0FBUCxHQUNNO0FBQ0oseUNBQUEsQ0FBQTs7OztLQUFBOztBQUFBLGlDQUFBLG1CQUFBLEdBQXFCLElBQXJCLENBQUE7O0FBQUEsaUNBQ0EsTUFBQSxHQUFRLFNBQUMsV0FBRCxHQUFBO0FBQ04sVUFBQSw4Q0FBQTtBQUFBLE1BQUEsS0FBQSx5QkFBUSxXQUFXLENBQUUsY0FBckIsQ0FBQTtBQUVBLE1BQUEsSUFBaUIsYUFBakI7QUFBQSxlQUFPLEVBQVAsQ0FBQTtPQUZBO0FBQUEsTUFJQSxPQUFBLEdBQVUsSUFBQyxDQUFBLGFBQUQsQ0FBZSxXQUFmLENBSlYsQ0FBQTtBQUFBLE1BTUEsQ0FBQSxHQUFJLEtBQUssQ0FBQyxJQU5WLENBQUE7QUFBQSxNQVFBLFNBQUEsR0FBZSxDQUFBLEdBQUksSUFBUCxHQUFpQixPQUFqQixHQUE4QixPQVIxQyxDQUFBO0FBU0EsV0FBQSw4Q0FBQTs2QkFBQTtZQUEwRTtBQUExRSxVQUFBLElBQUMsQ0FBQSxXQUFELENBQWEsTUFBYixFQUFxQixLQUFLLENBQUMsS0FBTixDQUFBLENBQXJCLEVBQW9DLFNBQXBDLENBQUE7U0FBQTtBQUFBLE9BVEE7YUFVQTtBQUFBLFFBQUMsU0FBQSxPQUFEO1FBWE07SUFBQSxDQURSLENBQUE7O0FBQUEsaUNBY0EsV0FBQSxHQUFhLFNBQUMsTUFBRCxFQUFTLEtBQVQsRUFBZ0IsU0FBaEIsR0FBQTtBQUNYLE1BQUEsTUFBTSxDQUFDLFNBQVMsQ0FBQyxHQUFqQixDQUFxQixZQUFyQixDQUFBLENBQUE7QUFBQSxNQUVBLE1BQU0sQ0FBQyxLQUFLLENBQUMsZUFBYixHQUErQixLQUYvQixDQUFBO2FBR0EsTUFBTSxDQUFDLEtBQUssQ0FBQyxLQUFiLEdBQXFCLFVBSlY7SUFBQSxDQWRiLENBQUE7OzhCQUFBOztLQUQrQixlQUhqQyxDQUFBO0FBQUEiCn0=

//# sourceURL=/Users/dawsonbotsford/.atom/packages/pigments/lib/renderers/background.coffee
