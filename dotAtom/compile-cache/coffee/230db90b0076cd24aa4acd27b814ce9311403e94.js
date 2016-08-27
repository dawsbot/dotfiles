(function() {
  var $$, CompositeDisposable, Emitter, ScriptInputView, ScriptProfileRunView, SelectListView, View, _ref, _ref1,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ref = require('atom'), CompositeDisposable = _ref.CompositeDisposable, Emitter = _ref.Emitter;

  _ref1 = require('atom-space-pen-views'), $$ = _ref1.$$, View = _ref1.View, SelectListView = _ref1.SelectListView;

  ScriptInputView = require('./script-input-view');

  module.exports = ScriptProfileRunView = (function(_super) {
    __extends(ScriptProfileRunView, _super);

    function ScriptProfileRunView() {
      return ScriptProfileRunView.__super__.constructor.apply(this, arguments);
    }

    ScriptProfileRunView.prototype.initialize = function(profiles) {
      this.profiles = profiles;
      ScriptProfileRunView.__super__.initialize.apply(this, arguments);
      this.emitter = new Emitter;
      this.subscriptions = new CompositeDisposable;
      this.subscriptions.add(atom.commands.add('atom-workspace', {
        'core:cancel': (function(_this) {
          return function() {
            return _this.hide();
          };
        })(this),
        'core:close': (function(_this) {
          return function() {
            return _this.hide();
          };
        })(this),
        'script:run-with-profile': (function(_this) {
          return function() {
            if (_this.panel.isVisible()) {
              return _this.hide();
            } else {
              return _this.show();
            }
          };
        })(this)
      }));
      this.setItems(this.profiles);
      return this.initializeView();
    };

    ScriptProfileRunView.prototype.initializeView = function() {
      var selector;
      this.addClass('overlay from-top script-profile-run-view');
      this.buttons = $$(function() {
        return this.div({
          "class": 'block buttons'
        }, (function(_this) {
          return function() {
            var css;
            css = 'btn inline-block-tight';
            _this.button({
              "class": "btn cancel"
            }, function() {
              return _this.span({
                "class": 'icon icon-x'
              }, 'Cancel');
            });
            _this.button({
              "class": "btn rename"
            }, function() {
              return _this.span({
                "class": 'icon icon-pencil'
              }, 'Rename');
            });
            _this.button({
              "class": "btn delete"
            }, function() {
              return _this.span({
                "class": 'icon icon-trashcan'
              }, 'Delete');
            });
            return _this.button({
              "class": "btn run"
            }, function() {
              return _this.span({
                "class": 'icon icon-playback-play'
              }, 'Run');
            });
          };
        })(this));
      });
      this.buttons.find('.btn.cancel').on('click', (function(_this) {
        return function() {
          return _this.hide();
        };
      })(this));
      this.buttons.find('.btn.rename').on('click', (function(_this) {
        return function() {
          return _this.rename();
        };
      })(this));
      this.buttons.find('.btn.delete').on('click', (function(_this) {
        return function() {
          return _this["delete"]();
        };
      })(this));
      this.buttons.find('.btn.run').on('click', (function(_this) {
        return function() {
          return _this.run();
        };
      })(this));
      this.buttons.find('.btn.run').on('keydown', (function(_this) {
        return function(e) {
          if (e.keyCode === 9) {
            e.stopPropagation();
            e.preventDefault();
            return _this.focusFilterEditor();
          }
        };
      })(this));
      this.on('keydown', (function(_this) {
        return function(e) {
          if (e.keyCode === 27) {
            _this.hide();
          }
          if (e.keyCode === 13) {
            return _this.run();
          }
        };
      })(this));
      this.append(this.buttons);
      selector = '.rename, .delete, .run';
      if (this.profiles.length) {
        this.buttons.find(selector).show();
      } else {
        this.buttons.find(selector).hide();
      }
      this.panel = atom.workspace.addModalPanel({
        item: this
      });
      return this.panel.hide();
    };

    ScriptProfileRunView.prototype.onProfileDelete = function(callback) {
      return this.emitter.on('on-profile-delete', callback);
    };

    ScriptProfileRunView.prototype.onProfileChange = function(callback) {
      return this.emitter.on('on-profile-change', callback);
    };

    ScriptProfileRunView.prototype.onProfileRun = function(callback) {
      return this.emitter.on('on-profile-run', callback);
    };

    ScriptProfileRunView.prototype.rename = function() {
      var inputView, profile;
      profile = this.getSelectedItem();
      if (!profile) {
        return;
      }
      inputView = new ScriptInputView({
        caption: 'Enter new profile name:',
        "default": profile.name
      });
      inputView.onCancel((function(_this) {
        return function() {
          return _this.show();
        };
      })(this));
      inputView.onConfirm((function(_this) {
        return function(newProfileName) {
          if (!newProfileName) {
            return;
          }
          return _this.emitter.emit('on-profile-change', {
            profile: profile,
            key: 'name',
            value: newProfileName
          });
        };
      })(this));
      return inputView.show();
    };

    ScriptProfileRunView.prototype["delete"] = function() {
      var profile;
      profile = this.getSelectedItem();
      if (!profile) {
        return;
      }
      return atom.confirm({
        message: 'Delete profile',
        detailedMessage: "Are you sure you want to delete \"" + profile.name + "\" profile?",
        buttons: {
          No: (function(_this) {
            return function() {
              return _this.focusFilterEditor();
            };
          })(this),
          Yes: (function(_this) {
            return function() {
              return _this.emitter.emit('on-profile-delete', profile);
            };
          })(this)
        }
      });
    };

    ScriptProfileRunView.prototype.getFilterKey = function() {
      return 'name';
    };

    ScriptProfileRunView.prototype.getEmptyMessage = function() {
      return 'No profiles found';
    };

    ScriptProfileRunView.prototype.viewForItem = function(item) {
      return $$(function() {
        return this.li({
          "class": 'two-lines profile'
        }, (function(_this) {
          return function() {
            _this.div({
              "class": 'primary-line name'
            }, function() {
              return _this.text(item.name);
            });
            return _this.div({
              "class": 'secondary-line description'
            }, function() {
              return _this.text(item.description);
            });
          };
        })(this));
      });
    };

    ScriptProfileRunView.prototype.cancel = function() {};

    ScriptProfileRunView.prototype.confirmed = function(item) {};

    ScriptProfileRunView.prototype.show = function() {
      this.panel.show();
      return this.focusFilterEditor();
    };

    ScriptProfileRunView.prototype.hide = function() {
      this.panel.hide();
      return atom.workspace.getActivePane().activate();
    };

    ScriptProfileRunView.prototype.setProfiles = function(profiles) {
      var selector;
      this.profiles = profiles;
      this.setItems(this.profiles);
      selector = '.rename, .delete, .run';
      if (this.profiles.length) {
        this.buttons.find(selector).show();
      } else {
        this.buttons.find(selector).hide();
      }
      this.populateList();
      return this.focusFilterEditor();
    };

    ScriptProfileRunView.prototype.close = function() {};

    ScriptProfileRunView.prototype.destroy = function() {
      var _ref2;
      return (_ref2 = this.subscriptions) != null ? _ref2.dispose() : void 0;
    };

    ScriptProfileRunView.prototype.run = function() {
      var profile;
      profile = this.getSelectedItem();
      if (!profile) {
        return;
      }
      this.emitter.emit('on-profile-run', profile);
      return this.hide();
    };

    return ScriptProfileRunView;

  })(SelectListView);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rhd3NvbmJvdHNmb3JkLy5hdG9tL3BhY2thZ2VzL3NjcmlwdC9saWIvc2NyaXB0LXByb2ZpbGUtcnVuLXZpZXcuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLDBHQUFBO0lBQUE7bVNBQUE7O0FBQUEsRUFBQSxPQUFpQyxPQUFBLENBQVEsTUFBUixDQUFqQyxFQUFDLDJCQUFBLG1CQUFELEVBQXNCLGVBQUEsT0FBdEIsQ0FBQTs7QUFBQSxFQUNBLFFBQTZCLE9BQUEsQ0FBUSxzQkFBUixDQUE3QixFQUFDLFdBQUEsRUFBRCxFQUFLLGFBQUEsSUFBTCxFQUFXLHVCQUFBLGNBRFgsQ0FBQTs7QUFBQSxFQUVBLGVBQUEsR0FBa0IsT0FBQSxDQUFRLHFCQUFSLENBRmxCLENBQUE7O0FBQUEsRUFJQSxNQUFNLENBQUMsT0FBUCxHQUNNO0FBQ0osMkNBQUEsQ0FBQTs7OztLQUFBOztBQUFBLG1DQUFBLFVBQUEsR0FBWSxTQUFFLFFBQUYsR0FBQTtBQUNWLE1BRFcsSUFBQyxDQUFBLFdBQUEsUUFDWixDQUFBO0FBQUEsTUFBQSxzREFBQSxTQUFBLENBQUEsQ0FBQTtBQUFBLE1BRUEsSUFBQyxDQUFBLE9BQUQsR0FBVyxHQUFBLENBQUEsT0FGWCxDQUFBO0FBQUEsTUFJQSxJQUFDLENBQUEsYUFBRCxHQUFpQixHQUFBLENBQUEsbUJBSmpCLENBQUE7QUFBQSxNQUtBLElBQUMsQ0FBQSxhQUFhLENBQUMsR0FBZixDQUFtQixJQUFJLENBQUMsUUFBUSxDQUFDLEdBQWQsQ0FBa0IsZ0JBQWxCLEVBQ2pCO0FBQUEsUUFBQSxhQUFBLEVBQWUsQ0FBQSxTQUFBLEtBQUEsR0FBQTtpQkFBQSxTQUFBLEdBQUE7bUJBQUcsS0FBQyxDQUFBLElBQUQsQ0FBQSxFQUFIO1VBQUEsRUFBQTtRQUFBLENBQUEsQ0FBQSxDQUFBLElB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

//# sourceURL=/Users/dawsonbotsford/.atom/packages/script/lib/script-profile-run-view.coffee
