(function() {
  var VariablesCollection;

  VariablesCollection = require('../lib/variables-collection');

  describe('VariablesCollection', function() {
    var changeSpy, collection, createVar, _ref;
    _ref = [], collection = _ref[0], changeSpy = _ref[1];
    createVar = function(name, value, range, path, line) {
      return {
        name: name,
        value: value,
        range: range,
        path: path,
        line: line
      };
    };
    return describe('with an empty collection', function() {
      beforeEach(function() {
        collection = new VariablesCollection;
        changeSpy = jasmine.createSpy('did-change');
        return collection.onDidChange(changeSpy);
      });
      describe('::addMany', function() {
        beforeEach(function() {
          return collection.addMany([createVar('foo', '#fff', [0, 10], '/path/to/foo.styl', 1), createVar('bar', '0.5', [12, 20], '/path/to/foo.styl', 2), createVar('baz', 'foo', [22, 30], '/path/to/foo.styl', 3), createVar('bat', 'bar', [32, 40], '/path/to/foo.styl', 4), createVar('bab', 'bat', [42, 50], '/path/to/foo.styl', 5)]);
        });
        it('stores them in the collection', function() {
          return expect(collection.length).toEqual(5);
        });
        it('detects that two of the variables are color variables', function() {
          return expect(collection.getColorVariables().length).toEqual(2);
        });
        it('dispatches a change event', function() {
          var arg;
          expect(changeSpy).toHaveBeenCalled();
          arg = changeSpy.mostRecentCall.args[0];
          expect(arg.created.length).toEqual(5);
          expect(arg.destroyed).toBeUndefined();
          return expect(arg.updated).toBeUndefined();
        });
        it('stores the names of the variables', function() {
          return expect(collection.variableNames.sort()).toEqual(['foo', 'bar', 'baz', 'bat', 'bab'].sort());
        });
        it('builds a dependencies map', function() {
          return expect(collection.dependencyGraph).toEqual({
            foo: ['baz'],
            bar: ['bat'],
            bat: ['bab']
          });
        });
        describe('appending an already existing variable', function() {
          beforeEach(function() {
            return collection.addMany([createVar('foo', '#fff', [0, 10], '/path/to/foo.styl', 1)]);
          });
          it('leaves the collection untouched', function() {
            expect(collection.length).toEqual(5);
            return expect(collection.getColorVariables().length).toEqual(2);
          });
          return it('does not trigger an update event', function() {
            return expect(changeSpy.callCount).toEqual(1);
          });
        });
        return describe('appending an already existing variable with a different value', function() {
          describe('that has a different range', function() {
            beforeEach(function() {
              return collection.addMany([createVar('foo', '#aabbcc', [0, 14], '/path/to/foo.styl', 1)]);
            });
            it('leaves the collection untouched', function() {
              expect(collection.length).toEqual(5);
              return expect(collection.getColorVariables().length).toEqual(2);
            });
            it('updates the existing variable value', function() {
              var variable;
              variable = collection.find({
                name: 'foo',
                path: '/path/to/foo.styl'
              });
              expect(variable.value).toEqual('#aabbcc');
              expect(variable.isColor).toBeTruthy();
              return expect(variable.color).toBeColor('#aabbcc');
            });
            return it('emits a change event', function() {
              var arg;
              expect(changeSpy.callCount).toEqual(2);
              arg = changeSpy.mostRecentCall.args[0];
              expect(arg.created).toBeUndefined();
              expect(arg.destroyed).toBeUndefined();
              return expect(arg.updated.length).toEqual(2);
            });
          });
          describe('that has a different range and a different line', function() {
            beforeEach(function() {
              return collection.addMany([createVar('foo', '#abc', [52, 64], '/path/to/foo.styl', 6)]);
            });
            it('appends the new variables', function() {
              expect(collection.length).toEqual(6);
              return expect(collection.getColorVariables().length).toEqual(3);
            });
            it('stores the two variables', function() {
              var variables;
              variables = collection.findAll({
                name: 'foo',
                path: '/path/to/foo.styl'
              });
              return expect(variables.length).toEqual(2);
            });
            return it('emits a change event', function() {
              var arg;
              expect(changeSpy.callCount).toEqual(2);
              arg = changeSpy.mostRecentCall.args[0];
              expect(arg.created.length).toEqual(1);
              expect(arg.destroyed).toBeUndefined();
              return expect(arg.updated.length).toEqual(1);
            });
          });
          describe('that is still a color', function() {
            beforeEach(function() {
              return collection.addMany([createVar('foo', '#abc', [0, 10], '/path/to/foo.styl', 1)]);
            });
            it('leaves the collection untouched', function() {
              expect(collection.length).toEqual(5);
              return expect(collection.getColorVariables().length).toEqual(2);
            });
            it('updates the existing variable value', function() {
              var variable;
              variable = collection.find({
                name: 'foo',
                path: '/path/to/foo.styl'
              });
              expect(variable.value).toEqual('#abc');
              expect(variable.isColor).toBeTruthy();
              return expect(variable.color).toBeColor('#abc');
            });
            return it('emits a change event', function() {
              var arg;
              expect(changeSpy.callCount).toEqual(2);
              arg = changeSpy.mostRecentCall.args[0];
              expect(arg.created).toBeUndefined();
              expect(arg.destroyed).toBeUndefined();
              return expect(arg.updated.length).toEqual(2);
            });
          });
          describe('that is no longer a color', function() {
            beforeEach(function() {
              return collection.addMany([createVar('foo', '20px', [0, 10], '/path/to/foo.styl', 1)]);
            });
            it('leaves the collection variables untouched', function() {
              return expect(collection.length).toEqual(5);
            });
            it('affects the colors variables within the collection', function() {
              return expect(collection.getColorVariables().length).toEqual(0);
            });
            it('updates the existing variable value', function() {
              var variable;
              variable = collection.find({
                name: 'foo',
                path: '/path/to/foo.styl'
              });
              expect(variable.value).toEqual('20px');
              return expect(variable.isColor).toBeFalsy();
            });
            it('updates the variables depending on the changed variable', function() {
              var variable;
              variable = collection.find({
                name: 'baz',
                path: '/path/to/foo.styl'
              });
              return expect(variable.isColor).toBeFalsy();
            });
            return it('emits a change event', function() {
              var arg;
              arg = changeSpy.mostRecentCall.args[0];
              expect(changeSpy.callCount).toEqual(2);
              expect(arg.created).toBeUndefined();
              expect(arg.destroyed).toBeUndefined();
              return expect(arg.updated.length).toEqual(2);
            });
          });
          describe('that breaks a dependency', function() {
            beforeEach(function() {
              return collection.addMany([createVar('baz', '#abc', [22, 30], '/path/to/foo.styl', 3)]);
            });
            it('leaves the collection untouched', function() {
              expect(collection.length).toEqual(5);
              return expect(collection.getColorVariables().length).toEqual(2);
            });
            it('updates the existing variable value', function() {
              var variable;
              variable = collection.find({
                name: 'baz',
                path: '/path/to/foo.styl'
              });
              expect(variable.value).toEqual('#abc');
              expect(variable.isColor).toBeTruthy();
              return expect(variable.color).toBeColor('#abc');
            });
            return it('updates the dependencies graph', function() {
              return expect(collection.dependencyGraph).toEqual({
                bar: ['bat'],
                bat: ['bab']
              });
            });
          });
          return describe('that adds a dependency', function() {
            beforeEach(function() {
              return collection.addMany([createVar('baz', 'transparentize(foo, bar)', [22, 30], '/path/to/foo.styl', 3)]);
            });
            it('leaves the collection untouched', function() {
              expect(collection.length).toEqual(5);
              return expect(collection.getColorVariables().length).toEqual(2);
            });
            it('updates the existing variable value', function() {
              var variable;
              variable = collection.find({
                name: 'baz',
                path: '/path/to/foo.styl'
              });
              expect(variable.value).toEqual('transparentize(foo, bar)');
              expect(variable.isColor).toBeTruthy();
              return expect(variable.color).toBeColor(255, 255, 255, 0.5);
            });
            return it('updates the dependencies graph', function() {
              return expect(collection.dependencyGraph).toEqual({
                foo: ['baz'],
                bar: ['bat', 'baz'],
                bat: ['bab']
              });
            });
          });
        });
      });
      describe('::removeMany', function() {
        beforeEach(function() {
          return collection.addMany([createVar('foo', '#fff', [0, 10], '/path/to/foo.styl', 1), createVar('bar', '0.5', [12, 20], '/path/to/foo.styl', 2), createVar('baz', 'foo', [22, 30], '/path/to/foo.styl', 3), createVar('bat', 'bar', [32, 40], '/path/to/foo.styl', 4), createVar('bab', 'bat', [42, 50], '/path/to/foo.styl', 5)]);
        });
        describe('with variables that were not colors', function() {
          beforeEach(function() {
            return collection.removeMany([createVar('bat', 'bar', [32, 40], '/path/to/foo.styl', 4), createVar('bab', 'bat', [42, 50], '/path/to/foo.styl', 5)]);
          });
          it('removes the variables from the collection', function() {
            return expect(collection.length).toEqual(3);
          });
          it('dispatches a change event', function() {
            var arg;
            expect(changeSpy).toHaveBeenCalled();
            arg = changeSpy.mostRecentCall.args[0];
            expect(arg.created).toBeUndefined();
            expect(arg.destroyed.length).toEqual(2);
            return expect(arg.updated).toBeUndefined();
          });
          it('stores the names of the variables', function() {
            return expect(collection.variableNames.sort()).toEqual(['foo', 'bar', 'baz'].sort());
          });
          it('updates the variables per path map', function() {
            return expect(collection.variablesByPath['/path/to/foo.styl'].length).toEqual(3);
          });
          return it('updates the dependencies map', function() {
            return expect(collection.dependencyGraph).toEqual({
              foo: ['baz']
            });
          });
        });
        return describe('with variables that were referenced by a color variable', function() {
          beforeEach(function() {
            return collection.removeMany([createVar('foo', '#fff', [0, 10], '/path/to/foo.styl', 1)]);
          });
          it('removes the variables from the collection', function() {
            expect(collection.length).toEqual(4);
            return expect(collection.getColorVariables().length).toEqual(0);
          });
          it('dispatches a change event', function() {
            var arg;
            expect(changeSpy).toHaveBeenCalled();
            arg = changeSpy.mostRecentCall.args[0];
            expect(arg.created).toBeUndefined();
            expect(arg.destroyed.length).toEqual(1);
            return expect(arg.updated.length).toEqual(1);
          });
          it('stores the names of the variables', function() {
            return expect(collection.variableNames.sort()).toEqual(['bar', 'baz', 'bat', 'bab'].sort());
          });
          it('updates the variables per path map', function() {
            return expect(collection.variablesByPath['/path/to/foo.styl'].length).toEqual(4);
          });
          return it('updates the dependencies map', function() {
            return expect(collection.dependencyGraph).toEqual({
              bar: ['bat'],
              bat: ['bab']
            });
          });
        });
      });
      describe('::updatePathCollection', function() {
        beforeEach(function() {
          return collection.addMany([createVar('foo', '#fff', [0, 10], '/path/to/foo.styl', 1), createVar('bar', '0.5', [12, 20], '/path/to/foo.styl', 2), createVar('baz', 'foo', [22, 30], '/path/to/foo.styl', 3), createVar('bat', 'bar', [32, 40], '/path/to/foo.styl', 4), createVar('bab', 'bat', [42, 50], '/path/to/foo.styl', 5)]);
        });
        describe('when a new variable is added', function() {
          beforeEach(function() {
            return collection.updatePathCollection('/path/to/foo.styl', [createVar('foo', '#fff', [0, 10], '/path/to/foo.styl', 1), createVar('bar', '0.5', [12, 20], '/path/to/foo.styl', 2), createVar('baz', 'foo', [22, 30], '/path/to/foo.styl', 3), createVar('bat', 'bar', [32, 40], '/path/to/foo.styl', 4), createVar('bab', 'bat', [42, 50], '/path/to/foo.styl', 5), createVar('baa', '#f00', [52, 60], '/path/to/foo.styl', 6)]);
          });
          return it('detects the addition and leave the rest of the collection unchanged', function() {
            expect(collection.length).toEqual(6);
            expect(collection.getColorVariables().length).toEqual(3);
            expect(changeSpy.mostRecentCall.args[0].created.length).toEqual(1);
            expect(changeSpy.mostRecentCall.args[0].destroyed).toBeUndefined();
            return expect(changeSpy.mostRecentCall.args[0].updated).toBeUndefined();
          });
        });
        describe('when a variable is removed', function() {
          beforeEach(function() {
            return collection.updatePathCollection('/path/to/foo.styl', [createVar('foo', '#fff', [0, 10], '/path/to/foo.styl', 1), createVar('bar', '0.5', [12, 20], '/path/to/foo.styl', 2), createVar('baz', 'foo', [22, 30], '/path/to/foo.styl', 3), createVar('bat', 'bar', [32, 40], '/path/to/foo.styl', 4)]);
          });
          return it('removes the variable that is not present in the new array', function() {
            expect(collection.length).toEqual(4);
            expect(collection.getColorVariables().length).toEqual(2);
            expect(changeSpy.mostRecentCall.args[0].destroyed.length).toEqual(1);
            expect(changeSpy.mostRecentCall.args[0].created).toBeUndefined();
            return expect(changeSpy.mostRecentCall.args[0].updated).toBeUndefined();
          });
        });
        return describe('when a new variable is changed', function() {
          beforeEach(function() {
            return collection.updatePathCollection('/path/to/foo.styl', [createVar('foo', '#fff', [0, 10], '/path/to/foo.styl', 1), createVar('bar', '0.5', [12, 20], '/path/to/foo.styl', 2), createVar('baz', 'foo', [22, 30], '/path/to/foo.styl', 3), createVar('bat', '#abc', [32, 40], '/path/to/foo.styl', 4), createVar('bab', 'bat', [42, 50], '/path/to/foo.styl', 5)]);
          });
          return it('detects the update', function() {
            expect(collection.length).toEqual(5);
            expect(collection.getColorVariables().length).toEqual(4);
            expect(changeSpy.mostRecentCall.args[0].updated.length).toEqual(2);
            expect(changeSpy.mostRecentCall.args[0].destroyed).toBeUndefined();
            return expect(changeSpy.mostRecentCall.args[0].created).toBeUndefined();
          });
        });
      });
      describe('::serialize', function() {
        describe('with an empty collection', function() {
          return it('returns an empty serialized collection', function() {
            return expect(collection.serialize()).toEqual({
              deserializer: 'VariablesCollection',
              content: []
            });
          });
        });
        describe('with a collection that contains a non-color variable', function() {
          beforeEach(function() {
            return collection.add(createVar('bar', '0.5', [12, 20], '/path/to/foo.styl', 2));
          });
          return it('returns the serialized collection', function() {
            return expect(collection.serialize()).toEqual({
              deserializer: 'VariablesCollection',
              content: [
                {
                  name: 'bar',
                  value: '0.5',
                  range: [12, 20],
                  path: '/path/to/foo.styl',
                  line: 2
                }
              ]
            });
          });
        });
        describe('with a collection that contains a color variable', function() {
          beforeEach(function() {
            return collection.add(createVar('bar', '#abc', [12, 20], '/path/to/foo.styl', 2));
          });
          return it('returns the serialized collection', function() {
            return expect(collection.serialize()).toEqual({
              deserializer: 'VariablesCollection',
              content: [
                {
                  name: 'bar',
                  value: '#abc',
                  range: [12, 20],
                  path: '/path/to/foo.styl',
                  line: 2,
                  isColor: true,
                  color: [170, 187, 204, 1],
                  variables: []
                }
              ]
            });
          });
        });
        return describe('with a collection that contains color variables with references', function() {
          beforeEach(function() {
            collection.add(createVar('foo', '#abc', [0, 10], '/path/to/foo.styl', 1));
            return collection.add(createVar('bar', 'foo', [12, 20], '/path/to/foo.styl', 2));
          });
          return it('returns the serialized collection', function() {
            return expect(collection.serialize()).toEqual({
              deserializer: 'VariablesCollection',
              content: [
                {
                  name: 'foo',
                  value: '#abc',
                  range: [0, 10],
                  path: '/path/to/foo.styl',
                  line: 1,
                  isColor: true,
                  color: [170, 187, 204, 1],
                  variables: []
                }, {
                  name: 'bar',
                  value: 'foo',
                  range: [12, 20],
                  path: '/path/to/foo.styl',
                  line: 2,
                  isColor: true,
                  color: [170, 187, 204, 1],
                  variables: ['foo']
                }
              ]
            });
          });
        });
      });
      return describe('.deserialize', function() {
        beforeEach(function() {
          return collection = atom.deserializers.deserialize({
            deserializer: 'VariablesCollection',
            content: [
              {
                name: 'foo',
                value: '#abc',
                range: [0, 10],
                path: '/path/to/foo.styl',
                line: 1,
                isColor: true,
                color: [170, 187, 204, 1],
                variables: []
              }, {
                name: 'bar',
                value: 'foo',
                range: [12, 20],
                path: '/path/to/foo.styl',
                line: 2,
                isColor: true,
                color: [170, 187, 204, 1],
                variables: ['foo']
              }, {
                name: 'baz',
                value: '0.5',
                range: [22, 30],
                path: '/path/to/foo.styl',
                line: 3
              }
            ]
          });
        });
        it('restores the variables', function() {
          expect(collection.length).toEqual(3);
          return expect(collection.getColorVariables().length).toEqual(2);
        });
        return it('restores all the denormalized data in the collection', function() {
          expect(collection.variableNames).toEqual(['foo', 'bar', 'baz']);
          expect(Object.keys(collection.variablesByPath)).toEqual(['/path/to/foo.styl']);
          expect(collection.variablesByPath['/path/to/foo.styl'].length).toEqual(3);
          return expect(collection.dependencyGraph).toEqual({
            foo: ['bar']
          });
        });
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rhd3NvbmJvdHNmb3JkLy5hdG9tL3BhY2thZ2VzL3BpZ21lbnRzL3NwZWMvdmFyaWFibGVzLWNvbGxlY3Rpb24tc3BlYy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsbUJBQUE7O0FBQUEsRUFBQSxtQkFBQSxHQUFzQixPQUFBLENBQVEsNkJBQVIsQ0FBdEIsQ0FBQTs7QUFBQSxFQUVBLFFBQUEsQ0FBUyxxQkFBVCxFQUFnQyxTQUFBLEdBQUE7QUFDOUIsUUFBQSxzQ0FBQTtBQUFBLElBQUEsT0FBMEIsRUFBMUIsRUFBQyxvQkFBRCxFQUFhLG1CQUFiLENBQUE7QUFBQSxJQUVBLFNBQUEsR0FBWSxTQUFDLElBQUQsRUFBTyxLQUFQLEVBQWMsS0FBZCxFQUFxQixJQUFyQixFQUEyQixJQUEzQixHQUFBO2FBQ1Y7QUFBQSxRQUFDLE1BQUEsSUFBRDtBQUFBLFFBQU8sT0FBQSxLQUFQO0FBQUEsUUFBYyxPQUFBLEtBQWQ7QUFBQSxRQUFxQixNQUFBLElBQXJCO0FBQUEsUUFBMkIsTUFBQSxJQUEzQjtRQURVO0lBQUEsQ0FGWixDQUFBO1dBS0EsUUFBQSxDQUFTLDBCQUFULEVBQXFDLFNBQUEsR0FBQTtBQUNuQyxNQUFBLFVBQUEsQ0FBVyxTQUFBLEdBQUE7QUFDVCxRQUFBLFVBQUEsR0FBYSxHQUFBLENBQUEsbUJBQWIsQ0FBQTtBQUFBLFFBQ0EsU0FBQSxHQUFZLE9BQU8sQ0FBQyxTQUFSLENBQWtCLFlBQWxCLENBRFosQ0FBQTtlQUVBLFVBQVUsQ0FBQyxXQUFYLENBQXVCLFNBQXZCLEVBSFM7TUFBQSxDQUFYLENBQUEsQ0FBQTtBQUFBLE1BYUEsUUFBQSxDQUFTLFdBQVQsRUFBc0IsU0FBQSxHQUFBO0FBQ3BCLFFBQUEsVUFBQSxDQUFXLFNBQUEsR0FBQTtpQkFDVCxVQUFVLENBQUMsT0FBWCxDQUFt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

//# sourceURL=/Users/dawsonbotsford/.atom/packages/pigments/spec/variables-collection-spec.coffee
