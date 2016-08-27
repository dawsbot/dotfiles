(function() {
  var $, $$$, BufferedProcess, Disposable, GitShow, LogListView, View, amountOfCommitsToShow, git, _, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Disposable = require('atom').Disposable;

  BufferedProcess = require('atom').BufferedProcess;

  _ref = require('atom-space-pen-views'), $ = _ref.$, $$$ = _ref.$$$, View = _ref.View;

  _ = require('underscore-plus');

  git = require('../git');

  GitShow = require('../models/git-show');

  amountOfCommitsToShow = function() {
    return atom.config.get('git-plus.amountOfCommitsToShow');
  };

  module.exports = LogListView = (function(_super) {
    __extends(LogListView, _super);

    function LogListView() {
      return LogListView.__super__.constructor.apply(this, arguments);
    }

    LogListView.content = function() {
      return this.div({
        "class": 'git-plus-log',
        tabindex: -1
      }, (function(_this) {
        return function() {
          return _this.table({
            id: 'git-plus-commits',
            outlet: 'commitsListView'
          });
        };
      })(this));
    };

    LogListView.prototype.getURI = function() {
      return 'atom://git-plus:log';
    };

    LogListView.prototype.getTitle = function() {
      return 'git-plus: Log';
    };

    LogListView.prototype.initialize = function() {
      this.skipCommits = 0;
      this.finished = false;
      this.on('click', '.commit-row', (function(_this) {
        return function(_arg) {
          var currentTarget;
          currentTarget = _arg.currentTarget;
          return _this.showCommitLog(currentTarget.getAttribute('hash'));
        };
      })(this));
      return this.scroll(_.debounce((function(_this) {
        return function() {
          if (_this.prop('scrollHeight') - _this.scrollTop() - _this.height() < 20) {
            return _this.getLog();
          }
        };
      })(this), 50));
    };

    LogListView.prototype.attached = function() {
      return this.commandSubscription = atom.commands.add(this.element, {
        'core:move-down': (function(_this) {
          return function() {
            return _this.selectNextResult();
          };
        })(this),
        'core:move-up': (function(_this) {
          return function() {
            return _this.selectPreviousResult();
          };
        })(this),
        'core:page-up': (function(_this) {
          return function() {
            return _this.selectPreviousResult(10);
          };
        })(this),
        'core:page-down': (function(_this) {
          return function() {
            return _this.selectNextResult(10);
          };
        })(this),
        'core:move-to-top': (function(_this) {
          return function() {
            return _this.selectFirstResult();
          };
        })(this),
        'core:move-to-bottom': (function(_this) {
          return function() {
            return _this.selectLastResult();
          };
        })(this),
        'core:confirm': (function(_this) {
          return function() {
            var hash;
            hash = _this.find('.selected').attr('hash');
            if (hash) {
              _this.showCommitLog(hash);
            }
            return false;
          };
        })(this)
      });
    };

    LogListView.prototype.detached = function() {
      this.commandSubscription.dispose();
      return this.commandSubscription = null;
    };

    LogListView.prototype.parseData = function(data) {
      var commits, newline, separator;
      if (data.length < 1) {
        this.finished = true;
        return;
      }
      separator = ';|';
      newline = '_.;._';
      data = data.substring(0, data.length - newline.length - 1);
      commits = data.split(newline).map(function(line) {
        var tmpData;
        if (line.trim() !== '') {
          tmpData = line.trim().split(separator);
          return {
            hashShort: tmpData[0],
            hash: tmpData[1],
            author: tmpData[2],
            email: tmpData[3],
            message: tmpData[4],
            date: tmpData[5]
          };
        }
      });
      return this.renderLog(commits);
    };

    LogListView.prototype.renderHeader = function() {
      var headerRow;
      headerRow = $$$(function() {
        return this.tr({
          "class": 'commit-header'
        }, (function(_this) {
          return function() {
            _this.td('Date');
            _this.td('Message');
            return _this.td({
              "class": 'hashShort'
            }, 'Short Hash');
          };
        })(this));
      });
      return this.commitsListView.append(headerRow);
    };

    LogListView.prototype.renderLog = function(commits) {
      commits.forEach((function(_this) {
        return function(commit) {
          return _this.renderCommit(commit);
        };
      })(this));
      return this.skipCommits += amountOfCommitsToShow();
    };

    LogListView.prototype.renderCommit = function(commit) {
      var commitRow;
      commitRow = $$$(function() {
        return this.tr({
          "class": 'commit-row',
          hash: "" + commit.hash
        }, (function(_this) {
          return function() {
            _this.td({
              "class": 'date'
            }, "" + commit.date + " by " + commit.author);
            _this.td({
              "class": 'message'
            }, "" + commit.message);
            return _this.td({
              "class": 'hashShort'
            }, "" + commit.hashShort);
          };
        })(this));
      });
      return this.commitsListView.append(commitRow);
    };

    LogListView.prototype.showCommitLog = function(hash) {
      return GitShow(this.repo, hash, this.onlyCurrentFile ? this.currentFile : void 0);
    };

    LogListView.prototype.branchLog = function(repo) {
      this.repo = repo;
      this.skipCommits = 0;
      this.commitsListView.empty();
      this.onlyCurrentFile = false;
      this.currentFile = null;
      this.renderHeader();
      return this.getLog();
    };

    LogListView.prototype.currentFileLog = function(repo, currentFile) {
      this.repo = repo;
      this.currentFile = currentFile;
      this.onlyCurrentFile = true;
      this.skipCommits = 0;
      this.commitsListView.empty();
      this.renderHeader();
      return this.getLog();
    };

    LogListView.prototype.getLog = function() {
      var args;
      if (this.finished) {
        return;
      }
      args = ['log', "--pretty=%h;|%H;|%aN;|%aE;|%s;|%ai_.;._", "-" + (amountOfCommitsToShow()), '--skip=' + this.skipCommits];
      if (this.onlyCurrentFile && (this.currentFile != null)) {
        args.push(this.currentFile);
      }
      return git.cmd(args, {
        cwd: this.repo.getWorkingDirectory()
      }).then((function(_this) {
        return function(data) {
          return _this.parseData(data);
        };
      })(this));
    };

    LogListView.prototype.selectFirstResult = function() {
      this.selectResult(this.find('.commit-row:first'));
      return this.scrollToTop();
    };

    LogListView.prototype.selectLastResult = function() {
      this.selectResult(this.find('.commit-row:last'));
      return this.scrollToBottom();
    };

    LogListView.prototype.selectNextResult = function(skip) {
      var nextView, selectedView;
      if (skip == null) {
        skip = 1;
      }
      selectedView = this.find('.selected');
      if (selectedView.length < 1) {
        return this.selectFirstResult();
      }
      nextView = this.getNextResult(selectedView, skip);
      this.selectResult(nextView);
      return this.scrollTo(nextView);
    };

    LogListView.prototype.selectPreviousResult = function(skip) {
      var prevView, selectedView;
      if (skip == null) {
        skip = 1;
      }
      selectedView = this.find('.selected');
      if (selectedView.length < 1) {
        return this.selectFirstResult();
      }
      prevView = this.getPreviousResult(selectedView, skip);
      this.selectResult(prevView);
      return this.scrollTo(prevView);
    };

    LogListView.prototype.getNextResult = function(element, skip) {
      var itemIndex, items;
      if (!(element != null ? element.length : void 0)) {
        return;
      }
      items = this.find('.commit-row');
      itemIndex = items.index(element);
      return $(items[Math.min(itemIndex + skip, items.length - 1)]);
    };

    LogListView.prototype.getPreviousResult = function(element, skip) {
      var itemIndex, items;
      if (!(element != null ? element.length : void 0)) {
        return;
      }
      items = this.find('.commit-row');
      itemIndex = items.index(element);
      return $(items[Math.max(itemIndex - skip, 0)]);
    };

    LogListView.prototype.selectResult = function(resultView) {
      if (!(resultView != null ? resultView.length : void 0)) {
        return;
      }
      this.find('.selected').removeClass('selected');
      return resultView.addClass('selected');
    };

    LogListView.prototype.scrollTo = function(element) {
      var bottom, top;
      if (!(element != null ? element.length : void 0)) {
        return;
      }
      top = this.scrollTop() + element.offset().top - this.offset().top;
      bottom = top + element.outerHeight();
      if (bottom > this.scrollBottom()) {
        this.scrollBottom(bottom);
      }
      if (top < this.scrollTop()) {
        return this.scrollTop(top);
      }
    };

    return LogListView;

  })(View);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rhd3NvbmJvdHNmb3JkLy5hdG9tL3BhY2thZ2VzL2dpdC1wbHVzL2xpYi92aWV3cy9sb2ctbGlzdC12aWV3LmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxvR0FBQTtJQUFBO21TQUFBOztBQUFBLEVBQUMsYUFBYyxPQUFBLENBQVEsTUFBUixFQUFkLFVBQUQsQ0FBQTs7QUFBQSxFQUNDLGtCQUFtQixPQUFBLENBQVEsTUFBUixFQUFuQixlQURELENBQUE7O0FBQUEsRUFFQSxPQUFpQixPQUFBLENBQVEsc0JBQVIsQ0FBakIsRUFBQyxTQUFBLENBQUQsRUFBSSxXQUFBLEdBQUosRUFBUyxZQUFBLElBRlQsQ0FBQTs7QUFBQSxFQUdBLENBQUEsR0FBSSxPQUFBLENBQVEsaUJBQVIsQ0FISixDQUFBOztBQUFBLEVBSUEsR0FBQSxHQUFNLE9BQUEsQ0FBUSxRQUFSLENBSk4sQ0FBQTs7QUFBQSxFQUtBLE9BQUEsR0FBVSxPQUFBLENBQVEsb0JBQVIsQ0FMVixDQUFBOztBQUFBLEVBT0EscUJBQUEsR0FBd0IsU0FBQSxHQUFBO1dBQ3RCLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQixnQ0FBaEIsRUFEc0I7RUFBQSxDQVB4QixDQUFBOztBQUFBLEVBVUEsTUFBTSxDQUFDLE9BQVAsR0FDTTtBQUNKLGtDQUFBLENBQUE7Ozs7S0FBQTs7QUFBQSxJQUFBLFdBQUMsQ0FBQSxPQUFELEdBQVUsU0FBQSxHQUFBO2FBQ1IsSUFBQyxDQUFBLEdBQUQsQ0FBSztBQUFBLFFBQUEsT0FBQSxFQUFPLGNBQVA7QUFBQSxRQUF1QixRQUFBLEVBQVUsQ0FBQSxDQUFqQztPQUFMLEVBQTBDLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFBLEdBQUE7aUJBQ3hDLEtBQUMsQ0FBQSxLQUFELENBQU87QUFBQSxZQUFB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

//# sourceURL=/Users/dawsonbotsford/.atom/packages/git-plus/lib/views/log-list-view.coffee
