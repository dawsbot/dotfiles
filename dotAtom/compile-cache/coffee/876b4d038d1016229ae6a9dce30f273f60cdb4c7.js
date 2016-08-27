(function() {
  var COMPLETIONS, JSXATTRIBUTE, JSXENDTAGSTART, JSXREGEXP, JSXSTARTTAGEND, JSXTAG, Point, REACTURL, Range, TAGREGEXP, filter, score, _ref, _ref1,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  _ref = require("atom"), Range = _ref.Range, Point = _ref.Point;

  _ref1 = require("fuzzaldrin"), filter = _ref1.filter, score = _ref1.score;

  JSXSTARTTAGEND = 0;

  JSXENDTAGSTART = 1;

  JSXTAG = 2;

  JSXATTRIBUTE = 3;

  JSXREGEXP = /(?:(<)|(<\/))([$_A-Za-z](?:[$._:\-a-zA-Z0-9])*)|(?:(\/>)|(>))/g;

  TAGREGEXP = /<([$_a-zA-Z][$._:\-a-zA-Z0-9]*)($|\s|\/>|>)/g;

  COMPLETIONS = require("./completions-jsx");

  REACTURL = "http://facebook.github.io/react/docs/tags-and-attributes.html";

  module.exports = {
    selector: ".meta.tag.jsx",
    inclusionPriority: 10000,
    excludeLowerPriority: false,
    getSuggestions: function(opts) {
      var attribute, bufferPosition, editor, elementObj, filteredAttributes, htmlElement, htmlElements, jsxRange, jsxTag, prefix, scopeDescriptor, startOfJSX, suggestions, tagName, tagNameStack, _i, _j, _k, _len, _len1, _len2, _ref2;
      editor = opts.editor, bufferPosition = opts.bufferPosition, scopeDescriptor = opts.scopeDescriptor, prefix = opts.prefix;
      if (editor.getGrammar().packageName !== "language-babel") {
        return;
      }
      jsxTag = this.getTriggerTag(editor, bufferPosition);
      if (jsxTag == null) {
        return;
      }
      suggestions = [];
      if (jsxTag === JSXSTARTTAGEND) {
        startOfJSX = this.getStartOfJSX(editor, bufferPosition);
        jsxRange = new Range(startOfJSX, bufferPosition);
        tagNameStack = this.buildTagStack(editor, jsxRange);
        while ((tagName = tagNameStack.pop()) != null) {
          suggestions.push({
            snippet: "$1</" + tagName + ">",
            type: "tag",
            description: "language-babel tag closer"
          });
        }
      } else if (jsxTag === JSXENDTAGSTART) {
        startOfJSX = this.getStartOfJSX(editor, bufferPosition);
        jsxRange = new Range(startOfJSX, bufferPosition);
        tagNameStack = this.buildTagStack(editor, jsxRange);
        while ((tagName = tagNameStack.pop()) != null) {
          suggestions.push({
            snippet: "" + tagName + ">",
            type: "tag",
            description: "language-babel tag closer"
          });
        }
      } else if (jsxTag === JSXTAG) {
        if (!/^[a-z]/g.exec(prefix)) {
          return;
        }
        htmlElements = filter(COMPLETIONS.htmlElements, prefix, {
          key: "name"
        });
        for (_i = 0, _len = htmlElements.length; _i < _len; _i++) {
          htmlElement = htmlElements[_i];
          if (score(htmlElement.name, prefix) < 0.07) {
            continue;
          }
          suggestions.push({
            snippet: htmlElement.name,
            type: "tag",
            description: "language-babel JSX supported elements",
            descriptionMoreURL: REACTURL
          });
        }
      } else if (jsxTag === JSXATTRIBUTE) {
        tagName = this.getThisTagName(editor, bufferPosition);
        if (tagName == null) {
          return;
        }
        _ref2 = COMPLETIONS.htmlElements;
        for (_j = 0, _len1 = _ref2.length; _j < _len1; _j++) {
          elementObj = _ref2[_j];
          if (elementObj.name === tagName) {
            break;
          }
        }
        elementObj.attributes = elementObj.attributes.concat(COMPLETIONS.globalAttributes);
        elementObj.attributes = elementObj.attributes.concat(COMPLETIONS.events);
        filteredAttributes = filter(elementObj.attributes, prefix, {
          key: "name"
        });
        for (_k = 0, _len2 = filteredAttributes.length; _k < _len2; _k++) {
          attribute = filteredAttributes[_k];
          if (score(attribute.name, prefix) < 0.07) {
            continue;
          }
          suggestions.push({
            snippet: attribute.name,
            type: "attribute",
            rightLabel: "<" + tagName + ">",
            description: "language-babel JSXsupported attributes/events",
            descriptionMoreURL: REACTURL
          });
        }
      } else {
        return;
      }
      return suggestions;
    },
    getThisTagName: function(editor, bufferPosition) {
      var column, match, matches, row, rowText, scopes;
      row = bufferPosition.row;
      column = null;
      while (row >= 0) {
        rowText = editor.lineTextForBufferRow(row);
        if (column == null) {
          rowText = rowText.substr(0, column = bufferPosition.column);
        }
        matches = [];
        while ((match = TAGREGEXP.exec(rowText)) !== null) {
          scopes = editor.scopeDescriptorForBufferPosition([row, match.index + 1]).getScopesArray();
          if (__indexOf.call(scopes, "entity.name.tag.open.jsx") >= 0) {
            matches.push(match[1]);
          }
        }
        if (matches.length) {
          return matches.pop();
        } else {
          row--;
        }
      }
    },
    getTriggerTag: function(editor, bufferPosition) {
      var column, scopes;
      column = bufferPosition.column - 1;
      if (column >= 0) {
        scopes = editor.scopeDescriptorForBufferPosition([bufferPosition.row, column]).getScopesArray();
        if (__indexOf.call(scopes, "entity.other.attribute-name.jsx") >= 0) {
          return JSXATTRIBUTE;
        }
        if (__indexOf.call(scopes, "entity.name.tag.open.jsx") >= 0) {
          return JSXTAG;
        }
        if (__indexOf.call(scopes, "JSXStartTagEnd") >= 0) {
          return JSXSTARTTAGEND;
        }
        if (__indexOf.call(scopes, "JSXEndTagStart") >= 0) {
          return JSXENDTAGSTART;
        }
      }
    },
    getStartOfJSX: function(editor, bufferPosition) {
      var column, columnLen, row;
      row = bufferPosition.row;
      while (row >= 0) {
        if (__indexOf.call(editor.scopeDescriptorForBufferPosition([row, 0]).getScopesArray(), "meta.tag.jsx") < 0) {
          break;
        }
        row--;
      }
      if (row < 0) {
        row = 0;
      }
      columnLen = editor.lineTextForBufferRow(row).length;
      column = 0;
      while (column < columnLen) {
        if (__indexOf.call(editor.scopeDescriptorForBufferPosition([row, column]).getScopesArray(), "meta.tag.jsx") >= 0) {
          break;
        }
        column++;
      }
      if (column === columnLen) {
        row++;
        column = 0;
      }
      return new Point(row, column);
    },
    buildTagStack: function(editor, range) {
      var closedtag, line, match, matchColumn, matchPointEnd, matchPointStart, matchRange, row, scopes, tagNameStack;
      tagNameStack = [];
      row = range.start.row;
      while (row <= range.end.row) {
        line = editor.lineTextForBufferRow(row);
        while ((match = JSXREGEXP.exec(line)) !== null) {
          matchColumn = match.index;
          matchPointStart = new Point(row, matchColumn);
          matchPointEnd = new Point(row, matchColumn + match[0].length - 1);
          matchRange = new Range(matchPointStart, matchPointEnd);
          if (range.intersectsWith(matchRange)) {
            scopes = editor.scopeDescriptorForBufferPosition([row, match.index]).getScopesArray();
            if (__indexOf.call(scopes, "punctuation.definition.tag.jsx") < 0) {
              continue;
            }
            if (match[1] != null) {
              tagNameStack.push(match[3]);
            } else if (match[2] != null) {
              closedtag = tagNameStack.pop();
              if (closedtag !== match[3]) {
                tagNameStack.push(closedtag);
              }
            } else if (match[4] != null) {
              tagNameStack.pop();
            }
          }
        }
        row++;
      }
      return tagNameStack;
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rhd3NvbmJvdHNmb3JkLy5hdG9tL3BhY2thZ2VzL2xhbmd1YWdlLWJhYmVsL2xpYi9hdXRvLWNvbXBsZXRlLWpzeC5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsMklBQUE7SUFBQSxxSkFBQTs7QUFBQSxFQUFBLE9BQWlCLE9BQUEsQ0FBUSxNQUFSLENBQWpCLEVBQUMsYUFBQSxLQUFELEVBQVEsYUFBQSxLQUFSLENBQUE7O0FBQUEsRUFDQSxRQUFrQixPQUFBLENBQVEsWUFBUixDQUFsQixFQUFDLGVBQUEsTUFBRCxFQUFTLGNBQUEsS0FEVCxDQUFBOztBQUFBLEVBSUEsY0FBQSxHQUFpQixDQUpqQixDQUFBOztBQUFBLEVBS0EsY0FBQSxHQUFpQixDQUxqQixDQUFBOztBQUFBLEVBTUEsTUFBQSxHQUFTLENBTlQsQ0FBQTs7QUFBQSxFQU9BLFlBQUEsR0FBZSxDQVBmLENBQUE7O0FBQUEsRUFTQSxTQUFBLEdBQVksZ0VBVFosQ0FBQTs7QUFBQSxFQVVBLFNBQUEsR0FBYSw4Q0FWYixDQUFBOztBQUFBLEVBV0EsV0FBQSxHQUFjLE9BQUEsQ0FBUSxtQkFBUixDQVhkLENBQUE7O0FBQUEsRUFZQSxRQUFBLEdBQVcsK0RBWlgsQ0FBQTs7QUFBQSxFQWNBLE1BQU0sQ0FBQyxPQUFQLEdBQ0U7QUFBQSxJQUFBLFFBQUEsRUFBVSxlQUFWO0FBQUEsSUFDQSxpQkFBQSxFQUFtQixLQURuQjtBQUFBLElBRUEsb0JBQUEsRUFBc0IsS0FGdEI7QUFBQSxJQUtBLGNBQUEsRUFBZ0IsU0FBQyxJQUFELEdBQUE7QUFDZCxVQUFBLDhOQUFBO0FBQUEsTUFBQyxjQUFBLE1BQUQsRUFBUyxzQkFBQSxjQUFULEVBQXlCLHVCQUFBLGVBQXpCLEVBQTBDLGNBQUEsTUFBMUMsQ0FBQTtBQUNBLE1BQUEsSUFBVSxNQUFNLENB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

//# sourceURL=/Users/dawsonbotsford/.atom/packages/language-babel/lib/auto-complete-jsx.coffee
