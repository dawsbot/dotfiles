(function() {
  var ColorSearch, click;

  click = require('./helpers/events').click;

  ColorSearch = require('../lib/color-search');

  describe('ColorResultsElement', function() {
    var completeSpy, findSpy, pigments, project, resultsElement, search, _ref;
    _ref = [], search = _ref[0], resultsElement = _ref[1], pigments = _ref[2], project = _ref[3], completeSpy = _ref[4], findSpy = _ref[5];
    beforeEach(function() {
      atom.config.set('pigments.sourceNames', ['**/*.styl', '**/*.less']);
      waitsForPromise(function() {
        return atom.packages.activatePackage('pigments').then(function(pkg) {
          pigments = pkg.mainModule;
          return project = pigments.getProject();
        });
      });
      waitsForPromise(function() {
        return project.initialize();
      });
      return runs(function() {
        search = project.findAllColors();
        spyOn(search, 'search').andCallThrough();
        completeSpy = jasmine.createSpy('did-complete-search');
        search.onDidCompleteSearch(completeSpy);
        resultsElement = atom.views.getView(search);
        return jasmine.attachToDOM(resultsElement);
      });
    });
    afterEach(function() {
      return waitsFor(function() {
        return completeSpy.callCount > 0;
      });
    });
    it('is associated with ColorSearch model', function() {
      return expect(resultsElement).toBeDefined();
    });
    it('starts the search', function() {
      return expect(search.search).toHaveBeenCalled();
    });
    return describe('when matches are found', function() {
      beforeEach(function() {
        return waitsFor(function() {
          return completeSpy.callCount > 0;
        });
      });
      it('groups results by files', function() {
        var fileResults;
        fileResults = resultsElement.querySelectorAll('.list-nested-item');
        expect(fileResults.length).toEqual(8);
        return expect(fileResults[0].querySelectorAll('li.list-item').length).toEqual(3);
      });
      describe('when a file item is clicked', function() {
        var fileItem;
        fileItem = [][0];
        beforeEach(function() {
          fileItem = resultsElement.querySelector('.list-nested-item > .list-item');
          return click(fileItem);
        });
        return it('collapses the file matches', function() {
          return expect(resultsElement.querySelector('.list-nested-item.collapsed')).toExist();
        });
      });
      return describe('when a matches item is clicked', function() {
        var matchItem, spy, _ref1;
        _ref1 = [], matchItem = _ref1[0], spy = _ref1[1];
        beforeEach(function() {
          spy = jasmine.createSpy('did-add-text-editor');
          atom.workspace.onDidAddTextEditor(spy);
          matchItem = resultsElement.querySelector('.search-result.list-item');
          click(matchItem);
          return waitsFor(function() {
            return spy.callCount > 0;
          });
        });
        return it('opens the file', function() {
          var textEditor;
          expect(spy).toHaveBeenCalled();
          textEditor = spy.argsForCall[0][0].textEditor;
          return expect(textEditor.getSelectedBufferRange()).toEqual([[1, 13], [1, 23]]);
        });
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rhd3NvbmJvdHNmb3JkLy5hdG9tL3BhY2thZ2VzL3BpZ21lbnRzL3NwZWMvY29sb3ItcmVzdWx0cy1lbGVtZW50LXNwZWMuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLGtCQUFBOztBQUFBLEVBQUMsUUFBUyxPQUFBLENBQVEsa0JBQVIsRUFBVCxLQUFELENBQUE7O0FBQUEsRUFDQSxXQUFBLEdBQWMsT0FBQSxDQUFRLHFCQUFSLENBRGQsQ0FBQTs7QUFBQSxFQUdBLFFBQUEsQ0FBUyxxQkFBVCxFQUFnQyxTQUFBLEdBQUE7QUFDOUIsUUFBQSxxRUFBQTtBQUFBLElBQUEsT0FBb0UsRUFBcEUsRUFBQyxnQkFBRCxFQUFTLHdCQUFULEVBQXlCLGtCQUF6QixFQUFtQyxpQkFBbkMsRUFBNEMscUJBQTVDLEVBQXlELGlCQUF6RCxDQUFBO0FBQUEsSUFFQSxVQUFBLENBQVcsU0FBQSxHQUFBO0FBQ1QsTUFBQSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0Isc0JBQWhCLEVBQXdDLENBQ3RDLFdBRHNDLEVBRXRDLFdBRnNDLENBQXhDLENBQUEsQ0FBQTtBQUFBLE1BS0EsZUFBQSxDQUFnQixTQUFBLEdBQUE7ZUFBRyxJQUFJLENBQUMsUUFBUSxDQUFDLGVBQWQsQ0FBOEIsVUFBOUIsQ0FBeUMsQ0FBQyxJQUExQyxDQUErQyxTQUFDLEdBQUQsR0FBQTtBQUNoRSxVQUFBLFFBQUEsR0FBVyxHQUFHLENBQUMsVUFBZixDQUFBO2lCQUNBLE9BQUEsR0FBVSxRQUFRLENBQUMsVUFBVCxDQUFBLEVBRnNEO1FBQUEsQ0FBL0MsRUFBSDtNQUFBLENBQWhCLENBTEEsQ0FBQTtBQUFBLE1BU0EsZUFBQSxDQUFnQixTQUFBLEdBQUE7ZUFBRyxPQUFPLENBQUMsVUFBUixDQUFBLEVBQUg7TUFBQSxDQUFoQixDQVRB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

//# sourceURL=/Users/dawsonbotsford/.atom/packages/pigments/spec/color-results-element-spec.coffee
