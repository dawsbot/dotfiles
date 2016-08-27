(function() {
  var Color, Palette, THEME_VARIABLES, change, click, _ref;

  Color = require('../lib/color');

  Palette = require('../lib/palette');

  THEME_VARIABLES = require('../lib/uris').THEME_VARIABLES;

  _ref = require('./helpers/events'), change = _ref.change, click = _ref.click;

  describe('PaletteElement', function() {
    var createVar, nextID, palette, paletteElement, pigments, project, workspaceElement, _ref1;
    _ref1 = [0], nextID = _ref1[0], palette = _ref1[1], paletteElement = _ref1[2], workspaceElement = _ref1[3], pigments = _ref1[4], project = _ref1[5];
    createVar = function(name, color, path, line) {
      return {
        name: name,
        color: color,
        path: path,
        line: line,
        id: nextID++
      };
    };
    beforeEach(function() {
      workspaceElement = atom.views.getView(atom.workspace);
      atom.config.set('pigments.sourceNames', ['*.styl', '*.less']);
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
    afterEach(function() {
      return project.destroy();
    });
    describe('as a view provider', function() {
      beforeEach(function() {
        palette = new Palette([createVar('red', new Color('#ff0000'), 'file.styl', 0), createVar('green', new Color('#00ff00'), 'file.styl', 1), createVar('blue', new Color('#0000ff'), 'file.styl', 2), createVar('redCopy', new Color('#ff0000'), 'file.styl', 3), createVar('red', new Color('#ff0000'), THEME_VARIABLES, 0)]);
        paletteElement = atom.views.getView(palette);
        return jasmine.attachToDOM(paletteElement);
      });
      it('is associated with the Palette model', function() {
        return expect(paletteElement).toBeDefined();
      });
      return it('does not render the file link when the variable comes from a theme', function() {
        return expect(paletteElement.querySelectorAll('li')[4].querySelector(' [data-variable-id]')).not.toExist();
      });
    });
    describe('when pigments:show-palette commands is triggered', function() {
      beforeEach(function() {
        atom.commands.dispatch(workspaceElement, 'pigments:show-palette');
        waitsFor(function() {
          return paletteElement = workspaceElement.querySelector('pigments-palette');
        });
        return runs(function() {
          palette = paletteElement.getModel();
          return jasmine.attachToDOM(paletteElement);
        });
      });
      it('opens a palette element', function() {
        return expect(paletteElement).toBeDefined();
      });
      it('creates as many list item as there is colors in the project', function() {
        expect(paletteElement.querySelectorAll('li').length).not.toEqual(0);
        return expect(paletteElement.querySelectorAll('li').length).toEqual(palette.variables.length);
      });
      it('binds colors with project variables', function() {
        var li, projectVariables;
        projectVariables = project.getColorVariables();
        li = paletteElement.querySelector('li');
        return expect(li.querySelector('.path').textContent).toEqual(atom.project.relativize(projectVariables[0].path));
      });
      describe('clicking on a result path', function() {
        return it('shows the variable in its file', function() {
          var pathElement;
          spyOn(project, 'showVariableInFile');
          pathElement = paletteElement.querySelector('[data-variable-id]');
          click(pathElement);
          return waitsFor(function() {
            return project.showVariableInFile.callCount > 0;
          });
        });
      });
      describe('when the sortPaletteColors settings is set to color', function() {
        beforeEach(function() {
          return atom.config.set('pigments.sortPaletteColors', 'by color');
        });
        return it('reorders the colors', function() {
          var i, lis, name, sortedColors, _i, _len, _results;
          sortedColors = project.getPalette().sortedByColor();
          lis = paletteElement.querySelectorAll('li');
          _results = [];
          for (i = _i = 0, _len = sortedColors.length; _i < _len; i = ++_i) {
            name = sortedColors[i].name;
            _results.push(expect(lis[i].querySelector('.name').textContent).toEqual(name));
          }
          return _results;
        });
      });
      describe('when the sortPaletteColors settings is set to name', function() {
        beforeEach(function() {
          return atom.config.set('pigments.sortPaletteColors', 'by name');
        });
        return it('reorders the colors', function() {
          var i, lis, name, sortedColors, _i, _len, _results;
          sortedColors = project.getPalette().sortedByName();
          lis = paletteElement.querySelectorAll('li');
          _results = [];
          for (i = _i = 0, _len = sortedColors.length; _i < _len; i = ++_i) {
            name = sortedColors[i].name;
            _results.push(expect(lis[i].querySelector('.name').textContent).toEqual(name));
          }
          return _results;
        });
      });
      describe('when the groupPaletteColors setting is set to file', function() {
        beforeEach(function() {
          return atom.config.set('pigments.groupPaletteColors', 'by file');
        });
        it('renders the list with sublists for each files', function() {
          var ols;
          ols = paletteElement.querySelectorAll('ol ol');
          return expect(ols.length).toEqual(5);
        });
        it('adds a header with the file path for each sublist', function() {
          var ols;
          ols = paletteElement.querySelectorAll('.pigments-color-group-header');
          return expect(ols.length).toEqual(5);
        });
        describe('and the sortPaletteColors is set to name', function() {
          beforeEach(function() {
            return atom.config.set('pigments.sortPaletteColors', 'by name');
          });
          return it('sorts the nested list items', function() {
            var file, i, lis, n, name, ol, ols, palettes, sortedColors, _results;
            palettes = paletteElement.getFilesPalettes();
            ols = paletteElement.querySelectorAll('.pigments-color-group');
            n = 0;
            _results = [];
            for (file in palettes) {
              palette = palettes[file];
              ol = ols[n++];
              lis = ol.querySelectorAll('li');
              sortedColors = palette.sortedByName();
              _results.push((function() {
                var _i, _len, _results1;
                _results1 = [];
                for (i = _i = 0, _len = sortedColors.length; _i < _len; i = ++_i) {
                  name = sortedColors[i].name;
                  _results1.push(expect(lis[i].querySelector('.name').textContent).toEqual(name));
                }
                return _results1;
              })());
            }
            return _results;
          });
        });
        return describe('when the mergeColorDuplicates', function() {
          beforeEach(function() {
            return atom.config.set('pigments.mergeColorDuplicates', true);
          });
          return it('groups identical colors together', function() {
            var lis;
            lis = paletteElement.querySelectorAll('li');
            return expect(lis.length).toEqual(40);
          });
        });
      });
      describe('sorting selector', function() {
        var sortSelect;
        sortSelect = [][0];
        return describe('when changed', function() {
          beforeEach(function() {
            sortSelect = paletteElement.querySelector('#sort-palette-colors');
            sortSelect.querySelector('option[value="by name"]').setAttribute('selected', 'selected');
            return change(sortSelect);
          });
          return it('changes the settings value', function() {
            return expect(atom.config.get('pigments.sortPaletteColors')).toEqual('by name');
          });
        });
      });
      return describe('grouping selector', function() {
        var groupSelect;
        groupSelect = [][0];
        return describe('when changed', function() {
          beforeEach(function() {
            groupSelect = paletteElement.querySelector('#group-palette-colors');
            groupSelect.querySelector('option[value="by file"]').setAttribute('selected', 'selected');
            return change(groupSelect);
          });
          return it('changes the settings value', function() {
            return expect(atom.config.get('pigments.groupPaletteColors')).toEqual('by file');
          });
        });
      });
    });
    describe('when the palette settings differs from defaults', function() {
      beforeEach(function() {
        atom.config.set('pigments.sortPaletteColors', 'by name');
        atom.config.set('pigments.groupPaletteColors', 'by file');
        return atom.config.set('pigments.mergeColorDuplicates', true);
      });
      return describe('when pigments:show-palette commands is triggered', function() {
        beforeEach(function() {
          atom.commands.dispatch(workspaceElement, 'pigments:show-palette');
          waitsFor(function() {
            return paletteElement = workspaceElement.querySelector('pigments-palette');
          });
          return runs(function() {
            return palette = paletteElement.getModel();
          });
        });
        describe('the sorting selector', function() {
          return it('selects the current value', function() {
            var sortSelect;
            sortSelect = paletteElement.querySelector('#sort-palette-colors');
            return expect(sortSelect.querySelector('option[selected]').value).toEqual('by name');
          });
        });
        describe('the grouping selector', function() {
          return it('selects the current value', function() {
            var groupSelect;
            groupSelect = paletteElement.querySelector('#group-palette-colors');
            return expect(groupSelect.querySelector('option[selected]').value).toEqual('by file');
          });
        });
        return it('checks the merge checkbox', function() {
          var mergeCheckBox;
          mergeCheckBox = paletteElement.querySelector('#merge-duplicates');
          return expect(mergeCheckBox.checked).toBeTruthy();
        });
      });
    });
    return describe('when the project variables are modified', function() {
      var initialColorCount, spy, _ref2;
      _ref2 = [], spy = _ref2[0], initialColorCount = _ref2[1];
      beforeEach(function() {
        atom.commands.dispatch(workspaceElement, 'pigments:show-palette');
        waitsFor(function() {
          return paletteElement = workspaceElement.querySelector('pigments-palette');
        });
        runs(function() {
          palette = paletteElement.getModel();
          initialColorCount = palette.getColorsCount();
          spy = jasmine.createSpy('onDidUpdateVariables');
          project.onDidUpdateVariables(spy);
          return atom.config.set('pigments.sourceNames', ['*.styl', '*.less', '*.sass']);
        });
        return waitsFor(function() {
          return spy.callCount > 0;
        });
      });
      return it('updates the palette', function() {
        var lis;
        expect(palette.getColorsCount()).not.toEqual(initialColorCount);
        lis = paletteElement.querySelectorAll('li');
        return expect(lis.length).not.toEqual(initialColorCount);
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rhd3NvbmJvdHNmb3JkLy5hdG9tL3BhY2thZ2VzL3BpZ21lbnRzL3NwZWMvcGFsZXR0ZS1lbGVtZW50LXNwZWMuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLG9EQUFBOztBQUFBLEVBQUEsS0FBQSxHQUFRLE9BQUEsQ0FBUSxjQUFSLENBQVIsQ0FBQTs7QUFBQSxFQUNBLE9BQUEsR0FBVSxPQUFBLENBQVEsZ0JBQVIsQ0FEVixDQUFBOztBQUFBLEVBRUMsa0JBQW1CLE9BQUEsQ0FBUSxhQUFSLEVBQW5CLGVBRkQsQ0FBQTs7QUFBQSxFQUdBLE9BQWtCLE9BQUEsQ0FBUSxrQkFBUixDQUFsQixFQUFDLGNBQUEsTUFBRCxFQUFTLGFBQUEsS0FIVCxDQUFBOztBQUFBLEVBS0EsUUFBQSxDQUFTLGdCQUFULEVBQTJCLFNBQUEsR0FBQTtBQUN6QixRQUFBLHNGQUFBO0FBQUEsSUFBQSxRQUF5RSxDQUFDLENBQUQsQ0FBekUsRUFBQyxpQkFBRCxFQUFTLGtCQUFULEVBQWtCLHlCQUFsQixFQUFrQywyQkFBbEMsRUFBb0QsbUJBQXBELEVBQThELGtCQUE5RCxDQUFBO0FBQUEsSUFFQSxTQUFBLEdBQVksU0FBQyxJQUFELEVBQU8sS0FBUCxFQUFjLElBQWQsRUFBb0IsSUFBcEIsR0FBQTthQUNWO0FBQUEsUUFBQyxNQUFBLElBQUQ7QUFBQSxRQUFPLE9BQUEsS0FBUDtBQUFBLFFBQWMsTUFBQSxJQUFkO0FBQUEsUUFBb0IsTUFBQSxJQUFwQjtBQUFBLFFBQTBCLEVBQUEsRUFBSSxNQUFBLEVBQTlCO1FBRFU7SUFBQSxDQUZaLENBQUE7QUFBQSxJQUtBLFVBQUEsQ0FBVyxTQUFBLEdBQUE7QUFDVCxNQUFBLGdCQUFBLEdBQW1CLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBWCxDQUFtQixJQUFJLENBQUMsU0FBeEIsQ0FBbkIsQ0FBQTtBQUFBLE1BQ0EsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLHNCQUFoQixFQUF3QyxDQUN0QyxRQURzQyxFQUV0QyxRQUZzQyxDQUF4QyxDQURBLENBQUE7QUFBQSxNQU1BLGVBQUEsQ0FBZ0IsU0FBQSxHQUFBO2VBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxlQUFkLENBQThCLFVBQTlCLENBQXlDLENBQUMsSUFBMUMsQ0FBK0MsU0FBQyxHQUFELEdBQUE7QUFDaEUsVUFBQSxRQUFBLEdBQVcsR0FBRyxDQUFDLFVBQWYsQ0FBQTtpQkFDQSxPQUFBLEdBQVUsUUFBUSxDQUFDLFVBQVQsQ0FBQSxFQUZzRDtRQUFBLENBQS9DLEVBQUg7TUFBQSxDQUFoQixDQU5BLENBQUE7YUFVQSxlQUFBLENBQWdCLFNBQUEsR0FBQTtlQUFHLE9BQU8sQ0FBQyxVQUFSLENBQUEsRUFBSDtNQUFBLENBQWhCLEVBWFM7SUFBQSxDQUFYLENBTEEsQ0FBQTtBQUFBLElBa0JBLFNBQUEsQ0FBVSxTQUFBLEdBQUE7YUFDUixPQUFPLENBQUMsT0FBUixDQUFBLEVBRFE7SUFBQSxDQUFWLENBbEJBLENBQUE7QUFBQSxJQXFCQSxRQUFBLENBQVMsb0JBQVQsRUFBK0IsU0FBQSxHQUFBO0FBQzdCLE1BQUEsVUFBQSxDQUFXLFNBQUEsR0FBQTtBQUNULFFBQUEsT0FBQSxHQUFjLElBQUEsT0FBQSxDQUFRLENBQ3BCLFNBQUEsQ0FBVSxLQUFWLEVBQXFCLElBQUEsS0FBQSxDQUFNLFNBQU4sQ0FBckIsRUFBdUMsV0FBdkMsRUFBb0QsQ0FBcEQsQ0FEb0IsRUFFcEIsU0FBQSxDQUFVLE9BQVYsRUFBdUIsSUFBQSxLQUFBLENBQU0sU0FBTixDQUF2QixFQUF5QyxXQUF6QyxFQUFzRCxDQUF0RCxDQUZvQixFQUdwQixTQUFBLENBQVUsTUFBVixFQUFzQixJQUFBLEtBQUEsQ0FBTSxTQUFOLENBQXRCLEVBQXdDLFdBQXhDLEVBQXFELENBQXJELENBSG9CLEVBSXBCLFNBQUEsQ0FBVSxTQUFWLEVBQXlCLElBQUEsS0FBQSxDQUFNLFNBQU4sQ0FBekIsRUFBMkMsV0FBM0MsRUFBd0QsQ0FBeEQsQ0FKb0IsRUFLcEIsU0FBQSxDQUFVLEtBQVYsRUFBcUIsSUFBQSxLQUFBLENBQU0sU0FBTixDQUFyQixFQUF1QyxlQUF2QyxFQUF3RCxDQUF4RCxDQUxvQixDQUFSLENBQWQsQ0FBQTtBQUFBLFFBUUEsY0FBQSxHQUFpQixJQUFJLENBQUMsS0FBSyxDQUFDLE9BQVgsQ0FBbUIsT0FBbkIsQ0FSakIsQ0FBQTtlQVNBLE9BQU8sQ0FBQyxXQUFSLENBQW9CLGNBQXBCLEVBVlM7TUFBQSxDQUFYLENBQUEsQ0FBQTtBQUFBLE1BWUEsRUFBQSxDQUFHLHNDQUFILEVBQTJDLFNBQUEsR0FBQTtlQUN6QyxNQUFBLENBQU8sY0FBUCxDQUFzQixDQUFDLFdBQXZCLENBQUEsRUFEeUM7TUFBQSxDQUEzQyxDQVpBLENBQUE7YUFlQSxFQUFBLENBQUcsb0VBQUgsRUFBeUUsU0FBQSxHQUFBO2VBQ3ZFLE1BQUEsQ0FBTyxjQUFjLENBQUMsZ0JBQWYsQ0FBZ0MsSUFBaEMsQ0FBc0MsQ0FBQSxDQUFBLENBQUUsQ0FBQyxhQUF6QyxDQUF1RCxxQkFBdkQsQ0FBUCxDQUFxRixDQUFDLEdBQUcsQ0FBQyxPQUExRixDQUFBLEVBRHVFO01BQUEsQ0FBekUsRUFoQjZCO0lBQUEsQ0FBL0IsQ0FyQkEsQ0FBQTtBQUFBLElBd0NBLFFBQUEsQ0FBUyxrREFBVCxFQUE2RCxTQUFBLEdBQUE7QUFDM0QsTUFBQSxVQUFBLENBQVcsU0FBQSxHQUFBO0FBQ1QsUUFBQSxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQWQsQ0FBdUIsZ0JBQXZCLEVBQXlDLHVCQUF6QyxDQUFBLENBQUE7QUFBQSxRQUVBLFFBQUEsQ0FBUyxTQUFBLEdBQUE7aUJBQ1AsY0FBQSxHQUFpQixnQkFBZ0IsQ0FBQyxhQUFqQixDQUErQixrQkFBL0IsRUFEVjtRQUFBLENBQVQsQ0FGQSxDQUFBO2VBS0EsSUFBQSxDQUFLLFNBQUEsR0FBQTtBQUNILFVBQUEsT0FBQSxHQUFVLGNBQWMsQ0FBQyxRQUFmLENBQUEsQ0FBVixDQUFBO2lCQUNBLE9BQU8sQ0FBQyxXQUFSLENBQW9CLGNBQXBCLEVBRkc7UUFBQSxDQUFMLEVBTlM7TUFBQSxDQUFYLENBQUEsQ0FBQTtBQUFBLE1BVUEsRUFBQSxDQUFHLHlCQUFILEVBQThCLFNBQUEsR0FBQTtlQUM1QixNQUFBLENBQU8sY0FBUCxDQUFzQixDQUFDLFdBQXZCLENBQUEsRUFENEI7TUFBQSxDQUE5QixDQVZBLENBQUE7QUFBQSxNQWFBLEVBQUEsQ0FBRyw2REFBSCxFQUFrRSxTQUFBLEdBQUE7QUFDaEUsUUFBQSxNQUFBLENBQU8sY0FBYyxDQUFDLGdCQUFmLENBQWdDLElBQWhDLENBQXFDLENBQUMsTUFBN0MsQ0FBb0QsQ0FBQyxHQUFHLENBQUMsT0FBekQsQ0FBaUUsQ0FBakUsQ0FBQSxDQUFBO2VBQ0EsTUFBQSxDQUFPLGNBQWMsQ0FBQyxnQkFBZixDQUFnQyxJQUFoQyxDQUFxQyxDQUFDLE1BQTdDLENBQW9ELENBQUMsT0FBckQsQ0FBNkQsT0FBTyxDQUFDLFNBQVMsQ0FBQyxNQUEvRSxFQUZnRTtNQUFBLENBQWxFLENBYkEsQ0FBQTtBQUFBLE1BaUJBLEVBQUEsQ0FBRyxxQ0FBSCxFQUEwQyxTQUFBLEdBQUE7QUFDeEMsWUFBQSxvQkFBQTtBQUFBLFFBQUEsZ0JBQUEsR0FBbUIsT0FBTyxDQUFDLGlCQUFSLENBQUEsQ0FBbkIsQ0FBQTtBQUFBLFFBRUEsRUFBQSxHQUFLLGNBQWMsQ0FBQyxhQUFmLENBQTZCLElBQTdCLENBRkwsQ0FBQTtlQUdBLE1BQUEsQ0FBTyxFQUFFLENBQUMsYUFBSCxDQUFpQixPQUFqQixDQUF5QixDQUFDLFdBQWpDLENBQTZDLENBQUMsT0FBOUMsQ0FBc0QsSUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFiLENBQXdCLGdCQUFpQixDQUFBLENBQUEsQ0FBRSxDQUFDLElBQTVDLENBQXRELEVBSndDO01BQUEsQ0FBMUMsQ0FqQkEsQ0FBQTtBQUFBLE1BdUJBLFFBQUEsQ0FBUywyQkFBVCxFQUFzQyxTQUFBLEdBQUE7ZUFDcEMsRUFBQSxDQUFHLGdDQUFILEVBQXFDLFNBQUEsR0FBQTtBQUNuQyxjQUFBLFdBQUE7QUFBQSxVQUFBLEtBQUEsQ0FBTSxPQUFOLEVBQWUsb0JBQWYsQ0FBQSxDQUFBO0FBQUEsVUFFQSxXQUFBLEdBQWMsY0FBYyxDQUFDLGFBQWYsQ0FBNkIsb0JBQTdCLENBRmQsQ0FBQTtBQUFBLFVBSUEsS0FBQSxDQUFNLFdBQU4sQ0FKQSxDQUFBO2lCQU1BLFFBQUEsQ0FBUyxTQUFBLEdBQUE7bUJBQUcsT0FBTyxDQUFDLGtCQUFrQixDQUFDLFNBQTNCLEdBQXVDLEVBQTFDO1VBQUEsQ0FBVCxFQVBtQztRQUFBLENBQXJDLEVBRG9DO01BQUEsQ0FBdEMsQ0F2QkEsQ0FBQTtBQUFBLE1BaUNBLFFBQUEsQ0FBUyxxREFBVCxFQUFnRSxTQUFBLEdBQUE7QUFDOUQsUUFBQSxVQUFBLENBQVcsU0FBQSxHQUFBO2lCQUNULElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQiw0QkFBaEIsRUFBOEMsVUFBOUMsRUFEUztRQUFBLENBQVgsQ0FBQSxDQUFBO2VBR0EsRUFBQSxDQUFHLHFCQUFILEVBQTBCLFNBQUEsR0FBQTtBQUN4QixjQUFBLDhDQUFBO0FBQUEsVUFBQSxZQUFBLEdBQWUsT0FBTyxDQUFDLFVBQVIsQ0FBQSxDQUFvQixDQUFDLGFBQXJCLENBQUEsQ0FBZixDQUFBO0FBQUEsVUFDQSxHQUFBLEdBQU0sY0FBYyxDQUFDLGdCQUFmLENBQWdDLElBQWhDLENBRE4sQ0FBQTtBQUdBO2VBQUEsMkRBQUEsR0FBQTtBQUNFLFlBREcsdUJBQUEsSUFDSCxDQUFBO0FBQUEsMEJBQUEsTUFBQSxDQUFPLEdBQUksQ0FBQSxDQUFBLENBQUUsQ0FBQyxhQUFQLENBQXFCLE9BQXJCLENBQTZCLENBQUMsV0FBckMsQ0FBaUQsQ0FBQyxPQUFsRCxDQUEwRCxJQUExRCxFQUFBLENBREY7QUFBQTswQkFKd0I7UUFBQSxDQUExQixFQUo4RDtNQUFBLENBQWhFLENBakNBLENBQUE7QUFBQSxNQTRDQSxRQUFBLENBQVMsb0RBQVQsRUFBK0QsU0FBQSxHQUFBO0FBQzdELFFBQUEsVUFBQSxDQUFXLFNBQUEsR0FBQTtpQkFDVCxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IsNEJBQWhCLEVBQThDLFNBQTlDLEVBRFM7UUFBQSxDQUFYLENBQUEsQ0FBQTtlQUdBLEVBQUEsQ0FBRyxxQkFBSCxFQUEwQixTQUFBLEdBQUE7QUFDeEIsY0FBQSw4Q0FBQTtBQUFBLFVBQUEsWUFBQSxHQUFlLE9BQU8sQ0FBQyxVQUFSLENBQUEsQ0FBb0IsQ0FBQyxZQUFyQixDQUFBLENBQWYsQ0FBQTtBQUFBLFVBQ0EsR0FBQSxHQUFNLGNBQWMsQ0FBQyxnQkFBZixDQUFnQyxJQUFoQyxDQUROLENBQUE7QUFHQTtlQUFBLDJEQUFBLEdBQUE7QUFDRSxZQURHLHVCQUFBLElBQ0gsQ0FBQTtBQUFBLDBCQUFBLE1BQUEsQ0FBTyxHQUFJLENBQUEsQ0FBQSxDQUFFLENBQUMsYUFBUCxDQUFxQixPQUFyQixDQUE2QixDQUFDLFdBQXJDLENBQWlELENBQUMsT0FBbEQsQ0FBMEQsSUFBMUQsRUFBQSxDQURGO0FBQUE7MEJBSndCO1FBQUEsQ0FBMUIsRUFKNkQ7TUFBQSxDQUEvRCxDQTVDQSxDQUFBO0FBQUEsTUF1REEsUUFBQSxDQUFTLG9EQUFULEVBQStELFNBQUEsR0FBQTtBQUM3RCxRQUFBLFVBQUEsQ0FBVyxTQUFBLEdBQUE7aUJBQ1QsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLDZCQUFoQixFQUErQyxTQUEvQyxFQURTO1FBQUEsQ0FBWCxDQUFBLENBQUE7QUFBQSxRQUdBLEVBQUEsQ0FBRywrQ0FBSCxFQUFvRCxTQUFBLEdBQUE7QUFDbEQsY0FBQSxHQUFBO0FBQUEsVUFBQSxHQUFBLEdBQU0sY0FBYyxDQUFDLGdCQUFmLENBQWdDLE9BQWhDLENBQU4sQ0FBQTtpQkFDQSxNQUFBLENBQU8sR0FBRyxDQUFDLE1BQVgsQ0FBa0IsQ0FBQyxPQUFuQixDQUEyQixDQUEzQixFQUZrRDtRQUFBLENBQXBELENBSEEsQ0FBQTtBQUFBLFFBT0EsRUFBQSxDQUFHLG1EQUFILEVBQXdELFNBQUEsR0FBQTtBQUN0RCxjQUFBLEdBQUE7QUFBQSxVQUFBLEdBQUEsR0FBTSxjQUFjLENBQUMsZ0JBQWYsQ0FBZ0MsOEJBQWhDLENBQU4sQ0FBQTtpQkFDQSxNQUFBLENBQU8sR0FBRyxDQUFDLE1BQVgsQ0FBa0IsQ0FBQyxPQUFuQixDQUEyQixDQUEzQixFQUZzRDtRQUFBLENBQXhELENBUEEsQ0FBQTtBQUFBLFFBV0EsUUFBQSxDQUFTLDBDQUFULEVBQXFELFNBQUEsR0FBQTtBQUNuRCxVQUFBLFVBQUEsQ0FBVyxTQUFBLEdBQUE7bUJBQ1QsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLDRCQUFoQixFQUE4QyxTQUE5QyxFQURTO1VBQUEsQ0FBWCxDQUFBLENBQUE7aUJBR0EsRUFBQSxDQUFHLDZCQUFILEVBQWtDLFNBQUEsR0FBQTtBQUNoQyxnQkFBQSxnRUFBQTtBQUFBLFlBQUEsUUFBQSxHQUFXLGNBQWMsQ0FBQyxnQkFBZixDQUFBLENBQVgsQ0FBQTtBQUFBLFlBQ0EsR0FBQSxHQUFNLGNBQWMsQ0FBQyxnQkFBZixDQUFnQyx1QkFBaEMsQ0FETixDQUFBO0FBQUEsWUFFQSxDQUFBLEdBQUksQ0FGSixDQUFBO0FBSUE7aUJBQUEsZ0JBQUE7dUNBQUE7QUFDRSxjQUFBLEVBQUEsR0FBSyxHQUFJLENBQUEsQ0FBQSxFQUFBLENBQVQsQ0FBQTtBQUFBLGNBQ0EsR0FBQSxHQUFNLEVBQUUsQ0FBQyxnQkFBSCxDQUFvQixJQUFwQixDQUROLENBQUE7QUFBQSxjQUVBLFlBQUEsR0FBZSxPQUFPLENBQUMsWUFBUixDQUFBLENBRmYsQ0FBQTtBQUFBOztBQUlBO3FCQUFBLDJEQUFBLEdBQUE7QUFDRSxrQkFERyx1QkFBQSxJQUNILENBQUE7QUFBQSxpQ0FBQSxNQUFBLENBQU8sR0FBSSxDQUFBLENBQUEsQ0FBRSxDQUFDLGFBQVAsQ0FBcUIsT0FBckIsQ0FBNkIsQ0FBQyxXQUFyQyxDQUFpRCxDQUFDLE9BQWxELENBQTBELElBQTFELEVBQUEsQ0FERjtBQUFBOzttQkFKQSxDQURGO0FBQUE7NEJBTGdDO1VBQUEsQ0FBbEMsRUFKbUQ7UUFBQSxDQUFyRCxDQVhBLENBQUE7ZUE0QkEsUUFBQSxDQUFTLCtCQUFULEVBQTBDLFNBQUEsR0FBQTtBQUN4QyxVQUFBLFVBQUEsQ0FBVyxTQUFBLEdBQUE7bUJBQ1QsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLCtCQUFoQixFQUFpRCxJQUFqRCxFQURTO1VBQUEsQ0FBWCxDQUFBLENBQUE7aUJBR0EsRUFBQSxDQUFHLGtDQUFILEVBQXVDLFNBQUEsR0FBQTtBQUNyQyxnQkFBQSxHQUFBO0FBQUEsWUFBQSxHQUFBLEdBQU0sY0FBYyxDQUFDLGdCQUFmLENBQWdDLElBQWhDLENBQU4sQ0FBQTttQkFFQSxNQUFBLENBQU8sR0FBRyxDQUFDLE1BQVgsQ0FBa0IsQ0FBQyxPQUFuQixDQUEyQixFQUEzQixFQUhxQztVQUFBLENBQXZDLEVBSndDO1FBQUEsQ0FBMUMsRUE3QjZEO01BQUEsQ0FBL0QsQ0F2REEsQ0FBQTtBQUFBLE1BNkZBLFFBQUEsQ0FBUyxrQkFBVCxFQUE2QixTQUFBLEdBQUE7QUFDM0IsWUFBQSxVQUFBO0FBQUEsUUFBQyxhQUFjLEtBQWYsQ0FBQTtlQUVBLFFBQUEsQ0FBUyxjQUFULEVBQXlCLFNBQUEsR0FBQTtBQUN2QixVQUFBLFVBQUEsQ0FBVyxTQUFBLEdBQUE7QUFDVCxZQUFBLFVBQUEsR0FBYSxjQUFjLENBQUMsYUFBZixDQUE2QixzQkFBN0IsQ0FBYixDQUFBO0FBQUEsWUFDQSxVQUFVLENBQUMsYUFBWCxDQUF5Qix5QkFBekIsQ0FBbUQsQ0FBQyxZQUFwRCxDQUFpRSxVQUFqRSxFQUE2RSxVQUE3RSxDQURBLENBQUE7bUJBR0EsTUFBQSxDQUFPLFVBQVAsRUFKUztVQUFBLENBQVgsQ0FBQSxDQUFBO2lCQU1BLEVBQUEsQ0FBRyw0QkFBSCxFQUFpQyxTQUFBLEdBQUE7bUJBQy9CLE1BQUEsQ0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IsNEJBQWhCLENBQVAsQ0FBcUQsQ0FBQyxPQUF0RCxDQUE4RCxTQUE5RCxFQUQrQjtVQUFBLENBQWpDLEVBUHVCO1FBQUEsQ0FBekIsRUFIMkI7TUFBQSxDQUE3QixDQTdGQSxDQUFBO2FBMEdBLFFBQUEsQ0FBUyxtQkFBVCxFQUE4QixTQUFBLEdBQUE7QUFDNUIsWUFBQSxXQUFBO0FBQUEsUUFBQyxjQUFlLEtBQWhCLENBQUE7ZUFFQSxRQUFBLENBQVMsY0FBVCxFQUF5QixTQUFBLEdBQUE7QUFDdkIsVUFBQSxVQUFBLENBQVcsU0FBQSxHQUFBO0FBQ1QsWUFBQSxXQUFBLEdBQWMsY0FBYyxDQUFDLGFBQWYsQ0FBNkIsdUJBQTdCLENBQWQsQ0FBQTtBQUFBLFlBQ0EsV0FBVyxDQUFDLGFBQVosQ0FBMEIseUJBQTFCLENBQW9ELENBQUMsWUFBckQsQ0FBa0UsVUFBbEUsRUFBOEUsVUFBOUUsQ0FEQSxDQUFBO21CQUdBLE1BQUEsQ0FBTyxXQUFQLEVBSlM7VUFBQSxDQUFYLENBQUEsQ0FBQTtpQkFNQSxFQUFBLENBQUcsNEJBQUgsRUFBaUMsU0FBQSxHQUFBO21CQUMvQixNQUFBLENBQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLDZCQUFoQixDQUFQLENBQXNELENBQUMsT0FBdkQsQ0FBK0QsU0FBL0QsRUFEK0I7VUFBQSxDQUFqQyxFQVB1QjtRQUFBLENBQXpCLEVBSDRCO01BQUEsQ0FBOUIsRUEzRzJEO0lBQUEsQ0FBN0QsQ0F4Q0EsQ0FBQTtBQUFBLElBZ0tBLFFBQUEsQ0FBUyxpREFBVCxFQUE0RCxTQUFBLEdBQUE7QUFDMUQsTUFBQSxVQUFBLENBQVcsU0FBQSxHQUFBO0FBQ1QsUUFBQSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IsNEJBQWhCLEVBQThDLFNBQTlDLENBQUEsQ0FBQTtBQUFBLFFBQ0EsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLDZCQUFoQixFQUErQyxTQUEvQyxDQURBLENBQUE7ZUFFQSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IsK0JBQWhCLEVBQWlELElBQWpELEVBSFM7TUFBQSxDQUFYLENBQUEsQ0FBQTthQUtBLFFBQUEsQ0FBUyxrREFBVCxFQUE2RCxTQUFBLEdBQUE7QUFDM0QsUUFBQSxVQUFBLENBQVcsU0FBQSxHQUFBO0FBQ1QsVUFBQSxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQWQsQ0FBdUIsZ0JBQXZCLEVBQXlDLHVCQUF6QyxDQUFBLENBQUE7QUFBQSxVQUVBLFFBQUEsQ0FBUyxTQUFBLEdBQUE7bUJBQ1AsY0FBQSxHQUFpQixnQkFBZ0IsQ0FBQyxhQUFqQixDQUErQixrQkFBL0IsRUFEVjtVQUFBLENBQVQsQ0FGQSxDQUFBO2lCQUtBLElBQUEsQ0FBSyxTQUFBLEdBQUE7bUJBQ0gsT0FBQSxHQUFVLGNBQWMsQ0FBQyxRQUFmLENBQUEsRUFEUDtVQUFBLENBQUwsRUFOUztRQUFBLENBQVgsQ0FBQSxDQUFBO0FBQUEsUUFTQSxRQUFBLENBQVMsc0JBQVQsRUFBaUMsU0FBQSxHQUFBO2lCQUMvQixFQUFBLENBQUcsMkJBQUgsRUFBZ0MsU0FBQSxHQUFBO0FBQzlCLGdCQUFBLFVBQUE7QUFBQSxZQUFBLFVBQUEsR0FBYSxjQUFjLENBQUMsYUFBZixDQUE2QixzQkFBN0IsQ0FBYixDQUFBO21CQUNBLE1BQUEsQ0FBTyxVQUFVLENBQUMsYUFBWCxDQUF5QixrQkFBekIsQ0FBNEMsQ0FBQyxLQUFwRCxDQUEwRCxDQUFDLE9BQTNELENBQW1FLFNBQW5FLEVBRjhCO1VBQUEsQ0FBaEMsRUFEK0I7UUFBQSxDQUFqQyxDQVRBLENBQUE7QUFBQSxRQWNBLFFBQUEsQ0FBUyx1QkFBVCxFQUFrQyxTQUFBLEdBQUE7aUJBQ2hDLEVBQUEsQ0FBRywyQkFBSCxFQUFnQyxTQUFBLEdBQUE7QUFDOUIsZ0JBQUEsV0FBQTtBQUFBLFlBQUEsV0FBQSxHQUFjLGNBQWMsQ0FBQyxhQUFmLENBQTZCLHVCQUE3QixDQUFkLENBQUE7bUJBQ0EsTUFBQSxDQUFPLFdBQVcsQ0FBQyxhQUFaLENBQTBCLGtCQUExQixDQUE2QyxDQUFDLEtBQXJELENBQTJELENBQUMsT0FBNUQsQ0FBb0UsU0FBcEUsRUFGOEI7VUFBQSxDQUFoQyxFQURnQztRQUFBLENBQWxDLENBZEEsQ0FBQTtlQW1CQSxFQUFBLENBQUcsMkJBQUgsRUFBZ0MsU0FBQSxHQUFBO0FBQzlCLGNBQUEsYUFBQTtBQUFBLFVBQUEsYUFBQSxHQUFnQixjQUFjLENBQUMsYUFBZixDQUE2QixtQkFBN0IsQ0FBaEIsQ0FBQTtpQkFDQSxNQUFBLENBQU8sYUFBYSxDQUFDLE9BQXJCLENBQTZCLENBQUMsVUFBOUIsQ0FBQSxFQUY4QjtRQUFBLENBQWhDLEVBcEIyRDtNQUFBLENBQTdELEVBTjBEO0lBQUEsQ0FBNUQsQ0FoS0EsQ0FBQTtXQThMQSxRQUFBLENBQVMseUNBQVQsRUFBb0QsU0FBQSxHQUFBO0FBQ2xELFVBQUEsNkJBQUE7QUFBQSxNQUFBLFFBQTJCLEVBQTNCLEVBQUMsY0FBRCxFQUFNLDRCQUFOLENBQUE7QUFBQSxNQUNBLFVBQUEsQ0FBVyxTQUFBLEdBQUE7QUFDVCxRQUFBLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBZCxDQUF1QixnQkFBdkIsRUFBeUMsdUJBQXpDLENBQUEsQ0FBQTtBQUFBLFFBRUEsUUFBQSxDQUFTLFNBQUEsR0FBQTtpQkFDUCxjQUFBLEdBQWlCLGdCQUFnQixDQUFDLGFBQWpCLENBQStCLGtCQUEvQixFQURWO1FBQUEsQ0FBVCxDQUZBLENBQUE7QUFBQSxRQUtBLElBQUEsQ0FBSyxTQUFBLEdBQUE7QUFDSCxVQUFBLE9BQUEsR0FBVSxjQUFjLENBQUMsUUFBZixDQUFBLENBQVYsQ0FBQTtBQUFBLFVBQ0EsaUJBQUEsR0FBb0IsT0FBTyxDQUFDLGNBQVIsQ0FBQSxDQURwQixDQUFBO0FBQUEsVUFFQSxHQUFBLEdBQU0sT0FBTyxDQUFDLFNBQVIsQ0FBa0Isc0JBQWxCLENBRk4sQ0FBQTtBQUFBLFVBSUEsT0FBTyxDQUFDLG9CQUFSLENBQTZCLEdBQTdCLENBSkEsQ0FBQTtpQkFNQSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0Isc0JBQWhCLEVBQXdDLENBQ3RDLFFBRHNDLEVBRXRDLFFBRnNDLEVBR3RDLFFBSHNDLENBQXhDLEVBUEc7UUFBQSxDQUFMLENBTEEsQ0FBQTtlQWtCQSxRQUFBLENBQVMsU0FBQSxHQUFBO2lCQUFHLEdBQUcsQ0FBQyxTQUFKLEdBQWdCLEVBQW5CO1FBQUEsQ0FBVCxFQW5CUztNQUFBLENBQVgsQ0FEQSxDQUFBO2FBc0JBLEVBQUEsQ0FBRyxxQkFBSCxFQUEwQixTQUFBLEdBQUE7QUFDeEIsWUFBQSxHQUFBO0FBQUEsUUFBQSxNQUFBLENBQU8sT0FBTyxDQUFDLGNBQVIsQ0FBQSxDQUFQLENBQWdDLENBQUMsR0FBRyxDQUFDLE9BQXJDLENBQTZDLGlCQUE3QyxDQUFBLENBQUE7QUFBQSxRQUVBLEdBQUEsR0FBTSxjQUFjLENBQUMsZ0JBQWYsQ0FBZ0MsSUFBaEMsQ0FGTixDQUFBO2VBSUEsTUFBQSxDQUFPLEdBQUcsQ0FBQyxNQUFYLENBQWtCLENBQUMsR0FBRyxDQUFDLE9BQXZCLENBQStCLGlCQUEvQixFQUx3QjtNQUFBLENBQTFCLEVBdkJrRDtJQUFBLENBQXBELEVBL0x5QjtFQUFBLENBQTNCLENBTEEsQ0FBQTtBQUFBIgp9

//# sourceURL=/Users/dawsonbotsford/.atom/packages/pigments/spec/palette-element-spec.coffee
