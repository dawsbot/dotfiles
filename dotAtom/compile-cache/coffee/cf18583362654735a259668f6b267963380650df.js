(function() {
  var PigmentsAPI;

  module.exports = PigmentsAPI = (function() {
    function PigmentsAPI(project) {
      this.project = project;
    }

    PigmentsAPI.prototype.getProject = function() {
      return this.project;
    };

    PigmentsAPI.prototype.getPalette = function() {
      return this.project.getPalette();
    };

    PigmentsAPI.prototype.getVariables = function() {
      return this.project.getVariables();
    };

    PigmentsAPI.prototype.getColorVariables = function() {
      return this.project.getColorVariables();
    };

    PigmentsAPI.prototype.observeColorBuffers = function(callback) {
      return this.project.observeColorBuffers(callback);
    };

    return PigmentsAPI;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rhd3NvbmJvdHNmb3JkLy5hdG9tL3BhY2thZ2VzL3BpZ21lbnRzL2xpYi9waWdtZW50cy1hcGkuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQ0E7QUFBQSxNQUFBLFdBQUE7O0FBQUEsRUFBQSxNQUFNLENBQUMsT0FBUCxHQUNNO0FBQ1MsSUFBQSxxQkFBRSxPQUFGLEdBQUE7QUFBWSxNQUFYLElBQUMsQ0FBQSxVQUFBLE9BQVUsQ0FBWjtJQUFBLENBQWI7O0FBQUEsMEJBRUEsVUFBQSxHQUFZLFNBQUEsR0FBQTthQUFHLElBQUMsQ0FBQSxRQUFKO0lBQUEsQ0FGWixDQUFBOztBQUFBLDBCQUlBLFVBQUEsR0FBWSxTQUFBLEdBQUE7YUFBRyxJQUFDLENBQUEsT0FBTyxDQUFDLFVBQVQsQ0FBQSxFQUFIO0lBQUEsQ0FKWixDQUFBOztBQUFBLDBCQU1BLFlBQUEsR0FBYyxTQUFBLEdBQUE7YUFBRyxJQUFDLENBQUEsT0FBTyxDQUFDLFlBQVQsQ0FBQSxFQUFIO0lBQUEsQ0FOZCxDQUFBOztBQUFBLDBCQVFBLGlCQUFBLEdBQW1CLFNBQUEsR0FBQTthQUFHLElBQUMsQ0FBQSxPQUFPLENBQUMsaUJBQVQsQ0FBQSxFQUFIO0lBQUEsQ0FSbkIsQ0FBQTs7QUFBQSwwQkFVQSxtQkFBQSxHQUFxQixTQUFDLFFBQUQsR0FBQTthQUFjLElBQUMsQ0FBQSxPQUFPLENBQUMsbUJBQVQsQ0FBNkIsUUFBN0IsRUFBZDtJQUFBLENBVnJCLENBQUE7O3VCQUFBOztNQUZGLENBQUE7QUFBQSIKfQ==

//# sourceURL=/Users/dawsonbotsford/.atom/packages/pigments/lib/pigments-api.coffee
