(function() {
  var ExCommandModeInputElement,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  ExCommandModeInputElement = (function(_super) {
    __extends(ExCommandModeInputElement, _super);

    function ExCommandModeInputElement() {
      return ExCommandModeInputElement.__super__.constructor.apply(this, arguments);
    }

    ExCommandModeInputElement.prototype.createdCallback = function() {
      this.className = "command-mode-input";
      this.editorContainer = document.createElement("div");
      this.editorContainer.className = "editor-container";
      return this.appendChild(this.editorContainer);
    };

    ExCommandModeInputElement.prototype.initialize = function(viewModel, opts) {
      var _ref;
      this.viewModel = viewModel;
      if (opts == null) {
        opts = {};
      }
      if (opts["class"] != null) {
        this.editorContainer.classList.add(opts["class"]);
      }
      if (opts.hidden) {
        this.editorContainer.style.height = "0px";
      }
      this.editorElement = document.createElement("atom-text-editor");
      this.editorElement.classList.add('editor');
      this.editorElement.getModel().setMini(true);
      this.editorElement.setAttribute('mini', '');
      this.editorContainer.appendChild(this.editorElement);
      this.singleChar = opts.singleChar;
      this.defaultText = (_ref = opts.defaultText) != null ? _ref : '';
      this.panel = atom.workspace.addBottomPanel({
        item: this,
        priority: 100
      });
      this.focus();
      this.handleEvents();
      return this;
    };

    ExCommandModeInputElement.prototype.handleEvents = function() {
      if (this.singleChar != null) {
        this.editorElement.getModel().getBuffer().onDidChange((function(_this) {
          return function(e) {
            if (e.newText) {
              return _this.confirm();
            }
          };
        })(this));
      } else {
        atom.commands.add(this.editorElement, 'editor:newline', this.confirm.bind(this));
        atom.commands.add(this.editorElement, 'core:backspace', this.backspace.bind(this));
      }
      atom.commands.add(this.editorElement, 'core:confirm', this.confirm.bind(this));
      atom.commands.add(this.editorElement, 'core:cancel', this.cancel.bind(this));
      return atom.commands.add(this.editorElement, 'blur', this.cancel.bind(this));
    };

    ExCommandModeInputElement.prototype.backspace = function() {
      if (!this.editorElement.getModel().getText().length) {
        return this.cancel();
      }
    };

    ExCommandModeInputElement.prototype.confirm = function() {
      this.value = this.editorElement.getModel().getText() || this.defaultText;
      this.viewModel.confirm(this);
      return this.removePanel();
    };

    ExCommandModeInputElement.prototype.focus = function() {
      return this.editorElement.focus();
    };

    ExCommandModeInputElement.prototype.cancel = function(e) {
      this.viewModel.cancel(this);
      return this.removePanel();
    };

    ExCommandModeInputElement.prototype.removePanel = function() {
      atom.workspace.getActivePane().activate();
      return this.panel.destroy();
    };

    return ExCommandModeInputElement;

  })(HTMLDivElement);

  module.exports = document.registerElement("ex-command-mode-input", {
    "extends": "div",
    prototype: ExCommandModeInputElement.prototype
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rhd3NvbmJvdHNmb3JkLy5hdG9tL3BhY2thZ2VzL2V4LW1vZGUvbGliL2V4LW5vcm1hbC1tb2RlLWlucHV0LWVsZW1lbnQuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHlCQUFBO0lBQUE7bVNBQUE7O0FBQUEsRUFBTTtBQUNKLGdEQUFBLENBQUE7Ozs7S0FBQTs7QUFBQSx3Q0FBQSxlQUFBLEdBQWlCLFNBQUEsR0FBQTtBQUNmLE1BQUEsSUFBQyxDQUFBLFNBQUQsR0FBYSxvQkFBYixDQUFBO0FBQUEsTUFFQSxJQUFDLENBQUEsZUFBRCxHQUFtQixRQUFRLENBQUMsYUFBVCxDQUF1QixLQUF2QixDQUZuQixDQUFBO0FBQUEsTUFHQSxJQUFDLENBQUEsZUFBZSxDQUFDLFNBQWpCLEdBQTZCLGtCQUg3QixDQUFBO2FBS0EsSUFBQyxDQUFBLFdBQUQsQ0FBYSxJQUFDLENBQUEsZUFBZCxFQU5lO0lBQUEsQ0FBakIsQ0FBQTs7QUFBQSx3Q0FRQSxVQUFBLEdBQVksU0FBRSxTQUFGLEVBQWEsSUFBYixHQUFBO0FBQ1YsVUFBQSxJQUFBO0FBQUEsTUFEVyxJQUFDLENBQUEsWUFBQSxTQUNaLENBQUE7O1FBRHVCLE9BQU87T0FDOUI7QUFBQSxNQUFBLElBQUcscUJBQUg7QUFDRSxRQUFBLElBQUMsQ0FBQSxlQUFlLENBQUMsU0FBUyxDQUFDLEdBQTNCLENBQStCLElBQUksQ0FBQyxPQUFELENBQW5DLENBQUEsQ0FERjtPQUFBO0FBR0EsTUFBQSxJQUFHLElBQUksQ0FBQyxNQUFSO0FBQ0UsUUFBQSxJQUFDLENBQUEsZUFBZSxDQUFDLEtBQUssQ0FBQyxNQUF2QixHQUFnQyxLQUFoQyxDQURGO09BSEE7QUFBQSxNQU1BLElBQUMsQ0FBQSxhQUFELEdBQWlCLFFBQVEsQ0FBQyxhQUFULENBQXVCLGtCQUF2QixD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

//# sourceURL=/Users/dawsonbotsford/.atom/packages/ex-mode/lib/ex-normal-mode-input-element.coffee
