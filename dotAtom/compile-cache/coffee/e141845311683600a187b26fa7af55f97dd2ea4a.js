(function() {
  var StatusListView, fs, git, repo,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  fs = require('fs-plus');

  git = require('../../lib/git');

  repo = require('../fixtures').repo;

  StatusListView = require('../../lib/views/status-list-view');

  describe("StatusListView", function() {
    describe("when there are modified files", function() {
      it("displays a list of modified files", function() {
        var view;
        view = new StatusListView(repo, [" M\tfile.txt", " D\tanother.txt", '']);
        return expect(view.items.length).toBe(2);
      });
      return it("calls git.cmd with 'diff' when user doesn't want to open the file", function() {
        var view;
        spyOn(window, 'confirm').andReturn(false);
        spyOn(git, 'cmd').andReturn(Promise.resolve('foobar'));
        spyOn(fs, 'stat').andCallFake(function() {
          var stat;
          stat = {
            isDirectory: function() {
              return false;
            }
          };
          return fs.stat.mostRecentCall.args[1](null, stat);
        });
        view = new StatusListView(repo, [" M\tfile.txt", " D\tanother.txt", '']);
        view.confirmSelection();
        return expect(__indexOf.call(git.cmd.mostRecentCall.args[0], 'diff') >= 0).toBe(true);
      });
    });
    return describe("when there are unstaged files", function() {
      beforeEach(function() {
        return spyOn(window, 'confirm').andReturn(true);
      });
      it("opens the file when it is a file", function() {
        var view;
        spyOn(atom.workspace, 'open');
        spyOn(fs, 'stat').andCallFake(function() {
          var stat;
          stat = {
            isDirectory: function() {
              return false;
            }
          };
          return fs.stat.mostRecentCall.args[1](null, stat);
        });
        view = new StatusListView(repo, [" M\tfile.txt", " D\tanother.txt", '']);
        view.confirmSelection();
        return expect(atom.workspace.open).toHaveBeenCalled();
      });
      return it("opens the directory in a project when it is a directory", function() {
        var view;
        spyOn(atom, 'open');
        spyOn(fs, 'stat').andCallFake(function() {
          var stat;
          stat = {
            isDirectory: function() {
              return true;
            }
          };
          return fs.stat.mostRecentCall.args[1](null, stat);
        });
        view = new StatusListView(repo, [" M\tfile.txt", " D\tanother.txt", '']);
        view.confirmSelection();
        return expect(atom.open).toHaveBeenCalled();
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rhd3NvbmJvdHNmb3JkLy5hdG9tL3BhY2thZ2VzL2dpdC1wbHVzL3NwZWMvdmlld3Mvc3RhdHVzLWxpc3Qtdmlldy1zcGVjLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSw2QkFBQTtJQUFBLHFKQUFBOztBQUFBLEVBQUEsRUFBQSxHQUFLLE9BQUEsQ0FBUSxTQUFSLENBQUwsQ0FBQTs7QUFBQSxFQUNBLEdBQUEsR0FBTSxPQUFBLENBQVEsZUFBUixDQUROLENBQUE7O0FBQUEsRUFFQyxPQUFRLE9BQUEsQ0FBUSxhQUFSLEVBQVIsSUFGRCxDQUFBOztBQUFBLEVBR0EsY0FBQSxHQUFpQixPQUFBLENBQVEsa0NBQVIsQ0FIakIsQ0FBQTs7QUFBQSxFQUtBLFFBQUEsQ0FBUyxnQkFBVCxFQUEyQixTQUFBLEdBQUE7QUFDekIsSUFBQSxRQUFBLENBQVMsK0JBQVQsRUFBMEMsU0FBQSxHQUFBO0FBQ3hDLE1BQUEsRUFBQSxDQUFHLG1DQUFILEVBQXdDLFNBQUEsR0FBQTtBQUN0QyxZQUFBLElBQUE7QUFBQSxRQUFBLElBQUEsR0FBVyxJQUFBLGNBQUEsQ0FBZSxJQUFmLEVBQXFCLENBQUMsY0FBRCxFQUFpQixpQkFBakIsRUFBb0MsRUFBcEMsQ0FBckIsQ0FBWCxDQUFBO2VBQ0EsTUFBQSxDQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBbEIsQ0FBeUIsQ0FBQyxJQUExQixDQUErQixDQUEvQixFQUZzQztNQUFBLENBQXhDLENBQUEsQ0FBQTthQUlBLEVBQUEsQ0FBRyxtRUFBSCxFQUF3RSxTQUFBLEdBQUE7QUFDdEUsWUFBQSxJQUFBO0FBQUEsUUFBQSxLQUFBLENBQU0sTUFBTixFQUFjLFNBQWQsQ0FBd0IsQ0FBQyxTQUF6QixDQUFtQyxLQUFuQyxDQUFBLENBQUE7QUFBQSxRQUNBLEtBQUEsQ0FBTSxHQUFOLEVBQVcsS0FBWCxDQUFpQixDQUFDLFNBQWxCLENBQTRCLE9BQU8sQ0FBQyxPQUFSLENBQWdCLFFBQWhCLENBQTVCLENBREEsQ0FBQTtBQUFBLFFBRUEsS0FBQSxDQUFNLEVBQU4sRUFBVSxNQUFWLENBQWlCLENBQUMsV0FBbEIsQ0FBOEIsU0FBQSxHQUFBO0FBQzVCLGNBQUEsSUFBQTtBQUFBLFVBQUEsSUFBQSxHQUFPO0FBQUEsWUFBQSxXQUFBLEVBQWEsU0FBQSxHQUFBO3FCQUFHLE1BQUg7WUFBQSxDQUFiO1dBQVAsQ0FBQTtpQkFDQSxFQUFFLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxJQUFLLENBQUEsQ0FBQSxDQUE1QixDQUErQixJQUEvQixFQUFxQyxJQUFyQyxFQUY0QjtRQUFBLENBQTlCLENBRkEsQ0FBQTtBQUFBLFFBS0EsSUFBQSxHQUFXLElBQUEsY0FBQSxDQUFlLElBQWYsRUFBcUIsQ0FBQyxjQUFELEVBQWlCLGlCQUFqQixFQUFvQyxFQUFwQyxDQUFyQixDQUxYLENBQUE7QUFBQSxRQU1BLElBQUksQ0FBQyxnQkFBTCxDQUFBLENBTkEsQ0FBQTtlQU9BLE1BQUEsQ0FBTyxlQUFVLEdBQUcsQ0FBQyxHQUFHLENBQUMsY0FBYyxDQUFDLElBQUssQ0FBQSxDQUFBLENBQXRDLEVBQUEsTUFBQSxNQUFQLENBQWdELENBQUMsSUFBakQsQ0FBc0QsSUFBdEQsRUFSc0U7TUFBQSxDQUF4RSxFQUx3QztJQUFBLENBQTFDLENBQUEsQ0FBQTtXQWdCQSxRQUFBLENBQVMsK0JBQVQsRUFBMEMsU0FBQSxHQUFBO0FBQ3hDLE1BQUEsVUFBQSxDQUFXLFNBQUEsR0FBQTtlQUNULEtBQUEsQ0FBTSxNQUFOLEVBQWMsU0FBZCxDQUF3QixDQUFDLFNBQXpCLENBQW1DLElBQW5DLEVBRFM7TUFBQSxDQUFYLENBQUEsQ0FBQTtBQUFBLE1BR0EsRUFBQSxDQUFHLGtDQUFILEVBQXVDLFNBQUEsR0FBQTtBQUNyQyxZQUFBLElBQUE7QUFBQSxRQUFBLEtBQUEsQ0FBTSxJQUFJLENBQUMsU0FBWCxFQUFzQixNQUF0QixDQUFBLENBQUE7QUFBQSxRQUNBLEtBQUEsQ0FBTSxFQUFOLEVBQVUsTUFBVixDQUFpQixDQUFDLFdBQWxCLENBQThCLFNBQUEsR0FBQTtBQUM1QixjQUFBLElBQUE7QUFBQSxVQUFBLElBQUEsR0FBTztBQUFBLFlBQUEsV0FBQSxFQUFhLFNBQUEsR0FBQTtxQkFBRyxNQUFIO1lBQUEsQ0FBYjtXQUFQLENBQUE7aUJBQ0EsRUFBRSxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsSUFBSyxDQUFBLENBQUEsQ0FBNUIsQ0FBK0IsSUFBL0IsRUFBcUMsSUFBckMsRUFGNEI7UUFBQSxDQUE5QixDQURBLENBQUE7QUFBQSxRQUlBLElBQUEsR0FBVyxJQUFBLGNBQUEsQ0FBZSxJQUFmLEVBQXFCLENBQUMsY0FBRCxFQUFpQixpQkFBakIsRUFBb0MsRUFBcEMsQ0FBckIsQ0FKWCxDQUFBO0FBQUEsUUFLQSxJQUFJLENBQUMsZ0JBQUwsQ0FBQSxDQUxBLENBQUE7ZUFNQSxNQUFBLENBQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUF0QixDQUEyQixDQUFDLGdCQUE1QixDQUFBLEVBUHFDO01BQUEsQ0FBdkMsQ0FIQSxDQUFBO2FBWUEsRUFBQSxDQUFHLHlEQUFILEVBQThELFNBQUEsR0FBQTtBQUM1RCxZQUFBLElBQUE7QUFBQSxRQUFBLEtBQUEsQ0FBTSxJQUFOLEVBQVksTUFBWixDQUFBLENBQUE7QUFBQSxRQUNBLEtBQUEsQ0FBTSxFQUFOLEVBQVUsTUFBVixDQUFpQixDQUFDLFdBQWxCLENBQThCLFNBQUEsR0FBQTtBQUM1QixjQUFBLElBQUE7QUFBQSxVQUFBLElBQUEsR0FBTztBQUFBLFlBQUEsV0FBQSxFQUFhLFNBQUEsR0FBQTtxQkFBRyxLQUFIO1lBQUEsQ0FBYjtXQUFQLENBQUE7aUJBQ0EsRUFBRSxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsSUFBSyxDQUFBLENBQUEsQ0FBNUIsQ0FBK0IsSUFBL0IsRUFBcUMsSUFBckMsRUFGNEI7UUFBQSxDQUE5QixDQURBLENBQUE7QUFBQSxRQUlBLElBQUEsR0FBVyxJQUFBLGNBQUEsQ0FBZSxJQUFmLEVBQXFCLENBQUMsY0FBRCxFQUFpQixpQkFBakIsRUFBb0MsRUFBcEMsQ0FBckIsQ0FKWCxDQUFBO0FBQUEsUUFLQSxJQUFJLENBQUMsZ0JBQUwsQ0FBQSxDQUxBLENBQUE7ZUFNQSxNQUFBLENBQU8sSUFBSSxDQUFDLElBQVosQ0FBaUIsQ0FBQyxnQkFBbEIsQ0FBQSxFQVA0RDtNQUFBLENBQTlELEVBYndDO0lBQUEsQ0FBMUMsRUFqQnlCO0VBQUEsQ0FBM0IsQ0FMQSxDQUFBO0FBQUEiCn0=

//# sourceURL=/Users/dawsonbotsford/.atom/packages/git-plus/spec/views/status-list-view-spec.coffee
