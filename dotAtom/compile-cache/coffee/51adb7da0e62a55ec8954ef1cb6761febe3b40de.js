(function() {
  var ExpressionsRegistry;

  ExpressionsRegistry = require('../lib/expressions-registry');

  describe('ExpressionsRegistry', function() {
    var Dummy, registry, _ref;
    _ref = [], registry = _ref[0], Dummy = _ref[1];
    beforeEach(function() {
      Dummy = (function() {
        function Dummy(_arg) {
          this.name = _arg.name, this.regexpString = _arg.regexpString, this.priority = _arg.priority, this.scopes = _arg.scopes, this.handle = _arg.handle;
        }

        return Dummy;

      })();
      return registry = new ExpressionsRegistry(Dummy);
    });
    describe('::createExpression', function() {
      return describe('called with enough data', function() {
        return it('creates a new expression of this registry expressions type', function() {
          var expression;
          expression = registry.createExpression('dummy', 'foo');
          expect(expression.constructor).toBe(Dummy);
          return expect(registry.getExpressions()).toEqual([expression]);
        });
      });
    });
    describe('::addExpression', function() {
      return it('adds a previously created expression in the registry', function() {
        var expression;
        expression = new Dummy({
          name: 'bar'
        });
        registry.addExpression(expression);
        expect(registry.getExpression('bar')).toBe(expression);
        return expect(registry.getExpressions()).toEqual([expression]);
      });
    });
    describe('::getExpressions', function() {
      return it('returns the expression based on their priority', function() {
        var expression1, expression2, expression3;
        expression1 = registry.createExpression('dummy1', '', 2);
        expression2 = registry.createExpression('dummy2', '', 0);
        expression3 = registry.createExpression('dummy3', '', 1);
        return expect(registry.getExpressions()).toEqual([expression1, expression3, expression2]);
      });
    });
    describe('::removeExpression', function() {
      return it('removes an expression with its name', function() {
        registry.createExpression('dummy', 'foo');
        registry.removeExpression('dummy');
        return expect(registry.getExpressions()).toEqual([]);
      });
    });
    describe('::serialize', function() {
      return it('serializes the registry with the function content', function() {
        var serialized;
        registry.createExpression('dummy', 'foo');
        registry.createExpression('dummy2', 'bar', function(a, b, c) {
          return a + b - c;
        });
        serialized = registry.serialize();
        expect(serialized.regexpString).toEqual('(foo)|(bar)');
        expect(serialized.expressions.dummy).toEqual({
          name: 'dummy',
          regexpString: 'foo',
          handle: void 0,
          priority: 0,
          scopes: ['*']
        });
        return expect(serialized.expressions.dummy2).toEqual({
          name: 'dummy2',
          regexpString: 'bar',
          handle: registry.getExpression('dummy2').handle.toString(),
          priority: 0,
          scopes: ['*']
        });
      });
    });
    return describe('.deserialize', function() {
      return it('deserializes the provided expressions using the specified model', function() {
        var deserialized, serialized;
        serialized = {
          regexpString: 'foo|bar',
          expressions: {
            dummy: {
              name: 'dummy',
              regexpString: 'foo',
              handle: 'function (a,b,c) { return a + b - c; }',
              priority: 0,
              scopes: ['*']
            }
          }
        };
        deserialized = ExpressionsRegistry.deserialize(serialized, Dummy);
        expect(deserialized.getRegExp()).toEqual('foo|bar');
        expect(deserialized.getExpression('dummy').name).toEqual('dummy');
        expect(deserialized.getExpression('dummy').regexpString).toEqual('foo');
        return expect(deserialized.getExpression('dummy').handle(1, 2, 3)).toEqual(0);
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rhd3NvbmJvdHNmb3JkLy5hdG9tL3BhY2thZ2VzL3BpZ21lbnRzL3NwZWMvZXhwcmVzc2lvbnMtcmVnaXN0cnktc3BlYy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsbUJBQUE7O0FBQUEsRUFBQSxtQkFBQSxHQUFzQixPQUFBLENBQVEsNkJBQVIsQ0FBdEIsQ0FBQTs7QUFBQSxFQUVBLFFBQUEsQ0FBUyxxQkFBVCxFQUFnQyxTQUFBLEdBQUE7QUFDOUIsUUFBQSxxQkFBQTtBQUFBLElBQUEsT0FBb0IsRUFBcEIsRUFBQyxrQkFBRCxFQUFXLGVBQVgsQ0FBQTtBQUFBLElBRUEsVUFBQSxDQUFXLFNBQUEsR0FBQTtBQUNULE1BQU07QUFDUyxRQUFBLGVBQUMsSUFBRCxHQUFBO0FBQXVELFVBQXJELElBQUMsQ0FBQSxZQUFBLE1BQU0sSUFBQyxDQUFBLG9CQUFBLGNBQWMsSUFBQyxDQUFBLGdCQUFBLFVBQVUsSUFBQyxDQUFBLGNBQUEsUUFBUSxJQUFDLENBQUEsY0FBQSxNQUFVLENBQXZEO1FBQUEsQ0FBYjs7cUJBQUE7O1VBREYsQ0FBQTthQUdBLFFBQUEsR0FBZSxJQUFBLG1CQUFBLENBQW9CLEtBQXBCLEVBSk47SUFBQSxDQUFYLENBRkEsQ0FBQTtBQUFBLElBUUEsUUFBQSxDQUFTLG9CQUFULEVBQStCLFNBQUEsR0FBQTthQUM3QixRQUFBLENBQVMseUJBQVQsRUFBb0MsU0FBQSxHQUFBO2VBQ2xDLEVBQUEsQ0FBRyw0REFBSCxFQUFpRSxTQUFBLEdBQUE7QUFDL0QsY0FBQSxVQUFBO0FBQUEsVUFBQSxVQUFBLEdBQWEsUUFBUSxDQUFDLGdCQUFULENBQTBCLE9BQTFCLEVBQW1DLEtBQW5DLENBQWIsQ0FBQTtBQUFBLFVBRUEsTUFBQSxDQUFPLFVBQVUsQ0FBQyxXQUFsQixDQUE4QixDQUFDLElB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

//# sourceURL=/Users/dawsonbotsford/.atom/packages/pigments/spec/expressions-registry-spec.coffee
