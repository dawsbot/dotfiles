(function() {
  var CompositeDisposable, EventsDelegation, StickyTitle;

  CompositeDisposable = require('atom').CompositeDisposable;

  EventsDelegation = require('atom-utils').EventsDelegation;

  module.exports = StickyTitle = (function() {
    EventsDelegation.includeInto(StickyTitle);

    function StickyTitle(stickies, scrollContainer) {
      this.stickies = stickies;
      this.scrollContainer = scrollContainer;
      this.subscriptions = new CompositeDisposable;
      Array.prototype.forEach.call(this.stickies, function(sticky) {
        sticky.parentNode.style.height = sticky.offsetHeight + 'px';
        return sticky.style.width = sticky.offsetWidth + 'px';
      });
      this.subscriptions.add(this.subscribeTo(this.scrollContainer, {
        'scroll': (function(_this) {
          return function(e) {
            return _this.scroll(e);
          };
        })(this)
      }));
    }

    StickyTitle.prototype.dispose = function() {
      this.subscriptions.dispose();
      this.stickies = null;
      return this.scrollContainer = null;
    };

    StickyTitle.prototype.scroll = function(e) {
      var delta;
      delta = this.lastScrollTop ? this.lastScrollTop - this.scrollContainer.scrollTop : 0;
      Array.prototype.forEach.call(this.stickies, (function(_this) {
        return function(sticky, i) {
          var nextSticky, nextTop, parentTop, prevSticky, prevTop, scrollTop, top;
          nextSticky = _this.stickies[i + 1];
          prevSticky = _this.stickies[i - 1];
          scrollTop = _this.scrollContainer.getBoundingClientRect().top;
          parentTop = sticky.parentNode.getBoundingClientRect().top;
          top = sticky.getBoundingClientRect().top;
          if (parentTop < scrollTop) {
            if (!sticky.classList.contains('absolute')) {
              sticky.classList.add('fixed');
              sticky.style.top = scrollTop + 'px';
              if (nextSticky != null) {
                nextTop = nextSticky.parentNode.getBoundingClientRect().top;
                if (top + sticky.offsetHeight >= nextTop) {
                  sticky.classList.add('absolute');
                  return sticky.style.top = _this.scrollContainer.scrollTop + 'px';
                }
              }
            }
          } else {
            sticky.classList.remove('fixed');
            if ((prevSticky != null) && prevSticky.classList.contains('absolute')) {
              prevTop = prevSticky.getBoundingClientRect().top;
              if (delta < 0) {
                prevTop -= prevSticky.offsetHeight;
              }
              if (scrollTop <= prevTop) {
                prevSticky.classList.remove('absolute');
                return prevSticky.style.top = scrollTop + 'px';
              }
            }
          }
        };
      })(this));
      return this.lastScrollTop = this.scrollContainer.scrollTop;
    };

    return StickyTitle;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rhd3NvbmJvdHNmb3JkLy5hdG9tL3BhY2thZ2VzL3BpZ21lbnRzL2xpYi9zdGlja3ktdGl0bGUuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLGtEQUFBOztBQUFBLEVBQUMsc0JBQXVCLE9BQUEsQ0FBUSxNQUFSLEVBQXZCLG1CQUFELENBQUE7O0FBQUEsRUFDQyxtQkFBb0IsT0FBQSxDQUFRLFlBQVIsRUFBcEIsZ0JBREQsQ0FBQTs7QUFBQSxFQUdBLE1BQU0sQ0FBQyxPQUFQLEdBRU07QUFDSixJQUFBLGdCQUFnQixDQUFDLFdBQWpCLENBQTZCLFdBQTdCLENBQUEsQ0FBQTs7QUFFYSxJQUFBLHFCQUFFLFFBQUYsRUFBYSxlQUFiLEdBQUE7QUFDWCxNQURZLElBQUMsQ0FBQSxXQUFBLFFBQ2IsQ0FBQTtBQUFBLE1BRHVCLElBQUMsQ0FBQSxrQkFBQSxlQUN4QixDQUFBO0FBQUEsTUFBQSxJQUFDLENBQUEsYUFBRCxHQUFpQixHQUFBLENBQUEsbUJBQWpCLENBQUE7QUFBQSxNQUNBLEtBQUssQ0FBQSxTQUFFLENBQUEsT0FBTyxDQUFDLElBQWYsQ0FBb0IsSUFBQyxDQUFBLFFBQXJCLEVBQStCLFNBQUMsTUFBRCxHQUFBO0FBQzdCLFFBQUEsTUFBTSxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsTUFBeEIsR0FBaUMsTUFBTSxDQUFDLFlBQVAsR0FBc0IsSUFBdkQsQ0FBQTtlQUNBLE1BQU0sQ0FBQyxLQUFLLENBQUMsS0FBYixHQUFxQixNQUFNLENBQUMsV0FBUCxHQUFxQixLQUZiO01BQUEsQ0FBL0IsQ0FEQSxDQUFBO0FBQUEsTUFLQSxJQUFDLENBQUEsYUFBYSxDQUFDLEdBQWYsQ0FBbUIsSUFBQyxDQUFBLFdBQUQsQ0FBYSxJQUFDLENBQUEsZUFBZCxFQUErQjtBQUFBLFFBQUEsUUFBQSxFQUFV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

//# sourceURL=/Users/dawsonbotsford/.atom/packages/pigments/lib/sticky-title.coffee
