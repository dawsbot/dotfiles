(function() {
  var OutputView, view;

  OutputView = require('./views/output-view');

  view = null;

  module.exports = {
    "new": function() {
      if (view != null) {
        view.reset();
      }
      return this.getView();
    },
    getView: function() {
      if (view === null) {
        view = new OutputView;
        atom.workspace.addBottomPanel({
          item: view
        });
        view.hide();
      }
      return view;
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rhd3NvbmJvdHNmb3JkLy5hdG9tL3BhY2thZ2VzL2dpdC1wbHVzL2xpYi9vdXRwdXQtdmlldy1tYW5hZ2VyLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxnQkFBQTs7QUFBQSxFQUFBLFVBQUEsR0FBYSxPQUFBLENBQVEscUJBQVIsQ0FBYixDQUFBOztBQUFBLEVBRUEsSUFBQSxHQUFPLElBRlAsQ0FBQTs7QUFBQSxFQUdBLE1BQU0sQ0FBQyxPQUFQLEdBQ0U7QUFBQSxJQUFBLEtBQUEsRUFBSyxTQUFBLEdBQUE7O1FBQ0gsSUFBSSxDQUFFLEtBQU4sQ0FBQTtPQUFBO2FBQ0EsSUFBQyxDQUFBLE9BQUQsQ0FBQSxFQUZHO0lBQUEsQ0FBTDtBQUFBLElBSUEsT0FBQSxFQUFTLFNBQUEsR0FBQTtBQUNQLE1BQUEsSUFBRyxJQUFBLEtBQVEsSUFBWDtBQUNFLFFBQUEsSUFBQSxHQUFPLEdBQUEsQ0FBQSxVQUFQLENBQUE7QUFBQSxRQUNBLElBQUksQ0FBQyxTQUFTLENBQUMsY0FBZixDQUE4QjtBQUFBLFVBQUEsSUFBQSxFQUFNLElBQU47U0FBOUIsQ0FEQSxDQUFBO0FBQUEsUUFFQSxJQUFJLENBQUMsSUFBTCxDQUFBLENBRkEsQ0FERjtPQUFBO2FBSUEsS0FMTztJQUFBLENBSlQ7R0FKRixDQUFBO0FBQUEiCn0=

//# sourceURL=/Users/dawsonbotsford/.atom/packages/git-plus/lib/output-view-manager.coffee
