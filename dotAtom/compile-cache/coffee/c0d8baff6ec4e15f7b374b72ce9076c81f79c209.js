(function() {
  var OutputView, create, getView, view;

  OutputView = require('./views/output-view');

  view = null;

  getView = function() {
    if (view === null) {
      view = new OutputView;
      atom.workspace.addBottomPanel({
        item: view
      });
      view.hide();
    }
    return view;
  };

  create = function() {
    if (view != null) {
      view.reset();
    }
    return getView();
  };

  module.exports = {
    create: create,
    getView: getView
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rhd3NvbmJvdHNmb3JkLy5hdG9tL3BhY2thZ2VzL2dpdC1wbHVzL2xpYi9vdXRwdXQtdmlldy1tYW5hZ2VyLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxpQ0FBQTs7QUFBQSxFQUFBLFVBQUEsR0FBYSxPQUFBLENBQVEscUJBQVIsQ0FBYixDQUFBOztBQUFBLEVBRUEsSUFBQSxHQUFPLElBRlAsQ0FBQTs7QUFBQSxFQUlBLE9BQUEsR0FBVSxTQUFBLEdBQUE7QUFDUixJQUFBLElBQUcsSUFBQSxLQUFRLElBQVg7QUFDRSxNQUFBLElBQUEsR0FBTyxHQUFBLENBQUEsVUFBUCxDQUFBO0FBQUEsTUFDQSxJQUFJLENBQUMsU0FBUyxDQUFDLGNBQWYsQ0FBOEI7QUFBQSxRQUFBLElBQUEsRUFBTSxJQUFOO09BQTlCLENBREEsQ0FBQTtBQUFBLE1BRUEsSUFBSSxDQUFDLElBQUwsQ0FBQSxDQUZBLENBREY7S0FBQTtXQUlBLEtBTFE7RUFBQSxDQUpWLENBQUE7O0FBQUEsRUFXQSxNQUFBLEdBQVMsU0FBQSxHQUFBOztNQUNQLElBQUksQ0FBRSxLQUFOLENBQUE7S0FBQTtXQUNBLE9BQUEsQ0FBQSxFQUZPO0VBQUEsQ0FYVCxDQUFBOztBQUFBLEVBZUEsTUFBTSxDQUFDLE9BQVAsR0FBaUI7QUFBQSxJQUFDLFFBQUEsTUFBRDtBQUFBLElBQVMsU0FBQSxPQUFUO0dBZmpCLENBQUE7QUFBQSIKfQ==

//# sourceURL=/Users/dawsonbotsford/.atom/packages/git-plus/lib/output-view-manager.coffee
