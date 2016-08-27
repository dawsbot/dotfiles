(function() {
  var $, CompositeDisposable, GitAdd, GitBranch, GitCheckoutAllFiles, GitCheckoutCurrentFile, GitCherryPick, GitCommit, GitCommitAmend, GitDeleteLocalBranch, GitDeleteRemoteBranch, GitDiff, GitDiffAll, GitDifftool, GitFetch, GitFetchPrune, GitInit, GitLog, GitMerge, GitPaletteView, GitPull, GitPush, GitRebase, GitRemove, GitRun, GitShow, GitStageFiles, GitStageHunk, GitStashApply, GitStashDrop, GitStashPop, GitStashSave, GitStatus, GitTags, GitUnstageFiles, OutputViewManager, currentFile, git;

  CompositeDisposable = require('atom').CompositeDisposable;

  $ = require('atom-space-pen-views').$;

  git = require('./git');

  OutputViewManager = require('./output-view-manager');

  GitPaletteView = require('./views/git-palette-view');

  GitAdd = require('./models/git-add');

  GitBranch = require('./models/git-branch');

  GitDeleteLocalBranch = require('./models/git-delete-local-branch.coffee');

  GitDeleteRemoteBranch = require('./models/git-delete-remote-branch.coffee');

  GitCheckoutAllFiles = require('./models/git-checkout-all-files');

  GitCheckoutCurrentFile = require('./models/git-checkout-current-file');

  GitCherryPick = require('./models/git-cherry-pick');

  GitCommit = require('./models/git-commit');

  GitCommitAmend = require('./models/git-commit-amend');

  GitDiff = require('./models/git-diff');

  GitDifftool = require('./models/git-difftool');

  GitDiffAll = require('./models/git-diff-all');

  GitFetch = require('./models/git-fetch');

  GitFetchPrune = require('./models/git-fetch-prune.coffee');

  GitInit = require('./models/git-init');

  GitLog = require('./models/git-log');

  GitPull = require('./models/git-pull');

  GitPush = require('./models/git-push');

  GitRemove = require('./models/git-remove');

  GitShow = require('./models/git-show');

  GitStageFiles = require('./models/git-stage-files');

  GitStageHunk = require('./models/git-stage-hunk');

  GitStashApply = require('./models/git-stash-apply');

  GitStashDrop = require('./models/git-stash-drop');

  GitStashPop = require('./models/git-stash-pop');

  GitStashSave = require('./models/git-stash-save');

  GitStatus = require('./models/git-status');

  GitTags = require('./models/git-tags');

  GitUnstageFiles = require('./models/git-unstage-files');

  GitRun = require('./models/git-run');

  GitMerge = require('./models/git-merge');

  GitRebase = require('./models/git-rebase');

  currentFile = function(repo) {
    var _ref;
    return repo.relativize((_ref = atom.workspace.getActiveTextEditor()) != null ? _ref.getPath() : void 0);
  };

  module.exports = {
    config: {
      includeStagedDiff: {
        title: 'Include staged diffs?',
        type: 'boolean',
        "default": true
      },
      openInPane: {
        type: 'boolean',
        "default": true,
        description: 'Allow commands to open new panes'
      },
      splitPane: {
        title: 'Split pane direction',
        type: 'string',
        "default": 'Right',
        description: 'Where should new panes go? (Defaults to Right)',
        "enum": ['Up', 'Right', 'Down', 'Left']
      },
      wordDiff: {
        type: 'boolean',
        "default": true,
        description: 'Should word diffs be highlighted in diffs?'
      },
      amountOfCommitsToShow: {
        type: 'integer',
        "default": 25,
        minimum: 1
      },
      gitPath: {
        type: 'string',
        "default": 'git',
        description: 'Where is your git?'
      },
      messageTimeout: {
        type: 'integer',
        "default": 5,
        description: 'How long should success/error messages be shown?'
      },
      pullBeforePush: {
        description: 'Pull from remote before pushing',
        type: 'string',
        "default": 'no',
        "enum": ['no', 'pull', 'pull --rebase']
      }
    },
    subscriptions: null,
    activate: function(state) {
      var repos;
      this.subscriptions = new CompositeDisposable;
      repos = atom.project.getRepositories().filter(function(r) {
        return r != null;
      });
      if (repos.length === 0) {
        this.subscriptions.add(atom.commands.add('atom-workspace', 'git-plus:init', function() {
          return GitInit();
        }));
      }
      this.subscriptions.add(atom.commands.add('atom-workspace', 'git-plus:menu', function() {
        return new GitPaletteView();
      }));
      this.subscriptions.add(atom.commands.add('atom-workspace', 'git-plus:add', function() {
        return git.getRepo().then(function(repo) {
          return GitAdd(repo);
        });
      }));
      this.subscriptions.add(atom.commands.add('atom-workspace', 'git-plus:add-all', function() {
        return git.getRepo().then(function(repo) {
          return GitAdd(repo, {
            addAll: true
          });
        });
      }));
      this.subscriptions.add(atom.commands.add('atom-workspace', 'git-plus:commit', function() {
        return git.getRepo().then(function(repo) {
          return GitCommit(repo);
        });
      }));
      this.subscriptions.add(atom.commands.add('atom-workspace', 'git-plus:commit-all', function() {
        return git.getRepo().then(function(repo) {
          return GitCommit(repo, {
            stageChanges: true
          });
        });
      }));
      this.subscriptions.add(atom.commands.add('atom-workspace', 'git-plus:commit-amend', function() {
        return git.getRepo().then(function(repo) {
          return new GitCommitAmend(repo);
        });
      }));
      this.subscriptions.add(atom.commands.add('atom-workspace', 'git-plus:add-and-commit', function() {
        return git.getRepo().then(function(repo) {
          return git.add(repo, {
            file: currentFile(repo)
          }).then(function() {
            return GitCommit(repo);
          });
        });
      }));
      this.subscriptions.add(atom.commands.add('atom-workspace', 'git-plus:add-all-and-commit', function() {
        return git.getRepo().then(function(repo) {
          return git.add(repo).then(function() {
            return GitCommit(repo);
          });
        });
      }));
      this.subscriptions.add(atom.commands.add('atom-workspace', 'git-plus:add-all-commit-and-push', function() {
        return git.getRepo().then(function(repo) {
          return git.add(repo).then(function() {
            return GitCommit(repo, {
              andPush: true
            });
          });
        });
      }));
      this.subscriptions.add(atom.commands.add('atom-workspace', 'git-plus:checkout', function() {
        return git.getRepo().then(function(repo) {
          return GitBranch.gitBranches(repo);
        });
      }));
      this.subscriptions.add(atom.commands.add('atom-workspace', 'git-plus:checkout-remote', function() {
        return git.getRepo().then(function(repo) {
          return GitBranch.gitRemoteBranches(repo);
        });
      }));
      this.subscriptions.add(atom.commands.add('atom-workspace', 'git-plus:checkout-current-file', function() {
        return git.getRepo().then(function(repo) {
          return GitCheckoutCurrentFile(repo);
        });
      }));
      this.subscriptions.add(atom.commands.add('atom-workspace', 'git-plus:checkout-all-files', function() {
        return git.getRepo().then(function(repo) {
          return GitCheckoutAllFiles(repo);
        });
      }));
      this.subscriptions.add(atom.commands.add('atom-workspace', 'git-plus:new-branch', function() {
        return git.getRepo().then(function(repo) {
          return GitBranch.newBranch(repo);
        });
      }));
      this.subscriptions.add(atom.commands.add('atom-workspace', 'git-plus:delete-local-branch', function() {
        return git.getRepo().then(function(repo) {
          return GitDeleteLocalBranch(repo);
        });
      }));
      this.subscriptions.add(atom.commands.add('atom-workspace', 'git-plus:delete-remote-branch', function() {
        return git.getRepo().then(function(repo) {
          return GitDeleteRemoteBranch(repo);
        });
      }));
      this.subscriptions.add(atom.commands.add('atom-workspace', 'git-plus:cherry-pick', function() {
        return git.getRepo().then(function(repo) {
          return GitCherryPick(repo);
        });
      }));
      this.subscriptions.add(atom.commands.add('atom-workspace', 'git-plus:diff', function() {
        return git.getRepo().then(function(repo) {
          return GitDiff(repo, {
            file: currentFile(repo)
          });
        });
      }));
      this.subscriptions.add(atom.commands.add('atom-workspace', 'git-plus:difftool', function() {
        return git.getRepo().then(function(repo) {
          return GitDifftool(repo);
        });
      }));
      this.subscriptions.add(atom.commands.add('atom-workspace', 'git-plus:diff-all', function() {
        return git.getRepo().then(function(repo) {
          return GitDiffAll(repo);
        });
      }));
      this.subscriptions.add(atom.commands.add('atom-workspace', 'git-plus:fetch', function() {
        return git.getRepo().then(function(repo) {
          return GitFetch(repo);
        });
      }));
      this.subscriptions.add(atom.commands.add('atom-workspace', 'git-plus:fetch-prune', function() {
        return git.getRepo().then(function(repo) {
          return GitFetchPrune(repo);
        });
      }));
      this.subscriptions.add(atom.commands.add('atom-workspace', 'git-plus:pull', function() {
        return git.getRepo().then(function(repo) {
          return GitPull(repo);
        });
      }));
      this.subscriptions.add(atom.commands.add('atom-workspace', 'git-plus:pull-using-rebase', function() {
        return git.getRepo().then(function(repo) {
          return GitPull(repo, {
            rebase: true
          });
        });
      }));
      this.subscriptions.add(atom.commands.add('atom-workspace', 'git-plus:push', function() {
        return git.getRepo().then(function(repo) {
          return GitPush(repo);
        });
      }));
      this.subscriptions.add(atom.commands.add('atom-workspace', 'git-plus:remove', function() {
        return git.getRepo().then(function(repo) {
          return GitRemove(repo, {
            showSelector: true
          });
        });
      }));
      this.subscriptions.add(atom.commands.add('atom-workspace', 'git-plus:remove-current-file', function() {
        return git.getRepo().then(function(repo) {
          return GitRemove(repo);
        });
      }));
      this.subscriptions.add(atom.commands.add('atom-workspace', 'git-plus:reset', function() {
        return git.getRepo().then(function(repo) {
          return git.reset(repo);
        });
      }));
      this.subscriptions.add(atom.commands.add('atom-workspace', 'git-plus:show', function() {
        return git.getRepo().then(function(repo) {
          return GitShow(repo);
        });
      }));
      this.subscriptions.add(atom.commands.add('atom-workspace', 'git-plus:log', function() {
        return git.getRepo().then(function(repo) {
          return GitLog(repo);
        });
      }));
      this.subscriptions.add(atom.commands.add('atom-workspace', 'git-plus:log-current-file', function() {
        return git.getRepo().then(function(repo) {
          return GitLog(repo, {
            onlyCurrentFile: true
          });
        });
      }));
      this.subscriptions.add(atom.commands.add('atom-workspace', 'git-plus:stage-files', function() {
        return git.getRepo().then(function(repo) {
          return GitStageFiles(repo);
        });
      }));
      this.subscriptions.add(atom.commands.add('atom-workspace', 'git-plus:unstage-files', function() {
        return git.getRepo().then(function(repo) {
          return GitUnstageFiles(repo);
        });
      }));
      this.subscriptions.add(atom.commands.add('atom-workspace', 'git-plus:stage-hunk', function() {
        return git.getRepo().then(function(repo) {
          return GitStageHunk(repo);
        });
      }));
      this.subscriptions.add(atom.commands.add('atom-workspace', 'git-plus:stash-save-changes', function() {
        return git.getRepo().then(function(repo) {
          return GitStashSave(repo);
        });
      }));
      this.subscriptions.add(atom.commands.add('atom-workspace', 'git-plus:stash-pop', function() {
        return git.getRepo().then(function(repo) {
          return GitStashPop(repo);
        });
      }));
      this.subscriptions.add(atom.commands.add('atom-workspace', 'git-plus:stash-apply', function() {
        return git.getRepo().then(function(repo) {
          return GitStashApply(repo);
        });
      }));
      this.subscriptions.add(atom.commands.add('atom-workspace', 'git-plus:stash-delete', function() {
        return git.getRepo().then(function(repo) {
          return GitStashDrop(repo);
        });
      }));
      this.subscriptions.add(atom.commands.add('atom-workspace', 'git-plus:status', function() {
        return git.getRepo().then(function(repo) {
          return GitStatus(repo);
        });
      }));
      this.subscriptions.add(atom.commands.add('atom-workspace', 'git-plus:tags', function() {
        return git.getRepo().then(function(repo) {
          return GitTags(repo);
        });
      }));
      this.subscriptions.add(atom.commands.add('atom-workspace', 'git-plus:run', function() {
        return git.getRepo().then(function(repo) {
          return new GitRun(repo);
        });
      }));
      this.subscriptions.add(atom.commands.add('atom-workspace', 'git-plus:merge', function() {
        return git.getRepo().then(function(repo) {
          return GitMerge(repo);
        });
      }));
      this.subscriptions.add(atom.commands.add('atom-workspace', 'git-plus:merge-remote', function() {
        return git.getRepo().then(function(repo) {
          return GitMerge(repo, {
            remote: true
          });
        });
      }));
      return this.subscriptions.add(atom.commands.add('atom-workspace', 'git-plus:rebase', function() {
        return git.getRepo().then(function(repo) {
          return GitRebase(repo);
        });
      }));
    },
    deactivate: function() {
      var _ref;
      this.subscriptions.dispose();
      if ((_ref = this.statusBarTile) != null) {
        _ref.destroy();
      }
      return delete this.statusBarTile;
    },
    consumeStatusBar: function(statusBar) {
      this.setupBranchesMenuToggle(statusBar);
      return this.setupOutputViewToggle(statusBar);
    },
    setupOutputViewToggle: function(statusBar) {
      var div, icon, link;
      div = document.createElement('div');
      div.classList.add('inline-block');
      icon = document.createElement('span');
      icon.classList.add('icon', 'icon-pin');
      link = document.createElement('a');
      link.appendChild(icon);
      link.onclick = function(e) {
        return OutputViewManager.getView().toggle();
      };
      link.title = "Toggle Output Console";
      div.appendChild(link);
      return this.statusBarTile = statusBar.addRightTile({
        item: div,
        priority: 0
      });
    },
    setupBranchesMenuToggle: function(statusBar) {
      return statusBar.getRightTiles().some((function(_this) {
        return function(_arg) {
          var item, _ref;
          item = _arg.item;
          if (item != null ? (_ref = item.classList) != null ? typeof _ref.contains === "function" ? _ref.contains('git-view') : void 0 : void 0 : void 0) {
            $(item).find('.git-branch').on('click', function(e) {
              return atom.commands.dispatch(document.querySelector('atom-workspace'), 'git-plus:checkout');
            });
            return true;
          }
        };
      })(this));
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rhd3NvbmJvdHNmb3JkLy5hdG9tL3BhY2thZ2VzL2dpdC1wbHVzL2xpYi9naXQtcGx1cy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsMmVBQUE7O0FBQUEsRUFBQyxzQkFBdUIsT0FBQSxDQUFRLE1BQVIsRUFBdkIsbUJBQUQsQ0FBQTs7QUFBQSxFQUNDLElBQUssT0FBQSxDQUFRLHNCQUFSLEVBQUwsQ0FERCxDQUFBOztBQUFBLEVBRUEsR0FBQSxHQUFNLE9BQUEsQ0FBUSxPQUFSLENBRk4sQ0FBQTs7QUFBQSxFQUdBLGlCQUFBLEdBQXlCLE9BQUEsQ0FBUSx1QkFBUixDQUh6QixDQUFBOztBQUFBLEVBSUEsY0FBQSxHQUF5QixPQUFBLENBQVEsMEJBQVIsQ0FKekIsQ0FBQTs7QUFBQSxFQUtBLE1BQUEsR0FBeUIsT0FBQSxDQUFRLGtCQUFSLENBTHpCLENBQUE7O0FBQUEsRUFNQSxTQUFBLEdBQXlCLE9BQUEsQ0FBUSxxQkFBUixDQU56QixDQUFBOztBQUFBLEVBT0Esb0JBQUEsR0FBeUIsT0FBQSxDQUFRLHlDQUFSLENBUHpCLENBQUE7O0FBQUEsRUFRQSxxQkFBQSxHQUF5QixPQUFBLENBQVEsMENBQVIsQ0FSekIsQ0FBQTs7QUFBQSxFQVNBLG1CQUFBLEdBQXlCLE9BQUEsQ0FBUSxpQ0FBUixDQVR6QixDQUFBOztBQUFBLEVBVUEsc0JBQUEsR0FBeUIsT0FBQSxDQUFRLG9DQUFSLENBVnpCLENBQUE7O0FBQUEsRUFXQSxhQUFBLEdBQXlCLE9BQUEsQ0FBUSwwQkFBUixDQVh6QixDQUFBOztBQUFBLEVBWUEsU0FBQSxHQUF5QixPQUFBLENBQVEscUJBQVIsQ0FaekIsQ0FBQTs7QUFBQSxFQWFBLGNBQUEsR0FBeUIsT0FBQSxDQUFRLDJCQUFSLENBYnpCLENBQUE7O0FBQUEsRUFjQSxPQUFBLEdB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

//# sourceURL=/Users/dawsonbotsford/.atom/packages/git-plus/lib/git-plus.coffee
