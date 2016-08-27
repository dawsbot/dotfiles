(function() {
  describe('Indie', function() {
    var Indie, Validate, indie;
    Validate = require('../lib/validate');
    Indie = require('../lib/indie');
    indie = null;
    beforeEach(function() {
      if (indie != null) {
        indie.dispose();
      }
      return indie = new Indie({});
    });
    describe('Validations', function() {
      return it('just cares about a name', function() {
        var linter;
        linter = {};
        Validate.linter(linter, true);
        expect(linter.name).toBe(null);
        linter.name = 'a';
        Validate.linter(linter, true);
        expect(linter.name).toBe('a');
        linter.name = 2;
        return expect(function() {
          return Validate.linter(linter, true);
        }).toThrow();
      });
    });
    describe('constructor', function() {
      return it('sets a scope for message registry to know', function() {
        return expect(indie.scope).toBe('project');
      });
    });
    describe('{set, delete}Messages', function() {
      return it('notifies the event listeners of the change', function() {
        var listener, messages;
        listener = jasmine.createSpy('indie.listener');
        messages = [{}];
        indie.onDidUpdateMessages(listener);
        indie.setMessages(messages);
        expect(listener).toHaveBeenCalled();
        expect(listener.calls.length).toBe(1);
        expect(listener).toHaveBeenCalledWith(messages);
        indie.deleteMessages();
        expect(listener.calls.length).toBe(2);
        expect(listener.mostRecentCall.args[0] instanceof Array);
        return expect(listener.mostRecentCall.args[0].length).toBe(0);
      });
    });
    return describe('dispose', function() {
      return it('triggers the onDidDestroy event', function() {
        var listener;
        listener = jasmine.createSpy('indie.destroy');
        indie.onDidDestroy(listener);
        indie.dispose();
        return expect(listener).toHaveBeenCalled();
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rhd3NvbmJvdHNmb3JkLy5hdG9tL3BhY2thZ2VzL2xpbnRlci9zcGVjL2luZGllLXNwZWMuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxFQUFBLFFBQUEsQ0FBUyxPQUFULEVBQWtCLFNBQUEsR0FBQTtBQUNoQixRQUFBLHNCQUFBO0FBQUEsSUFBQSxRQUFBLEdBQVcsT0FBQSxDQUFRLGlCQUFSLENBQVgsQ0FBQTtBQUFBLElBQ0EsS0FBQSxHQUFRLE9BQUEsQ0FBUSxjQUFSLENBRFIsQ0FBQTtBQUFBLElBRUEsS0FBQSxHQUFRLElBRlIsQ0FBQTtBQUFBLElBSUEsVUFBQSxDQUFXLFNBQUEsR0FBQTs7UUFDVCxLQUFLLENBQUUsT0FBUCxDQUFBO09BQUE7YUFDQSxLQUFBLEdBQVksSUFBQSxLQUFBLENBQU0sRUFBTixFQUZIO0lBQUEsQ0FBWCxDQUpBLENBQUE7QUFBQSxJQVFBLFFBQUEsQ0FBUyxhQUFULEVBQXdCLFNBQUEsR0FBQTthQUN0QixFQUFBLENBQUcseUJBQUgsRUFBOEIsU0FBQSxHQUFBO0FBQzVCLFlBQUEsTUFBQTtBQUFBLFFBQUEsTUFBQSxHQUFTLEVBQVQsQ0FBQTtBQUFBLFFBQ0EsUUFBUSxDQUFDLE1BQVQsQ0FBZ0IsTUFBaEIsRUFBd0IsSUFBeEIsQ0FEQSxDQUFBO0FBQUEsUUFFQSxNQUFBLENBQU8sTUFBTSxDQUFDLElBQWQsQ0FBbUIsQ0FBQyxJQUFwQixDQUF5QixJQUF6QixDQUZBLENBQUE7QUFBQSxRQUdBLE1BQU0sQ0FBQyxJQUFQLEdBQWMsR0FIZCxDQUFBO0FBQUEsUUFJQSxRQUFRLENBQUMsTUFBVCxDQUFnQixNQUFoQixFQUF3QixJQUF4QixDQUpBLENBQUE7QUFBQSxRQUtBLE1BQUEsQ0FBTyxNQUFNLENBQUMsSUFBZCxDQUFtQixDQUFDLElBQXBCLENBQXlCLEdBQXpC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

//# sourceURL=/Users/dawsonbotsford/.atom/packages/linter/spec/indie-spec.coffee
