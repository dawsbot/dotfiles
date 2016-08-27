Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.spawnWorker = spawnWorker;
exports.showError = showError;
exports.ruleURI = ruleURI;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _child_process = require('child_process');

var _child_process2 = _interopRequireDefault(_child_process);

var _atom = require('atom');

var _processCommunication = require('process-communication');

var _path = require('path');

'use babel';

function spawnWorker() {
  var env = Object.create(process.env);

  delete env.NODE_PATH;
  delete env.NODE_ENV;
  delete env.OS;

  var child = _child_process2['default'].fork((0, _path.join)(__dirname, 'worker.js'), [], { env: env, silent: true });
  var worker = (0, _processCommunication.createFromProcess)(child);

  child.stdout.on('data', function (chunk) {
    console.log('[Linter-ESLint] STDOUT', chunk.toString());
  });
  child.stderr.on('data', function (chunk) {
    console.log('[Linter-ESLint] STDERR', chunk.toString());
  });

  return { worker: worker, subscription: new _atom.Disposable(function () {
      worker.kill();
    }) };
}

function showError(givenMessage) {
  var givenDetail = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];

  var detail = undefined;
  var message = undefined;
  if (message instanceof Error) {
    detail = message.stack;
    message = message.message;
  } else {
    detail = givenDetail;
    message = givenMessage;
  }
  atom.notifications.addError('[Linter-ESLint] ' + message, {
    detail: detail,
    dismissable: true
  });
}

