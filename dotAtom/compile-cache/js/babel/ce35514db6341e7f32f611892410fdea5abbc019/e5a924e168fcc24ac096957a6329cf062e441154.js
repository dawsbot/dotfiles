function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

var _path = require('path');

var path = _interopRequireWildcard(_path);

'use babel';

var goodPath = path.join(__dirname, 'fixtures', 'good.json');
var badPath = path.join(__dirname, 'fixtures', 'bad.json');

describe('The jsonlint provider for Linter', function () {
  var lint = require(path.join('..', 'lib', 'index.js')).provideLinter().lint;

  beforeEach(function () {
    atom.workspace.destroyActivePaneItem();
    waitsForPromise(function () {
      return Promise.all([atom.packages.activatePackage('linter-jsonlint'), atom.packages.activatePackage('language-json')]);
    });
  });

  describe('checks bad.md and', function () {
    var editor = null;
    beforeEach(function () {
      waitsForPromise(function () {
        return atom.workspace.open(badPath).then(function (openEditor) {
          editor = openEditor;
        });
      });
    });

    it('finds at least one message', function () {
      waitsForPromise(function () {
        return lint(editor).then(function (messages) {
          expect(messages.length).toBeGreaterThan(0);
        });
      });
    });

    it('verifies the first message', function () {
      waitsForPromise(function () {
        return lint(editor).then(function (messages) {
          expect(messages[0].type).toEqual('Error');
          expect(messages[0].text).toEqual('Parse error on line 2:\n{  "key": 1 + 2}\n------------^\nExpecting \'EOF\', \'}\', \',\', \']\', got \'undefined\'');
          expect(messages[0].filePath).toMatch(/.+bad\.json$/);
          expect(messages[0].range).toEqual({
            start: { row: 2, column: 0 },
            end: { row: 2, column: 1 }
          });
        });
      });
    });
  });

  it('finds nothing wrong with a valid file', function () {
    waitsForPromise(function () {
      return atom.workspace.open(goodPath).then(function (editor) {
        return lint(editor).then(function (messages) {
          expect(messages.length).toEqual(0);
        });
      });
    });
  });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9kYXdzb25ib3RzZm9yZC8uYXRvbS9wYWNrYWdlcy9saW50ZXItanNvbmxpbnQvc3BlYy9saW50ZXItanNvbmxpbnQtc3BlYy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztvQkFFc0IsTUFBTTs7SUFBaEIsSUFBSTs7QUFGaEIsV0FBVyxDQUFDOztBQUlaLElBQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLFVBQVUsRUFBRSxXQUFXLENBQUMsQ0FBQztBQUMvRCxJQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxVQUFVLEVBQUUsVUFBVSxDQUFDLENBQUM7O0FBRTdELFFBQVEsQ0FBQyxrQ0FBa0MsRUFBRSxZQUFNO0FBQ2pELE1BQU0sSUFBSSxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxLQUFLLEVBQUUsVUFBVSxDQUFDLENBQUMsQ0FBQyxhQUFhLEVBQUUsQ0FBQyxJQUFJLENBQUM7O0FBRTlFLFlBQVUsQ0FBQyxZQUFNO0FBQ2YsUUFBSSxDQUFDLFNBQVMsQ0FBQyxxQkFBcUIsRUFBRSxDQUFDO0FBQ3ZDLG1CQUFlLENBQUM7YUFDZCxPQUFPLENBQUMsR0FBRyxDQUFDLENBQ1YsSUFBSSxDQUFDLFFBQVEsQ0FBQyxlQUFlLENBQUMsaUJBQWlCLENBQUMsRUFDaEQsSUFBSSxDQUFDLFFBQVEsQ0FBQyxlQUFlLENBQUMsZUFBZSxDQUFDLENBQy9DLENBQUM7S0FBQSxDQUNILENBQUM7R0FDSCxDQUFDLENBQUM7O0FBRUgsVUFBUSxDQUFDLG1CQUFtQixFQUFFLFlBQU07QUFDbEMsUUFBSSxNQUFNLEdBQUcsSUFBSSxDQUFDO0FBQ2xCLGNBQVUsQ0FBQyxZQUFNO0FBQ2YscUJBQWUsQ0FBQztlQUNkLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFBLFVBQVUsRUFBSTtBQUM5QyxnQkFBTSxHQUFHLFVBQVUsQ0FBQztTQUNyQixDQUFDO09BQUEsQ0FDSCxDQUFDO0tBQ0gsQ0FBQyxDQUFDOztBQUVILE1BQUUsQ0FBQyw0QkFBNEIsRUFBRSxZQUFNO0FBQ3JDLHFCQUFlLENBQUM7ZUFDZCxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQUEsUUFBUSxFQUFJO0FBQzVCLGdCQUFNLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUMsQ0FBQztTQUM1QyxDQUFDO09BQUEsQ0FDSCxDQUFDO0tBQ0gsQ0FBQyxDQUFDOztBQUVILE1BQUUsQ0FBQyw0QkFBNEIsRUFBRSxZQUFNO0FBQ3JDLHFCQUFlLENBQUM7ZUFDZCxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQUEsUUFBUSxFQUFJO0FBQzVCLGdCQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQztBQUMxQyxnQkFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxPQUFPLHNIQUdPLENBQUM7QUFDeEMsZ0JBQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsT0FBTyxDQUFDLGNBQWMsQ0FBQyxDQUFDO0FBQ3JELGdCQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLE9BQU8sQ0FBQztBQUNoQyxpQkFBSyxFQUFFLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxNQUFNLEVBQUUsQ0FBQyxFQUFFO0FBQzVCLGVBQUcsRUFBRSxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsTUFBTSxFQUFFLENBQUMsRUFBRTtXQUMzQixDQUFDLENBQUM7U0FDSixDQUFDO09BQUEsQ0FDSCxDQUFDO0tBQ0gsQ0FBQyxDQUFDO0dBQ0osQ0FBQyxDQUFDOztBQUVILElBQUUsQ0FBQyx1Q0FBdUMsRUFBRSxZQUFNO0FBQ2hELG1CQUFlLENBQUM7YUFDZCxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBQSxNQUFNO2VBQ3ZDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBQSxRQUFRLEVBQUk7QUFDNUIsZ0JBQU0sQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO1NBQ3BDLENBQUM7T0FBQSxDQUNIO0tBQUEsQ0FDRixDQUFDO0dBQ0gsQ0FBQyxDQUFDO0NBQ0osQ0FBQyxDQUFDIiwiZmlsZSI6Ii9Vc2Vycy9kYXdzb25ib3RzZm9yZC8uYXRvbS9wYWNrYWdlcy9saW50ZXItanNvbmxpbnQvc3BlYy9saW50ZXItanNvbmxpbnQtc3BlYy5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnO1xuXG5pbXBvcnQgKiBhcyBwYXRoIGZyb20gJ3BhdGgnO1xuXG5jb25zdCBnb29kUGF0aCA9IHBhdGguam9pbihfX2Rpcm5hbWUsICdmaXh0dXJlcycsICdnb29kLmpzb24nKTtcbmNvbnN0IGJhZFBhdGggPSBwYXRoLmpvaW4oX19kaXJuYW1lLCAnZml4dHVyZXMnLCAnYmFkLmpzb24nKTtcblxuZGVzY3JpYmUoJ1RoZSBqc29ubGludCBwcm92aWRlciBmb3IgTGludGVyJywgKCkgPT4ge1xuICBjb25zdCBsaW50ID0gcmVxdWlyZShwYXRoLmpvaW4oJy4uJywgJ2xpYicsICdpbmRleC5qcycpKS5wcm92aWRlTGludGVyKCkubGludDtcblxuICBiZWZvcmVFYWNoKCgpID0+IHtcbiAgICBhdG9tLndvcmtzcGFjZS5kZXN0cm95QWN0aXZlUGFuZUl0ZW0oKTtcbiAgICB3YWl0c0ZvclByb21pc2UoKCkgPT5cbiAgICAgIFByb21pc2UuYWxsKFtcbiAgICAgICAgYXRvbS5wYWNrYWdlcy5hY3RpdmF0ZVBhY2thZ2UoJ2xpbnRlci1qc29ubGludCcpLFxuICAgICAgICBhdG9tLnBhY2thZ2VzLmFjdGl2YXRlUGFja2FnZSgnbGFuZ3VhZ2UtanNvbicpXG4gICAgICBdKVxuICAgICk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKCdjaGVja3MgYmFkLm1kIGFuZCcsICgpID0+IHtcbiAgICBsZXQgZWRpdG9yID0gbnVsbDtcbiAgICBiZWZvcmVFYWNoKCgpID0+IHtcbiAgICAgIHdhaXRzRm9yUHJvbWlzZSgoKSA9PlxuICAgICAgICBhdG9tLndvcmtzcGFjZS5vcGVuKGJhZFBhdGgpLnRoZW4ob3BlbkVkaXRvciA9PiB7XG4gICAgICAgICAgZWRpdG9yID0gb3BlbkVkaXRvcjtcbiAgICAgICAgfSlcbiAgICAgICk7XG4gICAgfSk7XG5cbiAgICBpdCgnZmluZHMgYXQgbGVhc3Qgb25lIG1lc3NhZ2UnLCAoKSA9PiB7XG4gICAgICB3YWl0c0ZvclByb21pc2UoKCkgPT5cbiAgICAgICAgbGludChlZGl0b3IpLnRoZW4obWVzc2FnZXMgPT4ge1xuICAgICAgICAgIGV4cGVjdChtZXNzYWdlcy5sZW5ndGgpLnRvQmVHcmVhdGVyVGhhbigwKTtcbiAgICAgICAgfSlcbiAgICAgICk7XG4gICAgfSk7XG5cbiAgICBpdCgndmVyaWZpZXMgdGhlIGZpcnN0IG1lc3NhZ2UnLCAoKSA9PiB7XG4gICAgICB3YWl0c0ZvclByb21pc2UoKCkgPT5cbiAgICAgICAgbGludChlZGl0b3IpLnRoZW4obWVzc2FnZXMgPT4ge1xuICAgICAgICAgIGV4cGVjdChtZXNzYWdlc1swXS50eXBlKS50b0VxdWFsKCdFcnJvcicpO1xuICAgICAgICAgIGV4cGVjdChtZXNzYWdlc1swXS50ZXh0KS50b0VxdWFsKGBQYXJzZSBlcnJvciBvbiBsaW5lIDI6XG57ICBcImtleVwiOiAxICsgMn1cbi0tLS0tLS0tLS0tLV5cbkV4cGVjdGluZyAnRU9GJywgJ30nLCAnLCcsICddJywgZ290ICd1bmRlZmluZWQnYCk7XG4gICAgICAgICAgZXhwZWN0KG1lc3NhZ2VzWzBdLmZpbGVQYXRoKS50b01hdGNoKC8uK2JhZFxcLmpzb24kLyk7XG4gICAgICAgICAgZXhwZWN0KG1lc3NhZ2VzWzBdLnJhbmdlKS50b0VxdWFsKHtcbiAgICAgICAgICAgIHN0YXJ0OiB7IHJvdzogMiwgY29sdW1uOiAwIH0sXG4gICAgICAgICAgICBlbmQ6IHsgcm93OiAyLCBjb2x1bW46IDEgfVxuICAgICAgICAgIH0pO1xuICAgICAgICB9KVxuICAgICAgKTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgaXQoJ2ZpbmRzIG5vdGhpbmcgd3Jvbmcgd2l0aCBhIHZhbGlkIGZpbGUnLCAoKSA9PiB7XG4gICAgd2FpdHNGb3JQcm9taXNlKCgpID0+XG4gICAgICBhdG9tLndvcmtzcGFjZS5vcGVuKGdvb2RQYXRoKS50aGVuKGVkaXRvciA9PlxuICAgICAgICBsaW50KGVkaXRvcikudGhlbihtZXNzYWdlcyA9PiB7XG4gICAgICAgICAgZXhwZWN0KG1lc3NhZ2VzLmxlbmd0aCkudG9FcXVhbCgwKTtcbiAgICAgICAgfSlcbiAgICAgIClcbiAgICApO1xuICB9KTtcbn0pO1xuIl19
//# sourceURL=/Users/dawsonbotsford/.atom/packages/linter-jsonlint/spec/linter-jsonlint-spec.js
