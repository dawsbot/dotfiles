(function() {
  module.exports = {
    createTempFileWithCode: function(code) {
      if (!/^[\s]*<\?php/.test(code)) {
        code = "<?php " + code;
      }
      return module.parent.exports.createTempFileWithCode(code);
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rhd3NvbmJvdHNmb3JkLy5hdG9tL3BhY2thZ2VzL3NjcmlwdC9saWIvZ3JhbW1hci11dGlscy9waHAuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBRUE7QUFBQSxFQUFBLE1BQU0sQ0FBQyxPQUFQLEdBTUU7QUFBQSxJQUFBLHNCQUFBLEVBQXdCLFNBQUMsSUFBRCxHQUFBO0FBQ3RCLE1BQUEsSUFBQSxDQUFBLGNBQTRDLENBQUMsSUFBZixDQUFvQixJQUFwQixDQUE5QjtBQUFBLFFBQUEsSUFBQSxHQUFRLFFBQUEsR0FBUSxJQUFoQixDQUFBO09BQUE7YUFDQSxNQUFNLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxzQkFBdEIsQ0FBNkMsSUFBN0MsRUFGc0I7SUFBQSxDQUF4QjtHQU5GLENBQUE7QUFBQSIKfQ==

//# sourceURL=/Users/dawsonbotsford/.atom/packages/script/lib/grammar-utils/php.coffee
