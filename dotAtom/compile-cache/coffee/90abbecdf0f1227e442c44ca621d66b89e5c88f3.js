(function() {
  var args, coffee, e, execSync;

  execSync = require('child_process').execSync;

  args = ['-e'];

  try {
    coffee = execSync('coffee -h');
    if (coffee.toString().match(/--cli/)) {
      args.push('--cli');
    }
  } catch (_error) {
    e = _error;
    console.error('unable to find coffee');
  }

  exports.args = args;

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rhd3NvbmJvdHNmb3JkLy5hdG9tL3BhY2thZ2VzL3NjcmlwdC9saWIvZ3JhbW1hci11dGlscy9jb2ZmZWUtc2NyaXB0LWNvbXBpbGVyLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUVBO0FBQUEsTUFBQSx5QkFBQTs7QUFBQSxFQUFDLFdBQVksT0FBQSxDQUFRLGVBQVIsRUFBWixRQUFELENBQUE7O0FBQUEsRUFFQSxJQUFBLEdBQU8sQ0FBQyxJQUFELENBRlAsQ0FBQTs7QUFHQTtBQUNFLElBQUEsTUFBQSxHQUFTLFFBQUEsQ0FBUyxXQUFULENBQVQsQ0FBQTtBQUNBLElBQUEsSUFBRyxNQUFNLENBQUMsUUFBUCxDQUFBLENBQWlCLENBQUMsS0FBbEIsQ0FBd0IsT0FBeEIsQ0FBSDtBQUNFLE1BQUEsSUFBSSxDQUFDLElBQUwsQ0FBVSxPQUFWLENBQUEsQ0FERjtLQUZGO0dBQUEsY0FBQTtBQUtFLElBREksVUFDSixDQUFBO0FBQUEsSUFBQSxPQUFPLENBQUMsS0FBUixDQUFjLHVCQUFkLENBQUEsQ0FMRjtHQUhBOztBQUFBLEVBVUEsT0FBTyxDQUFDLElBQVIsR0FBZSxJQVZmLENBQUE7QUFBQSIKfQ==

//# sourceURL=/Users/dawsonbotsford/.atom/packages/script/lib/grammar-utils/coffee-script-compiler.coffee
