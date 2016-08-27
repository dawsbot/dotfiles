(function() {
  var change;

  change = require('./helpers/events').change;

  describe('ColorProjectElement', function() {
    var pigments, project, projectElement, _ref;
    _ref = [], pigments = _ref[0], project = _ref[1], projectElement = _ref[2];
    beforeEach(function() {
      var jasmineContent;
      jasmineContent = document.body.querySelector('#jasmine-content');
      return waitsForPromise(function() {
        return atom.packages.activatePackage('pigments').then(function(pkg) {
          pigments = pkg.mainModule;
          project = pigments.getProject();
          projectElement = atom.views.getView(project);
          return jasmineContent.appendChild(projectElement);
        });
      });
    });
    it('is bound to the ColorProject model', function() {
      return expect(projectElement).toExist();
    });
    describe('typing in the sourceNames input', function() {
      return it('update the source names in the project', function() {
        spyOn(project, 'setSourceNames');
        projectElement.sourceNames.getModel().setText('foo, bar');
        projectElement.sourceNames.getModel().getBuffer().emitter.emit('did-stop-changing');
        return expect(project.setSourceNames).toHaveBeenCalledWith(['foo', 'bar']);
      });
    });
    describe('typing in the supportedFiletypes input', function() {
      return it('update the source names in the project', function() {
        spyOn(project, 'setSupportedFiletypes');
        projectElement.supportedFiletypes.getModel().setText('foo, bar');
        projectElement.supportedFiletypes.getModel().getBuffer().emitter.emit('did-stop-changing');
        return expect(project.setSupportedFiletypes).toHaveBeenCalledWith(['foo', 'bar']);
      });
    });
    describe('typing in the searchNames input', function() {
      return it('update the search names in the project', function() {
        spyOn(project, 'setSearchNames');
        projectElement.searchNames.getModel().setText('foo, bar');
        projectElement.searchNames.getModel().getBuffer().emitter.emit('did-stop-changing');
        return expect(project.setSearchNames).toHaveBeenCalledWith(['foo', 'bar']);
      });
    });
    describe('typing in the ignoredNames input', function() {
      return it('update the source names in the project', function() {
        spyOn(project, 'setIgnoredNames');
        projectElement.ignoredNames.getModel().setText('foo, bar');
        projectElement.ignoredNames.getModel().getBuffer().emitter.emit('did-stop-changing');
        return expect(project.setIgnoredNames).toHaveBeenCalledWith(['foo', 'bar']);
      });
    });
    describe('typing in the ignoredScopes input', function() {
      return it('update the source names in the project', function() {
        spyOn(project, 'setIgnoredScopes');
        projectElement.ignoredScopes.getModel().setText('foo, bar');
        projectElement.ignoredScopes.getModel().getBuffer().emitter.emit('did-stop-changing');
        return expect(project.setIgnoredScopes).toHaveBeenCalledWith(['foo', 'bar']);
      });
    });
    describe('changing the sass implementation', function() {
      return it('update the setting in the project', function() {
        spyOn(project, 'setSassShadeAndTintImplementation');
        projectElement.sassShadeAndTintImplementation.selectedIndex = 1;
        change(projectElement.sassShadeAndTintImplementation);
        return expect(project.setSassShadeAndTintImplementation).toHaveBeenCalledWith('compass');
      });
    });
    describe('toggling on the includeThemes checkbox', function() {
      return it('update the source names in the project', function() {
        spyOn(project, 'setIncludeThemes');
        projectElement.includeThemes.checked = true;
        change(projectElement.includeThemes);
        expect(project.setIncludeThemes).toHaveBeenCalledWith(true);
        projectElement.includeThemes.checked = false;
        change(projectElement.includeThemes);
        return expect(project.setIncludeThemes).toHaveBeenCalledWith(false);
      });
    });
    describe('toggling on the ignoreGlobalSourceNames checkbox', function() {
      return it('update the source names in the project', function() {
        spyOn(project, 'setIgnoreGlobalSourceNames');
        projectElement.ignoreGlobalSourceNames.checked = true;
        change(projectElement.ignoreGlobalSourceNames);
        expect(project.setIgnoreGlobalSourceNames).toHaveBeenCalledWith(true);
        projectElement.ignoreGlobalSourceNames.checked = false;
        change(projectElement.ignoreGlobalSourceNames);
        return expect(project.setIgnoreGlobalSourceNames).toHaveBeenCalledWith(false);
      });
    });
    describe('toggling on the ignoreGlobalSupportedFiletypes checkbox', function() {
      return it('update the source names in the project', function() {
        spyOn(project, 'setIgnoreGlobalSupportedFiletypes');
        projectElement.ignoreGlobalSupportedFiletypes.checked = true;
        change(projectElement.ignoreGlobalSupportedFiletypes);
        expect(project.setIgnoreGlobalSupportedFiletypes).toHaveBeenCalledWith(true);
        projectElement.ignoreGlobalSupportedFiletypes.checked = false;
        change(projectElement.ignoreGlobalSupportedFiletypes);
        return expect(project.setIgnoreGlobalSupportedFiletypes).toHaveBeenCalledWith(false);
      });
    });
    describe('toggling on the ignoreGlobalIgnoredNames checkbox', function() {
      return it('update the ignored names in the project', function() {
        spyOn(project, 'setIgnoreGlobalIgnoredNames');
        projectElement.ignoreGlobalIgnoredNames.checked = true;
        change(projectElement.ignoreGlobalIgnoredNames);
        expect(project.setIgnoreGlobalIgnoredNames).toHaveBeenCalledWith(true);
        projectElement.ignoreGlobalIgnoredNames.checked = false;
        change(projectElement.ignoreGlobalIgnoredNames);
        return expect(project.setIgnoreGlobalIgnoredNames).toHaveBeenCalledWith(false);
      });
    });
    describe('toggling on the ignoreGlobalIgnoredScopes checkbox', function() {
      return it('update the ignored scopes in the project', function() {
        spyOn(project, 'setIgnoreGlobalIgnoredScopes');
        projectElement.ignoreGlobalIgnoredScopes.checked = true;
        change(projectElement.ignoreGlobalIgnoredScopes);
        expect(project.setIgnoreGlobalIgnoredScopes).toHaveBeenCalledWith(true);
        projectElement.ignoreGlobalIgnoredScopes.checked = false;
        change(projectElement.ignoreGlobalIgnoredScopes);
        return expect(project.setIgnoreGlobalIgnoredScopes).toHaveBeenCalledWith(false);
      });
    });
    return describe('toggling on the ignoreGlobalSearchNames checkbox', function() {
      return it('update the search names in the project', function() {
        spyOn(project, 'setIgnoreGlobalSearchNames');
        projectElement.ignoreGlobalSearchNames.checked = true;
        change(projectElement.ignoreGlobalSearchNames);
        expect(project.setIgnoreGlobalSearchNames).toHaveBeenCalledWith(true);
        projectElement.ignoreGlobalSearchNames.checked = false;
        change(projectElement.ignoreGlobalSearchNames);
        return expect(project.setIgnoreGlobalSearchNames).toHaveBeenCalledWith(false);
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rhd3NvbmJvdHNmb3JkLy5hdG9tL3BhY2thZ2VzL3BpZ21lbnRzL3NwZWMvY29sb3ItcHJvamVjdC1lbGVtZW50LXNwZWMuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLE1BQUE7O0FBQUEsRUFBQyxTQUFVLE9BQUEsQ0FBUSxrQkFBUixFQUFWLE1BQUQsQ0FBQTs7QUFBQSxFQUVBLFFBQUEsQ0FBUyxxQkFBVCxFQUFnQyxTQUFBLEdBQUE7QUFDOUIsUUFBQSx1Q0FBQTtBQUFBLElBQUEsT0FBc0MsRUFBdEMsRUFBQyxrQkFBRCxFQUFXLGlCQUFYLEVBQW9CLHdCQUFwQixDQUFBO0FBQUEsSUFFQSxVQUFBLENBQVcsU0FBQSxHQUFBO0FBQ1QsVUFBQSxjQUFBO0FBQUEsTUFBQSxjQUFBLEdBQWlCLFFBQVEsQ0FBQyxJQUFJLENBQUMsYUFBZCxDQUE0QixrQkFBNUIsQ0FBakIsQ0FBQTthQUVBLGVBQUEsQ0FBZ0IsU0FBQSxHQUFBO2VBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxlQUFkLENBQThCLFVBQTlCLENBQXlDLENBQUMsSUFBMUMsQ0FBK0MsU0FBQyxHQUFELEdBQUE7QUFDaEUsVUFBQSxRQUFBLEdBQVcsR0FBRyxDQUFDLFVBQWYsQ0FBQTtBQUFBLFVBQ0EsT0FBQSxHQUFVLFFBQVEsQ0FBQyxVQUFULENBQUEsQ0FEVixDQUFBO0FBQUEsVUFFQSxjQUFBLEdBQWlCLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBWCxDQUFtQixPQUFuQixDQUZqQixDQUFBO2lCQUdBLGNBQWMsQ0FBQyxXQUFmLENBQTJCLGNBQTNCLEVBSmdFO1FBQUEsQ0FBL0MsRUFBSDtNQUFBLENBQWhCLEVBSFM7SUFBQSxDQUFYLENBRkEsQ0FBQTtBQUFBLElBV0EsRUFBQSxDQUFHLG9DQUFILEVBQXlDLFNBQUEsR0FBQTthQUN2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

//# sourceURL=/Users/dawsonbotsford/.atom/packages/pigments/spec/color-project-element-spec.coffee
