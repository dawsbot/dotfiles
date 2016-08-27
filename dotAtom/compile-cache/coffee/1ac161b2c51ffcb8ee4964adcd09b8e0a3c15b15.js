(function() {
  var AtomShortcuts;

  module.exports = AtomShortcuts = {
    window: null,
    ctrl: {
      code: 17,
      down: false
    },
    backTick: {
      code: 192,
      down: false
    },
    activate: function(state) {
      this.window = document.createElement('div');
      this.window.className = 'atom-shortcuts';
      this.window.innerHTML = this.html;
      this.window.style.display = 'none';
      document.body.appendChild(this.window);
      this.keyDown = this.keyDown.bind(this);
      this.keyUp = this.keyUp.bind(this);
      document.body.addEventListener('keydown', this.keyDown);
      return document.body.addEventListener('keyup', this.keyUp);
    },
    keyDown: function(e) {
      if (e.which === this.backTick.code) {
        this.backTick.down = true;
      }
      if (e.which === this.ctrl.code) {
        this.ctrl.down = true;
      }
      if (this.backTick.down && this.ctrl.down) {
        return this.showWindow();
      }
    },
    keyUp: function(e) {
      if (e.which === this.backTick.code) {
        this.backTick.down = false;
      }
      if (e.which === this.ctrl.code) {
        this.ctrl.down = false;
      }
      if (!this.backTick.down || !this.ctrl.down) {
        return this.hideWindow();
      }
    },
    showWindow: function() {
      return this.window.style.display = 'block';
    },
    hideWindow: function() {
      return this.window.style.display = 'none';
    },
    deactivate: function() {
      document.body.removeEventListener('keydown', this.keyDown);
      document.body.removeEventListener('keyup', this.keyUp);
      return this.window.remove();
    },
    html: "<!-- First column --> <div class='one-third left'> <!-- General section --> <div class='section'> <h2>General</h2> <div class='item'> <p><b>shift + ⌘ + p</b></p> Toggle command palette </div> <div class='item'> <p><b>⌘ + /</b></p> Toggle line/selection comment </div> <div class='item item-last'> <p><b>ctrl + space</b></p> Show available auto-completions </div> </div> <!-- /General section --> <!-- Find section --> <div class='section'> <h2>Find</h2> <div class='item'> <p><b>⌘ + f</b></p> Find in file </div> <div class='item'> <p><b>⌘ + g</b></p> Find next </div> <div class='item'> <p><b>shift + ⌘ + f</b></p> Find in project </div> <div class='item item-last'> <p><b>⌘ + e</b></p> Use selection for find </div> </div> <!-- /Find section --> <!-- View/Window Manipulation --> <div class='section'> <h2>View/Window Manipulation</h2> <div class='item'> <p><b>⌘+ \</b></p> Toggle tree-view sidebar </div> <div class='item'> <p><b>ctrl + ⌘ + f</b></p> Toggle fullscreen </div> <div class='item'> <p><b>⌘ + k, left/right/up/down</b></p> Split pane left/right/up/down </div> <div class='item item-last'> <p><b>⌘ + k, ⌘ + left/right/up/down</b></p> Focus pane left/right/up/down </div> </div> <!-- /View/Window Manipulation --> </div> <!-- /First column --> <!-- Second column --> <div class='one-third left'> <!-- File Navigation section --> <div class='section'> <h2>File Navigation</h2> <div class='item'> <p><b>⌘ + p</b></p> Toggle file finder </div> <div class='item'> <p><b>ctrl + g></b></p> Goto line </div> <div class='item'> <p><b>⌘ + r</b></p> Goto symbol </div> <div class='item'> <p><b>shift + ⌘ + { / }</b></p> Previous/next file </div> <div class='item'> <p><b>⌘ + F2</b></p> Set bookmark </div> <div class='item item-last'> <p><b>F2</b></p> Goto next bookmark </div> </div> <!-- /File Navigation section --> <!-- Folding section --> <div class='section'> <h2>Folding</h2> <div class='item'> <p><b>ctrl + ⌘ + [ / ]</b></p> Fold/unfold current code block </div> <div class='item'> <p><b>option + shift + ⌘ + [ / ]</b></p> Fold/unfold all code blocks </div> <div class='item item-last'> <p><b>⌘ + 1-9</b></p> Fold code blocks at depth 1-9 </div> </div> <!-- /Folding section --> <!-- Word Manipulation --> <div class='section'> <h2>Word Manipulation</h2> <div class='item'> <p><b>ctrl + t</b></p> Transpose characters either side of cursor </div> <div class='item'> <p><b>option + backspace</b></p> Delete text to beginning of word </div> <div class='item item-last'> <p><b>option + delete</b></p> Delete text to end of word </div> </div> <!-- /Word Manipulation --> </div> <!-- /Second column --> <!-- Third column --> <div class='one-third left'> <!-- Line Manipulation --> <div class='section'> <h2>Line Manipulation</h2> <div class='item'> <p><b>⌘+ ] / [</b></p> Indent/outdent current line </div> <div class='item'> <p><b>⌘ + enter</b></p> Insert new line after current line </div> <div class='item'> <p><b>⌘ + shift + enter</b></p> Insert new line before current line </div> <div class='item'> <p><b>ctrl + shift + k</b></p> Delete current line </div> <div class='item'> <p><b>ctrl + ⌘ + up/down</b></p> Move current line up/down </div> <div class='item'> <p><b>shift + ⌘ + d</b></p> Duplicate current line </div> <div class='item item-last'> <p><b>⌘ + j</b></p> Join current and next lines </div> </div> <!-- /Line Manipulation --> <!-- Selection --> <div class='section'> <h2>Selection</h2> <div class='item'> <p><b>⌘ + d</b></p> Select current word/token </div> <div class='item'> <p><b>⌘ + l</b></p> Select current line </div> <div class='item'> <p><b>option + shift + left/right</b></p> Select to beginning/end of word </div> <div class='item'> <p><b>shift + ⌘ + left/right</b></p> Select to first/last character of line </div> <div class='item item-last'> <p><b>shift + ⌘ + up/down</b></p> Select to top/bottom of document </div> </div> <!-- /Line Manipulation --> </div> <!-- /Third column -->"
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rhd3NvbmJvdHNmb3JkLy5hdG9tL3BhY2thZ2VzL2F0b20tc2hvcnRjdXRzL2xpYi9hdG9tLXNob3J0Y3V0cy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsYUFBQTs7QUFBQSxFQUFBLE1BQU0sQ0FBQyxPQUFQLEdBQWlCLGFBQUEsR0FFZjtBQUFBLElBQUEsTUFBQSxFQUFRLElBQVI7QUFBQSxJQUVBLElBQUEsRUFDRTtBQUFBLE1BQUEsSUFBQSxFQUFNLEVBQU47QUFBQSxNQUNBLElBQUEsRUFBTSxLQUROO0tBSEY7QUFBQSxJQU1BLFFBQUEsRUFDRTtBQUFBLE1BQUEsSUFBQSxFQUFNLEdBQU47QUFBQSxNQUNBLElBQUEsRUFBTSxLQUROO0tBUEY7QUFBQSxJQVVBLFFBQUEsRUFBVSxTQUFDLEtBQUQsR0FBQTtBQUNSLE1BQUEsSUFBQyxDQUFBLE1BQUQsR0FBVSxRQUFRLENBQUMsYUFBVCxDQUF1QixLQUF2QixDQUFWLENBQUE7QUFBQSxNQUNBLElBQUMsQ0FBQSxNQUFNLENBQUMsU0FBUixHQUFvQixnQkFEcEIsQ0FBQTtBQUFBLE1BRUEsSUFBQyxDQUFBLE1BQU0sQ0FBQyxTQUFSLEdBQW9CLElBQUMsQ0FBQSxJQUZyQixDQUFBO0FBQUEsTUFHQSxJQUFDLENBQUEsTUFBTSxDQUFDLEtBQUssQ0FBQyxPQUFkLEdBQXdCLE1BSHhCLENBQUE7QUFBQSxNQUlBLFFBQVEsQ0FBQyxJQUFJLENBQUMsV0FBZCxDQUEwQixJQUFDLENBQUEsTUFBM0IsQ0FKQSxDQUFBO0FBQUEsTUFLQSxJQUFDLENBQUEsT0FBRCxHQUFXLElBQUMsQ0FBQSxPQUFPLENBQUMsSUFBVCxDQUFjLElBQWQsQ0FMWCxDQUFBO0FBQUEsTUFNQSxJQUFDLENBQUEsS0FBRCxHQUFTLElBQUMsQ0FBQSxLQUFLLENBQUMsSUFBUCxDQUFZLElBQVosQ0FOVCxDQUFBO0FBQUEsTUFPQSxRQUFRLENBQUMsSUFBSSxDQUFDLGdCQUFkLENBQStCLFNBQS9CLEVBQTBDLElBQUMsQ0FBQSxPQUEzQyxDQVBBLENBQUE7YUFRQSxRQUFRLENBQUMsSUFBSSxDQUFDLGdCQUFkLENBQStCLE9BQS9CLEVBQXdDLElBQUMsQ0FBQSxLQUF6QyxFQVRRO0lBQUEsQ0FWVjtBQUFBLElBcUJBLE9BQUEsRUFBUyxTQUFDLENBQUQsR0FBQTtBQUNQLE1BQUEsSUFBd0IsQ0FBQyxDQUFDLEtBQUYsS0FBVyxJQUFDLENBQUEsUUFBUSxDQUFDLElBQTdDO0FBQUEsUUFBQSxJQUFDLENBQUEsUUFBUSxDQUFDLElBQVYsR0FBaUIsSUFBakIsQ0FBQTtPQUFBO0FBQ0EsTUFBQSxJQUFvQixDQUFDLENBQUMsS0FBRixLQUFXLElBQUMsQ0FBQSxJQUFJLENBQUMsSUFBckM7QUFBQSxRQUFBLElBQUMsQ0FBQSxJQUFJLENBQUMsSUFBTixHQUFhLElBQWIsQ0FBQTtPQURBO0FBRUEsTUFBQSxJQUFpQixJQUFDLENBQUEsUUFBUSxDQUFDLElBQVYsSUFBbUIsSUFBQyxDQUFBLElBQUksQ0FBQyxJQUExQztlQUFBLElBQUMsQ0FBQSxVQUFELENBQUEsRUFBQTtPQUhPO0lBQUEsQ0FyQlQ7QUFBQSxJQTBCQSxLQUFBLEVBQU8sU0FBQyxDQUFELEdBQUE7QUFDTCxNQUFBLElBQXVCLENBQUMsQ0FBQyxLQUFGLEtBQVcsSUFBQyxDQUFBLFFBQVEsQ0FBQyxJQUE1QztBQUFBLFFBQUEsSUFBQyxDQUFBLFFBQVEsQ0FBQyxJQUFWLEdBQWlCLEtBQWpCLENBQUE7T0FBQTtBQUNBLE1BQUEsSUFBbUIsQ0FBQyxDQUFDLEtBQUYsS0FBVyxJQUFDLENBQUEsSUFBSSxDQUFDLElBQXBDO0FBQUEsUUFBQSxJQUFDLENBQUEsSUFBSSxDQUFDLElBQU4sR0FBYSxLQUFiLENBQUE7T0FEQTtBQUVBLE1BQUEsSUFBaUIsQ0FBQSxJQUFFLENBQUEsUUFBUSxDQUFDLElBQVgsSUFBbUIsQ0FBQSxJQUFFLENBQUEsSUFBSSxDQUFDLElBQTNDO2VBQUEsSUFBQyxDQUFBLFVBQUQsQ0FBQSxFQUFBO09BSEs7SUFBQSxDQTFCUDtBQUFBLElBK0JBLFVBQUEsRUFBWSxTQUFBLEdBQUE7YUFDVixJQUFDLENBQUEsTUFBTSxDQUFDLEtBQUssQ0FBQyxPQUFkLEdBQXdCLFFBRGQ7SUFBQSxDQS9CWjtBQUFBLElBa0NBLFVBQUEsRUFBWSxTQUFBLEdBQUE7YUFDVixJQUFDLENBQUEsTUFBTSxDQUFDLEtBQUssQ0FBQyxPQUFkLEdBQXdCLE9BRGQ7SUFBQSxDQWxDWjtBQUFBLElBcUNBLFVBQUEsRUFBWSxTQUFBLEdBQUE7QUFDVixNQUFBLFFBQVEsQ0FBQyxJQUFJLENBQUMsbUJBQWQsQ0FBa0MsU0FBbEMsRUFBNkMsSUFBQyxDQUFBLE9BQTlDLENBQUEsQ0FBQTtBQUFBLE1BQ0EsUUFBUSxDQUFDLElBQUksQ0FBQyxtQkFBZCxDQUFrQyxPQUFsQyxFQUEyQyxJQUFDLENBQUEsS0FBNUMsQ0FEQSxDQUFBO2FBRUEsSUFBQyxDQUFBLE1BQU0sQ0FBQyxNQUFSLENBQUEsRUFIVTtJQUFBLENBckNaO0FBQUEsSUEwQ0EsSUFBQSxFQUFNLCswSEExQ047R0FGRixDQUFBO0FBQUEiCn0=

//# sourceURL=/Users/dawsonbotsford/.atom/packages/atom-shortcuts/lib/atom-shortcuts.coffee
