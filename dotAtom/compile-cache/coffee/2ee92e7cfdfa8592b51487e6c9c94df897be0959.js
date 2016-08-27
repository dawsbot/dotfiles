(function() {
  var os;

  os = require('os');

  module.exports = {
    isDarwin: function() {
      return this.platform() === 'darwin';
    },
    isWindows: function() {
      return this.platform() === 'win32';
    },
    isLinux: function() {
      return this.platform() === 'linux';
    },
    platform: function() {
      return os.platform();
    },
    release: function() {
      return os.release();
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rhd3NvbmJvdHNmb3JkLy5hdG9tL3BhY2thZ2VzL3NjcmlwdC9saWIvZ3JhbW1hci11dGlscy9vcGVyYXRpbmctc3lzdGVtLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxFQUFBOztBQUFBLEVBQUEsRUFBQSxHQUFLLE9BQUEsQ0FBUSxJQUFSLENBQUwsQ0FBQTs7QUFBQSxFQUlBLE1BQU0sQ0FBQyxPQUFQLEdBQ0U7QUFBQSxJQUFBLFFBQUEsRUFBVSxTQUFBLEdBQUE7YUFDUixJQUFDLENBQUEsUUFBRCxDQUFBLENBQUEsS0FBZSxTQURQO0lBQUEsQ0FBVjtBQUFBLElBR0EsU0FBQSxFQUFXLFNBQUEsR0FBQTthQUNULElBQUMsQ0FBQSxRQUFELENBQUEsQ0FBQSxLQUFlLFFBRE47SUFBQSxDQUhYO0FBQUEsSUFNQSxPQUFBLEVBQVMsU0FBQSxHQUFBO2FBQ1AsSUFBQyxDQUFBLFFBQUQsQ0FBQSxDQUFBLEtBQWUsUUFEUjtJQUFBLENBTlQ7QUFBQSxJQVNBLFFBQUEsRUFBVSxTQUFBLEdBQUE7YUFDUixFQUFFLENBQUMsUUFBSCxDQUFBLEVBRFE7SUFBQSxDQVRWO0FBQUEsSUFZQSxPQUFBLEVBQVMsU0FBQSxHQUFBO2FBQ1AsRUFBRSxDQUFDLE9BQUgsQ0FBQSxFQURPO0lBQUEsQ0FaVDtHQUxGLENBQUE7QUFBQSIKfQ==

//# sourceURL=/Users/dawsonbotsford/.atom/packages/script/lib/grammar-utils/operating-system.coffee
