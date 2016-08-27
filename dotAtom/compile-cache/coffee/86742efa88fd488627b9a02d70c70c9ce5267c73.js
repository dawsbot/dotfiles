(function() {
  var CompositeDisposable, LineNumberView,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  CompositeDisposable = require('atom').CompositeDisposable;

  module.exports = LineNumberView = (function() {
    function LineNumberView(editor) {
      this.editor = editor;
      this._undo = __bind(this._undo, this);
      this._updateAbsoluteNumbers = __bind(this._updateAbsoluteNumbers, this);
      this._updateSync = __bind(this._updateSync, this);
      this._update = __bind(this._update, this);
      this.subscriptions = new CompositeDisposable();
      this.editorView = atom.views.getView(this.editor);
      this.trueNumberCurrentLine = atom.config.get('relative-numbers.trueNumberCurrentLine');
      this.showAbsoluteNumbers = atom.config.get('relative-numbers.showAbsoluteNumbers');
      this.startAtOne = atom.config.get('relative-numbers.startAtOne');
      this.lineNumberGutterView = atom.views.getView(this.editor.gutterWithName('line-number'));
      this.gutter = this.editor.addGutter({
        name: 'relative-numbers'
      });
      this.gutter.view = this;
      try {
        this.subscriptions.add(this.editorView.model.onDidChange(this._update));
      } catch (_error) {
        this.subscriptions.add(this.editorView.onDidAttach(this._update));
        this.subscriptions.add(this.editor.onDidStopChanging(this._update));
      }
      this.subscriptions.add(this.editor.onDidChangeCursorPosition(this._update));
      this.subscriptions.add(this.editorView.onDidChangeScrollTop(this._update));
      this.subscriptions.add(atom.config.onDidChange('relative-numbers.trueNumberCurrentLine', (function(_this) {
        return function() {
          _this.trueNumberCurrentLine = atom.config.get('relative-numbers.trueNumberCurrentLine');
          return _this._update();
        };
      })(this)));
      this.subscriptions.add(atom.config.onDidChange('relative-numbers.showAbsoluteNumbers', (function(_this) {
        return function() {
          _this.showAbsoluteNumbers = atom.config.get('relative-numbers.showAbsoluteNumbers');
          return _this._updateAbsoluteNumbers();
        };
      })(this)));
      this.subscriptions.add(atom.config.onDidChange('relative-numbers.startAtOne', (function(_this) {
        return function() {
          _this.startAtOne = atom.config.get('relative-numbers.startAtOne');
          return _this._update();
        };
      })(this)));
      this.subscriptions.add(this.editor.onDidDestroy((function(_this) {
        return function() {
          return _this.subscriptions.dispose();
        };
      })(this)));
      this._update();
      this._updateAbsoluteNumbers();
    }

    LineNumberView.prototype.destroy = function() {
      this.subscriptions.dispose();
      this._undo();
      return this.gutter.destroy();
    };

    LineNumberView.prototype._spacer = function(totalLines, currentIndex) {
      var width;
      width = Math.max(0, totalLines.toString().length - currentIndex.toString().length);
      return Array(width + 1).join('&nbsp;');
    };

    LineNumberView.prototype._toggleAbsoluteClass = function(isActive) {
      var classNames;
      if (isActive == null) {
        isActive = false;
      }
      classNames = this.lineNumberGutterView.className.split(' ');
      if (isActive) {
        classNames.push('show-absolute');
        return this.lineNumberGutterView.className = classNames.join(' ');
      } else {
        classNames = classNames.filter(function(name) {
          return name !== 'show-absolute';
        });
        return this.lineNumberGutterView.className = classNames.join(' ');
      }
    };

    LineNumberView.prototype._update = function() {
      if (this.editorView.isUpdatedSynchronously()) {
        return this._updateSync();
      } else {
        return atom.views.updateDocument((function(_this) {
          return function() {
            return _this._updateSync();
          };
        })(this));
      }
    };

    LineNumberView.prototype._updateSync = function() {
      var absolute, absoluteText, bufferRow, currentLineNumber, lineNumberElement, lineNumberElements, offset, relative, relativeClass, relativeText, row, selectRange, totalLines, _i, _len, _ref, _results;
      totalLines = this.editor.getLineCount();
      bufferRow = this.editor.getCursorBufferPosition().row;
      if (this.editor.getSelectedText().match(/\n$/)) {
        selectRange = this.editor.getSelectedBufferRange();
        currentLineNumber = bufferRow;
        if (selectRange.start.row !== selectRange.end.row) {
          if (selectRange.start.row === bufferRow) {
            currentLineNumber = bufferRow + 1;
          }
        }
      } else {
        currentLineNumber = bufferRow + 1;
      }
      lineNumberElements = (_ref = this.editorView.rootElement) != null ? _ref.querySelectorAll('.line-number') : void 0;
      offset = this.startAtOne ? 1 : 0;
      _results = [];
      for (_i = 0, _len = lineNumberElements.length; _i < _len; _i++) {
        lineNumberElement = lineNumberElements[_i];
        row = Number(lineNumberElement.getAttribute('data-buffer-row'));
        absolute = row + 1;
        relative = Math.abs(currentLineNumber - absolute);
        relativeClass = 'relative';
        if (this.trueNumberCurrentLine && relative === 0) {
          relative = currentLineNumber;
          relativeClass += ' current-line';
        } else {
          relative += offset;
        }
        absoluteText = this._spacer(totalLines, absolute) + absolute;
        relativeText = this._spacer(totalLines, relative) + relative;
        if (lineNumberElement.innerHTML.indexOf('•') === -1) {
          _results.push(lineNumberElement.innerHTML = "<span class=\"absolute\">" + absoluteText + "</span><span class=\"" + relativeClass + "\">" + relativeText + "</span><div class=\"icon-right\"></div>");
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };

    LineNumberView.prototype._updateAbsoluteNumbers = function() {
      var className;
      className = this.lineNumberGutterView.className;
      if (!className.includes('show-absolute') && this.showAbsoluteNumbers) {
        return this._toggleAbsoluteClass(true);
      } else if (className.includes('show-absolute') && !this.showAbsoluteNumbers) {
        return this._toggleAbsoluteClass(false);
      }
    };

    LineNumberView.prototype._undo = function() {
      var absolute, absoluteText, lineNumberElement, lineNumberElements, row, totalLines, _i, _len, _ref;
      totalLines = this.editor.getLineCount();
      lineNumberElements = (_ref = this.editorView.rootElement) != null ? _ref.querySelectorAll('.line-number') : void 0;
      for (_i = 0, _len = lineNumberElements.length; _i < _len; _i++) {
        lineNumberElement = lineNumberElements[_i];
        row = Number(lineNumberElement.getAttribute('data-buffer-row'));
        absolute = row + 1;
        absoluteText = this._spacer(totalLines, absolute) + absolute;
        if (lineNumberElement.innerHTML.indexOf('•') === -1) {
          lineNumberElement.innerHTML = "" + absoluteText + "<div class=\"icon-right\"></div>";
        }
      }
      if (this.lineNumberGutterView.className.includes('show-absolute')) {
        return this._toggleAbsoluteClass(false);
      }
    };

    return LineNumberView;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rhd3NvbmJvdHNmb3JkLy5hdG9tL3BhY2thZ2VzL3JlbGF0aXZlLW51bWJlcnMvbGliL2xpbmUtbnVtYmVyLXZpZXcuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLG1DQUFBO0lBQUEsa0ZBQUE7O0FBQUEsRUFBQyxzQkFBdUIsT0FBQSxDQUFRLE1BQVIsRUFBdkIsbUJBQUQsQ0FBQTs7QUFBQSxFQUVBLE1BQU0sQ0FBQyxPQUFQLEdBQ007QUFDUyxJQUFBLHdCQUFFLE1BQUYsR0FBQTtBQUNYLE1BRFksSUFBQyxDQUFBLFNBQUEsTUFDYixDQUFBO0FBQUEsMkNBQUEsQ0FBQTtBQUFBLDZFQUFBLENBQUE7QUFBQSx1REFBQSxDQUFBO0FBQUEsK0NBQUEsQ0FBQTtBQUFBLE1BQUEsSUFBQyxDQUFBLGFBQUQsR0FBcUIsSUFBQSxtQkFBQSxDQUFBLENBQXJCLENBQUE7QUFBQSxNQUNBLElBQUMsQ0FBQSxVQUFELEdBQWMsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFYLENBQW1CLElBQUMsQ0FBQSxNQUFwQixDQURkLENBQUE7QUFBQSxNQUVBLElBQUMsQ0FBQSxxQkFBRCxHQUF5QixJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0Isd0NBQWhCLENBRnpCLENBQUE7QUFBQSxNQUdBLElBQUMsQ0FBQSxtQkFBRCxHQUF1QixJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0Isc0NBQWhCLENBSHZCLENBQUE7QUFBQSxNQUlBLElBQUMsQ0FBQSxVQUFELEdBQWMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLDZCQUFoQixDQUpkLENBQUE7QUFBQSxNQU1BLElBQUMsQ0FBQSxvQkFBRCxHQUF3QixJQUFJLENBQUMsS0FBSyxDQUFDLE9BQVgsQ0FBbUIsSUFBQyxDQUFBLE1BQU0sQ0FBQyxjQUFS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

//# sourceURL=/Users/dawsonbotsford/.atom/packages/relative-numbers/lib/line-number-view.coffee
