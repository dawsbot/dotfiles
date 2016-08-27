(function() {
  var CompositeDisposable, LineNumberView;

  LineNumberView = require('./line-number-view');

  CompositeDisposable = require('atom').CompositeDisposable;

  module.exports = {
    config: {
      trueNumberCurrentLine: {
        type: 'boolean',
        "default": true,
        description: 'Show the true number on the current line'
      },
      showAbsoluteNumbers: {
        type: 'boolean',
        "default": false,
        description: 'Show absolute line numbers too?'
      },
      startAtOne: {
        type: 'boolean',
        "default": false,
        description: 'Start relative line numbering at one'
      }
    },
    configDefaults: {
      trueNumberCurrentLine: true,
      showAbsoluteNumbers: false,
      startAtOne: false
    },
    subscriptions: null,
    activate: function(state) {
      this.subscriptions = new CompositeDisposable;
      return this.subscriptions.add(atom.workspace.observeTextEditors(function(editor) {
        if (!editor.gutterWithName('relative-numbers')) {
          return new LineNumberView(editor);
        }
      }));
    },
    deactivate: function() {
      var editor, _i, _len, _ref, _ref1, _results;
      this.subscriptions.dispose();
      _ref = atom.workspace.getTextEditors();
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        editor = _ref[_i];
        _results.push((_ref1 = editor.gutterWithName('relative-numbers').view) != null ? _ref1.destroy() : void 0);
      }
      return _results;
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rhd3NvbmJvdHNmb3JkLy5hdG9tL3BhY2thZ2VzL3JlbGF0aXZlLW51bWJlcnMvbGliL3JlbGF0aXZlLW51bWJlcnMuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLG1DQUFBOztBQUFBLEVBQUEsY0FBQSxHQUFpQixPQUFBLENBQVEsb0JBQVIsQ0FBakIsQ0FBQTs7QUFBQSxFQUNDLHNCQUF1QixPQUFBLENBQVEsTUFBUixFQUF2QixtQkFERCxDQUFBOztBQUFBLEVBR0EsTUFBTSxDQUFDLE9BQVAsR0FFRTtBQUFBLElBQUEsTUFBQSxFQUNFO0FBQUEsTUFBQSxxQkFBQSxFQUNFO0FBQUEsUUFBQSxJQUFBLEVBQU0sU0FBTjtBQUFBLFFBQ0EsU0FBQSxFQUFTLElBRFQ7QUFBQSxRQUVBLFdBQUEsRUFBYSwwQ0FGYjtPQURGO0FBQUEsTUFJQSxtQkFBQSxFQUNFO0FBQUEsUUFBQSxJQUFBLEVBQU0sU0FBTjtBQUFBLFFBQ0EsU0FBQSxFQUFTLEtBRFQ7QUFBQSxRQUVBLFdBQUEsRUFBYSxpQ0FGYjtPQUxGO0FBQUEsTUFRQSxVQUFBLEVBQ0U7QUFBQSxRQUFBLElBQUEsRUFBTSxTQUFOO0FBQUEsUUFDQSxTQUFBLEVBQVMsS0FEVDtBQUFBLFFBRUEsV0FBQSxFQUFhLHNDQUZiO09BVEY7S0FERjtBQUFBLElBY0EsY0FBQSxFQUNFO0FBQUEsTUFBQSxxQkFBQSxFQUF1QixJQUF2QjtBQUFBLE1BQ0EsbUJBQUEsRUFBcUIsS0FEckI7QUFBQSxNQUVBLFVBQUEsRUFBWSxLQUZaO0tBZkY7QUFBQSxJQW1CQSxhQUFBLEVBQWUsSUFuQmY7QUFBQSxJQXFCQSxRQUFBLEVBQVUsU0FBQyxLQUFELEdBQUE7QUFDUixNQUFBLElBQUMsQ0FBQSxhQUFELEdBQWlCLEdBQUEsQ0FBQSxtQkFBakIsQ0FBQTthQUNBLElBQUMsQ0FBQSxhQUFhLENBQUMsR0FBZixDQUFtQixJQUFJLENBQUMsU0FBUyxDQUFDLGtCQUFmLENBQWtDLFNBQUMsTUFBRCxHQUFBO0FBQ25ELFFBQUEsSUFBRyxDQUFBLE1BQVUsQ0FBQyxjQUFQLENBQXNCLGtCQUF0QixDQUFQO2lCQUNNLElBQUEsY0FBQSxDQUFlLE1BQWYsRUFETjtTQURtRDtNQUFBLENBQWxDLENBQW5CLEVBRlE7SUFBQSxDQXJCVjtBQUFBLElBMkJBLFVBQUEsRUFBWSxTQUFBLEdBQUE7QUFDVixVQUFBLHVDQUFBO0FBQUEsTUFBQSxJQUFDLENBQUEsYUFBYSxDQUFDLE9BQWYsQ0FBQSxDQUFBLENBQUE7QUFDQTtBQUFBO1dBQUEsMkNBQUE7MEJBQUE7QUFDRSw4RkFBOEMsQ0FBRSxPQUFoRCxDQUFBLFdBQUEsQ0FERjtBQUFBO3NCQUZVO0lBQUEsQ0EzQlo7R0FMRixDQUFBO0FBQUEiCn0=

//# sourceURL=/Users/dawsonbotsford/.atom/packages/relative-numbers/lib/relative-numbers.coffee
