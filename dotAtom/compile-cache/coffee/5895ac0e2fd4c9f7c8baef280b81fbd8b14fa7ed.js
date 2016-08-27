(function() {
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
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rhd3NvbmJvdHNmb3JkLy5hdG9tL3BhY2thZ2VzL2V4LW1vZGUvbGliL2ZpbmQuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxFQUFBLE1BQU0sQ0FBQyxPQUFQLEdBQWlCO0FBQUEsSUFDZixZQUFBLEVBQWUsU0FBQyxNQUFELEVBQVMsT0FBVCxHQUFBO0FBQ2IsVUFBQSxLQUFBO0FBQUEsTUFBQSxLQUFBLEdBQVEsRUFBUixDQUFBO0FBQUEsTUFDQSxNQUFNLENBQUMsSUFBUCxDQUFnQixJQUFBLE1BQUEsQ0FBTyxPQUFQLEVBQWdCLEdBQWhCLENBQWhCLEVBQXNDLFNBQUMsR0FBRCxHQUFBO2VBQVMsS0FBSyxDQUFDLElBQU4sQ0FBVyxHQUFHLENBQUMsS0FBZixFQUFUO01BQUEsQ0FBdEMsQ0FEQSxDQUFBO0FBRUEsYUFBTyxLQUFQLENBSGE7SUFBQSxDQURBO0FBQUEsSUFNZixnQkFBQSxFQUFtQixTQUFDLE1BQUQsRUFBUyxNQUFULEVBQWlCLE9BQWpCLEdBQUE7QUFDakIsVUFBQSxjQUFBO0FBQUEsTUFBQSxLQUFBLEdBQVEsSUFBQyxDQUFBLFlBQUQsQ0FBYyxNQUFkLEVBQXNCLE9BQXRCLENBQVIsQ0FBQTtBQUFBLE1BQ0EsSUFBQTs7QUFBUTthQUFBLDRDQUFBO3dCQUFBO2NBQXNCLENBQUMsQ0FBQyxPQUFGLENBQVUsQ0FBQyxNQUFELEVBQVMsTUFBVCxDQUFWLENBQUEsS0FBK0I7QUFBckQsMEJBQUEsRUFBQTtXQUFBO0FBQUE7O1VBRFIsQ0FBQTtBQUVBLE1BQUEsSUFBRyxJQUFJLENBQUMsTUFBTCxHQUFjLENBQWpCO0FBQ0UsZUFBTyxJQUFLLENBQUEsQ0FBQSxDQUFFLENBQUMsS0FBSyxDQUFDLEdBQXJCLENBREY7T0FBQSxNQUVLLElBQUcsS0FBSyxDQUFDLE1BQU4sR0FBZSxDQUFsQjtBQUNILGVBQU8sS0FBTSxDQUFBLENBQUEsQ0FBRSxDQUFDLEtBQUssQ0FBQyxHQUF0QixDQURHO09BQUEsTUFBQTtBQUdILGVBQU8sSUFBUCxDQUhHO09BTFk7SUFBQSxDQU5KO0FBQUEsSUFnQmYsb0JBQUEsRUFBdUIsU0FBQyxNQUFELEVBQVMsTUFBVCxFQUFpQixPQUFqQixHQUFBO0FBQ3JCLFVBQUEsY0FBQTtBQUFBLE1BQUEsS0FBQSxHQUFRLElBQUMsQ0FBQSxZQUFELENBQWMsTUFBZCxFQUFzQixPQUF0QixDQUFSLENBQUE7QUFBQSxNQUNBLElBQUE7O0FBQVE7YUFBQSw0Q0FBQTt3QkFBQTtjQUFzQixDQUFDLENBQUMsT0FBRixDQUFVLENBQUMsTUFBRCxFQUFTLE1BQVQsQ0FBVixDQUFBLEtBQStCLENBQUE7QUFBckQsMEJBQUEsRUFBQTtXQUFBO0FBQUE7O1VBRFIsQ0FBQTtBQUVBLE1BQUEsSUFBRyxJQUFJLENBQUMsTUFBTCxHQUFjLENBQWpCO0FBQ0UsZUFBTyxJQUFLLENBQUEsSUFBSSxDQUFDLE1BQUwsR0FBYyxDQUFkLENBQWdCLENBQUMsS0FBSyxDQUFDLEdBQW5DLENBREY7T0FBQSxNQUVLLElBQUcsS0FBSyxDQUFDLE1BQU4sR0FBZSxDQUFsQjtBQUNILGVBQU8sS0FBTSxDQUFBLEtBQUssQ0FBQyxNQUFOLEdBQWUsQ0FBZixDQUFpQixDQUFDLEtBQUssQ0FBQyxHQUFyQyxDQURHO09BQUEsTUFBQTtBQUdILGVBQU8sSUFBUCxDQUhHO09BTGdCO0lBQUEsQ0FoQlI7R0FBakIsQ0FBQTtBQUFBIgp9

//# sourceURL=/Users/dawsonbotsford/.atom/packages/ex-mode/lib/find.coffee
