(function() {
  var fs, os, path, uuid;

  os = require('os');

  fs = require('fs');

  path = require('path');

  uuid = require('node-uuid');

  module.exports = {
    tempFilesDir: path.join(os.tmpdir(), 'atom_script_tempfiles'),
    createTempFileWithCode: function(code, extension) {
      var error, file, tempFilePath;
      if (extension == null) {
        extension = "";
      }
      try {
        if (!fs.existsSync(this.tempFilesDir)) {
          fs.mkdirSync(this.tempFilesDir);
        }
        tempFilePath = this.tempFilesDir + path.sep + uuid.v1() + extension;
        file = fs.openSync(tempFilePath, 'w');
        fs.writeSync(file, code);
        fs.closeSync(file);
        return tempFilePath;
      } catch (_error) {
        error = _error;
        throw "Error while creating temporary file (" + error + ")";
      }
    },
    deleteTempFiles: function() {
      var error, files;
      try {
        if (fs.existsSync(this.tempFilesDir)) {
          files = fs.readdirSync(this.tempFilesDir);
          if (files.length) {
            files.forEach((function(_this) {
              return function(file, index) {
                return fs.unlinkSync(_this.tempFilesDir + path.sep + file);
              };
            })(this));
          }
          return fs.rmdirSync(this.tempFilesDir);
        }
      } catch (_error) {
        error = _error;
        throw "Error while deleting temporary files (" + error + ")";
      }
    },
    Lisp: require('./grammar-utils/lisp'),
    MATLAB: require('./grammar-utils/matlab'),
    OperatingSystem: require('./grammar-utils/operating-system'),
    R: require('./grammar-utils/R'),
    Perl: require('./grammar-utils/perl'),
    PHP: require('./grammar-utils/php'),
    Nim: require('./grammar-utils/nim'),
    CScompiler: require('./grammar-utils/coffee-script-compiler')
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rhd3NvbmJvdHNmb3JkLy5hdG9tL3BhY2thZ2VzL3NjcmlwdC9saWIvZ3JhbW1hci11dGlscy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFDQTtBQUFBLE1BQUEsa0JBQUE7O0FBQUEsRUFBQSxFQUFBLEdBQUssT0FBQSxDQUFRLElBQVIsQ0FBTCxDQUFBOztBQUFBLEVBQ0EsRUFBQSxHQUFLLE9BQUEsQ0FBUSxJQUFSLENBREwsQ0FBQTs7QUFBQSxFQUVBLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUixDQUZQLENBQUE7O0FBQUEsRUFHQSxJQUFBLEdBQU8sT0FBQSxDQUFRLFdBQVIsQ0FIUCxDQUFBOztBQUFBLEVBTUEsTUFBTSxDQUFDLE9BQVAsR0FDRTtBQUFBLElBQUEsWUFBQSxFQUFjLElBQUksQ0FBQyxJQUFMLENBQVUsRUFBRSxDQUFDLE1BQUgsQ0FBQSxDQUFWLEVBQXVCLHVCQUF2QixDQUFkO0FBQUEsSUFPQSxzQkFBQSxFQUF3QixTQUFDLElBQUQsRUFBTyxTQUFQLEdBQUE7QUFDdEIsVUFBQSx5QkFBQTs7UUFENkIsWUFBWTtPQUN6QztBQUFBO0FBQ0UsUUFBQSxJQUFBLENBQUEsRUFBcUMsQ0FBQyxVQUFILENBQWMsSUFBQyxDQUFBLFlBQWYsQ0FBbkM7QUFBQSxVQUFBLEVBQUUsQ0FBQyxTQUFILENBQWEsSUFBQyxDQUFBLFlBQWQsQ0FBQSxDQUFBO1NBQUE7QUFBQSxRQUVBLFlBQUEsR0FBZSxJQUFDLENBQUEsWUFBRCxHQUFnQixJQUFJLENBQUMsR0FBckIsR0FBMkIsSUFBSSxDQUFDLEVBQUwsQ0FBQSxDQUEzQixHQUF1QyxTQUZ0RCxDQUFBO0FBQUEsUUFJQSxJQUFBLEdBQU8sRUFBRSxDQUFDLFFBQUgsQ0FBWSxZQUFaLEVBQTBCLEdBQTFCLENBSlAsQ0FBQTtBQUFBLFFBS0EsRUFBRSxDQUFDLFNBQUgsQ0FBYSxJQUFiLEVBQW1CLElBQW5CLENBTEEsQ0FBQTtBQUFBLFFBTUEsRUFBRSxDQUFDLFNBQUgsQ0FBYSxJQUFiLENBTkEsQ0FBQTtlQVFBLGFBVEY7T0FBQSxjQUFBO0FBV0UsUUFESSxjQUNKLENBQUE7QUFBQSxjQUFRLHVDQUFBLEdBQXVDLEtBQXZDLEdBQTZDLEdBQXJELENBWEY7T0FEc0I7SUFBQSxDQVB4QjtBQUFBLElBc0JBLGVBQUEsRUFBaUIsU0FBQSxHQUFBO0FBQ2YsVUFBQSxZQUFBO0FBQUE7QUFDRSxRQUFBLElBQUksRUFBRSxDQUFDLFVBQUgsQ0FBYyxJQUFDLENBQUEsWUFBZixDQUFKO0FBQ0UsVUFBQSxLQUFBLEdBQVEsRUFBRSxDQUFDLFdBQUgsQ0FBZSxJQUFDLENBQUEsWUFBaEIsQ0FBUixDQUFBO0FBQ0EsVUFBQSxJQUFJLEtBQUssQ0FBQyxNQUFWO0FBQ0UsWUFBQSxLQUFLLENBQUMsT0FBTixDQUFjLENBQUEsU0FBQSxLQUFBLEdBQUE7cUJBQUEsU0FBQyxJQUFELEVBQU8sS0FBUCxHQUFBO3VCQUFpQixFQUFFLENBQUMsVUFBSCxDQUFjLEtBQUMsQ0FBQSxZQUFELEdBQWdCLElBQUksQ0FBQyxHQUFyQixHQUEyQixJQUF6QyxFQUFqQjtjQUFBLEVBQUE7WUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQWQsQ0FBQSxDQURGO1dBREE7aUJBR0EsRUFBRSxDQUFDLFNBQUgsQ0FBYSxJQUFDLENBQUEsWUFBZCxFQUpGO1NBREY7T0FBQSxjQUFBO0FBT0UsUUFESSxjQUNKLENBQUE7QUFBQSxjQUFRLHdDQUFBLEdBQXdDLEtBQXhDLEdBQThDLEdBQXRELENBUEY7T0FEZTtJQUFBLENBdEJqQjtBQUFBLElBbUNBLElBQUEsRUFBTSxPQUFBLENBQVEsc0JBQVIsQ0FuQ047QUFBQSxJQXdDQSxNQUFBLEVBQVEsT0FBQSxDQUFRLHdCQUFSLENBeENSO0FBQUEsSUE2Q0EsZUFBQSxFQUFpQixPQUFBLENBQVEsa0NBQVIsQ0E3Q2pCO0FBQUEsSUFrREEsQ0FBQSxFQUFHLE9BQUEsQ0FBUSxtQkFBUixDQWxESDtBQUFBLElBdURBLElBQUEsRUFBTSxPQUFBLENBQVEsc0JBQVIsQ0F2RE47QUFBQSxJQTREQSxHQUFBLEVBQUssT0FBQSxDQUFRLHFCQUFSLENBNURMO0FBQUEsSUFpRUEsR0FBQSxFQUFLLE9BQUEsQ0FBUSxxQkFBUixDQWpFTDtBQUFBLElBc0VBLFVBQUEsRUFBWSxPQUFBLENBQVEsd0NBQVIsQ0F0RVo7R0FQRixDQUFBO0FBQUEiCn0=

//# sourceURL=/Users/dawsonbotsford/.atom/packages/script/lib/grammar-utils.coffee
