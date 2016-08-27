(function() {
  var Prefix, Register, Repeat,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Prefix = (function() {
    function Prefix() {}

    Prefix.prototype.complete = null;

    Prefix.prototype.composedObject = null;

    Prefix.prototype.isComplete = function() {
      return this.complete;
    };

    Prefix.prototype.isRecordable = function() {
      return this.composedObject.isRecordable();
    };

    Prefix.prototype.compose = function(composedObject) {
      this.composedObject = composedObject;
      return this.complete = true;
    };

    Prefix.prototype.execute = function() {
      var _base;
      return typeof (_base = this.composedObject).execute === "function" ? _base.execute(this.count) : void 0;
    };

    Prefix.prototype.select = function() {
      var _base;
      return typeof (_base = this.composedObject).select === "function" ? _base.select(this.count) : void 0;
    };

    Prefix.prototype.isLinewise = function() {
      var _base;
      return typeof (_base = this.composedObject).isLinewise === "function" ? _base.isLinewise() : void 0;
    };

    return Prefix;

  })();

  Repeat = (function(_super) {
    __extends(Repeat, _super);

    Repeat.prototype.count = null;

    function Repeat(count) {
      this.count = count;
      this.complete = false;
    }

    Repeat.prototype.addDigit = function(digit) {
      return this.count = this.count * 10 + digit;
    };

    return Repeat;

  })(Prefix);

  Register = (function(_super) {
    __extends(Register, _super);

    Register.prototype.name = null;

    function Register(name) {
      this.name = name;
      this.complete = false;
    }

    Register.prototype.compose = function(composedObject) {
      Register.__super__.compose.call(this, composedObject);
      if (composedObject.register != null) {
        return composedObject.register = this.name;
      }
    };

    return Register;

  })(Prefix);

  module.exports = {
    Repeat: Repeat,
    Register: Register
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rhd3NvbmJvdHNmb3JkLy5hdG9tL3BhY2thZ2VzL3ZpbS1tb2RlL2xpYi9wcmVmaXhlcy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsd0JBQUE7SUFBQTttU0FBQTs7QUFBQSxFQUFNO3dCQUNKOztBQUFBLHFCQUFBLFFBQUEsR0FBVSxJQUFWLENBQUE7O0FBQUEscUJBQ0EsY0FBQSxHQUFnQixJQURoQixDQUFBOztBQUFBLHFCQUdBLFVBQUEsR0FBWSxTQUFBLEdBQUE7YUFBRyxJQUFDLENBQUEsU0FBSjtJQUFBLENBSFosQ0FBQTs7QUFBQSxxQkFLQSxZQUFBLEdBQWMsU0FBQSxHQUFBO2FBQUcsSUFBQyxDQUFBLGNBQWMsQ0FBQyxZQUFoQixDQUFBLEVBQUg7SUFBQSxDQUxkLENBQUE7O0FBQUEscUJBWUEsT0FBQSxHQUFTLFNBQUUsY0FBRixHQUFBO0FBQ1AsTUFEUSxJQUFDLENBQUEsaUJBQUEsY0FDVCxDQUFBO2FBQUEsSUFBQyxDQUFBLFFBQUQsR0FBWSxLQURMO0lBQUEsQ0FaVCxDQUFBOztBQUFBLHFCQWtCQSxPQUFBLEdBQVMsU0FBQSxHQUFBO0FBQ1AsVUFBQSxLQUFBO2dGQUFlLENBQUMsUUFBUyxJQUFDLENBQUEsZ0JBRG5CO0lBQUEsQ0FsQlQsQ0FBQTs7QUFBQSxxQkF3QkEsTUFBQSxHQUFRLFNBQUEsR0FBQTtBQUNOLFVBQUEsS0FBQTsrRUFBZSxDQUFDLE9BQVEsSUFBQyxDQUFBLGdCQURuQjtJQUFBLENBeEJSLENBQUE7O0FBQUEscUJBMkJBLFVBQUEsR0FBWSxTQUFBLEdBQUE7QUFDVixVQUFBLEtBQUE7bUZBQWUsQ0FBQyxzQkFETjtJQUFBLENBM0JaLENBQUE7O2tCQUFBOztNQURGLENBQUE7O0FBQUEsRUFtQ007QUFDSiw2QkFBQSxDQUFBOztBQUFBLHFCQUFBLEtBQUEsR0FBTyxJQUFQLENBQUE7O0FBR2EsSUFBQSxnQkFBRSxLQUFGLEdBQUE7QUFBWSxNQUFYLElBQUMsQ0FBQSxRQUFBLEtBQVUsQ0FBQTtBQUFBLE1BQUEsSUFBQyxDQUFBLFFBQUQsR0FBWSxLQUFaLENBQVo7SUFBQSxDQUhiOztBQUFBLHFCQVVBLFFBQUEsR0FBVSxTQUFDLEtBQUQsR0FBQTthQUNSLElBQUMsQ0FBQSxLQUFELEdBQVMsSUFBQyxDQUFBLEtBQUQsR0FBUyxFQUFULEdBQWMsTUFEZjtJQUFBLENBVlYsQ0FBQTs7a0JBQUE7O0tBRG1CLE9BbkNyQixDQUFBOztBQUFBLEVBb0RNO0FBQ0osK0JBQUEsQ0FBQTs7QUFBQSx1QkFBQSxJQUFBLEdBQU0sSUFBTixDQUFBOztBQUdhLElBQUEsa0JBQUUsSUFBRixHQUFBO0FBQVcsTUFBVixJQUFDLENBQUEsT0FBQSxJQUFTLENBQUE7QUFBQSxNQUFBLElBQUMsQ0FBQSxRQUFELEdBQVksS0FBWixDQUFYO0lBQUEsQ0FIYjs7QUFBQSx1QkFVQSxPQUFBLEdBQVMsU0FBQyxjQUFELEdBQUE7QUFDUCxNQUFBLHNDQUFNLGNBQU4sQ0FBQSxDQUFBO0FBQ0EsTUFBQSxJQUFtQywrQkFBbkM7ZUFBQSxjQUFjLENBQUMsUUFBZixHQUEwQixJQUFDLENBQUEsS0FBM0I7T0FGTztJQUFBLENBVlQsQ0FBQTs7b0JBQUE7O0tBRHFCLE9BcER2QixDQUFBOztBQUFBLEVBbUVBLE1BQU0sQ0FBQyxPQUFQLEdBQWlCO0FBQUEsSUFBQyxRQUFBLE1BQUQ7QUFBQSxJQUFTLFVBQUEsUUFBVDtHQW5FakIsQ0FBQTtBQUFBIgp9

//# sourceURL=/Users/dawsonbotsford/.atom/packages/vim-mode/lib/prefixes.coffee
