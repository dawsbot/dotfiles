(function() {
  var IncreaseOperators, IndentOperators, InputOperators, Operators, Put, Replace, _;

  _ = require('underscore-plus');

  IndentOperators = require('./indent-operators');

  IncreaseOperators = require('./increase-operators');

  Put = require('./put-operator');

  InputOperators = require('./input');

  Replace = require('./replace-operator');

  Operators = require('./general-operators');

  Operators.Put = Put;

  Operators.Replace = Replace;

  _.extend(Operators, IndentOperators);

  _.extend(Operators, IncreaseOperators);

  _.extend(Operators, InputOperators);

  module.exports = Operators;

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rhd3NvbmJvdHNmb3JkLy5hdG9tL3BhY2thZ2VzL3ZpbS1tb2RlL2xpYi9vcGVyYXRvcnMvaW5kZXguY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLDhFQUFBOztBQUFBLEVBQUEsQ0FBQSxHQUFJLE9BQUEsQ0FBUSxpQkFBUixDQUFKLENBQUE7O0FBQUEsRUFDQSxlQUFBLEdBQWtCLE9BQUEsQ0FBUSxvQkFBUixDQURsQixDQUFBOztBQUFBLEVBRUEsaUJBQUEsR0FBb0IsT0FBQSxDQUFRLHNCQUFSLENBRnBCLENBQUE7O0FBQUEsRUFHQSxHQUFBLEdBQU0sT0FBQSxDQUFRLGdCQUFSLENBSE4sQ0FBQTs7QUFBQSxFQUlBLGNBQUEsR0FBaUIsT0FBQSxDQUFRLFNBQVIsQ0FKakIsQ0FBQTs7QUFBQSxFQUtBLE9BQUEsR0FBVSxPQUFBLENBQVEsb0JBQVIsQ0FMVixDQUFBOztBQUFBLEVBTUEsU0FBQSxHQUFZLE9BQUEsQ0FBUSxxQkFBUixDQU5aLENBQUE7O0FBQUEsRUFRQSxTQUFTLENBQUMsR0FBVixHQUFnQixHQVJoQixDQUFBOztBQUFBLEVBU0EsU0FBUyxDQUFDLE9BQVYsR0FBb0IsT0FUcEIsQ0FBQTs7QUFBQSxFQVVBLENBQUMsQ0FBQyxNQUFGLENBQVMsU0FBVCxFQUFvQixlQUFwQixDQVZBLENBQUE7O0FBQUEsRUFXQSxDQUFDLENBQUMsTUFBRixDQUFTLFNBQVQsRUFBb0IsaUJBQXBCLENBWEEsQ0FBQTs7QUFBQSxFQVlBLENBQUMsQ0FBQyxNQUFGLENBQVMsU0FBVCxFQUFvQixjQUFwQixDQVpBLENBQUE7O0FBQUEsRUFhQSxNQUFNLENBQUMsT0FBUCxHQUFpQixTQWJqQixDQUFBO0FBQUEiCn0=

//# sourceURL=/Users/dawsonbotsford/.atom/packages/vim-mode/lib/operators/index.coffee
