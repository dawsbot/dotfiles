(function() {
  var _;

  _ = require('underscore');

  module.exports = {
    splitStatements: function(code) {
      var iterator, statements;
      iterator = function(statements, currentCharacter, _memo, _context) {
        if (this.parenDepth == null) {
          this.parenDepth = 0;
        }
        if (currentCharacter === '(') {
          this.parenDepth += 1;
          this.inStatement = true;
        } else if (currentCharacter === ')') {
          this.parenDepth -= 1;
        }
        if (this.statement == null) {
          this.statement = '';
        }
        this.statement += currentCharacter;
        if (this.parenDepth === 0 && this.inStatement) {
          this.inStatement = false;
          statements.push(this.statement.trim());
          this.statement = '';
        }
        return statements;
      };
      statements = _.reduce(code.trim(), iterator, [], {});
      return statements;
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rhd3NvbmJvdHNmb3JkLy5hdG9tL3BhY2thZ2VzL3NjcmlwdC9saWIvZ3JhbW1hci11dGlscy9saXNwLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxDQUFBOztBQUFBLEVBQUEsQ0FBQSxHQUFJLE9BQUEsQ0FBUSxZQUFSLENBQUosQ0FBQTs7QUFBQSxFQUlBLE1BQU0sQ0FBQyxPQUFQLEdBSUU7QUFBQSxJQUFBLGVBQUEsRUFBaUIsU0FBQyxJQUFELEdBQUE7QUFDZixVQUFBLG9CQUFBO0FBQUEsTUFBQSxRQUFBLEdBQVcsU0FBQyxVQUFELEVBQWEsZ0JBQWIsRUFBK0IsS0FBL0IsRUFBc0MsUUFBdEMsR0FBQTs7VUFDVCxJQUFDLENBQUEsYUFBYztTQUFmO0FBQ0EsUUFBQSxJQUFHLGdCQUFBLEtBQW9CLEdBQXZCO0FBQ0UsVUFBQSxJQUFDLENBQUEsVUFBRCxJQUFlLENBQWYsQ0FBQTtBQUFBLFVBQ0EsSUFBQyxDQUFBLFdBQUQsR0FBZSxJQURmLENBREY7U0FBQSxNQUdLLElBQUcsZ0JBQUEsS0FBb0IsR0FBdkI7QUFDSCxVQUFBLElBQUMsQ0FBQSxVQUFELElBQWUsQ0FBZixDQURHO1NBSkw7O1VBT0EsSUFBQyxDQUFBLFlBQWE7U0FQZDtBQUFBLFFBUUEsSUFBQyxDQUFBLFNBQUQsSUFBYyxnQkFSZCxDQUFBO0FBVUEsUUFBQSxJQUFHLElBQUMsQ0FBQSxVQUFELEtBQWUsQ0FBZixJQUFxQixJQUFDLENBQUEsV0FBekI7QUFDRSxVQUFBLElBQUMsQ0FBQSxXQUFELEdBQWUsS0FBZixDQUFBO0FBQUEsVUFDQSxVQUFVLENBQUMsSUFBWCxDQUFnQixJQUFDLENBQUEsU0FBUyxDQUFDLElBQVgsQ0FBQSxDQUFoQixDQURBLENBQUE7QUFBQSxVQUVBLElBQUMsQ0FBQSxTQUFELEdBQWEsRUFGYixDQURGO1NBVkE7QUFlQSxlQUFPLFVBQVAsQ0FoQlM7TUFBQSxDQUFYLENBQUE7QUFBQSxNQWtCQSxVQUFBLEdBQWEsQ0FBQyxDQUFDLE1BQUYsQ0FBUyxJQUFJLENBQUMsSUFBTCxDQUFBLENBQVQsRUFBc0IsUUFBdEIsRUFBZ0MsRUFBaEMsRUFBb0MsRUFBcEMsQ0FsQmIsQ0FBQTtBQW9CQSxhQUFPLFVBQVAsQ0FyQmU7SUFBQSxDQUFqQjtHQVJGLENBQUE7QUFBQSIKfQ==

//# sourceURL=/Users/dawsonbotsford/.atom/packages/script/lib/grammar-utils/lisp.coffee
