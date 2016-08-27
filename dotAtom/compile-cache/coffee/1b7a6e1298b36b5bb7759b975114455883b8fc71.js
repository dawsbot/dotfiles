(function() {
  var Point, Range, actionUtils, editorUtils, emmet, insertSnippet, normalize, path, preprocessSnippet, resources, tabStops, utils, visualize, _ref;

  _ref = require('atom'), Point = _ref.Point, Range = _ref.Range;

  path = require('path');

  emmet = require('emmet');

  utils = require('emmet/lib/utils/common');

  tabStops = require('emmet/lib/assets/tabStops');

  resources = require('emmet/lib/assets/resources');

  editorUtils = require('emmet/lib/utils/editor');

  actionUtils = require('emmet/lib/utils/action');

  insertSnippet = function(snippet, editor) {
    var _ref1, _ref2, _ref3, _ref4;
    if ((_ref1 = atom.packages.getLoadedPackage('snippets')) != null) {
      if ((_ref2 = _ref1.mainModule) != null) {
        _ref2.insert(snippet, editor);
      }
    }
    return editor.snippetExpansion = (_ref3 = atom.packages.getLoadedPackage('snippets')) != null ? (_ref4 = _ref3.mainModule) != null ? _ref4.getExpansions(editor)[0] : void 0 : void 0;
  };

  visualize = function(str) {
    return str.replace(/\t/g, '\\t').replace(/\n/g, '\\n').replace(/\s/g, '\\s');
  };

  normalize = function(text, editor) {
    return editorUtils.normalize(text, {
      indentation: editor.getTabText(),
      newline: '\n'
    });
  };

  preprocessSnippet = function(value) {
    var order, tabstopOptions;
    order = [];
    tabstopOptions = {
      tabstop: function(data) {
        var group, placeholder;
        group = parseInt(data.group, 10);
        if (group === 0) {
          order.push(-1);
          group = order.length;
        } else {
          if (order.indexOf(group) === -1) {
            order.push(group);
          }
          group = order.indexOf(group) + 1;
        }
        placeholder = data.placeholder || '';
        if (placeholder) {
          placeholder = tabStops.processText(placeholder, tabstopOptions);
        }
        if (placeholder) {
          return "${" + group + ":" + placeholder + "}";
        } else {
          return "${" + group + "}";
        }
      },
      escape: function(ch) {
        if (ch === '$') {
          return '\\$';
        } else {
          return ch;
        }
      }
    };
    return tabStops.processText(value, tabstopOptions);
  };

  module.exports = {
    setup: function(editor, selectionIndex) {
      var buf, bufRanges;
      this.editor = editor;
      this.selectionIndex = selectionIndex != null ? selectionIndex : 0;
      buf = this.editor.getBuffer();
      bufRanges = this.editor.getSelectedBufferRanges();
      return this._selection = {
        index: 0,
        saved: new Array(bufRanges.length),
        bufferRanges: bufRanges,
        indexRanges: bufRanges.map(function(range) {
          return {
            start: buf.characterIndexForPosition(range.start),
            end: buf.characterIndexForPosition(range.end)
          };
        })
      };
    },
    exec: function(fn) {
      var ix, success;
      ix = this._selection.bufferRanges.length - 1;
      this._selection.saved = [];
      success = true;
      while (ix >= 0) {
        this._selection.index = ix;
        if (fn(this._selection.index) === false) {
          success = false;
          break;
        }
        ix--;
      }
      if (success && this._selection.saved.length > 1) {
        return this._setSelectedBufferRanges(this._selection.saved);
      }
    },
    _setSelectedBufferRanges: function(sels) {
      var filteredSels;
      filteredSels = sels.filter(function(s) {
        return !!s;
      });
      if (filteredSels.length) {
        return this.editor.setSelectedBufferRanges(filteredSels);
      }
    },
    _saveSelection: function(delta) {
      var i, range, _results;
      this._selection.saved[this._selection.index] = this.editor.getSelectedBufferRange();
      if (delta) {
        i = this._selection.index;
        delta = Point.fromObject([delta, 0]);
        _results = [];
        while (++i < this._selection.saved.length) {
          range = this._selection.saved[i];
          if (range) {
            _results.push(this._selection.saved[i] = new Range(range.start.translate(delta), range.end.translate(delta)));
          } else {
            _results.push(void 0);
          }
        }
        return _results;
      }
    },
    selectionList: function() {
      return this._selection.indexRanges;
    },
    getCaretPos: function() {
      return this.getSelectionRange().start;
    },
    setCaretPos: function(pos) {
      return this.createSelection(pos);
    },
    getSelectionRange: function() {
      return this._selection.indexRanges[this._selection.index];
    },
    getSelectionBufferRange: function() {
      return this._selection.bufferRanges[this._selection.index];
    },
    createSelection: function(start, end) {
      var buf, sels;
      if (end == null) {
        end = start;
      }
      sels = this._selection.bufferRanges;
      buf = this.editor.getBuffer();
      sels[this._selection.index] = new Range(buf.positionForCharacterIndex(start), buf.positionForCharacterIndex(end));
      return this._setSelectedBufferRanges(sels);
    },
    getSelection: function() {
      return this.editor.getTextInBufferRange(this.getSelectionBufferRange());
    },
    getCurrentLineRange: function() {
      var index, lineLength, row, sel;
      sel = this.getSelectionBufferRange();
      row = sel.getRows()[0];
      lineLength = this.editor.lineTextForBufferRow(row).length;
      index = this.editor.getBuffer().characterIndexForPosition({
        row: row,
        column: 0
      });
      return {
        start: index,
        end: index + lineLength
      };
    },
    getCurrentLine: function() {
      var row, sel;
      sel = this.getSelectionBufferRange();
      row = sel.getRows()[0];
      return this.editor.lineTextForBufferRow(row);
    },
    getContent: function() {
      return this.editor.getText();
    },
    replaceContent: function(value, start, end, noIndent) {
      var buf, caret, changeRange, oldValue;
      if (end == null) {
        end = start == null ? this.getContent().length : start;
      }
      if (start == null) {
        start = 0;
      }
      value = normalize(value, this.editor);
      buf = this.editor.getBuffer();
      changeRange = new Range(Point.fromObject(buf.positionForCharacterIndex(start)), Point.fromObject(buf.positionForCharacterIndex(end)));
      oldValue = this.editor.getTextInBufferRange(changeRange);
      buf.setTextInRange(changeRange, '');
      caret = buf.positionForCharacterIndex(start);
      this.editor.setSelectedBufferRange(new Range(caret, caret));
      insertSnippet(preprocessSnippet(value), this.editor);
      this._saveSelection(utils.splitByLines(value).length - utils.splitByLines(oldValue).length);
      return value;
    },
    getGrammar: function() {
      return this.editor.getGrammar().scopeName.toLowerCase();
    },
    getSyntax: function() {
      var m, scope, sourceSyntax, syntax, _ref1;
      scope = this.getCurrentScope().join(' ');
      if (~scope.indexOf('xsl')) {
        return 'xsl';
      }
      if (!/\bstring\b/.test(scope) && /\bsource\.(js|ts)x?\b/.test(scope)) {
        return 'jsx';
      }
      sourceSyntax = (_ref1 = scope.match(/\bsource\.([\w\-]+)/)) != null ? _ref1[0] : void 0;
      if (!/\bstring\b/.test(scope) && sourceSyntax && resources.hasSyntax(sourceSyntax)) {
        syntax = sourceSyntax;
      } else {
        m = scope.match(/\b(source|text)\.[\w\-\.]+/);
        syntax = m != null ? m[0].split('.').reduceRight(function(result, token) {
          return result || (resources.hasSyntax(token) ? token : void 0);
        }, null) : void 0;
      }
      return actionUtils.detectSyntax(this, syntax || 'html');
    },
    getCurrentScope: function() {
      var range;
      range = this._selection.bufferRanges[this._selection.index];
      return this.editor.scopeDescriptorForBufferPosition(range.start).getScopesArray();
    },
    getProfileName: function() {
      if (this.getCurrentScope().some(function(scope) {
        return /\bstring\.quoted\b/.test(scope);
      })) {
        return 'line';
      } else {
        return actionUtils.detectProfile(this);
      }
    },
    getFilePath: function() {
      return this.editor.buffer.file.path;
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rhd3NvbmJvdHNmb3JkLy5hdG9tL3BhY2thZ2VzL2VtbWV0L2xpYi9lZGl0b3ItcHJveHkuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLDZJQUFBOztBQUFBLEVBQUEsT0FBaUIsT0FBQSxDQUFRLE1BQVIsQ0FBakIsRUFBQyxhQUFBLEtBQUQsRUFBUSxhQUFBLEtBQVIsQ0FBQTs7QUFBQSxFQUNBLElBQUEsR0FBaUIsT0FBQSxDQUFRLE1BQVIsQ0FEakIsQ0FBQTs7QUFBQSxFQUdBLEtBQUEsR0FBYyxPQUFBLENBQVEsT0FBUixDQUhkLENBQUE7O0FBQUEsRUFJQSxLQUFBLEdBQWMsT0FBQSxDQUFRLHdCQUFSLENBSmQsQ0FBQTs7QUFBQSxFQUtBLFFBQUEsR0FBYyxPQUFBLENBQVEsMkJBQVIsQ0FMZCxDQUFBOztBQUFBLEVBTUEsU0FBQSxHQUFjLE9BQUEsQ0FBUSw0QkFBUixDQU5kLENBQUE7O0FBQUEsRUFPQSxXQUFBLEdBQWMsT0FBQSxDQUFRLHdCQUFSLENBUGQsQ0FBQTs7QUFBQSxFQVFBLFdBQUEsR0FBYyxPQUFBLENBQVEsd0JBQVIsQ0FSZCxDQUFBOztBQUFBLEVBVUEsYUFBQSxHQUFnQixTQUFDLE9BQUQsRUFBVSxNQUFWLEdBQUE7QUFDZCxRQUFBLDBCQUFBOzs7YUFBc0QsQ0FBRSxNQUF4RCxDQUErRCxPQUEvRCxFQUF3RSxNQUF4RTs7S0FBQTtXQUdBLE1BQU0sQ0FBQyxnQkFBUCw0R0FBZ0YsQ0FBRSxhQUF4RCxDQUFzRSxNQUF0RSxDQUE4RSxDQUFBLENBQUEsb0JBSjFGO0VBQUEsQ0FWaEIsQ0FBQTs7QUFBQSxFQWdCQSxTQUFBLEdBQVksU0FBQyxHQUFELEdBQUE7V0FDVixHQUNFLENBQUMsT0FESCxDQUNXLEtBRFgsRUFDa0IsS0FEbEIsQ0FFRSxDQUFDLE9BRkgsQ0FFVyxL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

//# sourceURL=/Users/dawsonbotsford/.atom/packages/emmet/lib/editor-proxy.coffee
