(function() {
  var arrayEquals, objectEquals,
    __slice = [].slice;

  arrayEquals = function(arr1, arr2) {
    return arr1.forEach(function(a, i) {
      return expect(a).toEqual(arr2[i]);
    });
  };

  objectEquals = function(o1, o2) {
    return Object.keys(o1).forEach(function(prop) {
      return expect(o1[prop]).toEqual(o2[prop]);
    });
  };

  module.exports = function(obj, fn) {
    var mock, spy;
    spy = spyOn(obj, fn);
    return mock = {
      "do": function(method) {
        spy.andCallFake(method);
        return mock;
      },
      verifyCalledWith: function() {
        var args, calledWith;
        args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
        calledWith = spy.mostRecentCall.args;
        return args.forEach(function(arg, i) {
          if (arg.forEach != null) {
            arrayEquals(arg, calledWith[i]);
          }
          if (arg.charAt != null) {
            return expect(arg).toEqual(calledWith[i]);
          } else {
            return objectEquals(arg, calledWith[i]);
          }
        });
      }
    };
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rhd3NvbmJvdHNmb3JkLy5hdG9tL3BhY2thZ2VzL2dpdC1wbHVzL3NwZWMvbW9jay5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEseUJBQUE7SUFBQSxrQkFBQTs7QUFBQSxFQUFBLFdBQUEsR0FBYyxTQUFDLElBQUQsRUFBTyxJQUFQLEdBQUE7V0FDWixJQUFJLENBQUMsT0FBTCxDQUFhLFNBQUMsQ0FBRCxFQUFJLENBQUosR0FBQTthQUNYLE1BQUEsQ0FBTyxDQUFQLENBQVMsQ0FBQyxPQUFWLENBQWtCLElBQUssQ0FBQSxDQUFBLENBQXZCLEVBRFc7SUFBQSxDQUFiLEVBRFk7RUFBQSxDQUFkLENBQUE7O0FBQUEsRUFJQSxZQUFBLEdBQWUsU0FBQyxFQUFELEVBQUssRUFBTCxHQUFBO1dBQ2IsTUFBTSxDQUFDLElBQVAsQ0FBWSxFQUFaLENBQWUsQ0FBQyxPQUFoQixDQUF3QixTQUFDLElBQUQsR0FBQTthQUN0QixNQUFBLENBQU8sRUFBRyxDQUFBLElBQUEsQ0FBVixDQUFnQixDQUFDLE9BQWpCLENBQXlCLEVBQUcsQ0FBQSxJQUFBLENBQTVCLEVBRHNCO0lBQUEsQ0FBeEIsRUFEYTtFQUFBLENBSmYsQ0FBQTs7QUFBQSxFQVFBLE1BQU0sQ0FBQyxPQUFQLEdBQWlCLFNBQUMsR0FBRCxFQUFNLEVBQU4sR0FBQTtBQUNmLFFBQUEsU0FBQTtBQUFBLElBQUEsR0FBQSxHQUFNLEtBQUEsQ0FBTSxHQUFOLEVBQVcsRUFBWCxDQUFOLENBQUE7QUFDQSxXQUFPLElBQUEsR0FDTDtBQUFBLE1BQUEsSUFBQSxFQUFJLFNBQUMsTUFBRCxHQUFBO0FBQ0YsUUFBQSxHQUFHLENBQUMsV0FBSixDQUFnQixNQUFoQixDQUFBLENBQUE7QUFDQSxlQUFPLElBQVAsQ0FGRTtNQUFBLENBQUo7QUFBQSxNQUdBLGdCQUFBLEVBQWtCLFNBQUEsR0FBQTtBQUNoQixZQUFBLGdCQUFBO0FBQUEsUUFEaUIsOERBQ2pCLENBQUE7QUFBQSxRQUFBLFVBQUEsR0FBYSxHQUFHLENBQUMsY0FBYyxDQUFDLElBQWhDLENBQUE7ZUFDQSxJQUFJLENBQUMsT0FBTCxDQUFhLFNBQUMsR0FBRCxFQUFNLENBQU4sR0FBQTtBQUNYLFVBQUEsSUFBRyxtQkFBSDtBQUNFLFlBQUEsV0FBQSxDQUFZLEdBQVosRUFBaUIsVUFBVyxDQUFBLENBQUEsQ0FBNUIsQ0FBQSxDQURGO1dBQUE7QUFFQSxVQUFBLElBQUcsa0JBQUg7bUJBQ0UsTUFBQSxDQUFPLEdBQVAsQ0FBVyxDQUFDLE9BQVosQ0FBb0IsVUFBVyxDQUFBLENBQUEsQ0FBL0IsRUFERjtXQUFBLE1BQUE7bUJBR0UsWUFBQSxDQUFhLEdBQWIsRUFBa0IsVUFBVyxDQUFBLENBQUEsQ0FBN0IsRUFIRjtXQUhXO1FBQUEsQ0FBYixFQUZnQjtNQUFBLENBSGxCO0tBREYsQ0FGZTtFQUFBLENBUmpCLENBQUE7QUFBQSIKfQ==

//# sourceURL=/Users/dawsonbotsford/.atom/packages/git-plus/spec/mock.coffee
