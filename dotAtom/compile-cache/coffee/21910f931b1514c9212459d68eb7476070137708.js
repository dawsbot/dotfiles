(function() {
  var getSearchTerm, _;

  _ = require('underscore-plus');

  getSearchTerm = function(term, modifiers) {
    var char, escaped, hasC, hasc, modFlags, term_, _i, _len;
    if (modifiers == null) {
      modifiers = {
        'g': true
      };
    }
    escaped = false;
    hasc = false;
    hasC = false;
    term_ = term;
    term = '';
    for (_i = 0, _len = term_.length; _i < _len; _i++) {
      char = term_[_i];
      if (char === '\\' && !escaped) {
        escaped = true;
        term += char;
      } else {
        if (char === 'c' && escaped) {
          hasc = true;
          term = term.slice(0, -1);
        } else if (char === 'C' && escaped) {
          hasC = true;
          term = term.slice(0, -1);
        } else if (char !== '\\') {
          term += char;
        }
        escaped = false;
      }
    }
    if (hasC) {
      modifiers['i'] = false;
    }
    if ((!hasC && !term.match('[A-Z]') && atom.config.get("vim-mode:useSmartcaseForSearch")) || hasc) {
      modifiers['i'] = true;
    }
    modFlags = Object.keys(modifiers).filter(function(key) {
      return modifiers[key];
    }).join('');
    try {
      return new RegExp(term, modFlags);
    } catch (_error) {
      return new RegExp(_.escapeRegExp(term), modFlags);
    }
  };

  module.exports = {
    findInBuffer: function(buffer, pattern) {
      var found;
      found = [];
      buffer.scan(new RegExp(pattern, 'g'), function(obj) {
        return found.push(obj.range);
      });
      return found;
    },
    findNextInBuffer: function(buffer, curPos, pattern) {
      var found, i, more;
      found = this.findInBuffer(buffer, pattern);
      more = (function() {
        var _i, _len, _results;
        _results = [];
        for (_i = 0, _len = found.length; _i < _len; _i++) {
          i = found[_i];
          if (i.compare([curPos, curPos]) === 1) {
            _results.push(i);
          }
        }
        return _results;
      })();
      if (more.length > 0) {
        return more[0].start.row;
      } else if (found.length > 0) {
        return found[0].start.row;
      } else {
        return null;
      }
    },
    findPreviousInBuffer: function(buffer, curPos, pattern) {
      var found, i, less;
      found = this.findInBuffer(buffer, pattern);
      less = (function() {
        var _i, _len, _results;
        _results = [];
        for (_i = 0, _len = found.length; _i < _len; _i++) {
          i = found[_i];
          if (i.compare([curPos, curPos]) === -1) {
            _results.push(i);
          }
        }
        return _results;
      })();
      if (less.length > 0) {
        return less[less.length - 1].start.row;
      } else if (found.length > 0) {
        return found[found.length - 1].start.row;
      } else {
        return null;
      }
    },
    scanEditor: function(term, editor, position, reverse) {
      var rangesAfter, rangesBefore, _ref;
      if (reverse == null) {
        reverse = false;
      }
      _ref = [[], []], rangesBefore = _ref[0], rangesAfter = _ref[1];
      editor.scan(getSearchTerm(term), function(_arg) {
        var isBefore, range;
        range = _arg.range;
        if (reverse) {
          isBefore = range.start.compare(position) < 0;
        } else {
          isBefore = range.start.compare(position) <= 0;
        }
        if (isBefore) {
          return rangesBefore.push(range);
        } else {
          return rangesAfter.push(range);
        }
      });
      if (reverse) {
        return rangesAfter.concat(rangesBefore).reverse();
      } else {
        return rangesAfter.concat(rangesBefore);
      }
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rhd3NvbmJvdHNmb3JkLy5hdG9tL3BhY2thZ2VzL2V4LW1vZGUvbGliL2ZpbmQuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLGdCQUFBOztBQUFBLEVBQUEsQ0FBQSxHQUFJLE9BQUEsQ0FBUSxpQkFBUixDQUFKLENBQUE7O0FBQUEsRUFFQSxhQUFBLEdBQWdCLFNBQUMsSUFBRCxFQUFPLFNBQVAsR0FBQTtBQUVkLFFBQUEsb0RBQUE7O01BRnFCLFlBQVk7QUFBQSxRQUFDLEdBQUEsRUFBSyxJQUFOOztLQUVqQztBQUFBLElBQUEsT0FBQSxHQUFVLEtBQVYsQ0FBQTtBQUFBLElBQ0EsSUFBQSxHQUFPLEtBRFAsQ0FBQTtBQUFBLElBRUEsSUFBQSxHQUFPLEtBRlAsQ0FBQTtBQUFBLElBR0EsS0FBQSxHQUFRLElBSFIsQ0FBQTtBQUFBLElBSUEsSUFBQSxHQUFPLEVBSlAsQ0FBQTtBQUtBLFNBQUEsNENBQUE7dUJBQUE7QUFDRSxNQUFBLElBQUcsSUFBQSxLQUFRLElBQVIsSUFBaUIsQ0FBQSxPQUFwQjtBQUNFLFFBQUEsT0FBQSxHQUFVLElBQVYsQ0FBQTtBQUFBLFFBQ0EsSUFBQSxJQUFRLElBRFIsQ0FERjtPQUFBLE1BQUE7QUFJRSxRQUFBLElBQUcsSUFBQSxLQUFRLEdBQVIsSUFBZ0IsT0FBbkI7QUFDRSxVQUFBLElBQUEsR0FBTyxJQUFQLENBQUE7QUFBQSxVQUNBLElBQUEsR0FBTyxJQUFLLGFBRFosQ0FERjtTQUFBLE1BR0ssSUFBRyxJQUFBLEtBQVEsR0FBUixJQUFnQixPQUFuQjtBQUNILFVBQUEsSUFBQSxHQUFPLElBQVAsQ0FBQTtBQUFBLFVBQ0EsSUFBQSxHQUFPLElBQUssYUFEWixDQURHO1NBQUEsTUFHQSxJQUFHLElBQUEsS0FBVSxJQUFiO0FBQ0gsVUFBQSxJQUFBLElBQVEsSUFB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

//# sourceURL=/Users/dawsonbotsford/.atom/packages/ex-mode/lib/find.coffee
