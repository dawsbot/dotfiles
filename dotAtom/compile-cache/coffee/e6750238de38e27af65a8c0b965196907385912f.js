(function() {
  var $, $$$, BufferedProcess, Disposable, GitShow, LogListView, View, git, numberOfCommitsToShow, _, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Disposable = require('atom').Disposable;

  BufferedProcess = require('atom').BufferedProcess;

  _ref = require('atom-space-pen-views'), $ = _ref.$, $$$ = _ref.$$$, View = _ref.View;

  _ = require('underscore-plus');

  git = require('../git');

  GitShow = require('../models/git-show');

  numberOfCommitsToShow = function() {
    return atom.config.get('git-plus.numberOfCommitsToShow');
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
      return this.skipCommits += numberOfCommitsToShow();
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
      args = ['log', "--pretty=%h;|%H;|%aN;|%aE;|%s;|%ai_.;._", "-" + (numberOfCommitsToShow()), '--skip=' + this.skipCommits];
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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rhd3NvbmJvdHNmb3JkLy5hdG9tL3BhY2thZ2VzL2dpdC1wbHVzL2xpYi92aWV3cy9sb2ctbGlzdC12aWV3LmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxvR0FBQTtJQUFBO21TQUFBOztBQUFBLEVBQUMsYUFBYyxPQUFBLENBQVEsTUFBUixFQUFkLFVBQUQsQ0FBQTs7QUFBQSxFQUNDLGtCQUFtQixPQUFBLENBQVEsTUFBUixFQUFuQixlQURELENBQUE7O0FBQUEsRUFFQSxPQUFpQixPQUFBLENBQVEsc0JBQVIsQ0FBakIsRUFBQyxTQUFBLENBQUQsRUFBSSxXQUFBLEdBQUosRUFBUyxZQUFBLElBRlQsQ0FBQTs7QUFBQSxFQUdBLENBQUEsR0FBSSxPQUFBLENBQVEsaUJBQVIsQ0FISixDQUFBOztBQUFBLEVBSUEsR0FBQSxHQUFNLE9BQUEsQ0FBUSxRQUFSLENBSk4sQ0FBQTs7QUFBQSxFQUtBLE9BQUEsR0FBVSxPQUFBLENBQVEsb0JBQVIsQ0FMVixDQUFBOztBQUFBLEVBT0EscUJBQUEsR0FBd0IsU0FBQSxHQUFBO1dBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLGdDQUFoQixFQUFIO0VBQUEsQ0FQeEIsQ0FBQTs7QUFBQSxFQVNBLE1BQU0sQ0FBQyxPQUFQLEdBQ007QUFDSixrQ0FBQSxDQUFBOzs7O0tBQUE7O0FBQUEsSUFBQSxXQUFDLENBQUEsT0FBRCxHQUFVLFNBQUEsR0FBQTthQUNSLElBQUMsQ0FBQSxHQUFELENBQUs7QUFBQSxRQUFBLE9BQUEsRUFBTyxjQUFQO0FBQUEsUUFBdUIsUUFBQSxFQUFVLENBQUEsQ0FBakM7T0FBTCxFQUEwQyxDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQSxHQUFBO2lCQUN4QyxLQUFDLENBQUEsS0FBRCxDQUFPO0FBQUEsWUFBQSxF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

//# sourceURL=/Users/dawsonbotsford/.atom/packages/git-plus/lib/views/log-list-view.coffee
