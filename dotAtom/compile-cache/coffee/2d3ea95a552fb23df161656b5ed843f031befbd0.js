(function() {
  var AFTERPROPS, AutoIndent, BRACE_CLOSE, BRACE_OPEN, CompositeDisposable, File, InsertNlJsx, JSXBRACE_CLOSE, JSXBRACE_OPEN, JSXTAG_CLOSE, JSXTAG_CLOSE_ATTRS, JSXTAG_OPEN, JSXTAG_SELFCLOSE_END, JSXTAG_SELFCLOSE_START, JS_ELSE, JS_IF, LINEALIGNED, NO_TOKEN, PROPSALIGNED, Point, Range, TAGALIGNED, TERNARY_ELSE, TERNARY_IF, YAML, autoCompleteJSX, fs, path, stripJsonComments, _ref,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  _ref = require('atom'), CompositeDisposable = _ref.CompositeDisposable, File = _ref.File, Range = _ref.Range, Point = _ref.Point;

  fs = require('fs-plus');

  path = require('path');

  autoCompleteJSX = require('./auto-complete-jsx');

  InsertNlJsx = require('./insert-nl-jsx');

  stripJsonComments = require('strip-json-comments');

  YAML = require('js-yaml');

  NO_TOKEN = 0;

  JSXTAG_SELFCLOSE_START = 1;

  JSXTAG_SELFCLOSE_END = 2;

  JSXTAG_OPEN = 3;

  JSXTAG_CLOSE_ATTRS = 4;

  JSXTAG_CLOSE = 5;

  JSXBRACE_OPEN = 6;

  JSXBRACE_CLOSE = 7;

  BRACE_OPEN = 8;

  BRACE_CLOSE = 9;

  TERNARY_IF = 10;

  TERNARY_ELSE = 11;

  JS_IF = 12;

  JS_ELSE = 13;

  TAGALIGNED = 'tag-aligned';

  LINEALIGNED = 'line-aligned';

  AFTERPROPS = 'after-props';

  PROPSALIGNED = 'props-aligned';

  module.exports = AutoIndent = (function() {
    function AutoIndent(editor) {
      this.editor = editor;
      this.onMouseUp = __bind(this.onMouseUp, this);
      this.onMouseDown = __bind(this.onMouseDown, this);
      this.handleOnDidStopChanging = __bind(this.handleOnDidStopChanging, this);
      this.changedCursorPosition = __bind(this.changedCursorPosition, this);
      this.insertNlJsx = new InsertNlJsx(this.editor);
      this.autoJsx = atom.config.get('language-babel').autoIndentJSX;
      this.JSXREGEXP = /(<)([$_A-Za-z](?:[$_.:\-A-Za-z0-9])*)|(\/>)|(<\/)([$_A-Za-z](?:[$._:\-A-Za-z0-9])*)(>)|(>)|({)|(})|(\?)|(:)|(if)|(else)/g;
      this.mouseUp = true;
      this.multipleCursorTrigger = 1;
      this.disposables = new CompositeDisposable();
      this.eslintIndentOptions = this.getIndentOptions();
      this.disposables.add(atom.commands.add('atom-text-editor', {
        'language-babel:auto-indent-jsx-on': (function(_this) {
          return function(event) {
            _this.autoJsx = true;
            return _this.eslintIndentOptions = _this.getIndentOptions();
          };
        })(this)
      }));
      this.disposables.add(atom.commands.add('atom-text-editor', {
        'language-babel:auto-indent-jsx-off': (function(_this) {
          return function(event) {
            return _this.autoJsx = false;
          };
        })(this)
      }));
      this.disposables.add(atom.commands.add('atom-text-editor', {
        'language-babel:toggle-auto-indent-jsx': (function(_this) {
          return function(event) {
            _this.autoJsx = !_this.autoJsx;
            if (_this.autoJsx) {
              return _this.eslintIndentOptions = _this.getIndentOptions();
            }
          };
        })(this)
      }));
      document.addEventListener('mousedown', this.onMouseDown);
      document.addEventListener('mouseup', this.onMouseUp);
      this.disposables.add(this.editor.onDidChangeCursorPosition((function(_this) {
        return function(event) {
          return _this.changedCursorPosition(event);
        };
      })(this)));
      this.handleOnDidStopChanging();
    }

    AutoIndent.prototype.destroy = function() {
      this.disposables.dispose();
      this.onDidStopChangingHandler.dispose();
      document.removeEventListener('mousedown', this.onMouseDown);
      return document.removeEventListener('mouseup', this.onMouseUp);
    };

    AutoIndent.prototype.changedCursorPosition = function(event) {
      var blankLineEndPos, bufferRow, columnToMoveTo, cursorPosition, cursorPositions, endPointOfJsx, previousRow, startPointOfJsx, _i, _len, _ref1, _ref2;
      if (!this.autoJsx) {
        return;
      }
      if (!this.mouseUp) {
        return;
      }
      if (event.oldBufferPosition.row === event.newBufferPosition.row) {
        return;
      }
      bufferRow = event.newBufferPosition.row;
      if (this.editor.hasMultipleCursors()) {
        cursorPositions = this.editor.getCursorBufferPositions();
        if (cursorPositions.length === this.multipleCursorTrigger) {
          this.multipleCursorTrigger = 1;
          bufferRow = 0;
          for (_i = 0, _len = cursorPositions.length; _i < _len; _i++) {
            cursorPosition = cursorPositions[_i];
            if (cursorPosition.row > bufferRow) {
              bufferRow = cursorPosition.row;
            }
          }
        } else {
          this.multipleCursorTrigger++;
          return;
        }
      } else {
        cursorPosition = event.newBufferPosition;
      }
      previousRow = event.oldBufferPosition.row;
      if (this.jsxInScope(previousRow)) {
        blankLineEndPos = (_ref1 = /^\s*$/.exec(this.editor.lineTextForBufferRow(previousRow))) != null ? _ref1[0].length : void 0;
        if (blankLineEndPos != null) {
          this.indentRow({
            row: previousRow,
            blockIndent: 0
          });
        }
      }
      if (!this.jsxInScope(bufferRow)) {
        return;
      }
      endPointOfJsx = new Point(bufferRow, 0);
      startPointOfJsx = autoCompleteJSX.getStartOfJSX(this.editor, cursorPosition);
      this.indentJSX(new Range(startPointOfJsx, endPointOfJsx));
      columnToMoveTo = (_ref2 = /^\s*$/.exec(this.editor.lineTextForBufferRow(bufferRow))) != null ? _ref2[0].length : void 0;
      if (columnToMoveTo != null) {
        return this.editor.setCursorBufferPosition([bufferRow, columnToMoveTo]);
      }
    };

    AutoIndent.prototype.didStopChanging = function() {
      var endPointOfJsx, highestRow, lowestRow, selectedRange, startPointOfJsx;
      if (!this.autoJsx) {
        return;
      }
      if (!this.mouseUp) {
        return;
      }
      selectedRange = this.editor.getSelectedBufferRange();
      if (selectedRange.start.row === selectedRange.end.row && selectedRange.start.column === selectedRange.end.column && __indexOf.call(this.editor.scopeDescriptorForBufferPosition([selectedRange.start.row, selectedRange.start.column]).getScopesArray(), 'JSXStartTagEnd') >= 0) {
        return;
      }
      highestRow = Math.max(selectedRange.start.row, selectedRange.end.row);
      lowestRow = Math.min(selectedRange.start.row, selectedRange.end.row);
      this.onDidStopChangingHandler.dispose();
      while (highestRow >= lowestRow) {
        if (this.jsxInScope(highestRow)) {
          endPointOfJsx = new Point(highestRow, 0);
          startPointOfJsx = autoCompleteJSX.getStartOfJSX(this.editor, endPointOfJsx);
          this.indentJSX(new Range(startPointOfJsx, endPointOfJsx));
          highestRow = startPointOfJsx.row - 1;
        } else {
          highestRow = highestRow - 1;
        }
      }
      setTimeout(this.handleOnDidStopChanging, 300);
    };

    AutoIndent.prototype.handleOnDidStopChanging = function() {
      return this.onDidStopChangingHandler = this.editor.onDidStopChanging((function(_this) {
        return function() {
          return _this.didStopChanging();
        };
      })(this));
    };

    AutoIndent.prototype.jsxInScope = function(bufferRow) {
      var scopes;
      scopes = this.editor.scopeDescriptorForBufferPosition([bufferRow, 0]).getScopesArray();
      return __indexOf.call(scopes, 'meta.tag.jsx') >= 0;
    };

    AutoIndent.prototype.indentJSX = function(range) {
      var blankLineEndPos, firstCharIndentation, firstTagInLineIndentation, idxOfToken, indent, indentRecalc, isFirstTagOfBlock, isFirstTokenOfLine, line, match, matchColumn, matchPointEnd, matchPointStart, matchRange, parentTokenIdx, row, stackOfTokensStillOpen, tagIndentation, token, tokenOnThisLine, tokenStack, _i, _ref1, _ref2, _ref3, _results;
      tokenStack = [];
      idxOfToken = 0;
      stackOfTokensStillOpen = [];
      indent = 0;
      isFirstTagOfBlock = true;
      this.JSXREGEXP.lastIndex = 0;
      _results = [];
      for (row = _i = _ref1 = range.start.row, _ref2 = range.end.row; _ref1 <= _ref2 ? _i <= _ref2 : _i >= _ref2; row = _ref1 <= _ref2 ? ++_i : --_i) {
        isFirstTokenOfLine = true;
        tokenOnThisLine = false;
        indentRecalc = false;
        line = this.editor.lineTextForBufferRow(row);
        while ((match = this.JSXREGEXP.exec(line)) !== null) {
          matchColumn = match.index;
          matchPointStart = new Point(row, matchColumn);
          matchPointEnd = new Point(row, matchColumn + match[0].length - 1);
          matchRange = new Range(matchPointStart, matchPointEnd);
          if (!(token = this.getToken(row, match))) {
            continue;
          }
          firstCharIndentation = this.editor.indentationForBufferRow(row);
          if (this.editor.getSoftTabs()) {
            tagIndentation = matchColumn / this.editor.getTabLength();
          } else {
            tagIndentation = (function() {
              var hardTabsFound, i, _j;
              hardTabsFound = 0;
              for (i = _j = 0; 0 <= matchColumn ? _j < matchColumn : _j > matchColumn; i = 0 <= matchColumn ? ++_j : --_j) {
                hardTabsFound += (line.substr(i, 1)) === '\t';
              }
              return hardTabsFound;
            })();
          }
          if (isFirstTokenOfLine) {
            firstTagInLineIndentation = tagIndentation;
          }
          switch (token) {
            case JSXTAG_OPEN:
              tokenOnThisLine = true;
              if (isFirstTokenOfLine) {
                stackOfTokensStillOpen.push(parentTokenIdx = stackOfTokensStillOpen.pop());
                if (isFirstTagOfBlock && (parentTokenIdx != null) && tokenStack[parentTokenIdx].type === BRACE_OPEN && tokenStack[parentTokenIdx].row === (row - 1)) {
                  tagIndentation = firstCharIndentation = firstTagInLineIndentation = this.eslintIndentOptions.jsxIndent[1] + this.getIndentOfPreviousRow(row);
                  indentRecalc = this.indentRow({
                    row: row,
                    blockIndent: firstCharIndentation
                  });
                } else if (isFirstTagOfBlock && (parentTokenIdx != null)) {
                  indentRecalc = this.indentRow({
                    row: row,
                    blockIndent: this.getIndentOfPreviousRow(row),
                    jsxIndent: 1
                  });
                } else if (parentTokenIdx != null) {
                  indentRecalc = this.indentRow({
                    row: row,
                    blockIndent: tokenStack[parentTokenIdx].firstCharIndentation,
                    jsxIndent: 1
                  });
                }
              }
              if (indentRecalc) {
                line = this.editor.lineTextForBufferRow(row);
                this.JSXREGEXP.lastIndex = 0;
                continue;
              }
              isFirstTokenOfLine = false;
              isFirstTagOfBlock = false;
              stackOfTokensStillOpen.push(parentTokenIdx = stackOfTokensStillOpen.pop());
              tokenStack.push({
                type: JSXTAG_OPEN,
                name: match[2],
                row: row,
                firstTagInLineIndentation: firstTagInLineIndentation,
                tagIndentation: tagIndentation,
                firstCharIndentation: firstCharIndentation,
                parentTokenIdx: parentTokenIdx,
                termsThisTagsAttributesIdx: null,
                termsThisTagIdx: null
              });
              stackOfTokensStillOpen.push(idxOfToken);
              idxOfToken++;
              break;
            case JSXTAG_CLOSE:
              tokenOnThisLine = true;
              if (isFirstTokenOfLine) {
                stackOfTokensStillOpen.push(parentTokenIdx = stackOfTokensStillOpen.pop());
                indentRecalc = this.indentRow({
                  row: row,
                  blockIndent: tokenStack[parentTokenIdx].firstCharIndentation
                });
              }
              if (indentRecalc) {
                line = this.editor.lineTextForBufferRow(row);
                this.JSXREGEXP.lastIndex = 0;
                continue;
              }
              isFirstTokenOfLine = false;
              isFirstTagOfBlock = false;
              parentTokenIdx = stackOfTokensStillOpen.pop();
              tokenStack.push({
                type: JSXTAG_CLOSE,
                name: match[5],
                row: row,
                parentTokenIdx: parentTokenIdx
              });
              if (parentTokenIdx >= 0) {
                tokenStack[parentTokenIdx].termsThisTagIdx = idxOfToken;
              }
              idxOfToken++;
              break;
            case JSXTAG_SELFCLOSE_END:
              tokenOnThisLine = true;
              if (isFirstTokenOfLine) {
                stackOfTokensStillOpen.push(parentTokenIdx = stackOfTokensStillOpen.pop());
                if (firstTagInLineIndentation === firstCharIndentation) {
                  indentRecalc = this.indentForClosingBracket(row, tokenStack[parentTokenIdx], this.eslintIndentOptions.jsxClosingBracketLocation[1].selfClosing);
                } else {
                  indentRecalc = this.indentRow({
                    row: row,
                    blockIndent: tokenStack[parentTokenIdx].firstTagInLineIndentation,
                    jsxIndentProps: 1
                  });
                }
              }
              if (indentRecalc) {
                line = this.editor.lineTextForBufferRow(row);
                this.JSXREGEXP.lastIndex = 0;
                continue;
              }
              isFirstTagOfBlock = false;
              isFirstTokenOfLine = false;
              parentTokenIdx = stackOfTokensStillOpen.pop();
              tokenStack.push({
                type: JSXTAG_SELFCLOSE_END,
                name: tokenStack[parentTokenIdx].name,
                row: row,
                parentTokenIdx: parentTokenIdx
              });
              if (parentTokenIdx >= 0) {
                tokenStack[parentTokenIdx].termsThisTagsAttributesIdx = idxOfToken;
                tokenStack[parentTokenIdx].type = JSXTAG_SELFCLOSE_START;
                tokenStack[parentTokenIdx].termsThisTagIdx = idxOfToken;
              }
              idxOfToken++;
              break;
            case JSXTAG_CLOSE_ATTRS:
              tokenOnThisLine = true;
              if (isFirstTokenOfLine) {
                stackOfTokensStillOpen.push(parentTokenIdx = stackOfTokensStillOpen.pop());
                if (firstTagInLineIndentation === firstCharIndentation) {
                  indentRecalc = this.indentForClosingBracket(row, tokenStack[parentTokenIdx], this.eslintIndentOptions.jsxClosingBracketLocation[1].nonEmpty);
                } else {
                  indentRecalc = this.indentRow({
                    row: row,
                    blockIndent: tokenStack[parentTokenIdx].firstTagInLineIndentation,
                    jsxIndentProps: 1
                  });
                }
              }
              if (indentRecalc) {
                line = this.editor.lineTextForBufferRow(row);
                this.JSXREGEXP.lastIndex = 0;
                continue;
              }
              isFirstTagOfBlock = false;
              isFirstTokenOfLine = false;
              stackOfTokensStillOpen.push(parentTokenIdx = stackOfTokensStillOpen.pop());
              tokenStack.push({
                type: JSXTAG_CLOSE_ATTRS,
                name: tokenStack[parentTokenIdx].name,
                row: row,
                parentTokenIdx: parentTokenIdx
              });
              if (parentTokenIdx >= 0) {
                tokenStack[parentTokenIdx].termsThisTagsAttributesIdx = idxOfToken;
              }
              idxOfToken++;
              break;
            case JSXBRACE_OPEN:
              tokenOnThisLine = true;
              if (isFirstTokenOfLine) {
                stackOfTokensStillOpen.push(parentTokenIdx = stackOfTokensStillOpen.pop());
                if (parentTokenIdx != null) {
                  if (tokenStack[parentTokenIdx].type === JSXTAG_OPEN && tokenStack[parentTokenIdx].termsThisTagsAttributesIdx === null) {
                    indentRecalc = this.indentRow({
                      row: row,
                      blockIndent: tokenStack[parentTokenIdx].firstCharIndentation,
                      jsxIndentProps: 1
                    });
                  } else {
                    indentRecalc = this.indentRow({
                      row: row,
                      blockIndent: tokenStack[parentTokenIdx].firstCharIndentation,
                      jsxIndent: 1
                    });
                  }
                }
              }
              if (indentRecalc) {
                line = this.editor.lineTextForBufferRow(row);
                this.JSXREGEXP.lastIndex = 0;
                continue;
              }
              isFirstTagOfBlock = true;
              isFirstTokenOfLine = false;
              stackOfTokensStillOpen.push(parentTokenIdx = stackOfTokensStillOpen.pop());
              tokenStack.push({
                type: JSXBRACE_OPEN,
                name: '',
                row: row,
                firstTagInLineIndentation: firstTagInLineIndentation,
                tagIndentation: tagIndentation,
                firstCharIndentation: firstCharIndentation,
                parentTokenIdx: parentTokenIdx,
                termsThisTagsAttributesIdx: null,
                termsThisTagIdx: null
              });
              stackOfTokensStillOpen.push(idxOfToken);
              idxOfToken++;
              break;
            case JSXBRACE_CLOSE:
              tokenOnThisLine = true;
              if (isFirstTokenOfLine) {
                stackOfTokensStillOpen.push(parentTokenIdx = stackOfTokensStillOpen.pop());
                indentRecalc = this.indentRow({
                  row: row,
                  blockIndent: tokenStack[parentTokenIdx].firstCharIndentation
                });
              }
              if (indentRecalc) {
                line = this.editor.lineTextForBufferRow(row);
                this.JSXREGEXP.lastIndex = 0;
                continue;
              }
              isFirstTagOfBlock = false;
              isFirstTokenOfLine = false;
              parentTokenIdx = stackOfTokensStillOpen.pop();
              tokenStack.push({
                type: JSXBRACE_CLOSE,
                name: '',
                row: row,
                parentTokenIdx: parentTokenIdx
              });
              if (parentTokenIdx >= 0) {
                tokenStack[parentTokenIdx].termsThisTagIdx = idxOfToken;
              }
              idxOfToken++;
              break;
            case BRACE_OPEN:
              tokenOnThisLine = true;
              if (isFirstTokenOfLine) {
                stackOfTokensStillOpen.push(parentTokenIdx = stackOfTokensStillOpen.pop());
                if (isFirstTagOfBlock && (parentTokenIdx != null) && tokenStack[parentTokenIdx].type === BRACE_OPEN && tokenStack[parentTokenIdx].row === (row - 1)) {
                  tagIndentation = firstCharIndentation = this.eslintIndentOptions.jsxIndent[1] + this.getIndentOfPreviousRow(row);
                  indentRecalc = this.indentRow({
                    row: row,
                    blockIndent: firstCharIndentation
                  });
                } else if (parentTokenIdx != null) {
                  indentRecalc = this.indentRow({
                    row: row,
                    blockIndent: tokenStack[parentTokenIdx].firstCharIndentation,
                    jsxIndent: 1
                  });
                }
              }
              if (indentRecalc) {
                line = this.editor.lineTextForBufferRow(row);
                this.JSXREGEXP.lastIndex = 0;
                continue;
              }
              isFirstTokenOfLine = false;
              stackOfTokensStillOpen.push(parentTokenIdx = stackOfTokensStillOpen.pop());
              tokenStack.push({
                type: BRACE_OPEN,
                name: '',
                row: row,
                firstTagInLineIndentation: firstTagInLineIndentation,
                tagIndentation: tagIndentation,
                firstCharIndentation: firstCharIndentation,
                parentTokenIdx: parentTokenIdx,
                termsThisTagsAttributesIdx: null,
                termsThisTagIdx: null
              });
              stackOfTokensStillOpen.push(idxOfToken);
              idxOfToken++;
              break;
            case BRACE_CLOSE:
              tokenOnThisLine = true;
              if (isFirstTokenOfLine) {
                stackOfTokensStillOpen.push(parentTokenIdx = stackOfTokensStillOpen.pop());
                if (parentTokenIdx != null) {
                  indentRecalc = this.indentRow({
                    row: row,
                    blockIndent: tokenStack[parentTokenIdx].firstCharIndentation
                  });
                }
              }
              if (indentRecalc) {
                line = this.editor.lineTextForBufferRow(row);
                this.JSXREGEXP.lastIndex = 0;
                continue;
              }
              isFirstTokenOfLine = false;
              parentTokenIdx = stackOfTokensStillOpen.pop();
              if (parentTokenIdx != null) {
                tokenStack.push({
                  type: BRACE_CLOSE,
                  name: '',
                  row: row,
                  parentTokenIdx: parentTokenIdx
                });
                if (parentTokenIdx >= 0) {
                  tokenStack[parentTokenIdx].termsThisTagIdx = idxOfToken;
                }
                idxOfToken++;
              }
              break;
            case TERNARY_IF:
            case TERNARY_ELSE:
            case JS_IF:
            case JS_ELSE:
              isFirstTagOfBlock = true;
          }
        }
        if (idxOfToken && !tokenOnThisLine) {
          if (row !== range.end.row) {
            blankLineEndPos = (_ref3 = /^\s*$/.exec(this.editor.lineTextForBufferRow(row))) != null ? _ref3[0].length : void 0;
            if (blankLineEndPos != null) {
              _results.push(this.indentRow({
                row: row,
                blockIndent: 0
              }));
            } else {
              _results.push(this.indentUntokenisedLine(row, tokenStack, stackOfTokensStillOpen));
            }
          } else {
            _results.push(this.indentUntokenisedLine(row, tokenStack, stackOfTokensStillOpen));
          }
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };

    AutoIndent.prototype.indentUntokenisedLine = function(row, tokenStack, stackOfTokensStillOpen) {
      var parentTokenIdx, token;
      stackOfTokensStillOpen.push(parentTokenIdx = stackOfTokensStillOpen.pop());
      token = tokenStack[parentTokenIdx];
      switch (token.type) {
        case JSXTAG_OPEN:
        case JSXTAG_SELFCLOSE_START:
          if (token.termsThisTagsAttributesIdx === null) {
            return this.indentRow({
              row: row,
              blockIndent: token.firstCharIndentation,
              jsxIndentProps: 1
            });
          } else {
            return this.indentRow({
              row: row,
              blockIndent: token.firstCharIndentation,
              jsxIndent: 1
            });
          }
          break;
        case JSXBRACE_OPEN:
          return this.indentRow({
            row: row,
            blockIndent: token.firstCharIndentation,
            jsxIndent: 1
          });
        case BRACE_OPEN:
          return this.indentRow({
            row: row,
            blockIndent: token.firstCharIndentation,
            jsxIndent: 1
          });
        case JSXTAG_SELFCLOSE_END:
        case JSXBRACE_CLOSE:
        case JSXTAG_CLOSE_ATTRS:
          return this.indentRow({
            row: row,
            blockIndent: tokenStack[token.parentTokenIdx].firstCharIndentation,
            jsxIndentProps: 1
          });
        case BRACE_CLOSE:
          return this.indentRow({
            row: row,
            blockIndent: tokenStack[token.parentTokenIdx].firstCharIndentation,
            jsxIndent: 1
          });
      }
    };

    AutoIndent.prototype.getToken = function(bufferRow, match) {
      var scope;
      scope = this.editor.scopeDescriptorForBufferPosition([bufferRow, match.index]).getScopesArray().pop();
      if ('punctuation.definition.tag.jsx' === scope) {
        if (match[1] != null) {
          return JSXTAG_OPEN;
        } else if (match[3] != null) {
          return JSXTAG_SELFCLOSE_END;
        }
      } else if ('JSXEndTagStart' === scope) {
        if (match[4] != null) {
          return JSXTAG_CLOSE;
        }
      } else if ('JSXStartTagEnd' === scope) {
        if (match[7] != null) {
          return JSXTAG_CLOSE_ATTRS;
        }
      } else if (match[8] != null) {
        if ('punctuation.section.embedded.begin.jsx' === scope) {
          return JSXBRACE_OPEN;
        } else if ('meta.brace.curly.js' === scope) {
          return BRACE_OPEN;
        }
      } else if (match[9] != null) {
        if ('punctuation.section.embedded.end.jsx' === scope) {
          return JSXBRACE_CLOSE;
        } else if ('meta.brace.curly.js' === scope) {
          return BRACE_CLOSE;
        }
      } else if (match[10] != null) {
        if ('keyword.operator.ternary.js' === scope) {
          return TERNARY_IF;
        }
      } else if (match[11] != null) {
        if ('keyword.operator.ternary.js' === scope) {
          return TERNARY_ELSE;
        }
      } else if (match[12] != null) {
        if ('keyword.control.conditional.js' === scope) {
          return JS_IF;
        }
      } else if (match[13] != null) {
        if ('keyword.control.conditional.js' === scope) {
          return JS_ELSE;
        }
      }
      return NO_TOKEN;
    };

    AutoIndent.prototype.getIndentOfPreviousRow = function(row) {
      var line, _i, _ref1;
      if (!row) {
        return 0;
      }
      for (row = _i = _ref1 = row - 1; _ref1 <= 0 ? _i < 0 : _i > 0; row = _ref1 <= 0 ? ++_i : --_i) {
        line = this.editor.lineTextForBufferRow(row);
        if (/.*\S/.test(line)) {
          return this.editor.indentationForBufferRow(row);
        }
      }
      return 0;
    };

    AutoIndent.prototype.getIndentOptions = function() {
      var eslintrcFilename;
      if (!this.autoJsx) {
        return this.translateIndentOptions();
      }
      if (eslintrcFilename = this.getEslintrcFilename()) {
        eslintrcFilename = new File(eslintrcFilename);
        return this.translateIndentOptions(this.readEslintrcOptions(eslintrcFilename.getPath()));
      } else {
        return this.translateIndentOptions({});
      }
    };

    AutoIndent.prototype.getEslintrcFilename = function() {
      var projectContainingSource;
      projectContainingSource = atom.project.relativizePath(this.editor.getPath());
      if (projectContainingSource[0] != null) {
        return path.join(projectContainingSource[0], '.eslintrc');
      }
    };

    AutoIndent.prototype.onMouseDown = function() {
      return this.mouseUp = false;
    };

    AutoIndent.prototype.onMouseUp = function() {
      return this.mouseUp = true;
    };

    AutoIndent.prototype.readEslintrcOptions = function(eslintrcFile) {
      var err, eslintRules, fileContent;
      if (fs.existsSync(eslintrcFile)) {
        fileContent = stripJsonComments(fs.readFileSync(eslintrcFile, 'utf8'));
        try {
          eslintRules = (YAML.safeLoad(fileContent)).rules;
          if (eslintRules) {
            return eslintRules;
          }
        } catch (_error) {
          err = _error;
          atom.notifications.addError("LB: Error reading .eslintrc at " + eslintrcFile, {
            dismissable: true,
            detail: "" + err.message
          });
        }
      }
      return {};
    };

    AutoIndent.prototype.translateIndentOptions = function(eslintRules) {
      var ES_DEFAULT_INDENT, defaultIndent, eslintIndentOptions, rule;
      eslintIndentOptions = {
        jsxIndent: [1, 1],
        jsxIndentProps: [1, 1],
        jsxClosingBracketLocation: [
          1, {
            selfClosing: TAGALIGNED,
            nonEmpty: TAGALIGNED
          }
        ]
      };
      if (typeof eslintRules !== "object") {
        return eslintIndentOptions;
      }
      ES_DEFAULT_INDENT = 4;
      rule = eslintRules['indent'];
      if (typeof rule === 'number' || typeof rule === 'string') {
        defaultIndent = ES_DEFAULT_INDENT / this.editor.getTabLength();
      } else if (typeof rule === 'object') {
        if (typeof rule[1] === 'number') {
          defaultIndent = rule[1] / this.editor.getTabLength();
        } else {
          defaultIndent = 1;
        }
      } else {
        defaultIndent = 1;
      }
      rule = eslintRules['react/jsx-indent'];
      if (typeof rule === 'number' || typeof rule === 'string') {
        eslintIndentOptions.jsxIndent[0] = rule;
        eslintIndentOptions.jsxIndent[1] = ES_DEFAULT_INDENT / this.editor.getTabLength();
      } else if (typeof rule === 'object') {
        eslintIndentOptions.jsxIndent[0] = rule[0];
        if (typeof rule[1] === 'number') {
          eslintIndentOptions.jsxIndent[1] = rule[1] / this.editor.getTabLength();
        } else {
          eslintIndentOptions.jsxIndent[1] = 1;
        }
      } else {
        eslintIndentOptions.jsxIndent[1] = defaultIndent;
      }
      rule = eslintRules['react/jsx-indent-props'];
      if (typeof rule === 'number' || typeof rule === 'string') {
        eslintIndentOptions.jsxIndentProps[0] = rule;
        eslintIndentOptions.jsxIndentProps[1] = ES_DEFAULT_INDENT / this.editor.getTabLength();
      } else if (typeof rule === 'object') {
        eslintIndentOptions.jsxIndentProps[0] = rule[0];
        if (typeof rule[1] === 'number') {
          eslintIndentOptions.jsxIndentProps[1] = rule[1] / this.editor.getTabLength();
        } else {
          eslintIndentOptions.jsxIndentProps[1] = 1;
        }
      } else {
        eslintIndentOptions.jsxIndentProps[1] = defaultIndent;
      }
      rule = eslintRules['react/jsx-closing-bracket-location'];
      eslintIndentOptions.jsxClosingBracketLocation[1].selfClosing = TAGALIGNED;
      eslintIndentOptions.jsxClosingBracketLocation[1].nonEmpty = TAGALIGNED;
      if (typeof rule === 'number' || typeof rule === 'string') {
        eslintIndentOptions.jsxClosingBracketLocation[0] = rule;
      } else if (typeof rule === 'object') {
        eslintIndentOptions.jsxClosingBracketLocation[0] = rule[0];
        if (typeof rule[1] === 'string') {
          eslintIndentOptions.jsxClosingBracketLocation[1].selfClosing = eslintIndentOptions.jsxClosingBracketLocation[1].nonEmpty = rule[1];
        } else {
          if (rule[1].selfClosing != null) {
            eslintIndentOptions.jsxClosingBracketLocation[1].selfClosing = rule[1].selfClosing;
          }
          if (rule[1].nonEmpty != null) {
            eslintIndentOptions.jsxClosingBracketLocation[1].nonEmpty = rule[1].nonEmpty;
          }
        }
      }
      return eslintIndentOptions;
    };

    AutoIndent.prototype.indentForClosingBracket = function(row, parentTag, closingBracketRule) {
      if (this.eslintIndentOptions.jsxClosingBracketLocation[0]) {
        if (closingBracketRule === TAGALIGNED) {
          return this.indentRow({
            row: row,
            blockIndent: parentTag.tagIndentation
          });
        } else if (closingBracketRule === LINEALIGNED) {
          return this.indentRow({
            row: row,
            blockIndent: parentTag.firstCharIndentation
          });
        } else if (closingBracketRule === AFTERPROPS) {
          if (this.eslintIndentOptions.jsxIndentProps[0]) {
            return this.indentRow({
              row: row,
              blockIndent: parentTag.tagIndentation,
              jsxIndentProps: 1
            });
          } else {
            return this.indentRow({
              row: row,
              blockIndent: parentTag.tagIndentation
            });
          }
        } else if (closingBracketRule === PROPSALIGNED) {
          if (this.eslintIndentOptions.jsxIndentProps[0]) {
            return this.indentRow({
              row: row,
              blockIndent: parentTag.firstTagInLineIndentation,
              jsxIndentProps: 1
            });
          } else {
            return this.indentRow({
              row: row,
              blockIndent: parentTag.firstTagInLineIndentation
            });
          }
        }
      }
    };

    AutoIndent.prototype.indentRow = function(options) {
      var allowAdditionalIndents, blockIndent, jsxIndent, jsxIndentProps, row;
      row = options.row, allowAdditionalIndents = options.allowAdditionalIndents, blockIndent = options.blockIndent, jsxIndent = options.jsxIndent, jsxIndentProps = options.jsxIndentProps;
      if (jsxIndent) {
        if (this.eslintIndentOptions.jsxIndent[0]) {
          if (this.eslintIndentOptions.jsxIndent[1]) {
            blockIndent += jsxIndent * this.eslintIndentOptions.jsxIndent[1];
          }
        }
      }
      if (jsxIndentProps) {
        if (this.eslintIndentOptions.jsxIndentProps[0]) {
          if (this.eslintIndentOptions.jsxIndentProps[1]) {
            blockIndent += jsxIndentProps * this.eslintIndentOptions.jsxIndentProps[1];
          }
        }
      }
      if (allowAdditionalIndents) {
        if (this.editor.indentationForBufferRow(row) < blockIndent) {
          this.editor.setIndentationForBufferRow(row, blockIndent, {
            preserveLeadingWhitespace: false
          });
          return true;
        }
      } else {
        if (this.editor.indentationForBufferRow(row) !== blockIndent) {
          this.editor.setIndentationForBufferRow(row, blockIndent, {
            preserveLeadingWhitespace: false
          });
          return true;
        }
      }
      return false;
    };

    return AutoIndent;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rhd3NvbmJvdHNmb3JkLy5hdG9tL3BhY2thZ2VzL2xhbmd1YWdlLWJhYmVsL2xpYi9hdXRvLWluZGVudC5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsc1hBQUE7SUFBQTt5SkFBQTs7QUFBQSxFQUFBLE9BQTRDLE9BQUEsQ0FBUSxNQUFSLENBQTVDLEVBQUMsMkJBQUEsbUJBQUQsRUFBc0IsWUFBQSxJQUF0QixFQUE0QixhQUFBLEtBQTVCLEVBQW1DLGFBQUEsS0FBbkMsQ0FBQTs7QUFBQSxFQUNBLEVBQUEsR0FBSyxPQUFBLENBQVEsU0FBUixDQURMLENBQUE7O0FBQUEsRUFFQSxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVIsQ0FGUCxDQUFBOztBQUFBLEVBR0EsZUFBQSxHQUFrQixPQUFBLENBQVEscUJBQVIsQ0FIbEIsQ0FBQTs7QUFBQSxFQUlBLFdBQUEsR0FBYyxPQUFBLENBQVEsaUJBQVIsQ0FKZCxDQUFBOztBQUFBLEVBS0EsaUJBQUEsR0FBb0IsT0FBQSxDQUFRLHFCQUFSLENBTHBCLENBQUE7O0FBQUEsRUFNQSxJQUFBLEdBQU8sT0FBQSxDQUFRLFNBQVIsQ0FOUCxDQUFBOztBQUFBLEVBU0EsUUFBQSxHQUEwQixDQVQxQixDQUFBOztBQUFBLEVBVUEsc0JBQUEsR0FBMEIsQ0FWMUIsQ0FBQTs7QUFBQSxFQVdBLG9CQUFBLEdBQTBCLENBWDFCLENBQUE7O0FBQUEsRUFZQSxXQUFBLEdBQTBCLENBWjFCLENBQUE7O0FBQUEsRUFhQSxrQkFBQSxHQUEwQixDQWIxQixDQUFBOztBQUFBLEVBY0EsWUFBQSxHQUEwQixDQWQxQixDQUFBOztBQUFBLEVBZUEsYUFBQSxHQUEwQixDQWYxQixDQUFBOztBQUFBLEVBZ0JBLGNBQUEsR0FBMEIsQ0FoQjFCLENBQUE7O0FBQUEsRUFpQkEsVUFBQSxHQUEw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

//# sourceURL=/Users/dawsonbotsford/.atom/packages/language-babel/lib/auto-indent.coffee
