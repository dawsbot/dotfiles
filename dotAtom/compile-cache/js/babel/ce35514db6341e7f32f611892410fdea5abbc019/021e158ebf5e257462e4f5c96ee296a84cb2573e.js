function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _workerHelpers = require('./worker-helpers');

var Helpers = _interopRequireWildcard(_workerHelpers);

var _processCommunication = require('process-communication');

var _atomLinter = require('atom-linter');

'use babel';
// Note: 'use babel' doesn't work in forked processes
process.title = 'linter-eslint helper';

var ignoredMessages = [
// V1
'File ignored because of your .eslintignore file. Use --no-ignore to override.',
// V2
'File ignored because of a matching ignore pattern. Use --no-ignore to override.',
// V2.11.1
'File ignored because of a matching ignore pattern. Use "--no-ignore" to override.'];

function lintJob(argv, contents, eslint, configPath, config) {
  if (configPath === null && config.disableWhenNoEslintConfig) {
    return [];
  }
  eslint.execute(argv, contents);
  return global.__LINTER_ESLINT_RESPONSE.filter(function (e) {
    return !ignoredMessages.includes(e.message);
  });
}
function fixJob(argv, eslint) {
  try {
    eslint.execute(argv);
    return 'Linter-ESLint: Fix Complete';
  } catch (err) {
    throw new Error('Linter-ESLint: Fix Attempt Completed, Linting Errors Remain');
  }
}

(0, _processCommunication.create)().onRequest('job', function (_ref, job) {
  var contents = _ref.contents;
  var type = _ref.type;
  var config = _ref.config;
  var filePath = _ref.filePath;

  global.__LINTER_ESLINT_RESPONSE = [];

  if (config.disableFSCache) {
    _atomLinter.FindCache.clear();
  }

  var fileDir = _path2['default'].dirname(filePath);
  var eslint = Helpers.getESLintInstance(fileDir, config);
  var configPath = Helpers.getConfigPath(fileDir);
  var relativeFilePath = Helpers.getRelativePath(fileDir, filePath, config);

  var argv = Helpers.getArgv(type, config, relativeFilePath, fileDir, configPath);

  if (type === 'lint') {
    job.response = lintJob(argv, contents, eslint, configPath, config);
  } else if (type === 'fix') {
    job.response = fixJob(argv, eslint);
  }
});

