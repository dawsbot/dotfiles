(function() {
  module.exports = {
    projectDir: function(editorfile) {
      var path;
      path = require('path');
      return path.dirname(editorfile);
    },
    findNimProjectFile: function(editorfile) {
      var error, file, filepath, files, fs, name, path, stats, tfile, _i, _len;
      path = require('path');
      fs = require('fs');
      if (path.extname(editorfile) === '.nims') {
        try {
          tfile = editorfile.slice(0, -1);
          stats = fs.statSync(tfile);
          return path.basename(tfile);
        } catch (_error) {
          error = _error;
          return path.basename(editorfile);
        }
      }
      try {
        stats = fs.statSync(editorfile + "s");
        return path.basename(editorfile);
      } catch (_error) {}
      try {
        stats = fs.statSync(editorfile + ".cfg");
        return path.basename(editorfile);
      } catch (_error) {}
      try {
        stats = fs.statSync(editorfile + "cfg");
        return path.basename(editorfile);
      } catch (_error) {}
      filepath = path.dirname(editorfile);
      files = fs.readdirSync(filepath);
      files.sort();
      for (_i = 0, _len = files.length; _i < _len; _i++) {
        file = files[_i];
        name = filepath + '/' + file;
        if (fs.statSync(name).isFile()) {
          if (path.extname(name) === '.nims' || path.extname(name) === '.nimcgf' || path.extname(name) === '.cfg') {
            try {
              tfile = name.slice(0, -1);
              stats = fs.statSync(tfile);
              return path.basename(tfile);
            } catch (_error) {
              error = _error;
              console.log("File does not exist.");
            }
          }
        }
      }
      return path.basename(editorfile);
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rhd3NvbmJvdHNmb3JkLy5hdG9tL3BhY2thZ2VzL3NjcmlwdC9saWIvZ3JhbW1hci11dGlscy9uaW0uY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQ0E7QUFBQSxFQUFBLE1BQU0sQ0FBQyxPQUFQLEdBT0U7QUFBQSxJQUFBLFVBQUEsRUFBWSxTQUFDLFVBQUQsR0FBQTtBQUNWLFVBQUEsSUFBQTtBQUFBLE1BQUEsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSLENBQVAsQ0FBQTtBQUNBLGFBQU8sSUFBSSxDQUFDLE9BQUwsQ0FBYSxVQUFiLENBQVAsQ0FGVTtJQUFBLENBQVo7QUFBQSxJQUlBLGtCQUFBLEVBQW9CLFNBQUMsVUFBRCxHQUFBO0FBQ2xCLFVBQUEsb0VBQUE7QUFBQSxNQUFBLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUixDQUFQLENBQUE7QUFBQSxNQUNBLEVBQUEsR0FBSyxPQUFBLENBQVEsSUFBUixDQURMLENBQUE7QUFHQSxNQUFBLElBQUcsSUFBSSxDQUFDLE9BQUwsQ0FBYSxVQUFiLENBQUEsS0FBMEIsT0FBN0I7QUFFRTtBQUNFLFVBQUEsS0FBQSxHQUFRLFVBQVUsQ0FBQyxLQUFYLENBQWlCLENBQWpCLEVBQW9CLENBQUEsQ0FBcEIsQ0FBUixDQUFBO0FBQUEsVUFDQSxLQUFBLEdBQVEsRUFBRSxDQUFDLFFBQUgsQ0FBWSxLQUFaLENBRFIsQ0FBQTtBQUlBLGlCQUFPLElBQUksQ0FBQyxRQUFMLENBQWMsS0FBZCxDQUFQLENBTEY7U0FBQSxjQUFBO0FBUUUsVUFGSSxjQUVKLENBQUE7QUFBQSxpQkFBTyxJQUFJLENBQUMsUUFBTCxDQUFjLFVBQWQsQ0FBUCxDQVJGO1NBRkY7T0FIQTtBQWdCQTtBQUNFLFFBQUEsS0FBQSxHQUFRLEVBQUUsQ0FBQyxRQUFILENBQVksVUFBQSxHQUFhLEdBQXpCLENBQVIsQ0FBQTtBQUNBLGVBQU8sSUFBSSxDQUFDLFFBQUwsQ0FBYyxVQUFkLENBQVAsQ0FGRjtPQUFBLGtCQWhCQTtBQW9CQTtBQUNFLFFBQUEsS0FBQSxHQUFRLEVBQUUsQ0FBQyxRQUFILENBQVksVUFBQSxHQUFhLE1BQXpCLENBQVIsQ0FBQTtBQUNBLGVBQU8sSUFBSSxDQUFDLFFBQUwsQ0FBYyxVQUFkLENBQVAsQ0FGRjtPQUFBLGtCQXBCQTtBQXdCQTtBQUNFLFFBQUEsS0FBQSxHQUFRLEVBQUUsQ0FBQyxRQUFILENBQVksVUFBQSxHQUFhLEtBQXpCLENBQVIsQ0FBQTtBQUNBLGVBQU8sSUFBSSxDQUFDLFFBQUwsQ0FBYyxVQUFkLENBQVAsQ0FGRjtPQUFBLGtCQXhCQTtBQUFBLE1BaUNBLFFBQUEsR0FBVyxJQUFJLENBQUMsT0FBTCxDQUFhLFVBQWIsQ0FqQ1gsQ0FBQTtBQUFBLE1Ba0NBLEtBQUEsR0FBUSxFQUFFLENBQUMsV0FBSCxDQUFlLFFBQWYsQ0FsQ1IsQ0FBQTtBQUFBLE1BbUNBLEtBQUssQ0FBQyxJQUFOLENBQUEsQ0FuQ0EsQ0FBQTtBQW9DQSxXQUFBLDRDQUFBO3lCQUFBO0FBQ0UsUUFBQSxJQUFBLEdBQU8sUUFBQSxHQUFXLEdBQVgsR0FBaUIsSUFBeEIsQ0FBQTtBQUNBLFFBQUEsSUFBSSxFQUFFLENBQUMsUUFBSCxDQUFZLElBQVosQ0FBaUIsQ0FBQyxNQUFsQixDQUFBLENBQUo7QUFDRSxVQUFBLElBQUcsSUFBSSxDQUFDLE9BQUwsQ0FBYSxJQUFiLENBQUEsS0FBb0IsT0FBcEIsSUFDRCxJQUFJLENBQUMsT0FBTCxDQUFhLElBQWIsQ0FBQSxLQUFvQixTQURuQixJQUVELElBQUksQ0FBQyxPQUFMLENBQWEsSUFBYixDQUFBLEtBQW9CLE1BRnRCO0FBR0k7QUFDRSxjQUFBLEtBQUEsR0FBUSxJQUFJLENBQUMsS0FBTCxDQUFXLENBQVgsRUFBYyxDQUFBLENBQWQsQ0FBUixDQUFBO0FBQUEsY0FDQSxLQUFBLEdBQVEsRUFBRSxDQUFDLFFBQUgsQ0FBWSxLQUFaLENBRFIsQ0FBQTtBQUVBLHFCQUFPLElBQUksQ0FBQyxRQUFMLENBQWMsS0FBZCxDQUFQLENBSEY7YUFBQSxjQUFBO0FBS0UsY0FESSxjQUNKLENBQUE7QUFBQSxjQUFBLE9BQU8sQ0FBQyxHQUFSLENBQVksc0JBQVosQ0FBQSxDQUxGO2FBSEo7V0FERjtTQUZGO0FBQUEsT0FwQ0E7QUFrREEsYUFBTyxJQUFJLENBQUMsUUFBTCxDQUFjLFVBQWQsQ0FBUCxDQW5Ea0I7SUFBQSxDQUpwQjtHQVBGLENBQUE7QUFBQSIKfQ==

//# sourceURL=/Users/dawsonbotsford/.atom/packages/script/lib/grammar-utils/nim.coffee
