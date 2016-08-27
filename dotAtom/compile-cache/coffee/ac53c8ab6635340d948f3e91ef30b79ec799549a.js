(function() {
  var ColorMarker, CompositeDisposable, fill;

  CompositeDisposable = require('atom').CompositeDisposable;

  fill = require('./utils').fill;

  module.exports = ColorMarker = (function() {
    function ColorMarker(_arg) {
      this.marker = _arg.marker, this.color = _arg.color, this.text = _arg.text, this.invalid = _arg.invalid, this.colorBuffer = _arg.colorBuffer;
      this.id = this.marker.id;
      this.subscriptions = new CompositeDisposable;
      this.subscriptions.add(this.marker.onDidDestroy((function(_this) {
        return function() {
          return _this.markerWasDestroyed();
        };
      })(this)));
      this.subscriptions.add(this.marker.onDidChange((function(_this) {
        return function() {
          if (_this.marker.isValid()) {
            _this.invalidateScreenRangeCache();
            return _this.checkMarkerScope();
          } else {
            return _this.destroy();
          }
        };
      })(this)));
      this.checkMarkerScope();
    }

    ColorMarker.prototype.destroy = function() {
      if (this.destroyed) {
        return;
      }
      return this.marker.destroy();
    };

    ColorMarker.prototype.markerWasDestroyed = function() {
      var _ref;
      if (this.destroyed) {
        return;
      }
      this.subscriptions.dispose();
      _ref = {}, this.marker = _ref.marker, this.color = _ref.color, this.text = _ref.text, this.colorBuffer = _ref.colorBuffer;
      return this.destroyed = true;
    };

    ColorMarker.prototype.match = function(properties) {
      var bool;
      if (this.destroyed) {
        return false;
      }
      bool = true;
      if (properties.bufferRange != null) {
        bool && (bool = this.marker.getBufferRange().isEqual(properties.bufferRange));
      }
      if (properties.color != null) {
        bool && (bool = properties.color.isEqual(this.color));
      }
      if (properties.match != null) {
        bool && (bool = properties.match === this.text);
      }
      if (properties.text != null) {
        bool && (bool = properties.text === this.text);
      }
      return bool;
    };

    ColorMarker.prototype.serialize = function() {
      var out;
      if (this.destroyed) {
        return;
      }
      out = {
        markerId: String(this.marker.id),
        bufferRange: this.marker.getBufferRange().serialize(),
        color: this.color.serialize(),
        text: this.text,
        variables: this.color.variables
      };
      if (!this.color.isValid()) {
        out.invalid = true;
      }
      return out;
    };

    ColorMarker.prototype.checkMarkerScope = function(forceEvaluation) {
      var e, range, scope, scopeChain, _ref;
      if (forceEvaluation == null) {
        forceEvaluation = false;
      }
      if (this.destroyed || (this.colorBuffer == null)) {
        return;
      }
      range = this.marker.getBufferRange();
      try {
        scope = this.colorBuffer.editor.scopeDescriptorForBufferPosition != null ? this.colorBuffer.editor.scopeDescriptorForBufferPosition(range.start) : this.colorBuffer.editor.displayBuffer.scopeDescriptorForBufferPosition(range.start);
        scopeChain = scope.getScopeChain();
        if (!scopeChain || (!forceEvaluation && scopeChain === this.lastScopeChain)) {
          return;
        }
        this.ignored = ((_ref = this.colorBuffer.ignoredScopes) != null ? _ref : []).some(function(scopeRegExp) {
          return scopeChain.match(scopeRegExp);
        });
        return this.lastScopeChain = scopeChain;
      } catch (_error) {
        e = _error;
        return console.error(e);
      }
    };

    ColorMarker.prototype.isIgnored = function() {
      return this.ignored;
    };

    ColorMarker.prototype.getBufferRange = function() {
      return this.marker.getBufferRange();
    };

    ColorMarker.prototype.getScreenRange = function() {
      var _ref;
      return this.screenRangeCache != null ? this.screenRangeCache : this.screenRangeCache = (_ref = this.marker) != null ? _ref.getScreenRange() : void 0;
    };

    ColorMarker.prototype.invalidateScreenRangeCache = function() {
      return this.screenRangeCache = null;
    };

    ColorMarker.prototype.convertContentToHex = function() {
      return this.convertContentInPlace('hex');
    };

    ColorMarker.prototype.convertContentToRGB = function() {
      return this.convertContentInPlace('rgb');
    };

    ColorMarker.prototype.convertContentToRGBA = function() {
      return this.convertContentInPlace('rgba');
    };

    ColorMarker.prototype.convertContentToHSL = function() {
      return this.convertContentInPlace('hsl');
    };

    ColorMarker.prototype.convertContentToHSLA = function() {
      return this.convertContentInPlace('hsla');
    };

    ColorMarker.prototype.copyContentAsHex = function() {
      return atom.clipboard.write(this.convertContent('hex'));
    };

    ColorMarker.prototype.copyContentAsRGB = function() {
      return atom.clipboard.write(this.convertContent('rgb'));
    };

    ColorMarker.prototype.copyContentAsRGBA = function() {
      return atom.clipboard.write(this.convertContent('rgba'));
    };

    ColorMarker.prototype.copyContentAsHSL = function() {
      return atom.clipboard.write(this.convertContent('hsl'));
    };

    ColorMarker.prototype.copyContentAsHSLA = function() {
      return atom.clipboard.write(this.convertContent('hsla'));
    };

    ColorMarker.prototype.convertContentInPlace = function(mode) {
      return this.colorBuffer.editor.getBuffer().setTextInRange(this.marker.getBufferRange(), this.convertContent(mode));
    };

    ColorMarker.prototype.convertContent = function(mode) {
      switch (mode) {
        case 'hex':
          return '#' + fill(this.color.hex, 6);
        case 'rgb':
          return "rgb(" + (Math.round(this.color.red)) + ", " + (Math.round(this.color.green)) + ", " + (Math.round(this.color.blue)) + ")";
        case 'rgba':
          return "rgba(" + (Math.round(this.color.red)) + ", " + (Math.round(this.color.green)) + ", " + (Math.round(this.color.blue)) + ", " + this.color.alpha + ")";
        case 'hsl':
          return "hsl(" + (Math.round(this.color.hue)) + ", " + (Math.round(this.color.saturation)) + "%, " + (Math.round(this.color.lightness)) + "%)";
        case 'hsla':
          return "hsla(" + (Math.round(this.color.hue)) + ", " + (Math.round(this.color.saturation)) + "%, " + (Math.round(this.color.lightness)) + "%, " + this.color.alpha + ")";
      }
    };

    return ColorMarker;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rhd3NvbmJvdHNmb3JkLy5hdG9tL3BhY2thZ2VzL3BpZ21lbnRzL2xpYi9jb2xvci1tYXJrZXIuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHNDQUFBOztBQUFBLEVBQUMsc0JBQXVCLE9BQUEsQ0FBUSxNQUFSLEVBQXZCLG1CQUFELENBQUE7O0FBQUEsRUFDQyxPQUFRLE9BQUEsQ0FBUSxTQUFSLEVBQVIsSUFERCxDQUFBOztBQUFBLEVBR0EsTUFBTSxDQUFDLE9BQVAsR0FDTTtBQUNTLElBQUEscUJBQUMsSUFBRCxHQUFBO0FBQ1gsTUFEYSxJQUFDLENBQUEsY0FBQSxRQUFRLElBQUMsQ0FBQSxhQUFBLE9BQU8sSUFBQyxDQUFBLFlBQUEsTUFBTSxJQUFDLENBQUEsZUFBQSxTQUFTLElBQUMsQ0FBQSxtQkFBQSxXQUNoRCxDQUFBO0FBQUEsTUFBQSxJQUFDLENBQUEsRUFBRCxHQUFNLElBQUMsQ0FBQSxNQUFNLENBQUMsRUFBZCxDQUFBO0FBQUEsTUFDQSxJQUFDLENBQUEsYUFBRCxHQUFpQixHQUFBLENBQUEsbUJBRGpCLENBQUE7QUFBQSxNQUVBLElBQUMsQ0FBQSxhQUFhLENBQUMsR0FBZixDQUFtQixJQUFDLENBQUEsTUFBTSxDQUFDLFlBQVIsQ0FBcUIsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUEsR0FBQTtpQkFBRyxLQUFDLENBQUEsa0JBQUQsQ0FBQSxFQUFIO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBckIsQ0FBbkIsQ0FGQSxDQUFBO0FBQUEsTUFHQSxJQUFDLENBQUEsYUFBYSxDQUFDLEdBQWYsQ0FBbUIsSUFBQyxDQUFBLE1BQU0sQ0FBQyxXQUFSLENBQW9CLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFBLEdBQUE7QUFDckMsVUFBQSxJQUFH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

//# sourceURL=/Users/dawsonbotsford/.atom/packages/pigments/lib/color-marker.coffee
