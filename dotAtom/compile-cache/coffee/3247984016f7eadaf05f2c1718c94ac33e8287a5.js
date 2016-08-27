(function() {
  var crypto, fs, shasum;

  crypto = require('crypto');

  fs = require('fs');

  console.log("Let's hash these bugs out");

  shasum = crypto.createHash('sha1');

  shasum.update('I like it when you sum.');

  console.log(shasum.digest('hex'));

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rhd3NvbmJvdHNmb3JkLy5hdG9tL3BhY2thZ2VzL3NjcmlwdC9leGFtcGxlcy9oYXNoaWUuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLGtCQUFBOztBQUFBLEVBQUEsTUFBQSxHQUFTLE9BQUEsQ0FBUSxRQUFSLENBQVQsQ0FBQTs7QUFBQSxFQUNBLEVBQUEsR0FBSyxPQUFBLENBQVEsSUFBUixDQURMLENBQUE7O0FBQUEsRUFHQSxPQUFPLENBQUMsR0FBUixDQUFZLDJCQUFaLENBSEEsQ0FBQTs7QUFBQSxFQUtBLE1BQUEsR0FBUyxNQUFNLENBQUMsVUFBUCxDQUFrQixNQUFsQixDQUxULENBQUE7O0FBQUEsRUFNQSxNQUFNLENBQUMsTUFBUCxDQUFjLHlCQUFkLENBTkEsQ0FBQTs7QUFBQSxFQU9BLE9BQU8sQ0FBQyxHQUFSLENBQVksTUFBTSxDQUFDLE1BQVAsQ0FBYyxLQUFkLENBQVosQ0FQQSxDQUFBO0FBQUEiCn0=

//# sourceURL=/Users/dawsonbotsford/.atom/packages/script/examples/hashie.coffee
