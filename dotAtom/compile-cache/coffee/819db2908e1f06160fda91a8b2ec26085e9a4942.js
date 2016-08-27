(function() {
  var ColorSearch;

  require('./helpers/matchers');

  ColorSearch = require('../lib/color-search');

  describe('ColorSearch', function() {
    var pigments, project, search, _ref;
    _ref = [], search = _ref[0], pigments = _ref[1], project = _ref[2];
    beforeEach(function() {
      atom.config.set('pigments.sourceNames', ['**/*.styl', '**/*.less']);
      atom.config.set('pigments.extendedSearchNames', ['**/*.css']);
      atom.config.set('pigments.ignoredNames', ['project/vendor/**']);
      waitsForPromise(function() {
        return atom.packages.activatePackage('pigments').then(function(pkg) {
          pigments = pkg.mainModule;
          return project = pigments.getProject();
        });
      });
      return waitsForPromise(function() {
        return project.initialize();
      });
    });
    return describe('when created with basic options', function() {
      beforeEach(function() {
        return search = project.findAllColors();
      });
      it('dispatches a did-complete-search when finalizing its search', function() {
        var spy;
        spy = jasmine.createSpy('did-complete-search');
        search.onDidCompleteSearch(spy);
        search.search();
        waitsFor(function() {
          return spy.callCount > 0;
        });
        return runs(function() {
          return expect(spy.argsForCall[0][0].length).toEqual(26);
        });
      });
      return it('dispatches a did-find-matches event for every file', function() {
        var completeSpy, findSpy;
        completeSpy = jasmine.createSpy('did-complete-search');
        findSpy = jasmine.createSpy('did-find-matches');
        search.onDidCompleteSearch(completeSpy);
        search.onDidFindMatches(findSpy);
        search.search();
        waitsFor(function() {
          return completeSpy.callCount > 0;
        });
        return runs(function() {
          expect(findSpy.callCount).toEqual(7);
          return expect(findSpy.argsForCall[0][0].matches.length).toEqual(3);
        });
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rhd3NvbmJvdHNmb3JkLy5hdG9tL3BhY2thZ2VzL3BpZ21lbnRzL3NwZWMvY29sb3Itc2VhcmNoLXNwZWMuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLFdBQUE7O0FBQUEsRUFBQSxPQUFBLENBQVEsb0JBQVIsQ0FBQSxDQUFBOztBQUFBLEVBQ0EsV0FBQSxHQUFjLE9BQUEsQ0FBUSxxQkFBUixDQURkLENBQUE7O0FBQUEsRUFHQSxRQUFBLENBQVMsYUFBVCxFQUF3QixTQUFBLEdBQUE7QUFDdEIsUUFBQSwrQkFBQTtBQUFBLElBQUEsT0FBOEIsRUFBOUIsRUFBQyxnQkFBRCxFQUFTLGtCQUFULEVBQW1CLGlCQUFuQixDQUFBO0FBQUEsSUFFQSxVQUFBLENBQVcsU0FBQSxHQUFBO0FBQ1QsTUFBQSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0Isc0JBQWhCLEVBQXdDLENBQ3RDLFdBRHNDLEVBRXRDLFdBRnNDLENBQXhDLENBQUEsQ0FBQTtBQUFBLE1BSUEsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLDhCQUFoQixFQUFnRCxDQUM5QyxVQUQ4QyxDQUFoRCxDQUpBLENBQUE7QUFBQSxNQU9BLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQix1QkFBaEIsRUFBeUMsQ0FDdkMsbUJBRHVDLENBQXpDLENBUEEsQ0FBQTtBQUFBLE1BV0EsZUFBQSxDQUFnQixTQUFBLEdBQUE7ZUFBRyxJQUFJLENBQUMsUUFBUSxDQUFDLGVBQWQsQ0FBOEIsVUFBOUIsQ0FBeUMsQ0FBQyxJQUExQyxDQUErQyxTQUFDLEdBQUQsR0FBQTtBQUNoRSxVQUFBLFFBQUEsR0FBVyxHQUFHLENBQUMsVUFBZixDQUFBO2lCQUNBLE9BQUEsR0FBVSxRQUFRLENBQUMsVUFBVCxDQUFBLEVBRnNEO1FBQUEsQ0FBL0MsRUFBSDtNQUFBLENBQWhCLENBWEEsQ0FBQTthQWVBLGVBQUEsQ0FBZ0IsU0FBQSxHQUFBO2VBQUcsT0FBTyxDQUFDLFVBQVIsQ0FBQSxFQUFIO01BQUEsQ0FBaEIsRUFoQlM7SUFBQSxDQUFYLENBRkEsQ0FBQTtXQW9CQSxRQUFBLENBQVMsaUNBQVQsRUFBNEMsU0FBQSxHQUFBO0FBQzFDLE1BQUEsVUFBQSxDQUFXLFNBQUEsR0FBQTtlQUNULE1BQUEsR0FBUyxPQUFPLENBQUMsYUFBUixDQUFBLEVBREE7TUFBQSxDQUFYLENBQUEsQ0FBQTtBQUFBLE1BR0EsRUFBQSxDQUFHLDZEQUFILEVBQWtFLFNBQUEsR0FBQTtBQUNoRSxZQUFBLEdBQUE7QUFBQSxRQUFBLEdBQUEsR0FBTSxPQUFPLENBQUMsU0FBUixDQUFrQixxQkFBbEIsQ0FBTixDQUFBO0FBQUEsUUFDQSxNQUFNLENBQUMsbUJBQVAsQ0FBMkIsR0FBM0IsQ0FEQSxDQUFBO0FBQUEsUUFFQSxNQUFNLENBQUMsTUFBUCxDQUFBLENBRkEsQ0FBQTtBQUFBLFFBR0EsUUFBQSxDQUFTLFNBQUEsR0FBQTtpQkFBRyxHQUFHLENBQUMsU0FBSixHQUFnQixFQUFuQjtRQUFBLENBQVQsQ0FIQSxDQUFBO2VBSUEsSUFBQSxDQUFLLFNBQUEsR0FBQTtpQkFBRyxNQUFBLENBQU8sR0FBRyxDQUFDLFdBQVksQ0FBQSxDQUFBLENBQUcsQ0FBQSxDQUFBLENBQUUsQ0FBQyxNQUE3QixDQUFvQyxDQUFDLE9BQXJDLENBQTZDLEVBQTdDLEVBQUg7UUFBQSxDQUFMLEVBTGdFO01BQUEsQ0FBbEUsQ0FIQSxDQUFBO2FBVUEsRUFBQSxDQUFHLG9EQUFILEVBQXlELFNBQUEsR0FBQTtBQUN2RCxZQUFBLG9CQUFBO0FBQUEsUUFBQSxXQUFBLEdBQWMsT0FBTyxDQUFDLFNBQVIsQ0FBa0IscUJBQWxCLENBQWQsQ0FBQTtBQUFBLFFBQ0EsT0FBQSxHQUFVLE9BQU8sQ0FBQyxTQUFSLENBQWtCLGtCQUFsQixDQURWLENBQUE7QUFBQSxRQUVBLE1BQU0sQ0FBQyxtQkFBUCxDQUEyQixXQUEzQixDQUZBLENBQUE7QUFBQSxRQUdBLE1BQU0sQ0FBQyxnQkFBUCxDQUF3QixPQUF4QixDQUhBLENBQUE7QUFBQSxRQUlBLE1BQU0sQ0FBQyxNQUFQLENBQUEsQ0FKQSxDQUFBO0FBQUEsUUFLQSxRQUFBLENBQVMsU0FBQSxHQUFBO2lCQUFHLFdBQVcsQ0FBQyxTQUFaLEdBQXdCLEVBQTNCO1FBQUEsQ0FBVCxDQUxBLENBQUE7ZUFNQSxJQUFBLENBQUssU0FBQSxHQUFBO0FBQ0gsVUFBQSxNQUFBLENBQU8sT0FBTyxDQUFDLFNBQWYsQ0FBeUIsQ0FBQyxPQUExQixDQUFrQyxDQUFsQyxDQUFBLENBQUE7aUJBQ0EsTUFBQSxDQUFPLE9BQU8sQ0FBQyxXQUFZLENBQUEsQ0FBQSxDQUFHLENBQUEsQ0FBQSxDQUFFLENBQUMsT0FBTyxDQUFDLE1BQXpDLENBQWdELENBQUMsT0FBakQsQ0FBeUQsQ0FBekQsRUFGRztRQUFBLENBQUwsRUFQdUQ7TUFBQSxDQUF6RCxFQVgwQztJQUFBLENBQTVDLEVBckJzQjtFQUFBLENBQXhCLENBSEEsQ0FBQTtBQUFBIgp9

//# sourceURL=/Users/dawsonbotsford/.atom/packages/pigments/spec/color-search-spec.coffee
