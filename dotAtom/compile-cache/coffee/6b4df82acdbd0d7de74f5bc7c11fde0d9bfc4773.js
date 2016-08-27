(function() {
  var RemoteListView, git, options, pullBeforePush, remotes, repo;

  git = require('../../lib/git');

  RemoteListView = require('../../lib/views/remote-list-view');

  repo = require('../fixtures').repo;

  options = {
    cwd: repo.getWorkingDirectory()
  };

  remotes = "remote1\nremote2";

  pullBeforePush = 'git-plus.pullBeforePush';

  describe("RemoteListView", function() {
    it("displays a list of remotes", function() {
      var view;
      view = new RemoteListView(repo, remotes, {
        mode: 'pull'
      });
      return expect(view.items.length).toBe(2);
    });
    describe("when mode is pull", function() {
      return it("it calls git.cmd to get the remote branches", function() {
        var view;
        view = new RemoteListView(repo, remotes, {
          mode: 'pull'
        });
        spyOn(git, 'cmd').andCallFake(function() {
          return Promise.resolve('branch1\nbranch2');
        });
        view.confirmSelection();
        waitsFor(function() {
          return git.cmd.callCount > 0;
        });
        return runs(function() {
          return expect(git.cmd).toHaveBeenCalledWith(['branch', '-r'], options);
        });
      });
    });
    describe("when mode is fetch", function() {
      return it("it calls git.cmd to with ['fetch'] and the remote name", function() {
        var view;
        spyOn(git, 'cmd').andCallFake(function() {
          return Promise.resolve('fetched stuff');
        });
        view = new RemoteListView(repo, remotes, {
          mode: 'fetch'
        });
        view.confirmSelection();
        waitsFor(function() {
          return git.cmd.callCount > 0;
        });
        return runs(function() {
          return expect(git.cmd).toHaveBeenCalledWith(['fetch', 'remote1'], options);
        });
      });
    });
    describe("when mode is fetch-prune", function() {
      return it("it calls git.cmd to with ['fetch', '--prune'] and the remote name", function() {
        var view;
        spyOn(git, 'cmd').andCallFake(function() {
          return Promise.resolve('fetched stuff');
        });
        view = new RemoteListView(repo, remotes, {
          mode: 'fetch-prune'
        });
        view.confirmSelection();
        waitsFor(function() {
          return git.cmd.callCount > 0;
        });
        return runs(function() {
          return expect(git.cmd).toHaveBeenCalledWith(['fetch', '--prune', 'remote1'], options);
        });
      });
    });
    describe("when mode is push", function() {
      return it("calls git.cmd with ['push']", function() {
        var view;
        spyOn(git, 'cmd').andReturn(Promise.resolve('pushing text'));
        view = new RemoteListView(repo, remotes, {
          mode: 'push'
        });
        view.confirmSelection();
        waitsFor(function() {
          return git.cmd.callCount > 1;
        });
        return runs(function() {
          return expect(git.cmd).toHaveBeenCalledWith(['push', 'remote1'], options);
        });
      });
    });
    return describe("when mode is push and there is no upstream set", function() {
      it("calls git.cmd with ['push', '-u'] and remote name", function() {
        var view;
        atom.config.set(pullBeforePush, 'no');
        spyOn(git, 'cmd').andCallFake(function() {
          if (git.cmd.callCount === 1) {
            return Promise.reject('no upstream');
          } else {
            return Promise.resolve('pushing text');
          }
        });
        view = new RemoteListView(repo, remotes, {
          mode: 'push'
        });
        view.confirmSelection();
        waitsFor(function() {
          return git.cmd.callCount > 1;
        });
        return runs(function() {
          return expect(git.cmd).toHaveBeenCalledWith(['push', '-u', 'remote1', 'HEAD'], options);
        });
      });
      describe("when the the config for pull before push is set to true", function() {
        return it("calls git.cmd with ['pull'], remote name, and branch name and then with ['push']", function() {
          var view;
          spyOn(git, 'cmd').andReturn(Promise.resolve('branch1'));
          atom.config.set(pullBeforePush, 'pull');
          view = new RemoteListView(repo, remotes, {
            mode: 'push'
          });
          view.confirmSelection();
          waitsFor(function() {
            return git.cmd.callCount > 2;
          });
          return runs(function() {
            expect(git.cmd).toHaveBeenCalledWith(['pull', 'remote1', 'branch1'], options);
            return expect(git.cmd).toHaveBeenCalledWith(['push', 'remote1'], options);
          });
        });
      });
      return describe("when the the config for pull before push is set to 'Pull --rebase'", function() {
        return it("calls git.cmd with ['pull', '--rebase'], remote name, and branch name and then with ['push']", function() {
          var view;
          spyOn(git, 'cmd').andReturn(Promise.resolve('branch1'));
          atom.config.set(pullBeforePush, 'pull --rebase');
          view = new RemoteListView(repo, remotes, {
            mode: 'push'
          });
          view.confirmSelection();
          waitsFor(function() {
            return git.cmd.callCount > 2;
          });
          return runs(function() {
            expect(git.cmd).toHaveBeenCalledWith(['pull', '--rebase', 'remote1', 'branch1'], options);
            return expect(git.cmd).toHaveBeenCalledWith(['push', 'remote1'], options);
          });
        });
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rhd3NvbmJvdHNmb3JkLy5hdG9tL3BhY2thZ2VzL2dpdC1wbHVzL3NwZWMvdmlld3MvcmVtb3RlLWxpc3Qtdmlldy1zcGVjLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSwyREFBQTs7QUFBQSxFQUFBLEdBQUEsR0FBTSxPQUFBLENBQVEsZUFBUixDQUFOLENBQUE7O0FBQUEsRUFDQSxjQUFBLEdBQWlCLE9BQUEsQ0FBUSxrQ0FBUixDQURqQixDQUFBOztBQUFBLEVBRUMsT0FBUSxPQUFBLENBQVEsYUFBUixFQUFSLElBRkQsQ0FBQTs7QUFBQSxFQUdBLE9BQUEsR0FBVTtBQUFBLElBQUMsR0FBQSxFQUFLLElBQUksQ0FBQyxtQkFBTCxDQUFBLENBQU47R0FIVixDQUFBOztBQUFBLEVBSUEsT0FBQSxHQUFVLGtCQUpWLENBQUE7O0FBQUEsRUFLQSxjQUFBLEdBQWlCLHlCQUxqQixDQUFBOztBQUFBLEVBT0EsUUFBQSxDQUFTLGdCQUFULEVBQTJCLFNBQUEsR0FBQTtBQUN6QixJQUFBLEVBQUEsQ0FBRyw0QkFBSCxFQUFpQyxTQUFBLEdBQUE7QUFDL0IsVUFBQSxJQUFBO0FBQUEsTUFBQSxJQUFBLEdBQVcsSUFBQSxjQUFBLENBQWUsSUFBZixFQUFxQixPQUFyQixFQUE4QjtBQUFBLFFBQUEsSUFBQSxFQUFNLE1BQU47T0FBOUIsQ0FBWCxDQUFBO2FBQ0EsTUFBQSxDQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBbEIsQ0FBeUIsQ0FBQyxJQUExQixDQUErQixDQUEvQixFQUYrQjtJQUFBLENBQWpDLENBQUEsQ0FBQTtBQUFBLElBSUEsUUFBQSxDQUFTLG1CQUFULEVBQThCLFNBQUEsR0FBQTthQUM1QixFQUFBLENBQUcsNkNBQUgsRUFBa0QsU0FBQSxHQUFBO0FBQ2hELFlBQUEsSUFBQTtBQUFBLFFB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

//# sourceURL=/Users/dawsonbotsford/.atom/packages/git-plus/spec/views/remote-list-view-spec.coffee
