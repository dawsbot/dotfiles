(function() {
  var CodeContextBuilder;

  CodeContextBuilder = require('../lib/code-context-builder');

  describe('CodeContextBuilder', function() {
    beforeEach(function() {
      this.editorMock = {
        getTitle: function() {},
        getPath: function() {},
        getText: function() {},
        getLastSelection: function() {
          return {
            isEmpty: function() {
              return false;
            }
          };
        },
        getGrammar: function() {
          return {
            name: 'JavaScript'
          };
        },
        getLastCursor: function() {},
        save: function() {}
      };
      spyOn(this.editorMock, 'getTitle').andReturn('file.js');
      spyOn(this.editorMock, 'getPath').andReturn('path/to/file.js');
      spyOn(this.editorMock, 'getText').andReturn('console.log("hello")\n');
      return this.codeContextBuilder = new CodeContextBuilder;
    });
    describe('initCodeContext', function() {
      it('sets correct text source for empty selection', function() {
        var codeContext, selection;
        selection = {
          isEmpty: function() {
            return true;
          }
        };
        spyOn(this.editorMock, 'getLastSelection').andReturn(selection);
        codeContext = this.codeContextBuilder.initCodeContext(this.editorMock);
        expect(codeContext.textSource).toEqual(this.editorMock);
        expect(codeContext.filename).toEqual('file.js');
        return expect(codeContext.filepath).toEqual('path/to/file.js');
      });
      it('sets correct text source for non-empty selection', function() {
        var codeContext, selection;
        selection = {
          isEmpty: function() {
            return false;
          }
        };
        spyOn(this.editorMock, 'getLastSelection').andReturn(selection);
        codeContext = this.codeContextBuilder.initCodeContext(this.editorMock);
        expect(codeContext.textSource).toEqual(selection);
        return expect(codeContext.selection).toEqual(selection);
      });
      return it('sets correct lang', function() {
        var codeContext;
        codeContext = this.codeContextBuilder.initCodeContext(this.editorMock);
        return expect(codeContext.lang).toEqual('JavaScript');
      });
    });
    return describe('buildCodeContext', function() {
      var argType, _i, _len, _ref, _results;
      _ref = ['Selection Based', 'Line Number Based'];
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        argType = _ref[_i];
        _results.push(it("sets lineNumber with screenRow + 1 when " + argType, function() {
          var codeContext, cursor;
          cursor = {
            getScreenRow: function() {
              return 1;
            }
          };
          spyOn(this.editorMock, 'getLastCursor').andReturn(cursor);
          codeContext = this.codeContextBuilder.buildCodeContext(this.editorMock, argType);
          expect(codeContext.argType).toEqual(argType);
          return expect(codeContext.lineNumber).toEqual(2);
        }));
      }
      return _results;
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rhd3NvbmJvdHNmb3JkLy5hdG9tL3BhY2thZ2VzL3NjcmlwdC9zcGVjL2NvZGUtY29udGV4dC1idWlsZGVyLXNwZWMuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLGtCQUFBOztBQUFBLEVBQUEsa0JBQUEsR0FBcUIsT0FBQSxDQUFRLDZCQUFSLENBQXJCLENBQUE7O0FBQUEsRUFFQSxRQUFBLENBQVMsb0JBQVQsRUFBK0IsU0FBQSxHQUFBO0FBQzdCLElBQUEsVUFBQSxDQUFXLFNBQUEsR0FBQTtBQUNULE1BQUEsSUFBQyxDQUFBLFVBQUQsR0FDRTtBQUFBLFFBQUEsUUFBQSxFQUFVLFNBQUEsR0FBQSxDQUFWO0FBQUEsUUFDQSxPQUFBLEVBQVMsU0FBQSxHQUFBLENBRFQ7QUFBQSxRQUVBLE9BQUEsRUFBUyxTQUFBLEdBQUEsQ0FGVDtBQUFBLFFBR0EsZ0JBQUEsRUFBa0IsU0FBQSxHQUFBO2lCQUNoQjtBQUFBLFlBQUEsT0FBQSxFQUFTLFNBQUEsR0FBQTtxQkFDUCxNQURPO1lBQUEsQ0FBVDtZQURnQjtRQUFBLENBSGxCO0FBQUEsUUFNQSxVQUFBLEVBQVksU0FBQSxHQUFBO2lCQUNWO0FBQUEsWUFBQSxJQUFBLEVBQU0sWUFBTjtZQURVO1FBQUEsQ0FOWjtBQUFBLFFBUUEsYUFBQSxFQUFlLFNBQUEsR0FBQSxDQVJmO0FBQUEsUUFTQSxJQUFBLEVBQU0sU0FBQSxHQUFBLENBVE47T0FERixDQUFBO0FBQUEsTUFZQSxLQUFBLENBQU0sSUFBQyxDQUFBLFVBQVAsRUFBbUIsVUFBbkIsQ0FBOEIsQ0FBQyxTQUEvQixDQUF5QyxTQUF6QyxDQVpBLENBQUE7QUFBQSxNQWFBLEtBQUEsQ0FBTSxJQUFDLENBQUEsVUFBUCxFQUFtQixTQUFuQixDQUE2QixDQUFDLFNBQTlCLENBQXdDLGlCQUF4QyxDQWJB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

//# sourceURL=/Users/dawsonbotsford/.atom/packages/script/spec/code-context-builder-spec.coffee
