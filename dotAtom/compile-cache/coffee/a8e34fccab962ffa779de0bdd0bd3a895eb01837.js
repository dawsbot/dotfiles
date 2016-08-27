(function() {
  var fs, os, path, uuid;

  os = require('os');

  fs = require('fs');

  path = require('path');

  uuid = require('node-uuid');

  module.exports = {
    tempFilesDir: path.join(os.tmpdir(), 'atom_script_tempfiles'),
    createTempFileWithCode: function(code) {
      var error, file, tempFilePath;
      try {
        if (!fs.existsSync(this.tempFilesDir)) {
          fs.mkdirSync(this.tempFilesDir);
        }
        tempFilePath = this.tempFilesDir + path.sep + 'm' + uuid.v1().split('-').join('_') + '.m';
        file = fs.openSync(tempFilePath, 'w');
        fs.writeSync(file, code);
        fs.closeSync(file);
        return tempFilePath;
      } catch (_error) {
        error = _error;
        throw "Error while creating temporary file (" + error + ")";
      }
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rhd3NvbmJvdHNmb3JkLy5hdG9tL3BhY2thZ2VzL3NjcmlwdC9saWIvZ3JhbW1hci11dGlscy9tYXRsYWIuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQ0E7QUFBQSxNQUFBLGtCQUFBOztBQUFBLEVBQUEsRUFBQSxHQUFLLE9BQUEsQ0FBUSxJQUFSLENBQUwsQ0FBQTs7QUFBQSxFQUNBLEVBQUEsR0FBSyxPQUFBLENBQVEsSUFBUixDQURMLENBQUE7O0FBQUEsRUFFQSxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVIsQ0FGUCxDQUFBOztBQUFBLEVBR0EsSUFBQSxHQUFPLE9BQUEsQ0FBUSxXQUFSLENBSFAsQ0FBQTs7QUFBQSxFQU1BLE1BQU0sQ0FBQyxPQUFQLEdBQ0U7QUFBQSxJQUFBLFlBQUEsRUFBYyxJQUFJLENBQUMsSUFBTCxDQUFVLEVBQUUsQ0FBQyxNQUFILENBQUEsQ0FBVixFQUF1Qix1QkFBdkIsQ0FBZDtBQUFBLElBT0Esc0JBQUEsRUFBd0IsU0FBQyxJQUFELEdBQUE7QUFDdEIsVUFBQSx5QkFBQTtBQUFBO0FBQ0UsUUFBQSxJQUFBLENBQUEsRUFBcUMsQ0FBQyxVQUFILENBQWMsSUFBQyxDQUFBLFlBQWYsQ0FBbkM7QUFBQSxVQUFBLEVBQUUsQ0FBQyxTQUFILENBQWEsSUFBQyxDQUFBLFlBQWQsQ0FBQSxDQUFBO1NBQUE7QUFBQSxRQUVBLFlBQUEsR0FBZSxJQUFDLENBQUEsWUFBRCxHQUFnQixJQUFJLENBQUMsR0FBckIsR0FBMkIsR0FBM0IsR0FBaUMsSUFBSSxDQUFDLEVBQUwsQ0FBQSxDQUFTLENBQUMsS0FBVixDQUFnQixHQUFoQixDQUFvQixDQUFDLElBQXJCLENBQTBCLEdBQTFCLENBQWpDLEdBQW1FLElBRmxGLENBQUE7QUFBQSxRQUlBLElBQUEsR0FBTyxFQUFFLENBQUMsUUFBSCxDQUFZLFlBQVosRUFBMEIsR0FBMUIsQ0FKUCxDQUFBO0FBQUEsUUFLQSxFQUFFLENBQUMsU0FBSCxDQUFhLElBQWIsRUFBbUIsSUFBbkIsQ0FMQSxDQUFBO0FBQUEsUUFNQSxFQUFFLENBQUMsU0FBSCxDQUFhLElBQWIsQ0FOQSxDQUFBO2VBUUEsYUFURjtPQUFBLGNBQUE7QUFXRSxRQURJLGNBQ0osQ0FBQTtBQUFBLGNBQVEsdUNBQUEsR0FBdUMsS0FBdkMsR0FBNkMsR0FBckQsQ0FYRjtPQURzQjtJQUFBLENBUHhCO0dBUEYsQ0FBQTtBQUFBIgp9

//# sourceURL=/Users/dawsonbotsford/.atom/packages/script/lib/grammar-utils/matlab.coffee
