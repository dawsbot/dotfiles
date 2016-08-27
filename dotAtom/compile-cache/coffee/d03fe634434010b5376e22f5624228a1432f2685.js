(function() {
  var CliStatus;

  CliStatus = require('../lib/cli-status');

  describe("CliStatus", function() {
    var activationPromise;
    activationPromise = null;
    beforeEach(function() {
      atom.workspaceView = new WorkspaceView;
      return activationPromise = atom.packages.activatePackage('cliStatus');
    });
    describe("when the cli-status:toggle event is triggered", function() {
      return it("attaches and then detaches the view", function() {
        expect(atom.workspaceView.find('.cli-status')).not.toExist();
        atom.workspaceView.trigger('cli-status:toggle');
        waitsForPromise(function() {
          return activationPromise;
        });
        return runs(function() {
          expect(atom.workspaceView.find('.cli-status')).toExist();
          atom.workspaceView.trigger('cli-status:toggle');
          return expect(atom.workspaceView.find('.cli-status')).not.toExist();
        });
      });
    });
    return describe("when cli-status is activated", function() {
      it("should have configuration set up with defaults");
      waitsForPromise(function() {
        return activationPromise;
      });
      return runs(function() {
        return expect(atom.config.get('terminal-status.WindowHeight')).toBe(300);
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rhd3NvbmJvdHNmb3JkLy5hdG9tL3BhY2thZ2VzL3Rlcm1pbmFsLXN0YXR1cy9zcGVjL2NsaS1zdGF0dXMtc3BlYy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsU0FBQTs7QUFBQSxFQUFBLFNBQUEsR0FBWSxPQUFBLENBQVEsbUJBQVIsQ0FBWixDQUFBOztBQUFBLEVBT0EsUUFBQSxDQUFTLFdBQVQsRUFBc0IsU0FBQSxHQUFBO0FBQ3BCLFFBQUEsaUJBQUE7QUFBQSxJQUFBLGlCQUFBLEdBQW9CLElBQXBCLENBQUE7QUFBQSxJQUVBLFVBQUEsQ0FBVyxTQUFBLEdBQUE7QUFDVCxNQUFBLElBQUksQ0FBQyxhQUFMLEdBQXFCLEdBQUEsQ0FBQSxhQUFyQixDQUFBO2FBQ0EsaUJBQUEsR0FBb0IsSUFBSSxDQUFDLFFBQVEsQ0FBQyxlQUFkLENBQThCLFdBQTlCLEVBRlg7SUFBQSxDQUFYLENBRkEsQ0FBQTtBQUFBLElBTUEsUUFBQSxDQUFTLCtDQUFULEVBQTBELFNBQUEsR0FBQTthQUN4RCxFQUFBLENBQUcscUNBQUgsRUFBMEMsU0FBQSxHQUFBO0FBQ3hDLFFBQUEsTUFBQSxDQUFPLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBbkIsQ0FBd0IsYUFBeEIsQ0FBUCxDQUE4QyxDQUFDLEdBQUcsQ0FBQyxPQUFuRCxDQUFBLENBQUEsQ0FBQTtBQUFBLFFBSUEsSUFBSSxDQUFDLGFBQWEsQ0FBQyxPQUFuQixDQUEyQixtQkFBM0IsQ0FKQSxDQUFBO0FBQUEsUUFNQSxlQUFBLENBQWdCLFNBQUEsR0FBQTtpQkFDZCxrQkFEYztRQUFBLENBQWhCLENBTkEsQ0FBQTtlQVNBLElBQUEsQ0FBSyxTQUFBLEdBQUE7QUFDSCxVQUFBLE1BQUEsQ0FBTyxJQUFJLENBQUMsYUFBYSxDQUFDLElBQW5CLENBQXdCLGFBQXhCLENBQVAsQ0FBOEMsQ0FBQyxPQUEvQyxDQUFBLENBQUEsQ0FBQTtBQUFBLFVBQ0EsSUFBSSxDQUFDLGFBQWEsQ0FBQyxPQUFuQixDQUEyQixtQkFBM0IsQ0FEQSxDQUFBO2lCQUVBLE1BQUEsQ0FBTyxJQUFJLENBQUMsYUFBYSxDQUFDLElBQW5CLENBQXdCLGFBQXhCLENBQVAsQ0FBOEMsQ0FBQyxHQUFHLENBQUMsT0FBbkQsQ0FBQSxFQUhHO1FBQUEsQ0FBTCxFQVZ3QztNQUFBLENBQTFDLEVBRHdEO0lBQUEsQ0FBMUQsQ0FOQSxDQUFBO1dBc0JBLFFBQUEsQ0FBUyw4QkFBVCxFQUF5QyxTQUFBLEdBQUE7QUFDdkMsTUFBQSxFQUFBLENBQUcsZ0RBQUgsQ0FBQSxDQUFBO0FBQUEsTUFFQSxlQUFBLENBQWdCLFNBQUEsR0FBQTtlQUNkLGtCQURjO01BQUEsQ0FBaEIsQ0FGQSxDQUFBO2FBS0EsSUFBQSxDQUFLLFNBQUEsR0FBQTtlQUNELE1BQUEsQ0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IsOEJBQWhCLENBQVAsQ0FBdUQsQ0FBQyxJQUF4RCxDQUE2RCxHQUE3RCxFQURDO01BQUEsQ0FBTCxFQU51QztJQUFBLENBQXpDLEVBdkJvQjtFQUFBLENBQXRCLENBUEEsQ0FBQTtBQUFBIgp9

//# sourceURL=/Users/dawsonbotsford/.atom/packages/terminal-status/spec/cli-status-spec.coffee
