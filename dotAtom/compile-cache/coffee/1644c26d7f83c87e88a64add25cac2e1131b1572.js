(function() {
  var Path, head, mocks, pathToRepoFile;

  Path = require('flavored-path');

  pathToRepoFile = Path.get("~/some/repository/directory/file");

  head = jasmine.createSpyObj('head', ['replace']);

  module.exports = mocks = {
    pathToRepoFile: pathToRepoFile,
    repo: {
      getPath: function() {
        return Path.join(this.getWorkingDirectory(), ".git");
      },
      getWorkingDirectory: function() {
        return Path.get("~/some/repository");
      },
      refreshStatus: function() {
        return void 0;
      },
      relativize: function(path) {
        if (path === pathToRepoFile) {
          return "directory/file";
        }
      },
      getReferences: function() {
        return {
          heads: [head]
        };
      },
      getShortHead: function() {
        return 'short head';
      },
      isPathModified: function() {
        return false;
      },
      repo: {
        submoduleForPath: function(path) {
          return void 0;
        }
      }
    },
    currentPane: {
      isAlive: function() {
        return true;
      },
      activate: function() {
        return void 0;
      },
      destroy: function() {
        return void 0;
      },
      getItems: function() {
        return [
          {
            getURI: function() {
              return pathToRepoFile;
            }
          }
        ];
      }
    },
    commitPane: {
      isAlive: function() {
        return true;
      },
      destroy: function() {
        return mocks.textEditor.destroy();
      },
      splitRight: function() {
        return void 0;
      },
      getItems: function() {
        return [
          {
            getURI: function() {
              return Path.join(mocks.repo.getPath(), 'COMMIT_EDITMSG');
            }
          }
        ];
      }
    },
    textEditor: {
      getPath: function() {
        return pathToRepoFile;
      },
      getURI: function() {
        return pathToRepoFile;
      },
      onDidDestroy: function(destroy) {
        this.destroy = destroy;
        return {
          dispose: function() {}
        };
      },
      onDidSave: function(save) {
        this.save = save;
        return {
          dispose: function() {
            return void 0;
          }
        };
      }
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rhd3NvbmJvdHNmb3JkLy5hdG9tL3BhY2thZ2VzL2dpdC1wbHVzL3NwZWMvZml4dHVyZXMuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLGlDQUFBOztBQUFBLEVBQUEsSUFBQSxHQUFPLE9BQUEsQ0FBUSxlQUFSLENBQVAsQ0FBQTs7QUFBQSxFQUVBLGNBQUEsR0FBaUIsSUFBSSxDQUFDLEdBQUwsQ0FBUyxrQ0FBVCxDQUZqQixDQUFBOztBQUFBLEVBSUEsSUFBQSxHQUFPLE9BQU8sQ0FBQyxZQUFSLENBQXFCLE1BQXJCLEVBQTZCLENBQUMsU0FBRCxDQUE3QixDQUpQLENBQUE7O0FBQUEsRUFNQSxNQUFNLENBQUMsT0FBUCxHQUFpQixLQUFBLEdBQ2Y7QUFBQSxJQUFBLGNBQUEsRUFBZ0IsY0FBaEI7QUFBQSxJQUVBLElBQUEsRUFDRTtBQUFBLE1BQUEsT0FBQSxFQUFTLFNBQUEsR0FBQTtlQUFHLElBQUksQ0FBQyxJQUFMLENBQVUsSUFBSSxDQUFDLG1CQUFMLENBQUEsQ0FBVixFQUFzQyxNQUF0QyxFQUFIO01BQUEsQ0FBVDtBQUFBLE1BQ0EsbUJBQUEsRUFBcUIsU0FBQSxHQUFBO2VBQUcsSUFBSSxDQUFDLEdBQUwsQ0FBUyxtQkFBVCxFQUFIO01BQUEsQ0FEckI7QUFBQSxNQUVBLGFBQUEsRUFBZSxTQUFBLEdBQUE7ZUFBRyxPQUFIO01BQUEsQ0FGZjtBQUFBLE1BR0EsVUFBQSxFQUFZLFNBQUMsSUFBRCxHQUFBO0FBQVUsUUFBQSxJQUFvQixJQUFBLEtBQVEsY0FBNUI7aUJBQUEsaUJBQUE7U0FBVjtNQUFBLENBSFo7QUFBQSxNQUlBLGFBQUEsRUFBZSxTQUFBLEdBQUE7ZUFDYjtBQUFBLFVBQUEsS0FBQSxFQUFPLENBQUMsSUFBRCxDQUFQO1VBRGE7TUFBQSxDQUpmO0FBQUEsTUFNQSxZQUFBLEVBQWMsU0FBQSxHQUFBO2VBQUcsYUFBSDtNQUFBLENBTmQ7QUFBQSxNQU9BLGNBQUEsRUFBZ0IsU0FBQSxHQUFBO2VBQUcsTUFBSDtNQUFBLENBUGhCO0FBQUEsTUFRQSxJQUFBLEVBQ0U7QUFBQSxRQUFBLGdCQUFBLEVBQWtCLFNBQUMsSUFBRCxHQUFBO2lCQUFVLE9BQVY7UUFBQSxDQUFsQjtPQVRGO0tBSEY7QUFBQSxJQWNBLFdBQUEsRUFDRTtBQUFBLE1BQUEsT0FBQSxFQUFTLFNBQUEsR0FBQTtlQUFHLEtBQUg7TUFBQSxDQUFUO0FBQUEsTUFDQSxRQUFBLEVBQVUsU0FBQSxHQUFBO2VBQUcsT0FBSDtNQUFBLENBRFY7QUFBQSxNQUVBLE9BQUEsRUFBUyxTQUFBLEdBQUE7ZUFBRyxPQUFIO01BQUEsQ0FGVDtBQUFBLE1BR0EsUUFBQSxFQUFVLFNBQUEsR0FBQTtlQUFHO1VBQ1g7QUFBQSxZQUFBLE1BQUEsRUFBUSxTQUFBLEdBQUE7cUJBQUcsZUFBSDtZQUFBLENBQVI7V0FEVztVQUFIO01BQUEsQ0FIVjtLQWZGO0FBQUEsSUFzQkEsVUFBQSxFQUNFO0FBQUEsTUFBQSxPQUFBLEVBQVMsU0FBQSxHQUFBO2VBQUcsS0FBSDtNQUFBLENBQVQ7QUFBQSxNQUNBLE9BQUEsRUFBUyxTQUFBLEdBQUE7ZUFBRyxLQUFLLENBQUMsVUFBVSxDQUFDLE9BQWpCLENBQUEsRUFBSDtNQUFBLENBRFQ7QUFBQSxNQUVBLFVBQUEsRUFBWSxTQUFBLEdBQUE7ZUFBRyxPQUFIO01BQUEsQ0FGWjtBQUFBLE1BR0EsUUFBQSxFQUFVLFNBQUEsR0FBQTtlQUFHO1VBQ1g7QUFBQSxZQUFBLE1BQUEsRUFBUSxTQUFBLEdBQUE7cUJBQUcsSUFBSSxDQUFDLElBQUwsQ0FBVSxLQUFLLENBQUMsSUFBSSxDQUFDLE9BQVgsQ0FBQSxDQUFWLEVBQWdDLGdCQUFoQyxFQUFIO1lBQUEsQ0FBUjtXQURXO1VBQUg7TUFBQSxDQUhWO0tBdkJGO0FBQUEsSUE4QkEsVUFBQSxFQUNFO0FBQUEsTUFBQSxPQUFBLEVBQVMsU0FBQSxHQUFBO2VBQUcsZUFBSDtNQUFBLENBQVQ7QUFBQSxNQUNBLE1BQUEsRUFBUSxTQUFBLEdBQUE7ZUFBRyxlQUFIO01BQUEsQ0FEUjtBQUFBLE1BRUEsWUFBQSxFQUFjLFNBQUUsT0FBRixHQUFBO0FBQ1osUUFEYSxJQUFDLENBQUEsVUFBQSxPQUNkLENBQUE7ZUFBQTtBQUFBLFVBQUEsT0FBQSxFQUFTLFNBQUEsR0FBQSxDQUFUO1VBRFk7TUFBQSxDQUZkO0FBQUEsTUFJQSxTQUFBLEVBQVcsU0FBRSxJQUFGLEdBQUE7QUFDVCxRQURVLElBQUMsQ0FBQSxPQUFBLElBQ1gsQ0FBQTtlQUFBO0FBQUEsVUFBQSxPQUFBLEVBQVMsU0FBQSxHQUFBO21CQUFHLE9BQUg7VUFBQSxDQUFUO1VBRFM7TUFBQSxDQUpYO0tBL0JGO0dBUEYsQ0FBQTtBQUFBIgp9

//# sourceURL=/Users/dawsonbotsford/.atom/packages/git-plus/spec/fixtures.coffee
