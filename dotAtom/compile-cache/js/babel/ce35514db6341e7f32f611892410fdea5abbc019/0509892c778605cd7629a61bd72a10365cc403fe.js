Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _atom = require('atom');

var _jsonlint = require('jsonlint');

var jsonlint = _interopRequireWildcard(_jsonlint);

'use babel';

var LinterJsonLint = (function () {
  function LinterJsonLint() {
    _classCallCheck(this, LinterJsonLint);
  }

  _createClass(LinterJsonLint, null, [{
    key: 'activate',
    value: function activate() {
      require('atom-package-deps').install();
    }
  }, {
    key: 'provideLinter',
    value: function provideLinter() {
      var _this = this;

      return {
        grammarScopes: ['source.json'],
        scope: 'file',
        lintOnFly: true,
        lint: function lint(editor) {
          var path = editor.getPath();
          var text = editor.getText();

          try {
            jsonlint.parse(text);
          } catch (error) {
            var line = Number(error.message.match(_this.regex)[1]);
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
  }, {
    key: 'regex',
    value: '.+?line\\s(\\d+)',
    enumerable: true
  }]);

  return LinterJsonLint;
})();

exports['default'] = LinterJsonLint;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9kYXdzb25ib3RzZm9yZC8uYXRvbS9wYWNrYWdlcy9saW50ZXItanNvbmxpbnQvbGliL2luZGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7b0JBRXNCLE1BQU07O3dCQUNGLFVBQVU7O0lBQXhCLFFBQVE7O0FBSHBCLFdBQVcsQ0FBQzs7SUFLUyxjQUFjO1dBQWQsY0FBYzswQkFBZCxjQUFjOzs7ZUFBZCxjQUFjOztXQUlsQixvQkFBRztBQUNoQixhQUFPLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxPQUFPLEVBQUUsQ0FBQztLQUN4Qzs7O1dBRW1CLHlCQUFHOzs7QUFDckIsYUFBTztBQUNMLHFCQUFhLEVBQUUsQ0FBQyxhQUFhLENBQUM7QUFDOUIsYUFBSyxFQUFFLE1BQU07QUFDYixpQkFBUyxFQUFFLElBQUk7QUFDZixZQUFJLEVBQUUsY0FBQSxNQUFNLEVBQUk7QUFDZCxjQUFNLElBQUksR0FBRyxNQUFNLENBQUMsT0FBTyxFQUFFLENBQUM7QUFDOUIsY0FBTSxJQUFJLEdBQUcsTUFBTSxDQUFDLE9BQU8sRUFBRSxDQUFDOztBQUU5QixjQUFJO0FBQ0Ysb0JBQVEsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7V0FDdEIsQ0FBQyxPQUFPLEtBQUssRUFBRTtBQUNkLGdCQUFNLElBQUksR0FBRyxNQUFNLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsTUFBSyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3hELGdCQUFNLE1BQU0sR0FBRyxDQUFDLENBQUM7O0FBRWpCLG1CQUFPLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQztBQUN0QixrQkFBSSxFQUFFLE9BQU87QUFDYixrQkFBSSxFQUFFLEtBQUssQ0FBQyxPQUFPO0FBQ25CLHNCQUFRLEVBQUUsSUFBSTtBQUNkLG1CQUFLLEVBQUUsZ0JBQVUsQ0FBQyxJQUFJLEVBQUUsTUFBTSxDQUFDLEVBQUUsQ0FBQyxJQUFJLEVBQUUsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDO2FBQ3JELENBQUMsQ0FBQyxDQUFDO1dBQ0w7O0FBRUQsaUJBQU8sT0FBTyxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQztTQUM1QjtPQUNGLENBQUM7S0FDSDs7O1dBaENjLGtCQUFrQjs7OztTQUZkLGNBQWM7OztxQkFBZCxjQUFjIiwiZmlsZSI6Ii9Vc2Vycy9kYXdzb25ib3RzZm9yZC8uYXRvbS9wYWNrYWdlcy9saW50ZXItanNvbmxpbnQvbGliL2luZGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCc7XG5cbmltcG9ydCB7IFJhbmdlIH0gZnJvbSAnYXRvbSc7XG5pbXBvcnQgKiBhcyBqc29ubGludCBmcm9tICdqc29ubGludCc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIExpbnRlckpzb25MaW50IHtcblxuICBzdGF0aWMgcmVnZXggPSAnLis/bGluZVxcXFxzKFxcXFxkKyknO1xuXG4gIHN0YXRpYyBhY3RpdmF0ZSgpIHtcbiAgICByZXF1aXJlKCdhdG9tLXBhY2thZ2UtZGVwcycpLmluc3RhbGwoKTtcbiAgfVxuXG4gIHN0YXRpYyBwcm92aWRlTGludGVyKCkge1xuICAgIHJldHVybiB7XG4gICAgICBncmFtbWFyU2NvcGVzOiBbJ3NvdXJjZS5qc29uJ10sXG4gICAgICBzY29wZTogJ2ZpbGUnLFxuICAgICAgbGludE9uRmx5OiB0cnVlLFxuICAgICAgbGludDogZWRpdG9yID0+IHtcbiAgICAgICAgY29uc3QgcGF0aCA9IGVkaXRvci5nZXRQYXRoKCk7XG4gICAgICAgIGNvbnN0IHRleHQgPSBlZGl0b3IuZ2V0VGV4dCgpO1xuXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAganNvbmxpbnQucGFyc2UodGV4dCk7XG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgY29uc3QgbGluZSA9IE51bWJlcihlcnJvci5tZXNzYWdlLm1hdGNoKHRoaXMucmVnZXgpWzFdKTtcbiAgICAgICAgICBjb25zdCBjb2x1bW4gPSAwO1xuXG4gICAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShbe1xuICAgICAgICAgICAgdHlwZTogJ0Vycm9yJyxcbiAgICAgICAgICAgIHRleHQ6IGVycm9yLm1lc3NhZ2UsXG4gICAgICAgICAgICBmaWxlUGF0aDogcGF0aCxcbiAgICAgICAgICAgIHJhbmdlOiBuZXcgUmFuZ2UoW2xpbmUsIGNvbHVtbl0sIFtsaW5lLCBjb2x1bW4gKyAxXSlcbiAgICAgICAgICB9XSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKFtdKTtcbiAgICAgIH1cbiAgICB9O1xuICB9XG59XG4iXX0=
//# sourceURL=/Users/dawsonbotsford/.atom/packages/linter-jsonlint/lib/index.js
