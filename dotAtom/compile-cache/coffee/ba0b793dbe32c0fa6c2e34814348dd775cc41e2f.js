(function() {
  var CompositeDisposable, Os, Path, disposables, fs, git, nothingToShow, notifier, prepFile, showFile;

  CompositeDisposable = require('atom').CompositeDisposable;

  Os = require('os');

  Path = require('path');

  fs = require('fs-plus');

  git = require('../git');

  notifier = require('../notifier');

  nothingToShow = 'Nothing to show.';

  disposables = new CompositeDisposable;

  showFile = function(filePath) {
    var splitDirection;
    if (atom.config.get('git-plus.openInPane')) {
      splitDirection = atom.config.get('git-plus.splitPane');
      atom.workspace.getActivePane()["split" + splitDirection]();
    }
    return atom.workspace.open(filePath);
  };

  prepFile = function(text, filePath) {
    return new Promise(function(resolve, reject) {
      if ((text != null ? text.length : void 0) === 0) {
        return reject(nothingToShow);
      } else {
        return fs.writeFile(filePath, text, {
          flag: 'w+'
        }, function(err) {
          if (err) {
            return reject(err);
          } else {
            return resolve(true);
          }
        });
      }
    });
  };

  module.exports = function(repo, _arg) {
    var args, diffFilePath, diffStat, file, _ref, _ref1;
    _ref = _arg != null ? _arg : {}, diffStat = _ref.diffStat, file = _ref.file;
    diffFilePath = Path.join(repo.getPath(), "atom_git_plus.diff");
    if (file == null) {
      file = repo.relativize((_ref1 = atom.workspace.getActiveTextEditor()) != null ? _ref1.getPath() : void 0);
    }
    if (!file) {
      return notifier.addError("No open file. Select 'Diff All'.");
    }
    args = ['diff', '--color=never'];
    if (atom.config.get('git-plus.includeStagedDiff')) {
      args.push('HEAD');
    }
    if (atom.config.get('git-plus.wordDiff')) {
      args.push('--word-diff');
    }
    if (!diffStat) {
      args.push(file);
    }
    return git.cmd(args, {
      cwd: repo.getWorkingDirectory()
    }).then(function(data) {
      return prepFile((diffStat != null ? diffStat : '') + data, diffFilePath);
    }).then(function() {
      return showFile(diffFilePath);
    }).then(function(textEditor) {
      return disposables.add(textEditor.onDidDestroy(function() {
        return fs.unlink(diffFilePath);
      }));
    })["catch"](function(err) {
      if (err === nothingToShow) {
        return notifier.addInfo(err);
      } else {
        return notifier.addError(err);
      }
    });
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rhd3NvbmJvdHNmb3JkLy5hdG9tL3BhY2thZ2VzL2dpdC1wbHVzL2xpYi9tb2RlbHMvZ2l0LWRpZmYuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLGdHQUFBOztBQUFBLEVBQUMsc0JBQXVCLE9BQUEsQ0FBUSxNQUFSLEVBQXZCLG1CQUFELENBQUE7O0FBQUEsRUFDQSxFQUFBLEdBQUssT0FBQSxDQUFRLElBQVIsQ0FETCxDQUFBOztBQUFBLEVBRUEsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSLENBRlAsQ0FBQTs7QUFBQSxFQUdBLEVBQUEsR0FBSyxPQUFBLENBQVEsU0FBUixDQUhMLENBQUE7O0FBQUEsRUFLQSxHQUFBLEdBQU0sT0FBQSxDQUFRLFFBQVIsQ0FMTixDQUFBOztBQUFBLEVBTUEsUUFBQSxHQUFXLE9BQUEsQ0FBUSxhQUFSLENBTlgsQ0FBQTs7QUFBQSxFQVFBLGFBQUEsR0FBZ0Isa0JBUmhCLENBQUE7O0FBQUEsRUFVQSxXQUFBLEdBQWMsR0FBQSxDQUFBLG1CQVZkLENBQUE7O0FBQUEsRUFZQSxRQUFBLEdBQVcsU0FBQyxRQUFELEdBQUE7QUFDVCxRQUFBLGNBQUE7QUFBQSxJQUFBLElBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLHFCQUFoQixDQUFIO0FBQ0UsTUFBQSxjQUFBLEdBQWlCLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQixvQkFBaEIsQ0FBakIsQ0FBQTtBQUFBLE1BQ0EsSUFBSSxDQUFDLFNBQVMsQ0FBQyxhQUFmLENBQUEsQ0FBK0IsQ0FBQyxPQUFBLEdBQU8sY0FBUixDQUEvQixDQUFBLENBREEsQ0FERjtLQUFBO1dBR0EsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFmLENBQW9CLFFBQXBCLEVBSlM7RUFBQSxDQVpYLENBQUE7O0FBQUEsRUFr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

//# sourceURL=/Users/dawsonbotsford/.atom/packages/git-plus/lib/models/git-diff.coffee
