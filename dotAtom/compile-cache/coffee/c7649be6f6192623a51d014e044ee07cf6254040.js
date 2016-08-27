(function() {
  var VimOption,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  VimOption = (function() {
    function VimOption() {
      this.nonu = __bind(this.nonu, this);
      this.nonumber = __bind(this.nonumber, this);
      this.nu = __bind(this.nu, this);
      this.number = __bind(this.number, this);
      this.nolist = __bind(this.nolist, this);
      this.list = __bind(this.list, this);
    }

    VimOption.singleton = function() {
      return VimOption.option || (VimOption.option = new VimOption);
    };

    VimOption.prototype.list = function() {
      return atom.config.set("editor.showInvisibles", true);
    };

    VimOption.prototype.nolist = function() {
      return atom.config.set("editor.showInvisibles", false);
    };

    VimOption.prototype.number = function() {
      return atom.config.set("editor.showLineNumbers", true);
    };

    VimOption.prototype.nu = function() {
      return this.number();
    };

    VimOption.prototype.nonumber = function() {
      return atom.config.set("editor.showLineNumbers", false);
    };

    VimOption.prototype.nonu = function() {
      return this.nonumber();
    };

    return VimOption;

  })();

  module.exports = VimOption;

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rhd3NvbmJvdHNmb3JkLy5hdG9tL3BhY2thZ2VzL2V4LW1vZGUvbGliL3ZpbS1vcHRpb24uY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLFNBQUE7SUFBQSxrRkFBQTs7QUFBQSxFQUFNOzs7Ozs7OztLQUNKOztBQUFBLElBQUEsU0FBQyxDQUFBLFNBQUQsR0FBWSxTQUFBLEdBQUE7YUFDVixTQUFDLENBQUEsV0FBRCxTQUFDLENBQUEsU0FBVyxHQUFBLENBQUEsV0FERjtJQUFBLENBQVosQ0FBQTs7QUFBQSx3QkFHQSxJQUFBLEdBQU0sU0FBQSxHQUFBO2FBQ0osSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLHVCQUFoQixFQUF5QyxJQUF6QyxFQURJO0lBQUEsQ0FITixDQUFBOztBQUFBLHdCQU1BLE1BQUEsR0FBUSxTQUFBLEdBQUE7YUFDTixJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IsdUJBQWhCLEVBQXlDLEtBQXpDLEVBRE07SUFBQSxDQU5SLENBQUE7O0FBQUEsd0JBU0EsTUFBQSxHQUFRLFNBQUEsR0FBQTthQUNOLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQix3QkFBaEIsRUFBMEMsSUFBMUMsRUFETTtJQUFBLENBVFIsQ0FBQTs7QUFBQSx3QkFZQSxFQUFBLEdBQUksU0FBQSxHQUFBO2FBQ0YsSUFBQyxDQUFBLE1BQUQsQ0FBQSxFQURFO0lBQUEsQ0FaSixDQUFBOztBQUFBLHdCQWVBLFFBQUEsR0FBVSxTQUFBLEdBQUE7YUFDUixJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0Isd0JBQWhCLEVBQTBDLEtBQTFDLEVBRFE7SUFBQSxDQWZWLENBQUE7O0FBQUEsd0JBa0JBLElBQUEsR0FBTSxTQUFBLEdBQUE7YUFDSixJQUFDLENBQUEsUUFBRCxDQUFBLEVBREk7SUFBQSxDQWxCTixDQUFBOztxQkFBQTs7TUFERixDQUFBOztBQUFBLEVBc0JBLE1BQU0sQ0FBQyxPQUFQLEdBQWlCLFNBdEJqQixDQUFBO0FBQUEiCn0=

//# sourceURL=/Users/dawsonbotsford/.atom/packages/ex-mode/lib/vim-option.coffee
