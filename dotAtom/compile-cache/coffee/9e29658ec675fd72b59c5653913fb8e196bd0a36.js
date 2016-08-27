(function() {
  var TagMacher;

  TagMacher = (function() {
    TagMacher.prototype.startRegex = /\S/;

    TagMacher.prototype.endRegex = /\S(\s+)?$/;

    function TagMacher(editor) {
      this.editor = editor;
    }

    TagMacher.prototype.lineStartsWithOpeningTag = function(bufferLine) {
      var match, scopeDescriptor;
      if (match = bufferLine.match(/\S/)) {
        scopeDescriptor = this.editor.tokenForBufferPosition([bufferRow, match.index]);
        return scopeDescriptor.scopes.indexOf('tag.open.js') > -1 && scopeDescriptor.scopes.indexOf('meta.tag.attribute-name.js') === -1;
      }
      return false;
    };

    TagMacher.prototype.lineStartWithAttribute = function(bufferLine) {
      var match, scopeDescriptor;
      if (match = bufferLine.match(/\S/)) {
        scopeDescriptor = this.editor.tokenForBufferPosition([bufferRow, match.index]);
        return scopeDescriptor.scopes.indexOf('meta.tag.attribute-name.js') > -1;
      }
      return false;
    };

    TagMacher.prototype.lineStartsWithClosingTag = function(bufferRow) {
      var match, scopeDescriptor;
      if (match = bufferLine.match(/\S/)) {
        scopeDescriptor = this.editor.tokenForBufferPosition([bufferRow, match.index]);
        return scopeDescriptor.scopes.indexOf('tag.closed.js') > -1;
      }
      return false;
    };

    return TagMacher;

  })();

  module.exports = TagMacher;

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rhd3NvbmJvdHNmb3JkLy5hdG9tL3BhY2thZ2VzL3JlYWN0L2xpYi90YWctbWF0Y2hlci5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsU0FBQTs7QUFBQSxFQUFNO0FBQ0osd0JBQUEsVUFBQSxHQUFZLElBQVosQ0FBQTs7QUFBQSx3QkFDQSxRQUFBLEdBQVUsV0FEVixDQUFBOztBQUdhLElBQUEsbUJBQUMsTUFBRCxHQUFBO0FBQ1gsTUFBQSxJQUFDLENBQUEsTUFBRCxHQUFVLE1BQVYsQ0FEVztJQUFBLENBSGI7O0FBQUEsd0JBTUEsd0JBQUEsR0FBMEIsU0FBQyxVQUFELEdBQUE7QUFDeEIsVUFBQSxzQkFBQTtBQUFBLE1BQUEsSUFBRyxLQUFBLEdBQVEsVUFBVSxDQUFDLEtBQVgsQ0FBaUIsSUFBakIsQ0FBWDtBQUNFLFFBQUEsZUFBQSxHQUFrQixJQUFDLENBQUEsTUFBTSxDQUFDLHNCQUFSLENBQStCLENBQUMsU0FBRCxFQUFZLEtBQUssQ0FBQyxLQUFsQixDQUEvQixDQUFsQixDQUFBO0FBQ0EsZUFBTyxlQUFlLENBQUMsTUFBTSxDQUFDLE9BQXZCLENBQStCLGFBQS9CLENBQUEsR0FBZ0QsQ0FBQSxDQUFoRCxJQUNBLGVBQWUsQ0FBQyxNQUFNLENBQUMsT0FBdkIsQ0FBK0IsNEJBQS9CLENBQUEsS0FBZ0UsQ0FBQSxDQUR2RSxDQUZGO09BQUE7QUFLQSxhQUFPLEtBQVAsQ0FOd0I7SUFBQSxDQU4xQixDQUFBOztBQUFBLHdCQWNBLHNCQUFBLEdBQXdCLFNBQUMsVUFBRCxHQUFBO0FBQ3RCLFVBQUEsc0JBQUE7QUFBQSxNQUFBLElBQUcsS0FBQSxHQUFRLFVBQVUsQ0FBQyxLQUFYLENBQWlCLElBQWpCLENBQVg7QUFDRSxRQUFBLGVBQUEsR0FBa0IsSUFBQyxDQUFBLE1BQU0sQ0FBQyxzQkFBUixDQUErQixDQUFDLFNBQUQsRUFBWSxLQUFLLENBQUMsS0FBbEIsQ0FBL0IsQ0FBbEIsQ0FBQTtBQUNBLGVBQU8sZUFBZSxDQUFDLE1BQU0sQ0FBQyxPQUF2QixDQUErQiw0QkFBL0IsQ0FBQSxHQUErRCxDQUFBLENBQXRFLENBRkY7T0FBQTtBQUlBLGFBQU8sS0FBUCxDQUxzQjtJQUFBLENBZHhCLENBQUE7O0FBQUEsd0JBcUJBLHdCQUFBLEdBQTBCLFNBQUMsU0FBRCxHQUFBO0FBQ3hCLFVBQUEsc0JBQUE7QUFBQSxNQUFBLElBQUcsS0FBQSxHQUFRLFVBQVUsQ0FBQyxLQUFYLENBQWlCLElBQWpCLENBQVg7QUFDRSxRQUFBLGVBQUEsR0FBa0IsSUFBQyxDQUFBLE1BQU0sQ0FBQyxzQkFBUixDQUErQixDQUFDLFNBQUQsRUFBWSxLQUFLLENBQUMsS0FBbEIsQ0FBL0IsQ0FBbEIsQ0FBQTtBQUNBLGVBQU8sZUFBZSxDQUFDLE1BQU0sQ0FBQyxPQUF2QixDQUErQixlQUEvQixDQUFBLEdBQWtELENBQUEsQ0FBekQsQ0FGRjtPQUFBO0FBSUEsYUFBTyxLQUFQLENBTHdCO0lBQUEsQ0FyQjFCLENBQUE7O3FCQUFBOztNQURGLENBQUE7O0FBQUEsRUE2QkEsTUFBTSxDQUFDLE9BQVAsR0FBaUIsU0E3QmpCLENBQUE7QUFBQSIKfQ==

//# sourceURL=/Users/dawsonbotsford/.atom/packages/react/lib/tag-matcher.coffee
