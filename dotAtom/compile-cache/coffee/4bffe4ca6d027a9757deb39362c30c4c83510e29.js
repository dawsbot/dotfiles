(function() {
  var Analytics, Tracker, allowUnsafeEval, analyticsWriteKey, pkg, _;

  analyticsWriteKey = 'pDV1EgxAbco4gjPXpJzuOeDyYgtkrmmG';

  _ = require('underscore-plus');

  allowUnsafeEval = require('loophole').allowUnsafeEval;

  Analytics = null;

  allowUnsafeEval(function() {
    return Analytics = require('analytics-node');
  });

  pkg = require("../package.json");

  Tracker = (function() {
    function Tracker(analyticsUserIdConfigKey, analyticsEnabledConfigKey) {
      var uuid;
      this.analyticsUserIdConfigKey = analyticsUserIdConfigKey;
      this.analyticsEnabledConfigKey = analyticsEnabledConfigKey;
      this.analytics = new Analytics(analyticsWriteKey);
      if (!atom.config.get(this.analyticsUserIdConfigKey)) {
        uuid = require('node-uuid');
        atom.config.set(this.analyticsUserIdConfigKey, uuid.v4());
      }
      this.defaultEvent = {
        userId: atom.config.get(this.analyticsUserIdConfigKey),
        properties: {
          value: 1,
          version: atom.getVersion(),
          platform: navigator.platform,
          category: "Atom-" + (atom.getVersion()) + "/" + pkg.name + "-" + pkg.version
        },
        context: {
          app: {
            name: pkg.name,
            version: pkg.version
          },
          userAgent: navigator.userAgent
        }
      };
      atom.config.observe(this.analyticsUserIdConfigKey, (function(_this) {
        return function(userId) {
          _this.analytics.identify({
            userId: userId
          });
          return _this.defaultEvent.userId = userId;
        };
      })(this));
      this.enabled = atom.config.get(this.analyticsEnabledConfigKey);
      atom.config.onDidChange(this.analyticsEnabledConfigKey, (function(_this) {
        return function(_arg) {
          var newValue;
          newValue = _arg.newValue;
          return _this.enabled = newValue;
        };
      })(this));
    }

    Tracker.prototype.track = function(message) {
      if (!this.enabled) {
        return;
      }
      if (_.isString(message)) {
        message = {
          event: message
        };
      }
      console.debug("tracking " + message.event);
      return this.analytics.track(_.deepExtend(this.defaultEvent, message));
    };

    Tracker.prototype.trackActivate = function() {
      return this.track({
        event: 'Activate',
        properties: {
          label: pkg.version
        }
      });
    };

    Tracker.prototype.trackDeactivate = function() {
      return this.track({
        event: 'Deactivate',
        properties: {
          label: pkg.version
        }
      });
    };

    Tracker.prototype.error = function(e) {
      return this.track({
        event: 'Error',
        properties: {
          error: e
        }
      });
    };

    return Tracker;

  })();

  module.exports = Tracker;

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rhd3NvbmJvdHNmb3JkLy5hdG9tL3BhY2thZ2VzL3N5bmMtc2V0dGluZ3MvbGliL3RyYWNrZXIuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQ0E7QUFBQSxNQUFBLDhEQUFBOztBQUFBLEVBQUEsaUJBQUEsR0FBb0Isa0NBQXBCLENBQUE7O0FBQUEsRUFHQSxDQUFBLEdBQUksT0FBQSxDQUFRLGlCQUFSLENBSEosQ0FBQTs7QUFBQSxFQUlDLGtCQUFtQixPQUFBLENBQVEsVUFBUixFQUFuQixlQUpELENBQUE7O0FBQUEsRUFPQSxTQUFBLEdBQVksSUFQWixDQUFBOztBQUFBLEVBUUEsZUFBQSxDQUFnQixTQUFBLEdBQUE7V0FBRyxTQUFBLEdBQVksT0FBQSxDQUFRLGdCQUFSLEVBQWY7RUFBQSxDQUFoQixDQVJBLENBQUE7O0FBQUEsRUFXQSxHQUFBLEdBQU0sT0FBQSxDQUFRLGlCQUFSLENBWE4sQ0FBQTs7QUFBQSxFQWFNO0FBRVMsSUFBQSxpQkFBRSx3QkFBRixFQUE2Qix5QkFBN0IsR0FBQTtBQUVYLFVBQUEsSUFBQTtBQUFBLE1BRlksSUFBQyxDQUFBLDJCQUFBLHdCQUViLENBQUE7QUFBQSxNQUZ1QyxJQUFDLENBQUEsNEJBQUEseUJBRXhDLENBQUE7QUFBQSxNQUFBLElBQUMsQ0FBQSxTQUFELEdBQWlCLElBQUEsU0FBQSxDQUFVLGlCQUFWLENBQWpCLENBQUE7QUFHQSxNQUFBLElBQUcsQ0FBQSxJQUFRLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IsSUFBQyxDQUFBLHdCQUFqQixDQUFQO0FBQ0UsUUFBQSxJQUFBLEdBQU8sT0FBQSxDQUFRLFdBQVIsQ0FBUCxDQUFBO0FBQUEsUUFDQSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IsSUFBQyxDQUFBLHdCQUFqQixFQUEyQyxJQUFJLENBQUMsRUFBTCxD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

//# sourceURL=/Users/dawsonbotsford/.atom/packages/sync-settings/lib/tracker.coffee
