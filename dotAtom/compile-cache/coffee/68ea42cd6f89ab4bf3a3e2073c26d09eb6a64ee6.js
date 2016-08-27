(function() {
  var $$, AnsiFilter, HeaderView, MessagePanelView, ScriptView, View, linkPaths, stripAnsi, _, _ref,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ref = require('atom-space-pen-views'), View = _ref.View, $$ = _ref.$$;

  HeaderView = require('./header-view');

  MessagePanelView = require('atom-message-panel').MessagePanelView;

  AnsiFilter = require('ansi-to-html');

  stripAnsi = require('strip-ansi');

  linkPaths = require('./link-paths');

  _ = require('underscore');

  module.exports = ScriptView = (function(_super) {
    __extends(ScriptView, _super);

    function ScriptView() {
      this.setHeaderAndShowExecutionTime = __bind(this.setHeaderAndShowExecutionTime, this);
      this.showInTab = __bind(this.showInTab, this);
      this.ansiFilter = new AnsiFilter;
      this.headerView = new HeaderView;
      ScriptView.__super__.constructor.call(this, {
        title: this.headerView,
        rawTitle: true,
        closeMethod: 'destroy'
      });
      this.addClass('script-view');
      this.addShowInTabIcon();
      linkPaths.listen(this.body);
    }

    ScriptView.prototype.addShowInTabIcon = function() {
      var icon;
      icon = $$(function() {
        return this.div({
          "class": 'heading-show-in-tab inline-block icon-file-text',
          style: 'cursor: pointer;',
          outlet: 'btnShowInTab',
          title: 'Show output in new tab'
        });
      });
      icon.click(this.showInTab);
      return icon.insertBefore(this.btnAutoScroll);
    };

    ScriptView.prototype.showInTab = function() {
      var context, message, output, _i, _len, _ref1;
      output = '';
      _ref1 = this.messages;
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        message = _ref1[_i];
        output += message.text();
      }
      context = '';
      if (this.commandContext) {
        context = "[Command: " + (this.commandContext.getRepresentation()) + "]\n";
      }
      return atom.workspace.open().then(function(editor) {
        return editor.setText(stripAnsi(context + output));
      });
    };

    ScriptView.prototype.setHeaderAndShowExecutionTime = function(returnCode, executionTime) {
      if ((executionTime != null)) {
        this.display('stdout', '[Finished in ' + executionTime.toString() + 's]');
      } else {
        this.display('stdout');
      }
      if (returnCode === 0) {
        return this.setHeaderStatus('stop');
      } else {
        return this.setHeaderStatus('err');
      }
    };

    ScriptView.prototype.resetView = function(title) {
      if (title == null) {
        title = 'Loading...';
      }
      if (!this.hasParent()) {
        this.attach();
      }
      this.setHeaderTitle(title);
      this.setHeaderStatus('start');
      return this.clear();
    };

    ScriptView.prototype.removePanel = function() {
      this.stop();
      this.detach();
      return ScriptView.__super__.close.apply(this);
    };

    ScriptView.prototype.close = function() {
      var workspaceView;
      workspaceView = atom.views.getView(atom.workspace);
      return atom.commands.dispatch(workspaceView, 'script:close-view');
    };

    ScriptView.prototype.stop = function() {
      this.display('stdout', '^C');
      return this.setHeaderStatus('kill');
    };

    ScriptView.prototype.createGitHubIssueLink = function(argType, lang) {
      var body, encodedURI, err, title;
      title = "Add " + argType + " support for " + lang;
      body = "##### Platform: `" + process.platform + "`\n---";
      encodedURI = encodeURI("https://github.com/rgbkrk/atom-script/issues/new?title=" + title + "&body=" + body);
      encodedURI = encodedURI.replace(/#/g, '%23');
      err = $$(function() {
        this.p({
          "class": 'block'
        }, "" + argType + " runner not available for " + lang + ".");
        return this.p({
          "class": 'block'
        }, (function(_this) {
          return function() {
            _this.text('If it should exist, add an ');
            _this.a({
              href: encodedURI
            }, 'issue on GitHub');
            return _this.text(', or send your own pull request.');
          };
        })(this));
      });
      return this.handleError(err);
    };

    ScriptView.prototype.showUnableToRunError = function(command) {
      return this.add($$(function() {
        this.h1('Unable to run');
        this.pre(_.escape(command));
        this.h2('Did you start Atom from the command line?');
        this.pre('  atom .');
        this.h2('Is it in your PATH?');
        return this.pre("PATH: " + (_.escape(process.env.PATH)));
      }));
    };

    ScriptView.prototype.showNoLanguageSpecified = function() {
      var err;
      err = $$(function() {
        return this.p('You must select a language in the lower right, or save the file with an appropriate extension.');
      });
      return this.handleError(err);
    };

    ScriptView.prototype.showLanguageNotSupported = function(lang) {
      var err;
      err = $$(function() {
        this.p({
          "class": 'block'
        }, "Command not configured for " + lang + "!");
        return this.p({
          "class": 'block'
        }, (function(_this) {
          return function() {
            _this.text('Add an ');
            _this.a({
              href: "https://github.com/rgbkrk/atom-script/issues/new?title=Add%20support%20for%20" + lang
            }, 'issue on GitHub');
            return _this.text(' or send your own Pull Request.');
          };
        })(this));
      });
      return this.handleError(err);
    };

    ScriptView.prototype.handleError = function(err) {
      this.setHeaderTitle('Error');
      this.setHeaderStatus('err');
      this.add(err);
      return this.stop();
    };

    ScriptView.prototype.setHeaderStatus = function(status) {
      return this.headerView.setStatus(status);
    };

    ScriptView.prototype.setHeaderTitle = function(title) {
      return this.headerView.title.text(title);
    };

    ScriptView.prototype.display = function(css, line) {
      var atEnd, clientHeight, scrollHeight, scrollTop, _ref1;
      if (atom.config.get('script.escapeConsoleOutput')) {
        line = _.escape(line);
      }
      line = this.ansiFilter.toHtml(line);
      line = linkPaths(line);
      _ref1 = this.body[0], clientHeight = _ref1.clientHeight, scrollTop = _ref1.scrollTop, scrollHeight = _ref1.scrollHeight;
      atEnd = scrollTop >= (scrollHeight - clientHeight);
      this.add($$(function() {
        return this.pre({
          "class": "line " + css
        }, (function(_this) {
          return function() {
            return _this.raw(line);
          };
        })(this));
      }));
      if (atom.config.get('script.scrollWithOutput') && atEnd) {
        return this.checkScrollAgain(5)();
      }
    };

    ScriptView.prototype.scrollTimeout = null;

    ScriptView.prototype.checkScrollAgain = function(times) {
      return (function(_this) {
        return function() {
          _this.body.scrollToBottom();
          clearTimeout(_this.scrollTimeout);
          if (times > 1) {
            return _this.scrollTimeout = setTimeout(_this.checkScrollAgain(times - 1), 50);
          }
        };
      })(this);
    };

    ScriptView.prototype.copyResults = function() {
      if (this.results) {
        return atom.clipboard.write(stripAnsi(this.results));
      }
    };

    return ScriptView;

  })(MessagePanelView);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rhd3NvbmJvdHNmb3JkLy5hdG9tL3BhY2thZ2VzL3NjcmlwdC9saWIvc2NyaXB0LXZpZXcuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLDZGQUFBO0lBQUE7O21TQUFBOztBQUFBLEVBQUEsT0FBYSxPQUFBLENBQVEsc0JBQVIsQ0FBYixFQUFDLFlBQUEsSUFBRCxFQUFPLFVBQUEsRUFBUCxDQUFBOztBQUFBLEVBRUEsVUFBQSxHQUFhLE9BQUEsQ0FBUSxlQUFSLENBRmIsQ0FBQTs7QUFBQSxFQUdDLG1CQUFvQixPQUFBLENBQVEsb0JBQVIsRUFBcEIsZ0JBSEQsQ0FBQTs7QUFBQSxFQUlBLFVBQUEsR0FBYSxPQUFBLENBQVEsY0FBUixDQUpiLENBQUE7O0FBQUEsRUFLQSxTQUFBLEdBQVksT0FBQSxDQUFRLFlBQVIsQ0FMWixDQUFBOztBQUFBLEVBTUEsU0FBQSxHQUFZLE9BQUEsQ0FBUSxjQUFSLENBTlosQ0FBQTs7QUFBQSxFQU9BLENBQUEsR0FBSSxPQUFBLENBQVEsWUFBUixDQVBKLENBQUE7O0FBQUEsRUFVQSxNQUFNLENBQUMsT0FBUCxHQUNNO0FBQ0osaUNBQUEsQ0FBQTs7QUFBYSxJQUFBLG9CQUFBLEdBQUE7QUFDWCwyRkFBQSxDQUFBO0FBQUEsbURBQUEsQ0FBQTtBQUFBLE1BQUEsSUFBQyxDQUFBLFVBQUQsR0FBYyxHQUFBLENBQUEsVUFBZCxDQUFBO0FBQUEsTUFFQSxJQUFDLENBQUEsVUFBRCxHQUFjLEdBQUEsQ0FBQSxVQUZkLENBQUE7QUFBQSxNQUlBLDRDQUFNO0FBQUEsUUFBQSxLQUFBLEVBQU8sSUFBQyxDQUFBLFVBQVI7QUFBQSxRQUFvQixRQUFBLEVBQVUsSUFBOUI7QUFBQSxRQUFvQyxXQUFBLEVBQWEsU0FBakQ7T0FBTixDQUpBLENBQUE7QUFBQSxNQU1BLElBQUMsQ0FB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

//# sourceURL=/Users/dawsonbotsford/.atom/packages/script/lib/script-view.coffee
