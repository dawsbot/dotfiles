(function() {
  var GrammarUtils;

  GrammarUtils = require('../../lib/grammar-utils');

  describe('GrammarUtils', function() {
    return describe('Lisp', function() {
      var toStatements;
      toStatements = GrammarUtils.Lisp.splitStatements;
      it('returns empty array for empty code', function() {
        var code;
        code = '';
        return expect(toStatements(code)).toEqual([]);
      });
      it('does not split single statement', function() {
        var code;
        code = '(print "dummy")';
        return expect(toStatements(code)).toEqual([code]);
      });
      it('splits two simple statements', function() {
        var code;
        code = '(print "dummy")(print "statement")';
        return expect(toStatements(code)).toEqual(['(print "dummy")', '(print "statement")']);
      });
      it('splits two simple statements in many lines', function() {
        var code;
        code = '(print "dummy")  \n\n  (print "statement")';
        return expect(toStatements(code)).toEqual(['(print "dummy")', '(print "statement")']);
      });
      it('does not split single line complex statement', function() {
        var code;
        code = '(when t(setq a 2)(+ i 1))';
        return expect(toStatements(code)).toEqual(['(when t(setq a 2)(+ i 1))']);
      });
      it('does not split multi line complex statement', function() {
        var code;
        code = '(when t(setq a 2)  \n \t (+ i 1))';
        return expect(toStatements(code)).toEqual(['(when t(setq a 2)  \n \t (+ i 1))']);
      });
      it('splits single line complex statements', function() {
        var code;
        code = '(when t(setq a 2)(+ i 1))(when t(setq a 5)(+ i 3))';
        return expect(toStatements(code)).toEqual(['(when t(setq a 2)(+ i 1))', '(when t(setq a 5)(+ i 3))']);
      });
      return it('splits multi line complex statements', function() {
        var code;
        code = '(when t(\nsetq a 2)(+ i 1))   \n\t (when t(\n\t  setq a 5)(+ i 3))';
        return expect(toStatements(code)).toEqual(['(when t(\nsetq a 2)(+ i 1))', '(when t(\n\t  setq a 5)(+ i 3))']);
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rhd3NvbmJvdHNmb3JkLy5hdG9tL3BhY2thZ2VzL3NjcmlwdC9zcGVjL2dyYW1tYXItdXRpbHMvbGlzcC1zcGVjLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxZQUFBOztBQUFBLEVBQUEsWUFBQSxHQUFlLE9BQUEsQ0FBUSx5QkFBUixDQUFmLENBQUE7O0FBQUEsRUFFQSxRQUFBLENBQVMsY0FBVCxFQUF5QixTQUFBLEdBQUE7V0FDdkIsUUFBQSxDQUFTLE1BQVQsRUFBaUIsU0FBQSxHQUFBO0FBQ2YsVUFBQSxZQUFBO0FBQUEsTUFBQSxZQUFBLEdBQWUsWUFBWSxDQUFDLElBQUksQ0FBQyxlQUFqQyxDQUFBO0FBQUEsTUFFQSxFQUFBLENBQUcsb0NBQUgsRUFBeUMsU0FBQSxHQUFBO0FBQ3ZDLFlBQUEsSUFBQTtBQUFBLFFBQUEsSUFBQSxHQUFPLEVBQVAsQ0FBQTtlQUNBLE1BQUEsQ0FBTyxZQUFBLENBQWEsSUFBYixDQUFQLENBQTBCLENBQUMsT0FBM0IsQ0FBbUMsRUFBbkMsRUFGdUM7TUFBQSxDQUF6QyxDQUZBLENBQUE7QUFBQSxNQU1BLEVBQUEsQ0FBRyxpQ0FBSCxFQUFzQyxTQUFBLEdBQUE7QUFDcEMsWUFBQSxJQUFBO0FBQUEsUUFBQSxJQUFBLEdBQU8saUJBQVAsQ0FBQTtlQUNBLE1BQUEsQ0FBTyxZQUFBLENBQWEsSUFBYixDQUFQLENBQTBCLENBQUMsT0FBM0IsQ0FBbUMsQ0FBQyxJQUFELENBQW5DLEVBRm9DO01BQUEsQ0FBdEMsQ0FOQSxDQUFBO0FBQUEsTUFVQSxFQUFBLENBQUcsOEJBQUgsRUFBbUMsU0FBQSxHQUFBO0FBQ2pDLFlBQUEsSUFBQTtBQUFBLFFBQUEsSUFBQSxHQUFPLG9DQUFQLENBQUE7ZUFDQSxNQUFBLENBQU8sWUFBQSxDQUFhLElBQWIsQ0FBUCxDQUEwQixDQUFDLE9BQTNCLENBQW1DLENBQUMsaUJBQUQsRUFBb0IscUJBQXBCLENBQW5DLEVBRmlDO01BQUEsQ0FBbkMsQ0FWQSxDQUFBO0FBQUEsTUFjQSxFQUFBLENBQUcsNENBQUgsRUFBaUQsU0FBQSxHQUFBO0FBQy9DLFlBQUEsSUFBQTtBQUFBLFFBQUEsSUFBQSxHQUFPLDRDQUFQLENBQUE7ZUFDQSxNQUFBLENBQU8sWUFBQSxDQUFhLElBQWIsQ0FBUCxDQUEwQixDQUFDLE9BQTNCLENBQW1DLENBQUMsaUJBQUQsRUFBb0IscUJBQXBCLENBQW5DLEVBRitDO01BQUEsQ0FBakQsQ0FkQSxDQUFBO0FBQUEsTUFrQkEsRUFBQSxDQUFHLDhDQUFILEVBQW1ELFNBQUEsR0FBQTtBQUNqRCxZQUFBLElBQUE7QUFBQSxRQUFBLElBQUEsR0FBTywyQkFBUCxDQUFBO2VBQ0EsTUFBQSxDQUFPLFlBQUEsQ0FBYSxJQUFiLENBQVAsQ0FBMEIsQ0FBQyxPQUEzQixDQUFtQyxDQUFDLDJCQUFELENBQW5DLEVBRmlEO01BQUEsQ0FBbkQsQ0FsQkEsQ0FBQTtBQUFBLE1Bc0JBLEVBQUEsQ0FBRyw2Q0FBSCxFQUFrRCxTQUFBLEdBQUE7QUFDaEQsWUFBQSxJQUFBO0FBQUEsUUFBQSxJQUFBLEdBQU8sbUNBQVAsQ0FBQTtlQUNBLE1BQUEsQ0FBTyxZQUFBLENBQWEsSUFBYixDQUFQLENBQTBCLENBQUMsT0FBM0IsQ0FBbUMsQ0FBQyxtQ0FBRCxDQUFuQyxFQUZnRDtNQUFBLENBQWxELENBdEJBLENBQUE7QUFBQSxNQTBCQSxFQUFBLENBQUcsdUNBQUgsRUFBNEMsU0FBQSxHQUFBO0FBQzFDLFlBQUEsSUFBQTtBQUFBLFFBQUEsSUFBQSxHQUFPLG9EQUFQLENBQUE7ZUFDQSxNQUFBLENBQU8sWUFBQSxDQUFhLElBQWIsQ0FBUCxDQUEwQixDQUFDLE9BQTNCLENBQW1DLENBQUMsMkJBQUQsRUFBOEIsMkJBQTlCLENBQW5DLEVBRjBDO01BQUEsQ0FBNUMsQ0ExQkEsQ0FBQTthQThCQSxFQUFBLENBQUcsc0NBQUgsRUFBMkMsU0FBQSxHQUFBO0FBQ3pDLFlBQUEsSUFBQTtBQUFBLFFBQUEsSUFBQSxHQUFPLG9FQUFQLENBQUE7ZUFDQSxNQUFBLENBQU8sWUFBQSxDQUFhLElBQWIsQ0FBUCxDQUEwQixDQUFDLE9BQTNCLENBQW1DLENBQUMsNkJBQUQsRUFBZ0MsaUNBQWhDLENBQW5DLEVBRnlDO01BQUEsQ0FBM0MsRUEvQmU7SUFBQSxDQUFqQixFQUR1QjtFQUFBLENBQXpCLENBRkEsQ0FBQTtBQUFBIgp9

//# sourceURL=/Users/dawsonbotsford/.atom/packages/script/spec/grammar-utils/lisp-spec.coffee
