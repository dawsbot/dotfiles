(function() {
  var VariableParser;

  module.exports = VariableParser = (function() {
    function VariableParser(registry) {
      this.registry = registry;
    }

    VariableParser.prototype.parse = function(expression) {
      var e, _i, _len, _ref;
      _ref = this.registry.getExpressions();
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        e = _ref[_i];
        if (e.match(expression)) {
          return e.parse(expression);
        }
      }
    };

    return VariableParser;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rhd3NvbmJvdHNmb3JkLy5hdG9tL3BhY2thZ2VzL3BpZ21lbnRzL2xpYi92YXJpYWJsZS1wYXJzZXIuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQ0E7QUFBQSxNQUFBLGNBQUE7O0FBQUEsRUFBQSxNQUFNLENBQUMsT0FBUCxHQUNNO0FBQ1MsSUFBQSx3QkFBRSxRQUFGLEdBQUE7QUFBYSxNQUFaLElBQUMsQ0FBQSxXQUFBLFFBQVcsQ0FBYjtJQUFBLENBQWI7O0FBQUEsNkJBQ0EsS0FBQSxHQUFPLFNBQUMsVUFBRCxHQUFBO0FBQ0wsVUFBQSxpQkFBQTtBQUFBO0FBQUEsV0FBQSwyQ0FBQTtxQkFBQTtBQUNFLFFBQUEsSUFBOEIsQ0FBQyxDQUFDLEtBQUYsQ0FBUSxVQUFSLENBQTlCO0FBQUEsaUJBQU8sQ0FBQyxDQUFDLEtBQUYsQ0FBUSxVQUFSLENBQVAsQ0FBQTtTQURGO0FBQUEsT0FESztJQUFBLENBRFAsQ0FBQTs7MEJBQUE7O01BRkYsQ0FBQTtBQUFBIgp9

//# sourceURL=/Users/dawsonbotsford/.atom/packages/pigments/lib/variable-parser.coffee
