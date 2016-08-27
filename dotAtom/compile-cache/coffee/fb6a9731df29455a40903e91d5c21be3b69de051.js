(function() {
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
      return process.platform;
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rhd3NvbmJvdHNmb3JkLy5hdG9tL3BhY2thZ2VzL3NjcmlwdC9saWIvZ3JhbW1hci11dGlscy9vcGVyYXRpbmctc3lzdGVtLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUVBO0FBQUEsRUFBQSxNQUFNLENBQUMsT0FBUCxHQUNFO0FBQUEsSUFBQSxRQUFBLEVBQVUsU0FBQSxHQUFBO2FBQ1IsSUFBQyxDQUFBLFFBQUQsQ0FBQSxDQUFBLEtBQWUsU0FEUDtJQUFBLENBQVY7QUFBQSxJQUdBLFNBQUEsRUFBVyxTQUFBLEdBQUE7YUFDVCxJQUFDLENBQUEsUUFBRCxDQUFBLENBQUEsS0FBZSxRQUROO0lBQUEsQ0FIWDtBQUFBLElBTUEsT0FBQSxFQUFTLFNBQUEsR0FBQTthQUNQLElBQUMsQ0FBQSxRQUFELENBQUEsQ0FBQSxLQUFlLFFBRFI7SUFBQSxDQU5UO0FBQUEsSUFTQSxRQUFBLEVBQVUsU0FBQSxHQUFBO2FBQ1IsT0FBTyxDQUFDLFNBREE7SUFBQSxDQVRWO0dBREYsQ0FBQTtBQUFBIgp9

//# sourceURL=/Users/dawsonbotsford/.atom/packages/script/lib/grammar-utils/operating-system.coffee
