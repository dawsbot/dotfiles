(function() {
  var ExState, GlobalExState, activateExMode, dispatchKeyboardEvent, dispatchTextEvent, getEditorElement, keydown,
    __slice = [].slice;

  ExState = require('../lib/ex-state');

  GlobalExState = require('../lib/global-ex-state');

  beforeEach(function() {
    return atom.workspace || (atom.workspace = {});
  });

  activateExMode = function() {
    return atom.workspace.open().then(function() {
      atom.commands.dispatch(atom.views.getView(atom.workspace), 'ex-mode:open');
      keydown('escape');
      return atom.workspace.getActivePane().destroyActiveItem();
    });
  };

  getEditorElement = function(callback) {
    var textEditor;
    textEditor = null;
    waitsForPromise(function() {
      return atom.workspace.open().then(function(e) {
        return textEditor = e;
      });
    });
    return runs(function() {
      var element;
      element = atom.views.getView(textEditor);
      return callback(element);
    });
  };

  dispatchKeyboardEvent = function() {
    var e, eventArgs, target;
    target = arguments[0], eventArgs = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
    e = document.createEvent('KeyboardEvent');
    e.initKeyboardEvent.apply(e, eventArgs);
    if (e.keyCode === 0) {
      Object.defineProperty(e, 'keyCode', {
        get: function() {
          return void 0;
        }
      });
    }
    return target.dispatchEvent(e);
  };

  dispatchTextEvent = function() {
    var e, eventArgs, target;
    target = arguments[0], eventArgs = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
    e = document.createEvent('TextEvent');
    e.initTextEvent.apply(e, eventArgs);
    return target.dispatchEvent(e);
  };

  keydown = function(key, _arg) {
    var alt, canceled, ctrl, element, eventArgs, meta, raw, shift, _ref;
    _ref = _arg != null ? _arg : {}, element = _ref.element, ctrl = _ref.ctrl, shift = _ref.shift, alt = _ref.alt, meta = _ref.meta, raw = _ref.raw;
    if (!(key === 'escape' || (raw != null))) {
      key = "U+" + (key.charCodeAt(0).toString(16));
    }
    element || (element = document.activeElement);
    eventArgs = [true, true, null, key, 0, ctrl, alt, shift, meta];
    canceled = !dispatchKeyboardEvent.apply(null, [element, 'keydown'].concat(__slice.call(eventArgs)));
    dispatchKeyboardEvent.apply(null, [element, 'keypress'].concat(__slice.call(eventArgs)));
    if (!canceled) {
      if (dispatchTextEvent.apply(null, [element, 'textInput'].concat(__slice.call(eventArgs)))) {
        element.value += key;
      }
    }
    return dispatchKeyboardEvent.apply(null, [element, 'keyup'].concat(__slice.call(eventArgs)));
  };

  module.exports = {
    keydown: keydown,
    getEditorElement: getEditorElement,
    activateExMode: activateExMode
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rhd3NvbmJvdHNmb3JkLy5hdG9tL3BhY2thZ2VzL2V4LW1vZGUvc3BlYy9zcGVjLWhlbHBlci5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsMkdBQUE7SUFBQSxrQkFBQTs7QUFBQSxFQUFBLE9BQUEsR0FBVSxPQUFBLENBQVEsaUJBQVIsQ0FBVixDQUFBOztBQUFBLEVBQ0EsYUFBQSxHQUFnQixPQUFBLENBQVEsd0JBQVIsQ0FEaEIsQ0FBQTs7QUFBQSxFQUdBLFVBQUEsQ0FBVyxTQUFBLEdBQUE7V0FDVCxJQUFJLENBQUMsY0FBTCxJQUFJLENBQUMsWUFBYyxJQURWO0VBQUEsQ0FBWCxDQUhBLENBQUE7O0FBQUEsRUFNQSxjQUFBLEdBQWlCLFNBQUEsR0FBQTtXQUNmLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBZixDQUFBLENBQXFCLENBQUMsSUFBdEIsQ0FBMkIsU0FBQSxHQUFBO0FBQ3pCLE1BQUEsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFkLENBQXVCLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBWCxDQUFtQixJQUFJLENBQUMsU0FBeEIsQ0FBdkIsRUFBMkQsY0FBM0QsQ0FBQSxDQUFBO0FBQUEsTUFDQSxPQUFBLENBQVEsUUFBUixDQURBLENBQUE7YUFFQSxJQUFJLENBQUMsU0FBUyxDQUFDLGFBQWYsQ0FBQSxDQUE4QixDQUFDLGlCQUEvQixDQUFBLEVBSHlCO0lBQUEsQ0FBM0IsRUFEZTtFQUFBLENBTmpCLENBQUE7O0FBQUEsRUFhQSxnQkFBQSxHQUFtQixTQUFDLFFBQUQsR0FBQTtBQUNqQixRQUFBLFVBQUE7QUFBQSxJQUFBLFVBQUEsR0FBYSxJQUFiLENBQUE7QUFBQSxJQUVBLGVBQUEsQ0FBZ0IsU0FBQSxHQUFBO2FBQ2QsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFmLENBQUEsQ0FBcUIs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

//# sourceURL=/Users/dawsonbotsford/.atom/packages/ex-mode/spec/spec-helper.coffee
