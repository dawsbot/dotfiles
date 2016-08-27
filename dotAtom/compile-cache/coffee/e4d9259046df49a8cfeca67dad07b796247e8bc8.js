(function() {
  var VimOption,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  VimOption = (function() {
    function VimOption() {
      this.noscs = __bind(this.noscs, this);
      this.nosmartcase = __bind(this.nosmartcase, this);
      this.scs = __bind(this.scs, this);
      this.smartcase = __bind(this.smartcase, this);
      this.nosb = __bind(this.nosb, this);
      this.nosplitbelow = __bind(this.nosplitbelow, this);
      this.sb = __bind(this.sb, this);
      this.splitbelow = __bind(this.splitbelow, this);
      this.nospr = __bind(this.nospr, this);
      this.nosplitright = __bind(this.nosplitright, this);
      this.spr = __bind(this.spr, this);
      this.splitright = __bind(this.splitright, this);
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

    VimOption.prototype.splitright = function() {
      return atom.config.set("ex-mode.splitright", true);
    };

    VimOption.prototype.spr = function() {
      return this.splitright();
    };

    VimOption.prototype.nosplitright = function() {
      return atom.config.set("ex-mode.splitright", false);
    };

    VimOption.prototype.nospr = function() {
      return this.nosplitright();
    };

    VimOption.prototype.splitbelow = function() {
      return atom.config.set("ex-mode.splitbelow", true);
    };

    VimOption.prototype.sb = function() {
      return this.splitbelow();
    };

    VimOption.prototype.nosplitbelow = function() {
      return atom.config.set("ex-mode.splitbelow", false);
    };

    VimOption.prototype.nosb = function() {
      return this.nosplitbelow();
    };

    VimOption.prototype.smartcase = function() {
      return atom.config.set("vim-mode.useSmartcaseForSearch", true);
    };

    VimOption.prototype.scs = function() {
      return this.smartcase();
    };

    VimOption.prototype.nosmartcase = function() {
      return atom.config.set("vim-mode.useSmartcaseForSearch", false);
    };

    VimOption.prototype.noscs = function() {
      return this.nosmartcase();
    };

    return VimOption;

  })();

  module.exports = VimOption;

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rhd3NvbmJvdHNmb3JkLy5hdG9tL3BhY2thZ2VzL2V4LW1vZGUvbGliL3ZpbS1vcHRpb24uY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLFNBQUE7SUFBQSxrRkFBQTs7QUFBQSxFQUFNOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztLQUNKOztBQUFBLElBQUEsU0FBQyxDQUFBLFNBQUQsR0FBWSxTQUFBLEdBQUE7YUFDVixTQUFDLENBQUEsV0FBRCxTQUFDLENBQUEsU0FBVyxHQUFBLENBQUEsV0FERjtJQUFBLENBQVosQ0FBQTs7QUFBQSx3QkFHQSxJQUFBLEdBQU0sU0FBQSxHQUFBO2FBQ0osSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLHVCQUFoQixFQUF5QyxJQUF6QyxFQURJO0lBQUEsQ0FITixDQUFBOztBQUFBLHdCQU1BLE1BQUEsR0FBUSxTQUFBLEdBQUE7YUFDTixJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IsdUJBQWhCLEVBQXlDLEtBQXpDLEVBRE07SUFBQSxDQU5SLENBQUE7O0FBQUEsd0JBU0EsTUFBQSxHQUFRLFNBQUEsR0FBQTthQUNOLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQix3QkFBaEIsRUFBMEMsSUFBMUMsRUFETTtJQUFBLENBVFIsQ0FBQTs7QUFBQSx3QkFZQSxFQUFBLEdBQUksU0FBQSxHQUFBO2FBQ0YsSUFBQyxDQUFBLE1BQUQsQ0FBQSxFQURFO0lBQUEsQ0FaSixDQUFBOztBQUFBLHdCQWVBLFFBQUEsR0FBVSxTQUFBLEdBQUE7YUFDUixJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0Isd0JBQWhCLEVBQTBDLEtBQTFDLEVBRFE7SUFBQSxDQWZWLENBQUE7O0FBQUEsd0JBa0JBLElBQUEsR0FBTSxTQUFBLEdBQUE7YUFDSixJQUFDLENBQUEsUUFBRCxDQUFBLEVBREk7SUFBQSxDQWxCTixDQUFBOztBQUFBLHdCQXFCQSxVQUFBLEdBQVksU0FBQSxHQUFBO2FBQ1YsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLG9CQUFoQixFQUFzQyxJQUF0QyxFQURVO0lBQUEsQ0FyQlosQ0FBQTs7QUFBQSx3QkF3QkEsR0FBQSxHQUFLLFNBQUEsR0FBQTthQUNILElBQUMsQ0FBQSxVQUFELENBQUEsRUFERztJQUFBLENBeEJMLENBQUE7O0FBQUEsd0JBMkJBLFlBQUEsR0FBYyxTQUFBLEdBQUE7YUFDWixJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0Isb0JBQWhCLEVBQXNDLEtBQXRDLEVBRFk7SUFBQSxDQTNCZCxDQUFBOztBQUFBLHdCQThCQSxLQUFBLEdBQU8sU0FBQSxHQUFBO2FBQ0wsSUFBQyxDQUFBLFlBQUQsQ0FBQSxFQURLO0lBQUEsQ0E5QlAsQ0FBQTs7QUFBQSx3QkFpQ0EsVUFBQSxHQUFZLFNBQUEsR0FBQTthQUNWLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQixvQkFBaEIsRUFBc0MsSUFBdEMsRUFEVTtJQUFBLENBakNaLENBQUE7O0FBQUEsd0JBb0NBLEVBQUEsR0FBSSxTQUFBLEdBQUE7YUFDRixJQUFDLENBQUEsVUFBRCxDQUFBLEVBREU7SUFBQSxDQXBDSixDQUFBOztBQUFBLHdCQXVDQSxZQUFBLEdBQWMsU0FBQSxHQUFBO2FBQ1osSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLG9CQUFoQixFQUFzQyxLQUF0QyxFQURZO0lBQUEsQ0F2Q2QsQ0FBQTs7QUFBQSx3QkEwQ0EsSUFBQSxHQUFNLFNBQUEsR0FBQTthQUNKLElBQUMsQ0FBQSxZQUFELENBQUEsRUFESTtJQUFBLENBMUNOLENBQUE7O0FBQUEsd0JBNkNBLFNBQUEsR0FBVyxTQUFBLEdBQUE7YUFDVCxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IsZ0NBQWhCLEVBQWtELElBQWxELEVBRFM7SUFBQSxDQTdDWCxDQUFBOztBQUFBLHdCQWdEQSxHQUFBLEdBQUssU0FBQSxHQUFBO2FBQ0gsSUFBQyxDQUFBLFNBQUQsQ0FBQSxFQURHO0lBQUEsQ0FoREwsQ0FBQTs7QUFBQSx3QkFtREEsV0FBQSxHQUFhLFNBQUEsR0FBQTthQUNYLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQixnQ0FBaEIsRUFBa0QsS0FBbEQsRUFEVztJQUFBLENBbkRiLENBQUE7O0FBQUEsd0JBc0RBLEtBQUEsR0FBTyxTQUFBLEdBQUE7YUFDTCxJQUFDLENBQUEsV0FBRCxDQUFBLEVBREs7SUFBQSxDQXREUCxDQUFBOztxQkFBQTs7TUFERixDQUFBOztBQUFBLEVBMERBLE1BQU0sQ0FBQyxPQUFQLEdBQWlCLFNBMURqQixDQUFBO0FBQUEiCn0=

//# sourceURL=/Users/dawsonbotsford/.atom/packages/ex-mode/lib/vim-option.coffee
