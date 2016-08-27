function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

var _libWorkerHelpers = require('../lib/worker-helpers');

var Helpers = _interopRequireWildcard(_libWorkerHelpers);

var _common = require('./common');

var _path = require('path');

var Path = _interopRequireWildcard(_path);

'use babel';

describe('Worker Helpers', function () {
  describe('getESLintInstance && getESLintFromDirectory', function () {
    it('tries to find a local eslint', function () {
      var eslint = Helpers.getESLintInstance((0, _common.getFixturesPath)('local-eslint'), {});
      expect(eslint).toBe('located');
    });
    it('cries if local eslint is not found', function () {
      expect(function () {
        Helpers.getESLintInstance((0, _common.getFixturesPath)('files', {}));
      }).toThrow();
    });

    it('tries to find a global eslint if config is specified', function () {
      var globalPath = '';
      if (process.platform === 'win32') {
        globalPath = (0, _common.getFixturesPath)(Path.join('global-eslint', 'lib'));
      } else {
        globalPath = (0, _common.getFixturesPath)('global-eslint');
      }
      var eslint = Helpers.getESLintInstance((0, _common.getFixturesPath)('local-eslint'), {
        useGlobalEslint: true,
        globalNodePath: globalPath
      });
      expect(eslint).toBe('located');
    });
    it('cries if global eslint is not found', function () {
      expect(function () {
        Helpers.getESLintInstance((0, _common.getFixturesPath)('local-eslint'), {
          useGlobalEslint: true,
          globalNodePath: (0, _common.getFixturesPath)('files')
        });
      }).toThrow();
    });

    it('tries to find a local eslint with nested node_modules', function () {
      var fileDir = Path.join((0, _common.getFixturesPath)('local-eslint'), 'lib', 'foo.js');
      var eslint = Helpers.getESLintInstance(fileDir, {});
      expect(eslint).toBe('located');
    });
  });

  describe('getConfigPath', function () {
    it('finds .eslintrc', function () {
      var fileDir = (0, _common.getFixturesPath)(Path.join('configs', 'no-ext'));
      var expectedPath = Path.join(fileDir, '.eslintrc');
      expect(Helpers.getConfigPath(fileDir)).toBe(expectedPath);
    });
    it('finds .eslintrc.yaml', function () {
      var fileDir = (0, _common.getFixturesPath)(Path.join('configs', 'yaml'));
      var expectedPath = Path.join(fileDir, '.eslintrc.yaml');
      expect(Helpers.getConfigPath(fileDir)).toBe(expectedPath);
    });
    it('finds .eslintrc.yml', function () {
      var fileDir = (0, _common.getFixturesPath)(Path.join('configs', 'yml'));
      var expectedPath = Path.join(fileDir, '.eslintrc.yml');
      expect(Helpers.getConfigPath(fileDir)).toBe(expectedPath);
    });
    it('finds .eslintrc.js', function () {
      var fileDir = (0, _common.getFixturesPath)(Path.join('configs', 'js'));
      var expectedPath = Path.join(fileDir, '.eslintrc.js');
      expect(Helpers.getConfigPath(fileDir)).toBe(expectedPath);
    });
    it('finds .eslintrc.json', function () {
      var fileDir = (0, _common.getFixturesPath)(Path.join('configs', 'json'));
      var expectedPath = Path.join(fileDir, '.eslintrc.json');
      expect(Helpers.getConfigPath(fileDir)).toBe(expectedPath);
    });
  });

  describe('getRelativePath', function () {
    it('return path relative of ignore file if found', function () {
      var fixtureDir = (0, _common.getFixturesPath)('eslintignore');
      var fixtureFile = Path.join(fixtureDir, 'ignored.js');
      var relativePath = Helpers.getRelativePath(fixtureDir, fixtureFile, {});
      var expectedPath = Path.relative(Path.join(__dirname, '..'), fixtureFile);
      expect(relativePath).toBe(expectedPath);
    });
    it('does not return path relative to ignore file if config overrides it', function () {
      var fixtureDir = (0, _common.getFixturesPath)('eslintignore');
      var fixtureFile = Path.join(fixtureDir, 'ignored.js');
      var relativePath = Helpers.getRelativePath(fixtureDir, fixtureFile, { disableEslintIgnore: true });
      expect(relativePath).toBe('ignored.js');
    });
  });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9kYXdzb25ib3RzZm9yZC8uYXRvbS9wYWNrYWdlcy9saW50ZXItZXNsaW50L3NwZWMvd29ya2VyLWhlbHBlcnMtc3BlYy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztnQ0FFeUIsdUJBQXVCOztJQUFwQyxPQUFPOztzQkFDYSxVQUFVOztvQkFDcEIsTUFBTTs7SUFBaEIsSUFBSTs7QUFKaEIsV0FBVyxDQUFBOztBQU1YLFFBQVEsQ0FBQyxnQkFBZ0IsRUFBRSxZQUFNO0FBQy9CLFVBQVEsQ0FBQyw2Q0FBNkMsRUFBRSxZQUFNO0FBQzVELE1BQUUsQ0FBQyw4QkFBOEIsRUFBRSxZQUFNO0FBQ3ZDLFVBQU0sTUFBTSxHQUFHLE9BQU8sQ0FBQyxpQkFBaUIsQ0FBQyw2QkFBZ0IsY0FBYyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUE7QUFDN0UsWUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQTtLQUMvQixDQUFDLENBQUE7QUFDRixNQUFFLENBQUMsb0NBQW9DLEVBQUUsWUFBTTtBQUM3QyxZQUFNLENBQUMsWUFBTTtBQUNYLGVBQU8sQ0FBQyxpQkFBaUIsQ0FBQyw2QkFBZ0IsT0FBTyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUE7T0FDeEQsQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFBO0tBQ2IsQ0FBQyxDQUFBOztBQUVGLE1BQUUsQ0FBQyxzREFBc0QsRUFBRSxZQUFNO0FBQy9ELFVBQUksVUFBVSxHQUFHLEVBQUUsQ0FBQTtBQUNuQixVQUFJLE9BQU8sQ0FBQyxRQUFRLEtBQUssT0FBTyxFQUFFO0FBQ2hDLGtCQUFVLEdBQUcsNkJBQWdCLElBQUksQ0FBQyxJQUFJLENBQUMsZUFBZSxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUE7T0FDaEUsTUFBTTtBQUNMLGtCQUFVLEdBQUcsNkJBQWdCLGVBQWUsQ0FBQyxDQUFBO09BQzlDO0FBQ0QsVUFBTSxNQUFNLEdBQUcsT0FBTyxDQUFDLGlCQUFpQixDQUFD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QW1CLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQTtBQUNqRixZQUFNLENBQUMsWUFBWSxDQUFDLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFBO0tBQ3hDLENBQUMsQ0FBQTtHQUNILENBQUMsQ0FBQTtDQUNILENBQUMsQ0FBQSIsImZpbGUiOiIvVXNlcnMvZGF3c29uYm90c2ZvcmQvLmF0b20vcGFja2FnZXMvbGludGVyLWVzbGludC9zcGVjL3dvcmtlci1oZWxwZXJzLXNwZWMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJ1xuXG5pbXBvcnQgKiBhcyBIZWxwZXJzIGZyb20gJy4uL2xpYi93b3JrZXItaGVscGVycydcbmltcG9ydCB7IGdldEZpeHR1cmVzUGF0aCB9IGZyb20gJy4vY29tbW9uJ1xuaW1wb3J0ICogYXMgUGF0aCBmcm9tICdwYXRoJ1xuXG5kZXNjcmliZSgnV29ya2VyIEhlbHBlcnMnLCAoKSA9PiB7XG4gIGRlc2NyaWJlKCdnZXRFU0xpbnRJbnN0YW5jZSAmJiBnZXRFU0xpbnRGcm9tRGlyZWN0b3J5JywgKCkgPT4ge1xuICAgIGl0KCd0cmllcyB0byBmaW5kIGEgbG9jYWwgZXNsaW50JywgKCkgPT4ge1xuICAgICAgY29uc3QgZXNsaW50ID0gSGVscGVycy5nZXRFU0xpbnRJbnN0YW5jZShnZXRGaXh0dXJlc1BhdGgoJ2xvY2FsLWVzbGludCcpLCB7fSlcbiAgICAgIGV4cGVjdChlc2xpbnQpLnRvQmUoJ2xvY2F0ZWQnKVxuICAgIH0pXG4gICAgaXQoJ2NyaWVzIGlmIGxvY2FsIGVzbGludCBpcyBub3QgZm91bmQnLCAoKSA9PiB7XG4gICAgICBleHBlY3QoKCkgPT4ge1xuICAgICAgICBIZWxwZXJzLmdldEVTTGludEluc3RhbmNlKGdldEZpeHR1cmVzUGF0aCgnZmlsZXMnLCB7fSkpXG4gICAgICB9KS50b1Rocm93KClcbiAgICB9KVxuXG4gICAgaXQoJ3RyaWVzIHRvIGZpbmQgYSBnbG9iYWwgZXNsaW50IGlmIGNvbmZpZyBpcyBzcGVjaWZpZWQnLCAoKSA9PiB7XG4gICAgICBsZXQgZ2xvYmFsUGF0aCA9ICcnXG4gICAgICBpZiAocHJvY2Vzcy5wbGF0Zm9ybSA9PT0gJ3dpbjMyJykge1xuICAgICAgICBnbG9iYWxQYXRoID0gZ2V0Rml4dHVyZXNQYXRoKFBhdGguam9pbignZ2xvYmFsLWVzbGludCcsICdsaWInKSlcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGdsb2JhbFBhdGggPSBnZXRGaXh0dXJlc1BhdGgoJ2dsb2JhbC1lc2xpbnQnKVxuICAgICAgfVxuICAgICAgY29uc3QgZXNsaW50ID0gSGVscGVycy5nZXRFU0xpbnRJbnN0YW5jZShnZXRGaXh0dXJlc1BhdGgoJ2xvY2FsLWVzbGludCcpLCB7XG4gICAgICAgIHVzZUdsb2JhbEVzbGludDogdHJ1ZSxcbiAgICAgICAgZ2xvYmFsTm9kZVBhdGg6IGdsb2JhbFBhdGhcbiAgICAgIH0pXG4gICAgICBleHBlY3QoZXNsaW50KS50b0JlKCdsb2NhdGVkJylcbiAgICB9KVxuICAgIGl0KCdjcmllcyBpZiBnbG9iYWwgZXNsaW50IGlzIG5vdCBmb3VuZCcsICgpID0+IHtcbiAgICAgIGV4cGVjdCgoKSA9PiB7XG4gICAgICAgIEhlbHBlcnMuZ2V0RVNMaW50SW5zdGFuY2UoZ2V0Rml4dHVyZXNQYXRoKCdsb2NhbC1lc2xpbnQnKSwge1xuICAgICAgICAgIHVzZUdsb2JhbEVzbGludDogdHJ1ZSxcbiAgICAgICAgICBnbG9iYWxOb2RlUGF0aDogZ2V0Rml4dHVyZXNQYXRoKCdmaWxlcycpXG4gICAgICAgIH0pXG4gICAgICB9KS50b1Rocm93KClcbiAgICB9KVxuXG4gICAgaXQoJ3RyaWVzIHRvIGZpbmQgYSBsb2NhbCBlc2xpbnQgd2l0aCBuZXN0ZWQgbm9kZV9tb2R1bGVzJywgKCkgPT4ge1xuICAgICAgY29uc3QgZmlsZURpciA9IFBhdGguam9pbihnZXRGaXh0dXJlc1BhdGgoJ2xvY2FsLWVzbGludCcpLCAnbGliJywgJ2Zvby5qcycpXG4gICAgICBjb25zdCBlc2xpbnQgPSBIZWxwZXJzLmdldEVTTGludEluc3RhbmNlKGZpbGVEaXIsIHt9KVxuICAgICAgZXhwZWN0KGVzbGludCkudG9CZSgnbG9jYXRlZCcpXG4gICAgfSlcbiAgfSlcblxuICBkZXNjcmliZSgnZ2V0Q29uZmlnUGF0aCcsICgpID0+IHtcbiAgICBpdCgnZmluZHMgLmVzbGludHJjJywgKCkgPT4ge1xuICAgICAgY29uc3QgZmlsZURpciA9IGdldEZpeHR1cmVzUGF0aChQYXRoLmpvaW4oJ2NvbmZpZ3MnLCAnbm8tZXh0JykpXG4gICAgICBjb25zdCBleHBlY3RlZFBhdGggPSBQYXRoLmpvaW4oZmlsZURpciwgJy5lc2xpbnRyYycpXG4gICAgICBleHBlY3QoSGVscGVycy5nZXRDb25maWdQYXRoKGZpbGVEaXIpKS50b0JlKGV4cGVjdGVkUGF0aClcbiAgICB9KVxuICAgIGl0KCdmaW5kcyAuZXNsaW50cmMueWFtbCcsICgpID0+IHtcbiAgICAgIGNvbnN0IGZpbGVEaXIgPSBnZXRGaXh0dXJlc1BhdGgoUGF0aC5qb2luKCdjb25maWdzJywgJ3lhbWwnKSlcbiAgICAgIGNvbnN0IGV4cGVjdGVkUGF0aCA9IFBhdGguam9pbihmaWxlRGlyLCAnLmVzbGludHJjLnlhbWwnKVxuICAgICAgZXhwZWN0KEhlbHBlcnMuZ2V0Q29uZmlnUGF0aChmaWxlRGlyKSkudG9CZShleHBlY3RlZFBhdGgpXG4gICAgfSlcbiAgICBpdCgnZmluZHMgLmVzbGludHJjLnltbCcsICgpID0+IHtcbiAgICAgIGNvbnN0IGZpbGVEaXIgPSBnZXRGaXh0dXJlc1BhdGgoUGF0aC5qb2luKCdjb25maWdzJywgJ3ltbCcpKVxuICAgICAgY29uc3QgZXhwZWN0ZWRQYXRoID0gUGF0aC5qb2luKGZpbGVEaXIsICcuZXNsaW50cmMueW1sJylcbiAgICAgIGV4cGVjdChIZWxwZXJzLmdldENvbmZpZ1BhdGgoZmlsZURpcikpLnRvQmUoZXhwZWN0ZWRQYXRoKVxuICAgIH0pXG4gICAgaXQoJ2ZpbmRzIC5lc2xpbnRyYy5qcycsICgpID0+IHtcbiAgICAgIGNvbnN0IGZpbGVEaXIgPSBnZXRGaXh0dXJlc1BhdGgoUGF0aC5qb2luKCdjb25maWdzJywgJ2pzJykpXG4gICAgICBjb25zdCBleHBlY3RlZFBhdGggPSBQYXRoLmpvaW4oZmlsZURpciwgJy5lc2xpbnRyYy5qcycpXG4gICAgICBleHBlY3QoSGVscGVycy5nZXRDb25maWdQYXRoKGZpbGVEaXIpKS50b0JlKGV4cGVjdGVkUGF0aClcbiAgICB9KVxuICAgIGl0KCdmaW5kcyAuZXNsaW50cmMuanNvbicsICgpID0+IHtcbiAgICAgIGNvbnN0IGZpbGVEaXIgPSBnZXRGaXh0dXJlc1BhdGgoUGF0aC5qb2luKCdjb25maWdzJywgJ2pzb24nKSlcbiAgICAgIGNvbnN0IGV4cGVjdGVkUGF0aCA9IFBhdGguam9pbihmaWxlRGlyLCAnLmVzbGludHJjLmpzb24nKVxuICAgICAgZXhwZWN0KEhlbHBlcnMuZ2V0Q29uZmlnUGF0aChmaWxlRGlyKSkudG9CZShleHBlY3RlZFBhdGgpXG4gICAgfSlcbiAgfSlcblxuICBkZXNjcmliZSgnZ2V0UmVsYXRpdmVQYXRoJywgKCkgPT4ge1xuICAgIGl0KCdyZXR1cm4gcGF0aCByZWxhdGl2ZSBvZiBpZ25vcmUgZmlsZSBpZiBmb3VuZCcsICgpID0+IHtcbiAgICAgIGNvbnN0IGZpeHR1cmVEaXIgPSBnZXRGaXh0dXJlc1BhdGgoJ2VzbGludGlnbm9yZScpXG4gICAgICBjb25zdCBmaXh0dXJlRmlsZSA9IFBhdGguam9pbihmaXh0dXJlRGlyLCAnaWdub3JlZC5qcycpXG4gICAgICBjb25zdCByZWxhdGl2ZVBhdGggPSBIZWxwZXJzLmdldFJlbGF0aXZlUGF0aChmaXh0dXJlRGlyLCBmaXh0dXJlRmlsZSwge30pXG4gICAgICBjb25zdCBleHBlY3RlZFBhdGggPSBQYXRoLnJlbGF0aXZlKFBhdGguam9pbihfX2Rpcm5hbWUsICcuLicpLCBmaXh0dXJlRmlsZSlcbiAgICAgIGV4cGVjdChyZWxhdGl2ZVBhdGgpLnRvQmUoZXhwZWN0ZWRQYXRoKVxuICAgIH0pXG4gICAgaXQoJ2RvZXMgbm90IHJldHVybiBwYXRoIHJlbGF0aXZlIHRvIGlnbm9yZSBmaWxlIGlmIGNvbmZpZyBvdmVycmlkZXMgaXQnLCAoKSA9PiB7XG4gICAgICBjb25zdCBmaXh0dXJlRGlyID0gZ2V0Rml4dHVyZXNQYXRoKCdlc2xpbnRpZ25vcmUnKVxuICAgICAgY29uc3QgZml4dHVyZUZpbGUgPSBQYXRoLmpvaW4oZml4dHVyZURpciwgJ2lnbm9yZWQuanMnKVxuICAgICAgY29uc3QgcmVsYXRpdmVQYXRoID1cbiAgICAgICAgSGVscGVycy5nZXRSZWxhdGl2ZVBhdGgoZml4dHVyZURpciwgZml4dHVyZUZpbGUsIHsgZGlzYWJsZUVzbGludElnbm9yZTogdHJ1ZSB9KVxuICAgICAgZXhwZWN0KHJlbGF0aXZlUGF0aCkudG9CZSgnaWdub3JlZC5qcycpXG4gICAgfSlcbiAgfSlcbn0pXG4iXX0=
//# sourceURL=/Users/dawsonbotsford/.atom/packages/linter-eslint/spec/worker-helpers-spec.js
