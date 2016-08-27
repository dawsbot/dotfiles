(function() {
  var linkPaths, regex, template;

  regex = /((?:\w:)?\/?(?:[-\w.]+\/)*[-\w.]+):(\d+)(?::(\d+))?/g;

  template = '<a class="-linked-path" data-path="$1" data-line="$2" data-column="$3">$&</a>';

  module.exports = linkPaths = function(lines) {
    return lines.replace(regex, template);
  };

  linkPaths.listen = function(parentView) {
    return parentView.on('click', '.-linked-path', function(event) {
      var column, el, line, path, _ref;
      el = this;
      _ref = el.dataset, path = _ref.path, line = _ref.line, column = _ref.column;
      line = Number(line) - 1;
      column = column ? Number(column) - 1 : 0;
      return atom.workspace.open(path, {
        initialLine: line,
        initialColumn: column
      });
    });
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rhd3NvbmJvdHNmb3JkLy5hdG9tL3BhY2thZ2VzL3NjcmlwdC9saWIvbGluay1wYXRocy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsMEJBQUE7O0FBQUEsRUFBQSxLQUFBLEdBQVEsc0RBQVIsQ0FBQTs7QUFBQSxFQU1BLFFBQUEsR0FBVywrRUFOWCxDQUFBOztBQUFBLEVBUUEsTUFBTSxDQUFDLE9BQVAsR0FBaUIsU0FBQSxHQUFZLFNBQUMsS0FBRCxHQUFBO1dBQzNCLEtBQUssQ0FBQyxPQUFOLENBQWMsS0FBZCxFQUFxQixRQUFyQixFQUQyQjtFQUFBLENBUjdCLENBQUE7O0FBQUEsRUFXQSxTQUFTLENBQUMsTUFBVixHQUFtQixTQUFDLFVBQUQsR0FBQTtXQUNqQixVQUFVLENBQUMsRUFBWCxDQUFjLE9BQWQsRUFBdUIsZUFBdkIsRUFBd0MsU0FBQyxLQUFELEdBQUE7QUFDdEMsVUFBQSw0QkFBQTtBQUFBLE1BQUEsRUFBQSxHQUFLLElBQUwsQ0FBQTtBQUFBLE1BQ0EsT0FBdUIsRUFBRSxDQUFDLE9BQTFCLEVBQUMsWUFBQSxJQUFELEVBQU8sWUFBQSxJQUFQLEVBQWEsY0FBQSxNQURiLENBQUE7QUFBQSxNQUVBLElBQUEsR0FBTyxNQUFBLENBQU8sSUFBUCxDQUFBLEdBQWUsQ0FGdEIsQ0FBQTtBQUFBLE1BSUEsTUFBQSxHQUFZLE1BQUgsR0FBZSxNQUFBLENBQU8sTUFBUCxDQUFBLEdBQWlCLENBQWhDLEdBQXVDLENBSmhELENBQUE7YUFNQSxJQUFJLENBQUMsU0FBUyxDQUFDLElBQWYsQ0FBb0IsSUFBcEIsRUFBMEI7QUFBQSxRQUN4QixXQUFBLEVBQWEsSUFEVztBQUFBLFFBRXhCLGFBQUEsRUFBZSxNQUZTO09BQTFCLEVBUHNDO0lBQUEsQ0FBeEMsRUFEaUI7RUFBQSxDQVhuQixDQUFBO0FBQUEiCn0=

//# sourceURL=/Users/dawsonbotsford/.atom/packages/script/lib/link-paths.coffee
