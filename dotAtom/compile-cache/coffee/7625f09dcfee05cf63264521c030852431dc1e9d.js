(function() {
  var CodeContext;

  module.exports = CodeContext = (function() {
    CodeContext.prototype.filename = null;

    CodeContext.prototype.filepath = null;

    CodeContext.prototype.lineNumber = null;

    CodeContext.prototype.shebang = null;

    CodeContext.prototype.textSource = null;

    function CodeContext(filename, filepath, textSource) {
      this.filename = filename;
      this.filepath = filepath;
      this.textSource = textSource != null ? textSource : null;
    }

    CodeContext.prototype.fileColonLine = function(fullPath) {
      var fileColonLine;
      if (fullPath == null) {
        fullPath = true;
      }
      if (fullPath) {
        fileColonLine = this.filepath;
      } else {
        fileColonLine = this.filename;
      }
      if (!this.lineNumber) {
        return fileColonLine;
      }
      return "" + fileColonLine + ":" + this.lineNumber;
    };

    CodeContext.prototype.getCode = function(prependNewlines) {
      var code, newlineCount, newlines, _ref;
      if (prependNewlines == null) {
        prependNewlines = true;
      }
      code = (_ref = this.textSource) != null ? _ref.getText() : void 0;
      if (!(prependNewlines && this.lineNumber)) {
        return code;
      }
      newlineCount = Number(this.lineNumber);
      newlines = Array(newlineCount).join("\n");
      return "" + newlines + code;
    };

    CodeContext.prototype.shebangCommand = function() {
      var sections;
      sections = this.shebangSections();
      if (!sections) {
        return;
      }
      return sections[0];
    };

    CodeContext.prototype.shebangCommandArgs = function() {
      var sections;
      sections = this.shebangSections();
      if (!sections) {
        return [];
      }
      return sections.slice(1, +(sections.length - 1) + 1 || 9e9);
    };

    CodeContext.prototype.shebangSections = function() {
      var _ref;
      return (_ref = this.shebang) != null ? _ref.split(' ') : void 0;
    };

    return CodeContext;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rhd3NvbmJvdHNmb3JkLy5hdG9tL3BhY2thZ2VzL3NjcmlwdC9saWIvY29kZS1jb250ZXh0LmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxXQUFBOztBQUFBLEVBQUEsTUFBTSxDQUFDLE9BQVAsR0FDTTtBQUNKLDBCQUFBLFFBQUEsR0FBVSxJQUFWLENBQUE7O0FBQUEsMEJBQ0EsUUFBQSxHQUFVLElBRFYsQ0FBQTs7QUFBQSwwQkFFQSxVQUFBLEdBQVksSUFGWixDQUFBOztBQUFBLDBCQUdBLE9BQUEsR0FBUyxJQUhULENBQUE7O0FBQUEsMEJBSUEsVUFBQSxHQUFZLElBSlosQ0FBQTs7QUFhYSxJQUFBLHFCQUFFLFFBQUYsRUFBYSxRQUFiLEVBQXdCLFVBQXhCLEdBQUE7QUFBNEMsTUFBM0MsSUFBQyxDQUFBLFdBQUEsUUFBMEMsQ0FBQTtBQUFBLE1BQWhDLElBQUMsQ0FBQSxXQUFBLFFBQStCLENBQUE7QUFBQSxNQUFyQixJQUFDLENBQUEsa0NBQUEsYUFBYSxJQUFPLENBQTVDO0lBQUEsQ0FiYjs7QUFBQSwwQkFvQkEsYUFBQSxHQUFlLFNBQUMsUUFBRCxHQUFBO0FBQ2IsVUFBQSxhQUFBOztRQURjLFdBQVc7T0FDekI7QUFBQSxNQUFBLElBQUcsUUFBSDtBQUNFLFFBQUEsYUFBQSxHQUFnQixJQUFDLENBQUEsUUFBakIsQ0FERjtPQUFBLE1BQUE7QUFHRSxRQUFBLGFBQUEsR0FBZ0IsSUFBQyxDQUFBLFFBQWpCLENBSEY7T0FBQTtBQUtBLE1BQUEsSUFBQSxDQUFBLElBQTZCLENBQUEsVUFBN0I7QUFBQSxlQUFPLGFBQVAsQ0FBQTtPQUxBO2FBTUEsRUFBQSxHQUFHLGFBQUgsR0FBaUIsR0FBakIsR0FBb0IsSUFBQyxDQUFBLFdBUFI7SUFBQSxDQXBCZixDQUFBOztBQUFBLDBCQWtDQSxPQUFBLEdBQVMsU0FBQyxlQUFELEdBQUE7QUFDUCxVQUFBLGtDQUFBOztRQURRLGtCQUFrQjtPQUMxQjtBQUFBLE1BQUEsSUFBQSwwQ0FBa0IsQ0FBRSxPQUFiLENBQUEsVUFBUCxDQUFBO0FBQ0EsTUFBQSxJQUFBLENBQUEsQ0FBbUIsZUFBQSxJQUFvQixJQUFDLENBQUEsVUFBeEMsQ0FBQTtBQUFBLGVBQU8sSUFBUCxDQUFBO09BREE7QUFBQSxNQUdBLFlBQUEsR0FBZSxNQUFBLENBQU8sSUFBQyxDQUFBLFVBQVIsQ0FIZixDQUFBO0FBQUEsTUFJQSxRQUFBLEdBQVcsS0FBQSxDQUFNLFlBQU4sQ0FBbUIsQ0FBQyxJQUFwQixDQUF5QixJQUF6QixDQUpYLENBQUE7YUFLQSxFQUFBLEdBQUcsUUFBSCxHQUFjLEtBTlA7SUFBQSxDQWxDVCxDQUFBOztBQUFBLDBCQTZDQSxjQUFBLEdBQWdCLFNBQUEsR0FBQTtBQUNkLFVBQUEsUUFBQTtBQUFBLE1BQUEsUUFBQSxHQUFXLElBQUMsQ0FBQSxlQUFELENBQUEsQ0FBWCxDQUFBO0FBQ0EsTUFBQSxJQUFBLENBQUEsUUFBQTtBQUFBLGNBQUEsQ0FBQTtPQURBO2FBR0EsUUFBUyxDQUFBLENBQUEsRUFKSztJQUFBLENBN0NoQixDQUFBOztBQUFBLDBCQXVEQSxrQkFBQSxHQUFvQixTQUFBLEdBQUE7QUFDbEIsVUFBQSxRQUFBO0FBQUEsTUFBQSxRQUFBLEdBQVcsSUFBQyxDQUFBLGVBQUQsQ0FBQSxDQUFYLENBQUE7QUFDQSxNQUFBLElBQUEsQ0FBQSxRQUFBO0FBQUEsZUFBTyxFQUFQLENBQUE7T0FEQTthQUdBLFFBQVMsNkNBSlM7SUFBQSxDQXZEcEIsQ0FBQTs7QUFBQSwwQkFpRUEsZUFBQSxHQUFpQixTQUFBLEdBQUE7QUFDZixVQUFBLElBQUE7aURBQVEsQ0FBRSxLQUFWLENBQWdCLEdBQWhCLFdBRGU7SUFBQSxDQWpFakIsQ0FBQTs7dUJBQUE7O01BRkYsQ0FBQTtBQUFBIgp9

//# sourceURL=/Users/dawsonbotsford/.atom/packages/script/lib/code-context.coffee