function ruleURI(ruleId) {
  var ruleParts = ruleId.split('/');

  if (ruleParts.length === 1) {
    return 'http://eslint.org/docs/rules/' + ruleId;
  }

  var pluginName = ruleParts[0];
  var ruleName = ruleParts[1];
  switch (pluginName) {
    case 'angular':
      return 'https://github.com/Gillespie59/eslint-plugin-angular/blob/master/docs/' + ruleName + '.md';

    case 'ava':
      return 'https://github.com/avajs/eslint-plugin-ava/blob/master/docs/rules/' + ruleName + '.md';

    case 'import':
      return 'https://github.com/benmosher/eslint-plugin-import/blob/master/docs/rules/' + ruleName + '.md';

    case 'import-order':
      return 'https://github.com/jfmengels/eslint-plugin-import-order/blob/master/docs/rules/' + ruleName + '.md';

    case 'jasmine':
      return 'https://github.com/tlvince/eslint-plugin-jasmine/blob/master/docs/rules/' + ruleName + '.md';

    case 'jsx-a11y':
      return 'https://github.com/evcohen/eslint-plugin-jsx-a11y/blob/master/docs/rules/' + ruleName + '.md';

    case 'lodash':
      return 'https://github.com/wix/eslint-plugin-lodash/blob/master/docs/rules/' + ruleName + '.md';

    case 'mocha':
      return 'https://github.com/lo1tuma/eslint-plugin-mocha/blob/master/docs/rules/' + ruleName + '.md';

    case 'promise':
      return 'https://github.com/xjamundx/eslint-plugin-promise#' + ruleName;

    case 'react':
      return 'https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/' + ruleName + '.md';

    default:
      return 'https://github.com/AtomLinter/linter-eslint/wiki/Linking-to-Rule-Documentation';
  }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9kYXdzb25ib3RzZm9yZC8uYXRvbS9wYWNrYWdlcy9saW50ZXItZXNsaW50L3NyYy9oZWxwZXJzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs2QkFFeUIsZUFBZTs7OztvQkFDYixNQUFNOztvQ0FDQyx1QkFBdUI7O29CQUNwQyxNQUFNOztBQUwzQixXQUFXLENBQUE7O0FBT0osU0FBUyxXQUFXLEdBQUc7QUFDNUIsTUFBTSxHQUFHLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUE7O0FBRXRDLFNBQU8sR0FBRyxDQUFDLFNBQVMsQ0FBQTtBQUNwQixTQUFPLEdBQUcsQ0FBQyxRQUFRLENBQUE7QUFDbkIsU0FBTyxHQUFHLENBQUMsRUFBRSxDQUFBOztBQUViLE1BQU0sS0FBSyxHQUFHLDJCQUFhLElBQUksQ0FBQyxnQkFBSyxTQUFTLEVBQUUsV0FBVyxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsR0FBRyxFQUFILEdBQUcsRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQTtBQUN4RixNQUFNLE1BQU0sR0FBRyw2Q0FBa0IsS0FBSyxDQUFDLENBQUE7O0FBRXZDLE9BQUssQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLE1BQU0sRUFBRSxVQUFDLEtBQUssRUFBSztBQUNqQyxXQUFPLENBQUMsR0FBRyxDQUFDLHdCQUF3QixFQUFFLEtBQUssQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFBO0dBQ3hELENBQUMsQ0FBQTtBQUNGLE9BQUssQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLE1BQU0sRUFBRSxVQUFDLEtBQUssRUFBSztBQUNqQyxXQUFPLENBQUMsR0FBRyxDQUFDLHdCQUF3QixFQUFFLEtBQUssQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFBO0dBQ3hELENBQUMsQ0FBQTs7QUFFRixTQUFPLEVBQUUsTUFBTSxFQUFOLE1BQU0sRUFBRSxZQUFZLEVBQUUscUJBQWUsWUFBTTtBQUNsRCxZQUFNLENBQUMsSUFBSSxFQUFFLENBQUE7S0FDZCxDQUFDLEVBQUUsQ0FBQTtDQUNMOztBQUVNLFNBQVMsU0FBUyxDQUFDLFlBQVksRUFBc0I7TUFBcEIsV0FBVyx5REFBRyxJQUFJOztBQUN4RCxNQUFJLE1BQU0sWUFBQSxDQUFBO0FBQ1YsTUFBSSxPQUFPLFlBQUEsQ0FBQTtBQUNYLE1BQUksT0FBTyxZQUFZLEtBQUssRUFBRTtBQUM1QixVQUFNLEdBQUcsT0FBTyxDQUFDLEtBQUssQ0FBQTtBQUN0QixXQUFPLEdBQUcsT0FBTyxDQUFDLE9BQU8sQ0FBQTtHQUMxQixNQUFNO0FBQ0wsVUFBTSxHQUFHLFdBQVcsQ0FBQTtBQUNwQixXQUFPLEdBQUcsWUFBWSxDQUFBO0dBQ3ZCO0FBQ0QsTUFBSSxDQUFDLGFBQWEsQ0FBQyxRQUFRLHNCQUFvQixPQUFPLEVBQUk7QUFDeEQsVUFBTSxFQUFOLE1BQU07QUFDTixlQUFXLEVBQUUsSUFBSTtHQUNsQixDQUFDLENBQUE7Q0FDSDs7QUFFTSxTQUFTLE9BQU8sQ0FBQyxNQUFNLEVBQUU7QUFDOUIsTUFBTSxTQUFTLEdBQUcsTUFBTSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQTs7QUFFbkMsTUFBSSxTQUFTLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRTtBQUMxQiw2Q0FBdUMsTUFBTSxDQUFFO0dBQ2hEOztBQUVELE1BQU0sVUFBVSxHQUFHLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQTtBQUMvQixNQUFNLFFBQVEsR0FBRyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUE7QUFDN0IsVUFBUSxVQUFVO0FBQ2hCLFNBQUssU0FBUztBQUNaLHdGQUFnRixRQUFRLFNBQUs7O0FBQUEsQUFFL0YsU0FBSyxLQUFLO0FBQ1Isb0ZBQTRFLFFBQVEsU0FBSzs7QUFBQSxBQUUzRixTQUFLLFFBQVE7QUFDWCwyRkFBbUYsUUFBUSxTQUFLOztBQUFBLEFBRWxHLFNBQUssY0FBYztBQUNqQixpR0FBeUYsUUFBUSxTQUFLOztBQUFBLEFBRXhHLFNBQUssU0FBUztBQUNaLDBGQUFrRixRQUFRLFNBQUs7O0FBQUEsQUFFakcsU0FBSyxVQUFVO0FBQ2IsMkZBQW1GLFFBQVEsU0FBSzs7QUFBQSxBQUVsRyxTQUFLLFFBQVE7QUFDWCxxRkFBNkUsUUFBUSxTQUFLOztBQUFBLEFBRTVGLFNBQUssT0FBTztBQUNWLHdGQUFnRixRQUFRLFNBQUs7O0FBQUEsQUFFL0YsU0FBSyxTQUFTO0FBQ1osb0VBQTRELFFBQVEsQ0FBRTs7QUFBQSxBQUV4RSxTQUFLLE9BQU87QUFDViwwRkFBa0YsUUFBUSxTQUFLOztBQUFBLEFBRWpHO0FBQ0UsYUFBTyxnRkFBZ0YsQ0FBQTtBQUFBLEdBQzFGO0NBQ0YiLCJmaWxlIjoiL1VzZXJzL2Rhd3NvbmJvdHNmb3JkLy5hdG9tL3BhY2thZ2VzL2xpbnRlci1lc2xpbnQvc3JjL2hlbHBlcnMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJ1xuXG5pbXBvcnQgQ2hpbGRQcm9jZXNzIGZyb20gJ2NoaWxkX3Byb2Nlc3MnXG5pbXBvcnQgeyBEaXNwb3NhYmxlIH0gZnJvbSAnYXRvbSdcbmltcG9ydCB7IGNyZWF0ZUZyb21Qcm9jZXNzIH0gZnJvbSAncHJvY2Vzcy1jb21tdW5pY2F0aW9uJ1xuaW1wb3J0IHsgam9pbiB9IGZyb20gJ3BhdGgnXG5cbmV4cG9ydCBmdW5jdGlvbiBzcGF3bldvcmtlcigpIHtcbiAgY29uc3QgZW52ID0gT2JqZWN0LmNyZWF0ZShwcm9jZXNzLmVudilcblxuICBkZWxldGUgZW52Lk5PREVfUEFUSFxuICBkZWxldGUgZW52Lk5PREVfRU5WXG4gIGRlbGV0ZSBlbnYuT1NcblxuICBjb25zdCBjaGlsZCA9IENoaWxkUHJvY2Vzcy5mb3JrKGpvaW4oX19kaXJuYW1lLCAnd29ya2VyLmpzJyksIFtdLCB7IGVudiwgc2lsZW50OiB0cnVlIH0pXG4gIGNvbnN0IHdvcmtlciA9IGNyZWF0ZUZyb21Qcm9jZXNzKGNoaWxkKVxuXG4gIGNoaWxkLnN0ZG91dC5vbignZGF0YScsIChjaHVuaykgPT4ge1xuICAgIGNvbnNvbGUubG9nKCdbTGludGVyLUVTTGludF0gU1RET1VUJywgY2h1bmsudG9TdHJpbmcoKSlcbiAgfSlcbiAgY2hpbGQuc3RkZXJyLm9uKCdkYXRhJywgKGNodW5rKSA9PiB7XG4gICAgY29uc29sZS5sb2coJ1tMaW50ZXItRVNMaW50XSBTVERFUlInLCBjaHVuay50b1N0cmluZygpKVxuICB9KVxuXG4gIHJldHVybiB7IHdvcmtlciwgc3Vic2NyaXB0aW9uOiBuZXcgRGlzcG9zYWJsZSgoKSA9PiB7XG4gICAgd29ya2VyLmtpbGwoKVxuICB9KSB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzaG93RXJyb3IoZ2l2ZW5NZXNzYWdlLCBnaXZlbkRldGFpbCA9IG51bGwpIHtcbiAgbGV0IGRldGFpbFxuICBsZXQgbWVzc2FnZVxuICBpZiAobWVzc2FnZSBpbnN0YW5jZW9mIEVycm9yKSB7XG4gICAgZGV0YWlsID0gbWVzc2FnZS5zdGFja1xuICAgIG1lc3NhZ2UgPSBtZXNzYWdlLm1lc3NhZ2VcbiAgfSBlbHNlIHtcbiAgICBkZXRhaWwgPSBnaXZlbkRldGFpbFxuICAgIG1lc3NhZ2UgPSBnaXZlbk1lc3NhZ2VcbiAgfVxuICBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkRXJyb3IoYFtMaW50ZXItRVNMaW50XSAke21lc3NhZ2V9YCwge1xuICAgIGRldGFpbCxcbiAgICBkaXNtaXNzYWJsZTogdHJ1ZVxuICB9KVxufVxuXG5leHBvcnQgZnVuY3Rpb24gcnVsZVVSSShydWxlSWQpIHtcbiAgY29uc3QgcnVsZVBhcnRzID0gcnVsZUlkLnNwbGl0KCcvJylcblxuICBpZiAocnVsZVBhcnRzLmxlbmd0aCA9PT0gMSkge1xuICAgIHJldHVybiBgaHR0cDovL2VzbGludC5vcmcvZG9jcy9ydWxlcy8ke3J1bGVJZH1gXG4gIH1cblxuICBjb25zdCBwbHVnaW5OYW1lID0gcnVsZVBhcnRzWzBdXG4gIGNvbnN0IHJ1bGVOYW1lID0gcnVsZVBhcnRzWzFdXG4gIHN3aXRjaCAocGx1Z2luTmFtZSkge1xuICAgIGNhc2UgJ2FuZ3VsYXInOlxuICAgICAgcmV0dXJuIGBodHRwczovL2dpdGh1Yi5jb20vR2lsbGVzcGllNTkvZXNsaW50LXBsdWdpbi1hbmd1bGFyL2Jsb2IvbWFzdGVyL2RvY3MvJHtydWxlTmFtZX0ubWRgXG5cbiAgICBjYXNlICdhdmEnOlxuICAgICAgcmV0dXJuIGBodHRwczovL2dpdGh1Yi5jb20vYXZhanMvZXNsaW50LXBsdWdpbi1hdmEvYmxvYi9tYXN0ZXIvZG9jcy9ydWxlcy8ke3J1bGVOYW1lfS5tZGBcblxuICAgIGNhc2UgJ2ltcG9ydCc6XG4gICAgICByZXR1cm4gYGh0dHBzOi8vZ2l0aHViLmNvbS9iZW5tb3NoZXIvZXNsaW50LXBsdWdpbi1pbXBvcnQvYmxvYi9tYXN0ZXIvZG9jcy9ydWxlcy8ke3J1bGVOYW1lfS5tZGBcblxuICAgIGNhc2UgJ2ltcG9ydC1vcmRlcic6XG4gICAgICByZXR1cm4gYGh0dHBzOi8vZ2l0aHViLmNvbS9qZm1lbmdlbHMvZXNsaW50LXBsdWdpbi1pbXBvcnQtb3JkZXIvYmxvYi9tYXN0ZXIvZG9jcy9ydWxlcy8ke3J1bGVOYW1lfS5tZGBcblxuICAgIGNhc2UgJ2phc21pbmUnOlxuICAgICAgcmV0dXJuIGBodHRwczovL2dpdGh1Yi5jb20vdGx2aW5jZS9lc2xpbnQtcGx1Z2luLWphc21pbmUvYmxvYi9tYXN0ZXIvZG9jcy9ydWxlcy8ke3J1bGVOYW1lfS5tZGBcblxuICAgIGNhc2UgJ2pzeC1hMTF5JzpcbiAgICAgIHJldHVybiBgaHR0cHM6Ly9naXRodWIuY29tL2V2Y29oZW4vZXNsaW50LXBsdWdpbi1qc3gtYTExeS9ibG9iL21hc3Rlci9kb2NzL3J1bGVzLyR7cnVsZU5hbWV9Lm1kYFxuXG4gICAgY2FzZSAnbG9kYXNoJzpcbiAgICAgIHJldHVybiBgaHR0cHM6Ly9naXRodWIuY29tL3dpeC9lc2xpbnQtcGx1Z2luLWxvZGFzaC9ibG9iL21hc3Rlci9kb2NzL3J1bGVzLyR7cnVsZU5hbWV9Lm1kYFxuXG4gICAgY2FzZSAnbW9jaGEnOlxuICAgICAgcmV0dXJuIGBodHRwczovL2dpdGh1Yi5jb20vbG8xdHVtYS9lc2xpbnQtcGx1Z2luLW1vY2hhL2Jsb2IvbWFzdGVyL2RvY3MvcnVsZXMvJHtydWxlTmFtZX0ubWRgXG5cbiAgICBjYXNlICdwcm9taXNlJzpcbiAgICAgIHJldHVybiBgaHR0cHM6Ly9naXRodWIuY29tL3hqYW11bmR4L2VzbGludC1wbHVnaW4tcHJvbWlzZSMke3J1bGVOYW1lfWBcblxuICAgIGNhc2UgJ3JlYWN0JzpcbiAgICAgIHJldHVybiBgaHR0cHM6Ly9naXRodWIuY29tL3lhbm5pY2tjci9lc2xpbnQtcGx1Z2luLXJlYWN0L2Jsb2IvbWFzdGVyL2RvY3MvcnVsZXMvJHtydWxlTmFtZX0ubWRgXG5cbiAgICBkZWZhdWx0OlxuICAgICAgcmV0dXJuICdodHRwczovL2dpdGh1Yi5jb20vQXRvbUxpbnRlci9saW50ZXItZXNsaW50L3dpa2kvTGlua2luZy10by1SdWxlLURvY3VtZW50YXRpb24nXG4gIH1cbn1cbiJdfQ==
//# sourceURL=/Users/dawsonbotsford/.atom/packages/linter-eslint/src/helpers.js
