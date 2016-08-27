(function() {
  module.exports = {
    createTempFileWithCode: (function(_this) {
      return function(code) {
        if (!/^[\s]*<\?php/.test(code)) {
          code = "<?php " + code;
        }
        return module.parent.exports.createTempFileWithCode(code);
      };
    })(this)
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rhd3NvbmJvdHNmb3JkLy5hdG9tL3BhY2thZ2VzL3NjcmlwdC9saWIvZ3JhbW1hci11dGlscy9waHAuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBRUE7QUFBQSxFQUFBLE1BQU0sQ0FBQyxPQUFQLEdBTUU7QUFBQSxJQUFBLHNCQUFBLEVBQXdCLENBQUEsU0FBQSxLQUFBLEdBQUE7YUFBQSxTQUFDLElBQUQsR0FBQTtBQUN0QixRQUFBLElBQUEsQ0FBQSxjQUE0QyxDQUFDLElBQWYsQ0FBb0IsSUFBcEIsQ0FBOUI7QUFBQSxVQUFBLElBQUEsR0FBUSxRQUFBLEdBQVEsSUFBaEIsQ0FBQTtTQUFBO2VBQ0EsTUFBTSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsc0JBQXRCLENBQTZDLElBQTdDLEVBRnNCO01BQUEsRUFBQTtJQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBeEI7R0FORixDQUFBO0FBQUEiCn0=

//# sourceURL=/Users/dawsonbotsford/.atom/packages/script/lib/grammar-utils/php.coffee