process.exit = function () {/* Stop eslint from closing the daemon */};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9kYXdzb25ib3RzZm9yZC8uYXRvbS9wYWNrYWdlcy9saW50ZXItZXNsaW50L3NyYy93b3JrZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztvQkFJaUIsTUFBTTs7Ozs2QkFDRSxrQkFBa0I7O0lBQS9CLE9BQU87O29DQUNJLHVCQUF1Qjs7MEJBQ3BCLGFBQWE7O0FBUHZDLFdBQVcsQ0FBQTs7QUFFWCxPQUFPLENBQUMsS0FBSyxHQUFHLHNCQUFzQixDQUFBOztBQU90QyxJQUFNLGVBQWUsR0FBRzs7QUFFdEIsK0VBQStFOztBQUUvRSxpRkFBaUY7O0FBRWpGLG1GQUFtRixDQUNwRixDQUFBOztBQUVELFNBQVMsT0FBTyxDQUFDLElBQUksRUFBRSxRQUFRLEVBQUUsTUFBTSxFQUFFLFVBQVUsRUFBRSxNQUFNLEVBQUU7QUFDM0QsTUFBSSxVQUFVLEtBQUssSUFBSSxJQUFJLE1BQU0sQ0FBQyx5QkFBeUIsRUFBRTtBQUMzRCxXQUFPLEVBQUUsQ0FBQTtHQUNWO0FBQ0QsUUFBTSxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsUUFBUSxDQUFDLENBQUE7QUFDOUIsU0FBTyxNQUFNLENBQUMsd0JBQXdCLENBQ25DLE1BQU0sQ0FBQyxVQUFBLENBQUM7V0FBSSxDQUFDLGVBQWUsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQztHQUFBLENBQUMsQ0FBQTtDQUNyRDtBQUNELFNBQVMsTUFBTSxDQUFDLElBQUksRUFBRSxNQUFNLEVBQUU7QUFDNUIsTUFBSTtBQUNGLFVBQU0sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUE7QUFDcEIsV0FBTyw2QkFBNkIsQ0FBQTtHQUNyQyxDQUFDLE9BQU8sR0FBRyxFQUFFO0FBQ1osVUFBTSxJQUFJLEtBQUssQ0FBQyw2REFBNkQsQ0FBQyxDQUFBO0dBQy9FO0NBQ0Y7O0FBRUQsbUNBQVEsQ0FBQyxTQUFTLENBQUMsS0FBSyxFQUFFLFVBQUMsSUFBb0MsRUFBRSxHQUFHLEVBQUs7TUFBNUMsUUFBUSxHQUFWLElBQW9DLENBQWxDLFFBQVE7TUFBRSxJQUFJLEdBQWhCLElBQW9DLENBQXhCLElBQUk7TUFBRSxNQUFNLEdBQXhCLElBQW9DLENBQWxCLE1BQU07TUFBRSxRQUFRLEdBQWxDLElBQW9DLENBQVYsUUFBUTs7QUFDM0QsUUFBTSxDQUFDLHdCQUF3QixHQUFHLEVBQUUsQ0FBQTs7QUFFcEMsTUFBSSxNQUFNLENBQUMsY0FBYyxFQUFFO0FBQ3pCLDBCQUFVLEtBQUssRUFBRSxDQUFBO0dBQ2xCOztBQUVELE1BQU0sT0FBTyxHQUFHLGtCQUFLLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQTtBQUN0QyxNQUFNLE1BQU0sR0FBRyxPQUFPLENBQUMsaUJBQWlCLENBQUMsT0FBTyxFQUFFLE1BQU0sQ0FBQyxDQUFBO0FBQ3pELE1BQU0sVUFBVSxHQUFHLE9BQU8sQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLENBQUE7QUFDakQsTUFBTSxnQkFBZ0IsR0FBRyxPQUFPLENBQUMsZUFBZSxDQUFDLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxDQUFDLENBQUE7O0FBRTNFLE1BQU0sSUFBSSxHQUFHLE9BQU8sQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLE1BQU0sRUFBRSxnQkFBZ0IsRUFBRSxPQUFPLEVBQUUsVUFBVSxDQUFDLENBQUE7O0FBRWpGLE1BQUksSUFBSSxLQUFLLE1BQU0sRUFBRTtBQUNuQixPQUFHLENBQUMsUUFBUSxHQUFHLE9BQU8sQ0FBQyxJQUFJLEVBQUUsUUFBUSxFQUFFLE1BQU0sRUFBRSxVQUFVLEVBQUUsTUFBTSxDQUFDLENBQUE7R0FDbkUsTUFBTSxJQUFJLElBQUksS0FBSyxLQUFLLEVBQUU7QUFDekIsT0FBRyxDQUFDLFFBQVEsR0FBRyxNQUFNLENBQUMsSUFBSSxFQUFFLE1BQU0sQ0FBQyxDQUFBO0dBQ3BDO0NBQ0YsQ0FBQyxDQUFBOztBQUVGLE9BQU8sQ0FBQyxJQUFJLEdBQUcsWUFBWSwyQ0FBNkMsQ0FBQSIsImZpbGUiOiIvVXNlcnMvZGF3c29uYm90c2ZvcmQvLmF0b20vcGFja2FnZXMvbGludGVyLWVzbGludC9zcmMvd29ya2VyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCdcbi8vIE5vdGU6ICd1c2UgYmFiZWwnIGRvZXNuJ3Qgd29yayBpbiBmb3JrZWQgcHJvY2Vzc2VzXG5wcm9jZXNzLnRpdGxlID0gJ2xpbnRlci1lc2xpbnQgaGVscGVyJ1xuXG5pbXBvcnQgUGF0aCBmcm9tICdwYXRoJ1xuaW1wb3J0ICogYXMgSGVscGVycyBmcm9tICcuL3dvcmtlci1oZWxwZXJzJ1xuaW1wb3J0IHsgY3JlYXRlIH0gZnJvbSAncHJvY2Vzcy1jb21tdW5pY2F0aW9uJ1xuaW1wb3J0IHsgRmluZENhY2hlIH0gZnJvbSAnYXRvbS1saW50ZXInXG5cbmNvbnN0IGlnbm9yZWRNZXNzYWdlcyA9IFtcbiAgLy8gVjFcbiAgJ0ZpbGUgaWdub3JlZCBiZWNhdXNlIG9mIHlvdXIgLmVzbGludGlnbm9yZSBmaWxlLiBVc2UgLS1uby1pZ25vcmUgdG8gb3ZlcnJpZGUuJyxcbiAgLy8gVjJcbiAgJ0ZpbGUgaWdub3JlZCBiZWNhdXNlIG9mIGEgbWF0Y2hpbmcgaWdub3JlIHBhdHRlcm4uIFVzZSAtLW5vLWlnbm9yZSB0byBvdmVycmlkZS4nLFxuICAvLyBWMi4xMS4xXG4gICdGaWxlIGlnbm9yZWQgYmVjYXVzZSBvZiBhIG1hdGNoaW5nIGlnbm9yZSBwYXR0ZXJuLiBVc2UgXCItLW5vLWlnbm9yZVwiIHRvIG92ZXJyaWRlLicsXG5dXG5cbmZ1bmN0aW9uIGxpbnRKb2IoYXJndiwgY29udGVudHMsIGVzbGludCwgY29uZmlnUGF0aCwgY29uZmlnKSB7XG4gIGlmIChjb25maWdQYXRoID09PSBudWxsICYmIGNvbmZpZy5kaXNhYmxlV2hlbk5vRXNsaW50Q29uZmlnKSB7XG4gICAgcmV0dXJuIFtdXG4gIH1cbiAgZXNsaW50LmV4ZWN1dGUoYXJndiwgY29udGVudHMpXG4gIHJldHVybiBnbG9iYWwuX19MSU5URVJfRVNMSU5UX1JFU1BPTlNFXG4gICAgLmZpbHRlcihlID0+ICFpZ25vcmVkTWVzc2FnZXMuaW5jbHVkZXMoZS5tZXNzYWdlKSlcbn1cbmZ1bmN0aW9uIGZpeEpvYihhcmd2LCBlc2xpbnQpIHtcbiAgdHJ5IHtcbiAgICBlc2xpbnQuZXhlY3V0ZShhcmd2KVxuICAgIHJldHVybiAnTGludGVyLUVTTGludDogRml4IENvbXBsZXRlJ1xuICB9IGNhdGNoIChlcnIpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ0xpbnRlci1FU0xpbnQ6IEZpeCBBdHRlbXB0IENvbXBsZXRlZCwgTGludGluZyBFcnJvcnMgUmVtYWluJylcbiAgfVxufVxuXG5jcmVhdGUoKS5vblJlcXVlc3QoJ2pvYicsICh7IGNvbnRlbnRzLCB0eXBlLCBjb25maWcsIGZpbGVQYXRoIH0sIGpvYikgPT4ge1xuICBnbG9iYWwuX19MSU5URVJfRVNMSU5UX1JFU1BPTlNFID0gW11cblxuICBpZiAoY29uZmlnLmRpc2FibGVGU0NhY2hlKSB7XG4gICAgRmluZENhY2hlLmNsZWFyKClcbiAgfVxuXG4gIGNvbnN0IGZpbGVEaXIgPSBQYXRoLmRpcm5hbWUoZmlsZVBhdGgpXG4gIGNvbnN0IGVzbGludCA9IEhlbHBlcnMuZ2V0RVNMaW50SW5zdGFuY2UoZmlsZURpciwgY29uZmlnKVxuICBjb25zdCBjb25maWdQYXRoID0gSGVscGVycy5nZXRDb25maWdQYXRoKGZpbGVEaXIpXG4gIGNvbnN0IHJlbGF0aXZlRmlsZVBhdGggPSBIZWxwZXJzLmdldFJlbGF0aXZlUGF0aChmaWxlRGlyLCBmaWxlUGF0aCwgY29uZmlnKVxuXG4gIGNvbnN0IGFyZ3YgPSBIZWxwZXJzLmdldEFyZ3YodHlwZSwgY29uZmlnLCByZWxhdGl2ZUZpbGVQYXRoLCBmaWxlRGlyLCBjb25maWdQYXRoKVxuXG4gIGlmICh0eXBlID09PSAnbGludCcpIHtcbiAgICBqb2IucmVzcG9uc2UgPSBsaW50Sm9iKGFyZ3YsIGNvbnRlbnRzLCBlc2xpbnQsIGNvbmZpZ1BhdGgsIGNvbmZpZylcbiAgfSBlbHNlIGlmICh0eXBlID09PSAnZml4Jykge1xuICAgIGpvYi5yZXNwb25zZSA9IGZpeEpvYihhcmd2LCBlc2xpbnQpXG4gIH1cbn0pXG5cbnByb2Nlc3MuZXhpdCA9IGZ1bmN0aW9uICgpIHsgLyogU3RvcCBlc2xpbnQgZnJvbSBjbG9zaW5nIHRoZSBkYWVtb24gKi8gfVxuIl19
//# sourceURL=/Users/dawsonbotsford/.atom/packages/linter-eslint/src/worker.js
