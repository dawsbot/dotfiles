Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.activate = activate;
exports.provideLinter = provideLinter;

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

var _atom = require('atom');

var _jsonlint = require('jsonlint');

var jsonlint = _interopRequireWildcard(_jsonlint);

'use babel';

var regex = '.+?line\\s(\\d+)';

function activate() {
  require('atom-package-deps').install('linter-jsonlint');
}

function provideLinter() {
  return {
    name: 'JSON Lint',
    grammarScopes: ['source.json'],
    scope: 'file',
    lintOnFly: true,
    lint: function lint(editor) {
      var path = editor.getPath();
      var text = editor.getText();

      try {
        jsonlint.parse(text);
      } catch (error) {
        var message = error.message;
        var line = Number(message.match(regex)[1]);
        var column = 0;

        return Promise.resolve([{
          type: 'Error',
          text: error.message,
          filePath: path,
          range: new _atom.Range([line, column], [line, column + 1])
        }]);
      }

      return Promise.resolve([]);
    }
  };
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9kYXdzb25ib3RzZm9yZC8uYXRvbS9wYWNrYWdlcy9saW50ZXItanNvbmxpbnQvbGliL2luZGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O29CQUVzQixNQUFNOzt3QkFDRixVQUFVOztJQUF4QixRQUFROztBQUhwQixXQUFXLENBQUM7O0FBS1osSUFBTSxLQUFLLEdBQUcsa0JBQWtCLENBQUM7O0FBRTFCLFNBQVMsUUFBUSxHQUFHO0FBQ3pCLFNBQU8sQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO0NBQ3pEOztBQUVNLFNBQVMsYUFBYSxHQUFHO0FBQzlCLFNBQU87QUFDTCxRQUFJLEVBQUUsV0FBVztBQUNqQixpQkFBYSxFQUFFLENBQUMsYUFBYSxDQUFDO0FBQzlCLFNBQUssRUFBRSxNQUFNO0FBQ2IsYUFBUyxFQUFFLElBQUk7QUFDZixRQUFJLEVBQUUsY0FBQSxNQUFNLEVBQUk7QUFDZCxVQUFNLElBQUksR0FBRyxNQUFNLENBQUMsT0FBTyxFQUFFLENBQUM7QUFDOUIsVUFBTSxJQUFJLEdBQUcsTUFBTSxDQUFDLE9BQU8sRUFBRSxDQUFDOztBQUU5QixVQUFJO0FBQ0YsZ0JBQVEsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7T0FDdEIsQ0FBQyxPQUFPLEtBQUssRUFBRTtBQUNkLFlBQU0sT0FBTyxHQUFHLEtBQUssQ0FBQyxPQUFPLENBQUM7QUFDOUIsWUFBTSxJQUFJLEdBQUcsTUFBTSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUM3QyxZQUFNLE1BQU0sR0FBRyxDQUFDLENBQUM7O0FBRWpCLGVBQU8sT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBQ3RCLGNBQUksRUFBRSxPQUFPO0FBQ2IsY0FBSSxFQUFFLEtBQUssQ0FBQyxPQUFPO0FBQ25CLGtCQUFRLEVBQUUsSUFBSTtBQUNkLGVBQUssRUFBRSxnQkFBVSxDQUFDLElBQUksRUFBRSxNQUFNLENBQUMsRUFBRSxDQUFDLElBQUksRUFBRSxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUM7U0FDckQsQ0FBQyxDQUFDLENBQUM7T0FDTDs7QUFFRCxhQUFPLE9BQU8sQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLENBQUM7S0FDNUI7R0FDRixDQUFDO0NBQ0giLCJmaWxlIjoiL1VzZXJzL2Rhd3NvbmJvdHNmb3JkLy5hdG9tL3BhY2thZ2VzL2xpbnRlci1qc29ubGludC9saWIvaW5kZXguanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJztcblxuaW1wb3J0IHsgUmFuZ2UgfSBmcm9tICdhdG9tJztcbmltcG9ydCAqIGFzIGpzb25saW50IGZyb20gJ2pzb25saW50JztcblxuY29uc3QgcmVnZXggPSAnLis/bGluZVxcXFxzKFxcXFxkKyknO1xuXG5leHBvcnQgZnVuY3Rpb24gYWN0aXZhdGUoKSB7XG4gIHJlcXVpcmUoJ2F0b20tcGFja2FnZS1kZXBzJykuaW5zdGFsbCgnbGludGVyLWpzb25saW50Jyk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBwcm92aWRlTGludGVyKCkge1xuICByZXR1cm4ge1xuICAgIG5hbWU6ICdKU09OIExpbnQnLFxuICAgIGdyYW1tYXJTY29wZXM6IFsnc291cmNlLmpzb24nXSxcbiAgICBzY29wZTogJ2ZpbGUnLFxuICAgIGxpbnRPbkZseTogdHJ1ZSxcbiAgICBsaW50OiBlZGl0b3IgPT4ge1xuICAgICAgY29uc3QgcGF0aCA9IGVkaXRvci5nZXRQYXRoKCk7XG4gICAgICBjb25zdCB0ZXh0ID0gZWRpdG9yLmdldFRleHQoKTtcblxuICAgICAgdHJ5IHtcbiAgICAgICAganNvbmxpbnQucGFyc2UodGV4dCk7XG4gICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICBjb25zdCBtZXNzYWdlID0gZXJyb3IubWVzc2FnZTtcbiAgICAgICAgY29uc3QgbGluZSA9IE51bWJlcihtZXNzYWdlLm1hdGNoKHJlZ2V4KVsxXSk7XG4gICAgICAgIGNvbnN0IGNvbHVtbiA9IDA7XG5cbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShbe1xuICAgICAgICAgIHR5cGU6ICdFcnJvcicsXG4gICAgICAgICAgdGV4dDogZXJyb3IubWVzc2FnZSxcbiAgICAgICAgICBmaWxlUGF0aDogcGF0aCxcbiAgICAgICAgICByYW5nZTogbmV3IFJhbmdlKFtsaW5lLCBjb2x1bW5dLCBbbGluZSwgY29sdW1uICsgMV0pXG4gICAgICAgIH1dKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShbXSk7XG4gICAgfVxuICB9O1xufVxuIl19
//# sourceURL=/Users/dawsonbotsford/.atom/packages/linter-jsonlint/lib/index.js
