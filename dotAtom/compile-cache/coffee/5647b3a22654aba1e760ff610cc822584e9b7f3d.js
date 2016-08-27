(function() {
  var getCommands, git;

  git = require('./git');

  getCommands = function() {
    var GitAdd, GitBranch, GitCheckoutAllFiles, GitCheckoutCurrentFile, GitCherryPick, GitCommit, GitCommitAmend, GitDeleteLocalBranch, GitDeleteRemoteBranch, GitDiff, GitDiffAll, GitDifftool, GitFetch, GitFetchPrune, GitInit, GitLog, GitMerge, GitOpenChangedFiles, GitPull, GitPush, GitRebase, GitRemove, GitRun, GitShow, GitStageFiles, GitStageHunk, GitStashApply, GitStashDrop, GitStashPop, GitStashSave, GitStashSaveMessage, GitStatus, GitTags, GitUnstageFiles;
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
    GitStashSaveMessage = require('./models/git-stash-save-message');
    GitStatus = require('./models/git-status');
    GitTags = require('./models/git-tags');
    GitUnstageFiles = require('./models/git-unstage-files');
    GitRun = require('./models/git-run');
    GitMerge = require('./models/git-merge');
    GitRebase = require('./models/git-rebase');
    GitOpenChangedFiles = require('./models/git-open-changed-files');
    return git.getRepo().then(function(repo) {
      var commands, currentFile, _ref;
      currentFile = repo.relativize((_ref = atom.workspace.getActiveTextEditor()) != null ? _ref.getPath() : void 0);
      git.refresh();
      commands = [];
      commands.push([
        'git-plus:add', 'Add', function() {
          return GitAdd(repo);
        }
      ]);
      commands.push([
        'git-plus:add-all', 'Add All', function() {
          return GitAdd(repo, {
            addAll: true
          });
        }
      ]);
      commands.push([
        'git-plus:log', 'Log', function() {
          return GitLog(repo);
        }
      ]);
      commands.push([
        'git-plus:log-current-file', 'Log Current File', function() {
          return GitLog(repo, {
            onlyCurrentFile: true
          });
        }
      ]);
      commands.push([
        'git-plus:remove-current-file', 'Remove Current File', function() {
          return GitRemove(repo);
        }
      ]);
      commands.push([
        'git-plus:checkout-all-files', 'Checkout All Files', function() {
          return GitCheckoutAllFiles(repo);
        }
      ]);
      commands.push([
        'git-plus:checkout-current-file', 'Checkout Current File', function() {
          return GitCheckoutCurrentFile(repo);
        }
      ]);
      commands.push([
        'git-plus:commit', 'Commit', function() {
          return GitCommit(repo);
        }
      ]);
      commands.push([
        'git-plus:commit-all', 'Commit All', function() {
          return GitCommit(repo, {
            stageChanges: true
          });
        }
      ]);
      commands.push([
        'git-plus:commit-amend', 'Commit Amend', function() {
          return GitCommitAmend(repo);
        }
      ]);
      commands.push([
        'git-plus:add-and-commit', 'Add And Commit', function() {
          return git.add(repo, {
            file: currentFile
          }).then(function() {
            return GitCommit(repo);
          });
        }
      ]);
      commands.push([
        'git-plus:add-and-commit-and-push', 'Add And Commit And Push', function() {
          return git.add(repo, {
            file: currentFile
          }).then(function() {
            return GitCommit(repo, {
              andPush: true
            });
          });
        }
      ]);
      commands.push([
        'git-plus:add-all-and-commit', 'Add All And Commit', function() {
          return git.add(repo).then(function() {
            return GitCommit(repo);
          });
        }
      ]);
      commands.push([
        'git-plus:add-all-commit-and-push', 'Add All, Commit And Push', function() {
          return git.add(repo).then(function() {
            return GitCommit(repo, {
              andPush: true
            });
          });
        }
      ]);
      commands.push([
        'git-plus:checkout', 'Checkout', function() {
          return GitBranch.gitBranches(repo);
        }
      ]);
      commands.push([
        'git-plus:checkout-remote', 'Checkout Remote', function() {
          return GitBranch.gitRemoteBranches(repo);
        }
      ]);
      commands.push([
        'git-plus:new-branch', 'Checkout New Branch', function() {
          return GitBranch.newBranch(repo);
        }
      ]);
      commands.push([
        'git-plus:delete-local-branch', 'Delete Local Branch', function() {
          return GitDeleteLocalBranch(repo);
        }
      ]);
      commands.push([
        'git-plus:delete-remote-branch', 'Delete Remote Branch', function() {
          return GitDeleteRemoteBranch(repo);
        }
      ]);
      commands.push([
        'git-plus:cherry-pick', 'Cherry-Pick', function() {
          return GitCherryPick(repo);
        }
      ]);
      commands.push([
        'git-plus:diff', 'Diff', function() {
          return GitDiff(repo, {
            file: currentFile
          });
        }
      ]);
      commands.push([
        'git-plus:difftool', 'Difftool', function() {
          return GitDifftool(repo);
        }
      ]);
      commands.push([
        'git-plus:diff-all', 'Diff All', function() {
          return GitDiffAll(repo);
        }
      ]);
      commands.push([
        'git-plus:fetch', 'Fetch', function() {
          return GitFetch(repo);
        }
      ]);
      commands.push([
        'git-plus:fetch-prune', 'Fetch Prune', function() {
          return GitFetchPrune(repo);
        }
      ]);
      commands.push([
        'git-plus:pull', 'Pull', function() {
          return GitPull(repo);
        }
      ]);
      commands.push([
        'git-plus:pull-using-rebase', 'Pull Using Rebase', function() {
          return GitPull(repo, {
            rebase: true
          });
        }
      ]);
      commands.push([
        'git-plus:push', 'Push', function() {
          return GitPush(repo);
        }
      ]);
      commands.push([
        'git-plus:remove', 'Remove', function() {
          return GitRemove(repo, {
            showSelector: true
          });
        }
      ]);
      commands.push([
        'git-plus:reset', 'Reset HEAD', function() {
          return git.reset(repo);
        }
      ]);
      commands.push([
        'git-plus:show', 'Show', function() {
          return GitShow(repo);
        }
      ]);
      commands.push([
        'git-plus:stage-files', 'Stage Files', function() {
          return GitStageFiles(repo);
        }
      ]);
      commands.push([
        'git-plus:unstage-files', 'Unstage Files', function() {
          return GitUnstageFiles(repo);
        }
      ]);
      commands.push([
        'git-plus:stage-hunk', 'Stage Hunk', function() {
          return GitStageHunk(repo);
        }
      ]);
      commands.push([
        'git-plus:stash-save', 'Stash: Save Changes', function() {
          return GitStashSave(repo);
        }
      ]);
      commands.push([
        'git-plus:stash-save-message', 'Stash: Save Changes With Message', function() {
          return GitStashSaveMessage(repo);
        }
      ]);
      commands.push([
        'git-plus:stash-pop', 'Stash: Apply (Pop)', function() {
          return GitStashPop(repo);
        }
      ]);
      commands.push([
        'git-plus:stash-apply', 'Stash: Apply (Keep)', function() {
          return GitStashApply(repo);
        }
      ]);
      commands.push([
        'git-plus:stash-delete', 'Stash: Delete (Drop)', function() {
          return GitStashDrop(repo);
        }
      ]);
      commands.push([
        'git-plus:status', 'Status', function() {
          return GitStatus(repo);
        }
      ]);
      commands.push([
        'git-plus:tags', 'Tags', function() {
          return GitTags(repo);
        }
      ]);
      commands.push([
        'git-plus:run', 'Run', function() {
          return new GitRun(repo);
        }
      ]);
      commands.push([
        'git-plus:merge', 'Merge', function() {
          return GitMerge(repo);
        }
      ]);
      commands.push([
        'git-plus:merge-remote', 'Merge Remote', function() {
          return GitMerge(repo, {
            remote: true
          });
        }
      ]);
      commands.push([
        'git-plus:rebase', 'Rebase', function() {
          return GitRebase(repo);
        }
      ]);
      commands.push([
        'git-plus:git-open-changed-files', 'Open Changed Files', function() {
          return GitOpenChangedFiles(repo);
        }
      ]);
      return commands;
    });
  };

  module.exports = getCommands;

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rhd3NvbmJvdHNmb3JkLy5hdG9tL3BhY2thZ2VzL2dpdC1wbHVzL2xpYi9naXQtcGx1cy1jb21tYW5kcy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsZ0JBQUE7O0FBQUEsRUFBQSxHQUFBLEdBQU0sT0FBQSxDQUFRLE9BQVIsQ0FBTixDQUFBOztBQUFBLEVBRUEsV0FBQSxHQUFjLFNBQUEsR0FBQTtBQUNaLFFBQUEsd2NBQUE7QUFBQSxJQUFBLE1BQUEsR0FBeUIsT0FBQSxDQUFRLGtCQUFSLENBQXpCLENBQUE7QUFBQSxJQUNBLFNBQUEsR0FBeUIsT0FBQSxDQUFRLHFCQUFSLENBRHpCLENBQUE7QUFBQSxJQUVBLG9CQUFBLEdBQXlCLE9BQUEsQ0FBUSx5Q0FBUixDQUZ6QixDQUFBO0FBQUEsSUFHQSxxQkFBQSxHQUF5QixPQUFBLENBQVEsMENBQVIsQ0FIekIsQ0FBQTtBQUFBLElBSUEsbUJBQUEsR0FBeUIsT0FBQSxDQUFRLGlDQUFSLENBSnpCLENBQUE7QUFBQSxJQUtBLHNCQUFBLEdBQXlCLE9BQUEsQ0FBUSxvQ0FBUixDQUx6QixDQUFBO0FBQUEsSUFNQSxhQUFBLEdBQXlCLE9BQUEsQ0FBUSwwQkFBUixDQU56QixDQUFBO0FBQUEsSUFPQSxTQUFBLEdBQXlCLE9BQUEsQ0FBUSxxQkFBUixDQVB6QixDQUFBO0FBQUEsSUFRQSxjQUFBLEdBQXlCLE9BQUEsQ0FBUSwyQkFBUixDQVJ6QixDQUFBO0FBQUEsSUFTQSxPQUFBLEdBQXlCLE9BQUEsQ0FBUSxtQkFBUixDQVR6QixDQUFBO0FBQUEsSUFVQSxXQUFBLEdBQXlCLE9BQUEsQ0FBUSx1QkFBUixDQVZ6QixDQUFBO0FBQUEsSUFXQSxVQUFBLEdBQXlCLE9BQUEsQ0FBUSx1QkFBUixDQVh6QixDQUFBO0FBQUEsSUFZQSxRQUFBLEdBQXlCLE9B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

//# sourceURL=/Users/dawsonbotsford/.atom/packages/git-plus/lib/git-plus-commands.coffee
